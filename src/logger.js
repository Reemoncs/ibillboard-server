const fs = require('fs')

module.exports = class Logger {
    constructor(env) {
        this.dev = env.NODE_ENV === 'dev'
        this.logRequests = env.LOG_REQUESTS
    }

    log(msg) {
        console.log(msg)
    }

    async requestLog(method, url, data) {
        if (this.logRequests === undefined) {
            return
        }

        const log = method.toString().toUpperCase() + " " + url + "\n" + JSON.stringify(data) + "\n\n"
        
        await fs.writeFile(this.logRequests, log, {flag: 'a'}, (error) => {
            if (error) throw error
        })
    }
}