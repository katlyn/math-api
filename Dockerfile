ARG NODE_VERSION=16
FROM node:${NODE_VERSION}

ARG NODE_ENV=production
ENV PORT=3000 NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y fonts-liberation gconf-service        \
  libappindicator1 libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1    \
  libgbm-dev libgdk-pixbuf2.0-0 libgtk-3-0 libicu-dev libjpeg-dev libnspr4     \
  libnss3 libpango-1.0-0 libpangocairo-1.0-0 libpng-dev libx11-6 libx11-xcb1   \
  libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6    \
  libxrandr2 libxrender1 libxss1 libxtst6 xdg-utils                            \
  && rm -rf /var/lib/apt/lists/*
  
COPY package.json package-lock.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "start" ]
