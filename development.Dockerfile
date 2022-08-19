FROM node:16-alpine
EXPOSE 80
WORKDIR /math-api

RUN apk add --no-cache inkscape
  
# Install packages
COPY package*.json tsconfig.json ./
RUN npm ci

# Compile typescript
COPY ./tests ./tests
COPY ./src ./src
RUN npm run build

CMD [ "npm", "run", "start:dev" ]
