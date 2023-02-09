FROM node:18-alpine as node
WORKDIR /app
COPY . .
RUN apk add gettext
RUN npm install
RUN npm run build --prod

FROM nginx:alpine

COPY --from=node /app/dist/gemtries-frontend /usr/share/nginx/html

