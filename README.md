# pub-sub-transporter-redis

> Implementation of [Pub/Sub Transporter Interface](https://github.com:twittwer/pub-sub#pubsubtransporter---pubsub-transporter-interface) based on Redis Pub/Sub

## Installation

`npm install git+ssh://git@github.com:twittwer/pub-sub-transporter-redis.git`

## Usage

```javascript
const redis = require( 'redis' ), // using node-redis as redis connector
    pubSub = require( 'pub-sub' );

const pubSubTransporterRedis = require( 'pub-sub-transporter-redis' );

const redisClientFactory = () => {
    return redis.createClient( {
        host: process.env.REDIS_HOST
    } );
}

const redisTransporter = pubSubTransporterRedis.initialize( {
    clientFactory: redisClientFactory
} );

pubSub.initialize( {
    transporter: redisTransporter,
    channelPrefix: 'pubSub:'
} );
```

## Reference

> required **parameters** are written bold  
> optional *parameters* are written italic or marked with `[`square brackets`]`

### Methods

#### pubSubTransporterRedis.initialize(config): pubSubTransporter

Initializes Redis Pub/Sub Transporter

**Returns** `pubSubTransporter` based on [Pub/Sub Transporter Interface](https://github.com:twittwer/pub-sub#pubsubtransporter---pubsub-transporter-interface)

| Param  | Type           | Description          |
| ------ | -------------- | -------------------- |
| config | `moduleConfig` | module configuration |

### Custom Type Definitions

#### `moduleConfig` - Module Configuration

| Param             | Type                | Description                                                                               |
| ----------------- | ------------------- | ----------------------------------------------------------------------------------------- |
| **clientFactory** | `() => redisClient` | client creator for underlying event transporter (Redis Pub/Sub; must return Redis client) |

#### `redisClient` - Redis Client Interface

##### redisClient.publish(channel, dataString): void

Publishes Data to Channel

| Param      | Type     | Description                         |
| ---------- | -------- | ----------------------------------- |
| channel    | `string` | name of targeted channel            |
| dataString | `string` | stringified data to emit on channel |

##### redisClient.subscribe(channel): void

Subscribes Client to Channel  
Incoming data is retrieved by client's message event.

| Param   | Type     | Description                                     |
| ------- | -------- | ----------------------------------------------- |
| channel | `string` | name of channel, the client should subscribe to |

##### redisClient.unsubscribe(channel): void

Unsubscribes Client from Channel

| Param   | Type     | Description                                             |
| ------- | -------- | ------------------------------------------------------- |
| channel | `string` | name of channel, the client should end his subscription |

##### redisClient.on(event, handler): void

Registers Event Handler on Client  
The 'message' event should be fired for every publication on subscribed channels and  
should provide the parameters for the following handler signature `(channel, dataString) => void`.

| Param   | Type       | Description                                   |
| ------- | ---------- | --------------------------------------------- |
| event   | `string`   | name of event, the handler should be wired to |
| handler | `function` | function to handle incoming events            |
