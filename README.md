# ibillboard-server

## Requirements
Redis 

## Installation
```
git clone https://github.com/Reemoncs/ibillboard-server.git
```
```
npm install
```
Setup your .env file
```
NODE_ENV=<dev/prod>
LOG_REQUESTS=<file path to save /track requests>
HTTP_SERVER_PORT=<http server port>
REDIS_PORT=<redis database port>
REDIS_HOST=<redis database host>
```

## Usage
Start node http server with connection to Redis database
```
npm run start
```

Run tests
```
npm run test
```

Run tests with coverage calculation
```
npm run coverage
```

## Tested on
Node v8.7.0
Npm v5.4.2


