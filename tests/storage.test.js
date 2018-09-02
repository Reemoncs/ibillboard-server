const { RedisStorage } = require('../src/storage')

class LoggerStub {
    constructor() {
        this.logs = []
    }
    
    log(msg) {
        this.logs.push(msg)
    }
}

class RedisClientStub {
    constructor() {
        this.handlers = {}
        this.data = {}
    }

    on(event, handler) {
        this.handlers[event] = handler
    }
}

test('redis client registering and calling callbacks', () => {
    const logger = new LoggerStub()
    const client = new RedisClientStub()

    const storage = new RedisStorage(client, logger)
    
    expect(client.handlers.connect).not.toBeUndefined()
    expect(client.handlers.error).not.toBeUndefined()
    
    client.handlers.connect()
    client.handlers.error('error')
    
    expect(logger.logs).toContain('error')
    expect(logger.logs).toContain('Connected to Redis')
});

test('incrementBy promise rejected on error', async () => {
    RedisClientStub.prototype.incrby = (key, value, callback) => {
        callback('error', value)
    }

    const logger = new LoggerStub()
    const client = new RedisClientStub()

    const storage = new RedisStorage(client, logger)
    
    expect.assertions(1)
    try {
        await storage.incrementBy('data', 4)
    } catch (e) {
        expect(String(e)).toMatch('error')
    }
});

test('incrementBy promise resolved with value on null error', async () => {
    RedisClientStub.prototype.incrby = (key, value, callback) => {
        callback(null, value)
    }

    const logger = new LoggerStub()
    const client = new RedisClientStub()

    const storage = new RedisStorage(client, logger)
    
    const result = await storage.incrementBy('data', 4)
    
    expect(result).toBe(4)
});

test('get promise rejected on error', async () => {
    RedisClientStub.prototype.get = (key, callback) => {
        callback('error', 10)
    }

    const logger = new LoggerStub()
    const client = new RedisClientStub()

    const storage = new RedisStorage(client, logger)
    
    expect.assertions(1)
    try {
        await storage.get('data')
    } catch (e) {
        expect(String(e)).toMatch('error')
    }
});

test('get promise resolved with value on null error', async () => {
    RedisClientStub.prototype.get = (key, callback) => {
        callback(null, 10)
    }

    const logger = new LoggerStub()
    const client = new RedisClientStub()

    const storage = new RedisStorage(client, logger)
    
    const result = await storage.get('data')
    
    expect(result).toBe(10)
});

test('get promise resolved with default value when no data found', async () => {
    RedisClientStub.prototype.get = (key, callback) => {
        callback(null, null)
    }

    const logger = new LoggerStub()
    const client = new RedisClientStub()

    const storage = new RedisStorage(client, logger)
    
    const result = await storage.get('data', 20)
    
    expect(result).toBe(20)
});

test('get promise resolved with null value when no data found and default value is not provided', async () => {
    RedisClientStub.prototype.get = (key, callback) => {
        callback(null, null)
    }

    const logger = new LoggerStub()
    const client = new RedisClientStub()

    const storage = new RedisStorage(client, logger)
    
    const result = await storage.get('data')
    
    expect(result).toBeNull()
});