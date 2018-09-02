const Redis = require('redis')

const ERROR_EVENT = 'error'
const CONNECT_EVENT = 'connect'

class RedisStorage {
    constructor(client, logger) {
        this.logger = logger
        this.client = client

        this.client.on(CONNECT_EVENT, this.onConnected.bind(this))
        this.client.on(ERROR_EVENT, this.onError.bind(this))
    }

    onConnected() {
        this.logger.log('Connected to Redis')
    }

    onError(error) {
        this.logger.log(error)
    }

    incrementBy(key, value) {
        return new Promise((resolve, reject) => {
            this.client.incrby(key, parseInt(value), (error, result) => {
                if (error !== null) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
    }

    get(key, def) {
        def = def === undefined ? null : def

        return new Promise((resolve, reject) => {
            this.client.get(key, (error, result) => {
                if (error !== null) {
                    reject(error)
                } else {
                    resolve(result === null ? def : result)
                }
            })
        })
    }
}

const createRedisStorage = (env, logger) => {
    return new RedisStorage(Redis.createClient({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT
    }), logger)
}

module.exports = {
    createRedisStorage: createRedisStorage,
    RedisStorage: RedisStorage
}  