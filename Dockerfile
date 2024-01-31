FROM node:18 as dev-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .

RUN chown -R node /app/node_modules

USER node

EXPOSE 3000

CMD [ "npm", "run", "dev"]