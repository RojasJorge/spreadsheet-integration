const fs = require('fs')
const readline = require('readline')
const google = require('googleapis')
const googleAuth = require('google-auth-library')
const _ = require('lodash')

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

const TOKEN_PATH = './token/client_id.json'

const authorize = (credentials, callback) => {
    // console.log(credentials)
    const clientSecret = credentials.web.client_secret
    const clientId = credentials.web.client_id
    const redirectUrl = credentials.web.redirect_uris[0]
    const auth = new googleAuth()
    const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)

    fs.readFile(TOKEN_PATH, function(err, token) {
        if (err) {
            getNewToken(oauth2Client, callback)
        } else {
            oauth2Client.credentials = JSON.parse(token)
            callback(oauth2Client)
        }
    })
}

const getNewToken = (oauth2Client, callback) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    })
    console.log('Authorize this app by visiting this url: ', authUrl)
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    rl.question('Enter the code from that page here: ', function(code) {
        rl.close()
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err)
                return reply(err)
            }
            oauth2Client.credentials = token
            storeToken(token)
            callback(oauth2Client)
        })
    })
}

const storeToken = (token) => {
    try {
        fs.mkdirSync(TOKEN_DIR)
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token))
    console.log('Token stored to ' + TOKEN_PATH)
}

const ReadS = (request, reply) => {
    fs.readFile('./keys/client_id.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err)
            return reply({ err })
        }

        authorize(JSON.parse(content), (auth) => {
            const sheets = google.sheets('v4')
            sheets.spreadsheets.values.get({
                auth: auth,
                spreadsheetId: '1bS43zSjUJqhyem0YRGsulmnIjdNWSYeN2djZSaHzAn8',
                range: 'A2:C',
            }, function(err, response) {
                if (err) {
                    console.log('The API returned an error: ' + err)
                    return reply({
                        err
                    })
                }
                let rows = response.values
                if (rows.length == 0) {
                    console.log('No data found.')
                    return reply({
                        status: 'empty',
                        rows
                    })
                } else {
                    console.log(rows)
                    if (request.query) {
                        console.log(request.query)
                        const { email, team, name } = request.query
                        if (name) {
                            rows = _.filter(rows, (o) => {
                                console.log(o)
                                return o[0] == name
                            })
                        }
                        if (email) {
                            rows = _.filter(rows, (o) => {
                                console.log(o)
                                return o[1] == email
                            })
                        }
                        if (team) {
                            rows = _.filter(rows, (o) => {
                                console.log(o)
                                return o[2] == team
                            })
                        }
                    }
                    return reply({
                        status: 'success',
                        rows
                    })
                }
            })
        })
    })
}

module.exports = {
    ReadS
}