FROM nginx:latest

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./dist/spa /usr/share/nginx/html

EXPOSE 80
