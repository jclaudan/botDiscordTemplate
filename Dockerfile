FROM node:16-slim

# Base dir /app
WORKDIR /app
COPY ./src .
COPY package.json .
COPY ./db/warns.json .
COPY .env .
RUN npm install

CMD [ "npm", "start" ]
# Expose the listening port of your app
EXPOSE 8000