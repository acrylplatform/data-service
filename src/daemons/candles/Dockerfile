FROM node:10-alpine

# enable node_modules caching layer
RUN apk add --no-cache tini git
ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn install
RUN mkdir -p /opt/dataservice-candles && cp -a /tmp/node_modules /opt/dataservice-candles

# set work dir
WORKDIR /opt/dataservice-candles
ADD . /opt/dataservice-candles
RUN cd /opt/dataservice-candles

# add tini for PID 1 handling
ENTRYPOINT ["/sbin/tini", "--"]

# NodeJS launch
USER node
ENV NODE_ENV production
CMD ["node", "--max-old-space-size=2048", "src/daemons/candles/index.js"]