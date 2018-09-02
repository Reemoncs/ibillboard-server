const Response = require('../src/response');

class ServerResponseStub {
    constructor() {
        this.status = 0
        this.headers = {}
        this.body = ''
    }
    
    writeHead(status, headers) {
        this.status = status
        this.headers = headers
    }

    end(body) {
        this.body = body
    }
}

test('check setting status code and sending data', () => {
    const stub = new ServerResponseStub()

    const resp = new Response(stub)

    resp.statusCode(200)
    resp.send('data')

    expect(stub.status).toBe(200)
    expect(stub.body).toMatch('data')
});

test('check sending json formated data', () => {
    const stub = new ServerResponseStub()

    const resp = new Response(stub)

    resp.statusCode(500)
    resp.sendJson({
        data: 'testdata'
    })

    expect(stub.status).toBe(500)
    expect(stub.body).toMatch('{"data":"testdata"}')
});