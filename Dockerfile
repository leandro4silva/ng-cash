FROM node:alpine

RUN mkdir -p /usr/app
RUN chmod -R 777 /usr/app

WORKDIR /usr/app

COPY package*.json ./

COPY prisma ./prisma/

COPY .env ./

COPY tsconfig.json ./

RUN npm install

RUN chown node:node -R /usr/app/node_modules/.prisma/client

RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]