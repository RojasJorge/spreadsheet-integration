'use strict'

const Hapi = require('hapi')
const Joi = require('joi')
const SpreadSheetsApi = require('./handlers/SpreadSheetsApi')

const server = new Hapi.Server()

server.connection({
    host: 'localhost',
    port: 2009
})

server.route({
    method: 'GET',
    path: '/api/v1/contact',
    config: {
        handler: SpreadSheetsApi.ReadS,
        validate: {
            params: {
                team: Joi.string().max(50).min(3).optional(),
                name: Joi.string().max(150).min(15).optional(),
                email: Joi.string().email().optional()
            }
        }
    }
})

server.start((err) => {
    if (err) {
        throw err
    }
    console.log('Server running at:', server.info.uri)
})