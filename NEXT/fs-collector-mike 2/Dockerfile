FROM mhart/alpine-node:11

CMD mkdir /collector
WORKDIR /collector

COPY server.js .

COPY LICENSE .
COPY package.json .
#COPY package-lock.json .
COPY lib ./lib
COPY language ./language
COPY mdimages ./mdimages
COPY insight ./insight

RUN npm install

COPY teams.json .
COPY config.json .
COPY README.md .
COPY LICENSE .
COPY public ./public

EXPOSE 3000

CMD ["node", "server.js"]
