FROM node:14.16.0

COPY ./package*.json /processor/

WORKDIR /processor

RUN npm install

COPY . .

RUN npm install --silent

CMD ["npm", "start"]
