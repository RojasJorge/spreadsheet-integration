'use strict'

const Hapi = require('hapi')
const Files = require('./handlers/files')

const server = new Hapi.Server()

server.connection({
    host: 'localhost',
    port: 2007
})

server.route({
    method: 'GET',
    path: '/files',
    handler: Files.getFiles
})

server.start((err) => {
    if (err) {
        throw err
    }
    console.log('Server running at:', server.info.uri)
})