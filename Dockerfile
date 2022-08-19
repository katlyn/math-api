FROM node:16-alpine
EXPOSE 80
WORKDIR /math-api

# Install Chromium
RUN apk add --no-cache inkscape

# Install packages
COPY package*.json tsconfig.json ./
RUN npm ci

# Compile typescript
COPY ./tests ./tests
COPY ./src ./src
RUN npm run build

CMD [ "npm", "start" ]

# FROM node:16
# EXPOSE 80
# WORKDIR /math-api

# # Install chromium deps
# RUN apt-get update && apt-get install -y fonts-liberation gconf-service        \
#   libappindicator1 libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1    \
#   libgbm-dev libgdk-pixbuf2.0-0 libgtk-3-0 libicu-dev libjpeg-dev libnspr4     \
#   libnss3 libpango-1.0-0 libpangocairo-1.0-0 libpng-dev libx11-6 libx11-xcb1   \
#   libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6    \
#   libxrandr2 libxrender1 libxss1 libxtst6 xdg-utils chromium                   \
#   && rm -rf /var/lib/apt/lists/*

# # Install packages
# COPY package*.json tsconfig.json ./
# RUN npm ci --production
# COPY --from=0 /math-api/dist /math-api/dist

# CMD [ "npm", "start" ]
