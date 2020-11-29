FROM node:alpine

ENV NODE_ENV development

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

ENTRYPOINT npx ts-node src/index.ts
