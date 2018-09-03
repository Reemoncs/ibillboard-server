const Request = require('../src/request');

test('get method throws error on non existant parameter', () => {
    const reqStub = {
        method: 'GET',
        url: '/track'
    }

    const req = new Request(reqStub)

    expect(() => {
        req.get('headers')
    }).toThrow(Error)
});

test('get method returns correct value if parameter exists', () => {
    const reqStub = {
        method: 'GET',
        url: '/track'
    }

    const req = new Request(reqStub)

    expect(req.get('method')).toMatch('GET')
    expect(req.get('url')).toMatch('/track')
});

test('body promise rejected if exception is thrown', async () => {
    const reqStub = {
        on: (event, handler) => {
            if (event === 'error') {
                throw new Error('error')
            }
        }
    }

    const req = new Request(reqStub)

    expect.assertions(1)
    try {
        await req.body()
    } catch (e) {
        expect(e.toString()).toMatch('error');
    }
});

test('body promise resolved on data', async () => {
    const reqStub = {
        on: (event, handler) => {
            if (event === 'data') {
                handler('some ')
                handler('data')
            }
            if (event === 'end') {
                handler()
            }
        }
    }

    const req = new Request(reqStub)

    const data = await req.body()
    expect(data).toMatch('some data');
});

test('jsonBody returns json data', async () => {
    const reqStub = {
        on: (event, handler) => {
            if (event === 'data') {
                handler('{"test":"test"}')
            }
            if (event === 'end') {
                handler()
            }
        }
    }

    const req = new Request(reqStub)

    const data = await req.jsonBody()
    expect(data).toEqual({test: 'test'});
});

test('jsonBody throws exception on invalid json string', async () => {
    const reqStub = {
        on: (event, handler) => {
            if (event === 'data') {
                handler('invalid json')
            }
            if (event === 'end') {
                handler()
            }
        }
    }

    const req = new Request(reqStub)

    expect.assertions(1)
    try {
        await req.jsonBody()
    } catch (e) {
        expect(e.toString()).toMatch('Body is not a valid json string!');
    }
});

test('url returns plain pathname without query params', () => {
    const reqStub = {
        method: 'GET',
        url: '/track?test=test&test1=test1'
    }

    const req = new Request(reqStub)
    expect(req.url()).toMatch('/track');
});