FROM node:lts-alpine as builder
WORKDIR /app
COPY src/Webs/daotao/package.json ./
COPY src/Webs/daotao/yarn.lock ./
RUN yarn install

COPY src/Webs/daotao ./
RUN yarn run build

FROM nginx:alpine as prod
EXPOSE 80
COPY ../src/Webs/daotao/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]