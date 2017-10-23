'use strict';

/* ----------------- */
/* --- Variables --- */
/* ----------------- */

const redis = {
  pub: null,
  sub: null
};

/* ------------------------------------- */
/* --- Pub/Sub Transporter Interface --- */
/* ------------------------------------- */

const connectFactory = clientFactory => {
  const connect = dataHandler => {
    if (typeof dataHandler !== 'function') {
      throw new Error('Parameter Error: dataHandler is required and has to be a function');
    }

    redis.pub = clientFactory();
    redis.sub = clientFactory();

    /* eslint-disable arrow-body-style */
    redis.sub.on('message', (channel, data) => dataHandler(channel, JSON.parse(data)));
    /* eslint-enable arrow-body-style */
  };

  return connect;
};

const publish = (channel, data) => {
  let dataString;

  try {
    dataString = JSON.stringify(data);
  } catch (error) {
    throw new Error('Parameter Error: data has to be a valid JSON document');
  }

  redis.pub.publish(channel, dataString);
};

const subscribe = channel => {
  redis.sub.subscribe(channel);
};

const unsubscribe = channel => {
  redis.sub.unsubscribe(channel);
};

/* ---------------------- */
/* --- Initialization --- */
/* ---------------------- */

const initialize = config => {
  if (!config || typeof config.clientFactory !== 'function') {
    throw new Error('Parameter Error: clientFactory is required and has to be a function');
  }

  const connect = connectFactory(config.clientFactory);

  return {
    connect,
    publish,
    subscribe,
    unsubscribe
  };
};

/* -------------- */
/* --- Export --- */
/* -------------- */

module.exports = {
  initialize
};
