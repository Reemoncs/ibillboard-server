const { createServer } = require('http')
const Request = require('./request')
const Response = require('./response')
const Router = require('./router')
const { ResourceNotFound } = require('./exceptions')

const POST = 'post'
const GET = 'get'
const SERVER_ERROR = 'Server error'
const RESOURCE_NOT_FOUND = 'Resource not found!'

class Server {
    constructor(router, logger) {
        this.logger = logger
        this.router = router
        this.server = createServer(this.onRequest.bind(this))
    }

    async onRequest(request, response) {
        const req = new Request(request)
        const resp = new Response(response)

        try {
            const reqHandler = this.router.resolveRequest(req)
            await reqHandler(this, req, resp)
        } catch (e) {
            if (e instanceof ResourceNotFound) {
                this.onError(resp, {
                    status: 404,
                    statusMessage: RESOURCE_NOT_FOUND,
                    error: e
                })
            } else {
                this.onError(resp, {
                    error: e
                })
            }
        }
    }

    onError(response, { status = 500, statusMessage = SERVER_ERROR, error = undefined} ) {
        if (error !== undefined) {
            this.logger.log(String(error))
        }

        response.statusCode(status)
        response.send(statusMessage)
    }

    post(url, asyncHandler) {
        this.router.add(POST, url, asyncHandler)
    }

    get(url, asyncHandler) {
        this.router.add(GET, url, asyncHandler)
    }

    listen(port) {
        this.logger.log(`Server listening on port ${port}`)
        this.server.listen(port)
    }

    stop() {
        this.server.close()
    }
}

const createIBillboardServer = (logger) => {
    return new Server(new Router(), logger)
}

module.exports = {
    IBillboardServer: Server,
    createIBillboardServer: createIBillboardServer
}