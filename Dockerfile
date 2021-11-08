FROM node:16-slim

# Base dir /app
WORKDIR /app
COPY script.js .
COPY package.json .
RUN npm install

CMD [ "node", "script.js" ]
# Expose the listening port of your app
EXPOSE 8000