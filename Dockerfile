FROM node:18 as Builder

COPY package*.json ./
RUN npm ci --force

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /shortener
EXPOSE 3000

COPY --from=Builder build /shortener/
COPY --from=Builder package*.json /shortener/
RUN npm install --omit dev --force

CMD [ "node", "." ]