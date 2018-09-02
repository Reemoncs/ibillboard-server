const { InvalidJsonFormat } = require('./exceptions')

module.exports = class Request {
    constructor(req) {
        this.req = req
    }

    body() {
        return new Promise((resolve, reject) => {
            let data = ''
            this.req.on('error', reject)
            this.req.on('data', chunk => data += chunk.toString())
            this.req.on('end', () => resolve(data))
        })
    }

    async jsonBody() {
        const body = await this.body()
        try {
            return JSON.parse(body)
        } catch (e) {
            throw new InvalidJsonFormat('Body is not a valid json string!')
        }
    }

    method() {
        return this.get('method')
    }

    url() {
        return this.get('url')
    }

    get(param) {
        if ( ! (param in this.req)) {
            throw new Error(`Parameter ${param} not found in request object!`)
        }

        return this.req[param]
    }
}