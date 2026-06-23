FROM node:22-slim AS dependencies

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV MONGOMS_DISABLE_POSTINSTALL=1

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-slim AS runner

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app/backend

RUN groupadd --system nodeapp \
    && useradd --system --gid nodeapp --home-dir /home/nodeapp --create-home nodeapp \
    && apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates libcurl4 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=dependencies --chown=nodeapp:nodeapp /app/backend/node_modules ./node_modules
COPY --chown=nodeapp:nodeapp backend ./

USER nodeapp

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 8080) + '/health').then((res) => process.exit(res.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
