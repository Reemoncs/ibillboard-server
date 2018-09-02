
module.exports = class Response {
    constructor(response) {
        this.resp = response
        this.status = 200
        this.headers = {
            'Content-Type': 'text/plain'
        }
    }

    statusCode(code) {
        this.status = code
    }

    contentType(type) {
        this.headers['Content-Type'] = type
    }

    send(body) {
        this.resp.writeHead(this.status, this.headers)
        this.resp.end(body)
    }

    sendJson(json) {
        this.contentType('application/json')
        this.send(JSON.stringify(json))
    }
}