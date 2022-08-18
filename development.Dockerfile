FROM node:16
EXPOSE 80
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
WORKDIR /math-api

# Install Chromium
RUN apt-get update && apt-get install -y chromium && rm -rf /var/lib/apt/lists/*

# Install packages
COPY package*.json tsconfig.json ./
RUN npm ci

# Compile typescript
COPY ./tests ./tests
COPY ./src ./src
RUN npm run build

CMD [ "npm", "run", "start:dev" ]
