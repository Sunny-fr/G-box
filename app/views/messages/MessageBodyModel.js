var Bb = require('backbone')

var google = require('googleapis')
var gmail = google.gmail('v1')
var auth = require('../../singletons/auth')


var MessageBody = Bb.Model.extend({
    source(){
        return {
            auth: auth.google, 
            messageId: this.get('messageId'), 
            id: this.get('id'), 
            userId: 'me'
        }
    },
    fetch() {
        var promise = $.Deferred()
        gmail.users.messages.attachments.get(this.source(), (err, response) => {
            this.set(response)
            promise.resolve(response)
        })
        return promise
    }
})

module.exports = MessageBody
