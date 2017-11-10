'use strict'

const Google = require('googleapis')
const key = require('../keys/google-key')
const Drive = Google.drive('v2')

const getFiles = (request, reply) => {

    const jwtClient = new Google.auth.JWT(
        key.client_email,
        null,
        key.private_key, ['https://www.googleapis.com/auth/drive'], // an array of auth scopes
        null
    );

    jwtClient.authorize(function(err, tokens) {
        if (err) {
            console.log(err);
            return reply({ err });
        }

        // Make an authorized request to list Drive files.
        Drive.files.list({
            auth: jwtClient
        }, function(err, resp) {
            if (err) {
                return reply({ err })
            }


            const files = resp.items
            if (files.length == 0) {
                console.log('No files found.');
            } else {
                console.log('Files:');
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    console.log('%s (%s)', file.title, file.id);
                }
            }

            return reply({ files })

        });
    });

}

module.exports = {
    getFiles
}