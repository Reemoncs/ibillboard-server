const Router = require('../src/router');
const { ResourceNotFound } = require('../src/exceptions')
const Request = require('../src/request');

test('throw error on non existant route', () => {
    const router = new Router()
    expect(() => {
        router.resolve('post', '/track')
    }).toThrow(ResourceNotFound)
});

test('resolve one route', () => {
    const router = new Router()

    router.add('post', '/track', () => 1)

    expect(router.resolve('post', '/track')()).toBe(1)
});

test('resolve multiple routes', () => {
    const router = new Router()

    router.add('post', '/track', () => 1)
    router.add('get', '/count', () => 2)
    router.add('put', '/track', () => 3)
    router.add('post', '/count', () => 4)

    expect(router.resolve('post', '/track')()).toBe(1)
    expect(router.resolve('get', '/count')()).toBe(2)
    expect(router.resolve('put', '/track')()).toBe(3)
    expect(router.resolve('post', '/count')()).toBe(4)
});

test('resolve with request object', () => {
    const router = new Router()
    const request = new Request({
        method: 'GET',
        url: '/track'
    })

    router.add('get', '/track', () => 1)

    expect(router.resolveRequest(request)()).toBe(1)
});