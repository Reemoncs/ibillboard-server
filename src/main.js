require('dotenv').config()

const Logger = require('./logger')
const { createIBillboardServer } = require('./server')
const { createRedisStorage } = require('./storage')
const { InvalidJsonFormat } = require('./exceptions')

const logger = new Logger(process.env)
const app = createIBillboardServer(logger)
const redis = createRedisStorage(process.env, logger)

const trackRequest = async (context, req, resp) => {
    try {
        const body = await req.jsonBody()

        await logger.requestLog(req.method(), req.url(), body)

        if(body.count !== undefined) {
            await redis.incrementBy('count', body.count)
        }
    } catch (e) {
        if (e instanceof InvalidJsonFormat) {
            context.onError(resp, {
                error: e,
                status: 400,
                statusMessage: 'Request must contain valid json data'
            })
        } else {
            context.onError(resp, {error: e})
        }

        return
    }

    resp.send('OK')
}

const countRequest = async (context, req, resp) => {
    try {
        const count = await redis.get('count', '0')
        resp.send(count)
    } catch (e) {
        context.onError(resp, {error: e})
    }
}

app.post('/track', trackRequest)
app.get('/count', countRequest)

app.listen(process.env.HTTP_SERVER_PORT)