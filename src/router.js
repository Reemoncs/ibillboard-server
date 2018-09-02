const { ResourceNotFound } = require('./exceptions')

module.exports = class Router {
    constructor() {
        this.routes = {}
    }

    add(method, url, handler) {
        const lowerCaseMethod = method.toString().toLowerCase()

        if ( ! (lowerCaseMethod in this.routes)) {
            this.routes[lowerCaseMethod] = {}
        }

        this.routes[lowerCaseMethod][url] = handler
    }

    resolveRequest(request) {
        return this.resolve(request.method(), request.url())
    }

    resolve(method, url) {
        const lowerCaseMethod = method.toString().toLowerCase()

        if (this.routes[lowerCaseMethod] === undefined || this.routes[lowerCaseMethod][url] === undefined) {
            throw new ResourceNotFound(`Route for ${lowerCaseMethod} method and ${url} url not found!`)
        }

        return this.routes[lowerCaseMethod][url]
    }
}