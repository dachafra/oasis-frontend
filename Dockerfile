FROM node:6.12.0

MAINTAINER dachafra@gmail.com

WORKDIR /tripscore/oasis-frontend

COPY package*.json ./

RUN	npm install 

COPY . .

ENTRYPOINT ["/tripscore/oasis-frontend/run.sh"]

EXPOSE 4200
