FROM node:13-alpine

COPY ./package*.json /processor/

WORKDIR /processor

RUN npm install

COPY . .

RUN npm install --silent

CMD ["npm", "start"]
