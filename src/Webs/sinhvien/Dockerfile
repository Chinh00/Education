FROM node:lts-alpine as builder
WORKDIR /app
COPY src/Webs/sinhvien/package.json ./
COPY src/Webs/sinhvien/yarn.lock ./
RUN yarn install

COPY src/Webs/sinhvien ./
RUN yarn run build

FROM nginx:alpine as prod
EXPOSE 80
COPY ../src/Webs/sinhvien/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]