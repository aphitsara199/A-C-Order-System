FROM node:22-alpine

WORKDIR /app
COPY package.json ./
COPY api ./api
COPY assets ./assets
COPY css ./css
COPY js ./js
COPY pages ./pages
COPY *.html ./

ENV NODE_ENV=production
ENV PORT=8080
USER node
EXPOSE 8080
CMD ["npm", "start"]
