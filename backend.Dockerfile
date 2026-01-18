FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate --schema=./backend/prisma/schema.prisma

EXPOSE 8000

CMD sleep 5 && \
    npx prisma db push --schema=./backend/prisma/schema.prisma && \
    npm run seed:rich && \
    npm run backend