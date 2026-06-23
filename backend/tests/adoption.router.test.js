const assert = require('node:assert/strict');
const { describe, test } = require('node:test');
const express = require('express');
const createAdoptionRouter = require('../routes/adoption.router');

const createClient = async (service) => {
    const app = express();
    app.use(express.json());
    app.use('/api/adoptions', createAdoptionRouter(service));

    const server = await new Promise((resolve) => {
        const instance = app.listen(0, () => resolve(instance));
    });

    const baseUrl = `http://127.0.0.1:${server.address().port}`;

    const request = async (method, path, body) => {
        const response = await fetch(`${baseUrl}${path}`, {
            method,
            headers: body ? { 'content-type': 'application/json' } : undefined,
            body: body ? JSON.stringify(body) : undefined
        });

        const text = await response.text();
        return {
            status: response.status,
            body: text ? JSON.parse(text) : null
        };
    };

    const close = () => new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
    });

    return { request, close };
};

const withClient = async (service, assertion) => {
    const client = await createClient(service);
    try {
        await assertion(client);
    } finally {
        await client.close();
    }
};

const baseService = (overrides = {}) => ({
    getAllAdoptions: async () => ([
        {
            id: 'adoption-1',
            owner: { id: 'user-1', email: 'maxi@example.com' },
            pet: { id: 'pet-1', name: 'Luna' }
        }
    ]),
    getAdoptionById: async (adoptionId) => {
        if (adoptionId !== 'adoption-1') {
            return null;
        }

        return {
            id: 'adoption-1',
            owner: { id: 'user-1', email: 'maxi@example.com' },
            pet: { id: 'pet-1', name: 'Luna' }
        };
    },
    createAdoption: async (userId, petId, data) => ({
        id: 'adoption-2',
        owner: { id: userId },
        pet: { id: petId },
        notes: data.notes
    }),
    ...overrides
});

const serviceError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

describe('adoption.router functional tests', () => {
    test('GET /api/adoptions returns all adoptions', async () => {
        await withClient(baseService(), async (client) => {
            const response = await client.request('GET', '/api/adoptions');

            assert.equal(response.status, 200);
            assert.equal(response.body.status, 'success');
            assert.equal(response.body.payload.length, 1);
            assert.equal(response.body.payload[0].id, 'adoption-1');
        });
    });

    test('GET /api/adoptions returns 500 when the service fails', async () => {
        await withClient(baseService({
            getAllAdoptions: async () => {
                throw new Error('database unavailable');
            }
        }), async (client) => {
            const response = await client.request('GET', '/api/adoptions');

            assert.equal(response.status, 500);
            assert.deepEqual(response.body, {
                status: 'error',
                error: 'Error interno del servidor'
            });
        });
    });

    test('GET /api/adoptions/:aid returns one adoption by id', async () => {
        await withClient(baseService(), async (client) => {
            const response = await client.request('GET', '/api/adoptions/adoption-1');

            assert.equal(response.status, 200);
            assert.equal(response.body.status, 'success');
            assert.equal(response.body.payload.id, 'adoption-1');
            assert.equal(response.body.payload.pet.name, 'Luna');
        });
    });

    test('GET /api/adoptions/:aid validates the adoption id', async () => {
        let calls = 0;

        await withClient(baseService({
            getAdoptionById: async () => {
                calls += 1;
            }
        }), async (client) => {
            const response = await client.request('GET', '/api/adoptions/bad!');

            assert.equal(response.status, 400);
            assert.equal(response.body.error, 'El id de adopcion no es valido');
            assert.equal(calls, 0);
        });
    });

    test('GET /api/adoptions/:aid returns 404 when the adoption does not exist', async () => {
        await withClient(baseService(), async (client) => {
            const response = await client.request('GET', '/api/adoptions/adoption-999');

            assert.equal(response.status, 404);
            assert.deepEqual(response.body, {
                status: 'error',
                error: 'Adopcion no encontrada'
            });
        });
    });

    test('GET /api/adoptions/:aid returns 500 when lookup fails', async () => {
        await withClient(baseService({
            getAdoptionById: async () => {
                throw new Error('lookup failed');
            }
        }), async (client) => {
            const response = await client.request('GET', '/api/adoptions/adoption-1');

            assert.equal(response.status, 500);
            assert.equal(response.body.error, 'Error interno del servidor');
        });
    });

    test('POST /api/adoptions/:uid/:pid creates an adoption', async () => {
        await withClient(baseService(), async (client) => {
            const response = await client.request('POST', '/api/adoptions/user-1/pet-1', {
                notes: 'Retira la mascota el viernes'
            });

            assert.equal(response.status, 201);
            assert.equal(response.body.status, 'success');
            assert.equal(response.body.payload.owner.id, 'user-1');
            assert.equal(response.body.payload.pet.id, 'pet-1');
            assert.equal(response.body.payload.notes, 'Retira la mascota el viernes');
        });
    });

    test('POST /api/adoptions/:uid/:pid validates route params before creating', async () => {
        let calls = 0;

        await withClient(baseService({
            createAdoption: async () => {
                calls += 1;
            }
        }), async (client) => {
            const response = await client.request('POST', '/api/adoptions/bad!/pet-1', {});

            assert.equal(response.status, 400);
            assert.equal(response.body.error, 'Los ids de usuario y mascota deben ser validos');
            assert.equal(calls, 0);
        });
    });

    test('POST /api/adoptions/:uid/:pid returns 404 when the user does not exist', async () => {
        await withClient(baseService({
            createAdoption: async () => {
                throw serviceError(404, 'Usuario no encontrado');
            }
        }), async (client) => {
            const response = await client.request('POST', '/api/adoptions/user-404/pet-1', {});

            assert.equal(response.status, 404);
            assert.equal(response.body.error, 'Usuario no encontrado');
        });
    });

    test('POST /api/adoptions/:uid/:pid returns 404 when the pet does not exist', async () => {
        await withClient(baseService({
            createAdoption: async () => {
                throw serviceError(404, 'Mascota no encontrada');
            }
        }), async (client) => {
            const response = await client.request('POST', '/api/adoptions/user-1/pet-404', {});

            assert.equal(response.status, 404);
            assert.equal(response.body.error, 'Mascota no encontrada');
        });
    });

    test('POST /api/adoptions/:uid/:pid returns 409 when the pet was already adopted', async () => {
        await withClient(baseService({
            createAdoption: async () => {
                throw serviceError(409, 'La mascota ya fue adoptada');
            }
        }), async (client) => {
            const response = await client.request('POST', '/api/adoptions/user-1/pet-1', {});

            assert.equal(response.status, 409);
            assert.equal(response.body.error, 'La mascota ya fue adoptada');
        });
    });

    test('POST /api/adoptions/:uid/:pid returns 500 when create fails', async () => {
        await withClient(baseService({
            createAdoption: async () => {
                throw new Error('unexpected create error');
            }
        }), async (client) => {
            const response = await client.request('POST', '/api/adoptions/user-1/pet-1', {});

            assert.equal(response.status, 500);
            assert.equal(response.body.error, 'Error interno del servidor');
        });
    });
});
