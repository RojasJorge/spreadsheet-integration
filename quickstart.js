'use strict'

const Hapi = require('hapi')
const SpreadSheetsApi = require('./handlers/SpreadSheetsApi')

const server = new Hapi.Server()

server.connection({
    host: 'localhost',
    port: 2009
})

server.route({
    method: 'GET',
    path: '/api/v1/contact',
    handler: SpreadSheetsApi.ReadS
})

server.start((err) => {
    if (err) {
        throw err
    }
    console.log('Server running at:', server.info.uri)
})