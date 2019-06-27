FROM nginx
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD build /usr/src/app/
COPY nginx.conf /etc/nginx/nginx.conf
