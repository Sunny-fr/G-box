var Bb = require('backbone')

var google = require('googleapis')
var gmail = google.gmail('v1')
var auth = require('../../singletons/auth')


var LabelModel = Bb.Model.extend({
})

var LabelCollection = Bb.Collection.extend({
    model: LabelModel,
    fetch() {
        var promise = new Promise((resolve, reject)=>{
            gmail.users.labels.list({auth: auth.google, userId: 'me'}, (err, response) => {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject('The API returned an error: ' + err)
                return;
            }
            this.reset(response.labels)
            this.trigger('update');
            resolve(response.labels)
            })
        })
        
        return promise
    }
})

module.exports = LabelCollection