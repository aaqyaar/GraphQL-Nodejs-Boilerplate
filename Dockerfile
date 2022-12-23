# nodejs:alpine version 18
# excute npm run build to build the project
# excute npm run start to start the project

FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install && npm run build

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]

