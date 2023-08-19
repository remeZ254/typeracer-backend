FROM openshift-image-registry.apps.oscp-dev.mamdas.iaf/romach/node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY node_modules node_modules
COPY configuration configuration
COPY dist dist
COPY public public

EXPOSE 3000

CMD npm run start:prod
