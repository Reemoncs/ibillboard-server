const Logger = require('../src/logger')
const fs = require('fs')

const testFile = './test.txt'

describe('creating test log file', () => {
    afterEach(() => {
        fs.unlinkSync(testFile, (err) => {})
    })

    test('append log request to file', async (done) => {
        const logger = new Logger({
            NODE_ENV: 'dev',
            LOG_REQUESTS: testFile
        })

        const method = 'post'
        const url = '/track'
        const data = {
            'test': 'test'
        }

        const expected = method.toString().toUpperCase() + " " + url + "\n" + JSON.stringify(data) + "\n\n";

        await logger.requestLog(method, url, data)

        await fs.readFile(testFile, (error, data) => {
            expect(data.toString()).toMatch(expected)
            done()
        })
    });
})

test('skip log request when no file path provided', async (done) => {
    const logger = new Logger({
        NODE_ENV: 'dev',
    })

    const method = 'post'
    const url = '/track'
    const data = {
        'test': 'test'
    }

    await logger.requestLog(method, url, data)

    await fs.exists(testFile, (exists) => {
        expect(exists).toBeFalsy()
        done()
    })
});