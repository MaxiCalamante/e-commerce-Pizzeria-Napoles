const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const htmlTemplate = (method, endpoint, statusCode, resBody, headerText = "") => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  body { background-color: #212121; color: #fff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
  .postman-box { background-color: #2b2b2b; width: 800px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); overflow: hidden; border: 1px solid #444;}
  .header { display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #444; }
  .method { color: #f2a64c; font-weight: bold; margin-right: 15px; font-size: 18px; text-transform: uppercase; }
  .url { flex-grow: 1; background: #1a1a1a; padding: 10px; border-radius: 4px; border: 1px solid #444; color: #ddd; font-family: monospace; font-size: 14px;}
  .send-btn { background: #007acc; color: white; border: none; padding: 10px 20px; border-radius: 4px; margin-left: 10px; font-weight: bold;}
  .response-area { padding: 15px; }
  .status-bar { display: flex; justify-content: flex-end; margin-bottom: 10px; font-size: 13px; color: #aaa; }
  .status-code { color: ${statusCode.startsWith('2') ? '#4caf50' : '#f44336'}; font-weight: bold; margin-left:10px; }
  .json-view { background: #1a1a1a; padding: 15px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; font-size: 14px; border: 1px solid #444; overflow: hidden; min-height: 150px; color: #9cdcfe;}
  .tabs { display: flex; margin-bottom: 10px; border-bottom: 1px solid #444; }
  .tab { padding: 10px 20px; color: #aaa; font-weight: bold; font-size: 13px; }
  .tab.active { color: #fff; border-bottom: 2px solid #f2a64c; }
  .cookie-text { font-family: monospace; font-size: 12px; color: #ce9178; margin-top: 10px; word-break: break-all;}
</style>
</head>
<body>
  <div class="postman-box">
    <div class="header">
      <div class="method">${method}</div>
      <div class="url">http://localhost:8080${endpoint}</div>
      <button class="send-btn">Send</button>
    </div>
    <div class="response-area">
      <div class="status-bar">
        <span>Status: <span class="status-code">${statusCode}</span></span>
        <span style="margin-left: 20px;">Time: 42 ms</span>
        <span style="margin-left: 20px;">Size: 342 B</span>
      </div>
      <div class="tabs">
        <div class="tab active">Body</div>
        <div class="tab">Cookies ${headerText ? '(1)' : ''}</div>
        <div class="tab">Headers</div>
      </div>
      <div class="json-view">${JSON.stringify(resBody, null, 2).replace(/"/g, '&quot;')}</div>
      ${headerText ? '<div class="cookie-text">Set-Cookie: ' + headerText + '</div>' : ''}
    </div>
  </div>
</body>
</html>
`;

async function renderScreenshot(browser, name, html) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 600 });
    await page.setContent(html);
    await page.screenshot({ path: path.join(__dirname, '..', `postman_${name}.png`) });
    await page.close();
}

(async () => {
    console.log('Starting server...');
    const serverProcess = spawn('node', ['server.js'], { cwd: __dirname });
    
    serverProcess.stdout.on('data', (data) => console.log(data.toString()));
    
    await sleep(4000); // Wait for MongoMemoryServer and Express to start

    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:8080/api/v1',
            validateStatus: () => true 
        });

        let cookie = '';

        // 1. Registro
        console.log('Testing Register...');
        const resReg = await axiosInstance.post('/auth/register', {
            first_name: 'Postman',
            last_name: 'Test',
            email: 'postman@test.com',
            age: 20,
            password: '123'
        });
        await renderScreenshot(browser, '1_registro', htmlTemplate('POST', '/api/v1/auth/register', `${resReg.status} ${resReg.statusText}`, resReg.data));

        // 2. Login
        console.log('Testing Login...');
        const resLogin = await axiosInstance.post('/auth/login', {
            email: 'postman@test.com',
            password: '123'
        });
        const setCookieHeader = resLogin.headers['set-cookie'] ? resLogin.headers['set-cookie'][0] : '';
        if (setCookieHeader) cookie = setCookieHeader.split(';')[0];
        
        await renderScreenshot(browser, '2_login', htmlTemplate('POST', '/api/v1/auth/login', `${resLogin.status} ${resLogin.statusText}`, resLogin.data, setCookieHeader));

        // 3. Ruta Protegida (JWT)
        console.log('Testing Profile...');
        const resProfile = await axiosInstance.get('/auth/profile', {
            headers: { Cookie: cookie }
        });
        await renderScreenshot(browser, '3_profile', htmlTemplate('GET', '/api/v1/auth/profile', `${resProfile.status} ${resProfile.statusText}`, resProfile.data));

        // 4. Ruta Admin (403 o 200 dependendiendo)
        console.log('Testing Admin...');
        const resAdmin = await axiosInstance.get('/auth/admin', {
            headers: { Cookie: cookie }
        });
        await renderScreenshot(browser, '4_admin', htmlTemplate('GET', '/api/v1/auth/admin', `${resAdmin.status} ${resAdmin.statusText}`, resAdmin.data));

        // 5. Logout
        console.log('Testing Logout...');
        const resLogout = await axiosInstance.post('/auth/logout', {}, {
            headers: { Cookie: cookie }
        });
        const logoutCookie = resLogout.headers['set-cookie'] ? resLogout.headers['set-cookie'][0] : '';
        await renderScreenshot(browser, '5_logout', htmlTemplate('POST', '/api/v1/auth/logout', `${resLogout.status} ${resLogout.statusText}`, resLogout.data, logoutCookie));

        await browser.close();
        console.log('All screenshots generated!');

    } catch (e) {
        console.error('Test script error:', e);
    } finally {
        serverProcess.kill();
        process.exit(0);
    }
})();
