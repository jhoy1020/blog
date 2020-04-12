# Build the production code for the blog.
FROM node:11-alpine as build

WORKDIR /app

COPY package.json /app/package.json

RUN npm install

COPY . /app

RUN npm run build

# Copy the build over to the ngix server.
FROM nginx
#  This file is necessary to fix an issue with ngix and react-router.
#  Without it, nginx returns 404s because it can find the correct page.
COPY ./conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
