var Bb = require('backbone')
var MessageModel = require('./MessageModel')

var google = require('googleapis')
var gmail = google.gmail('v1')
var auth = require('../../singletons/auth')
var checked = require('../../singletons/checkedLabels')

var MessageCollection = Bb.Collection.extend({
    model: MessageModel,
    labels: null,
    initialize(){
        this.labels = ['INBOX'] 
    },
    setLabels (labels) {
        this.labels = labels
        return this;
    },
    filtered(){
        var items = this.toJSON().filter(msg=>{
            var found = false
            console.log(msg)
            msg.labelIds.map(label=>{
                if (found == false && this.labels.indexOf(label) > -1) found = true
            })
            return true
        })
        this.reset(items)
        //this.trigger('update')
    },
    fetch() {
        var promise = new Promise((resolve, reject)=>{
                gmail.users.messages.list({auth: auth.google, userId: 'me', labelIds: this.labels}, (err, response) => {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    reject('The API returned an error: ' + err)
                    return;
                }
                this.reset(response.messages)
                this.trigger('update')
                //this.filtered()
                resolve(response.messages)
            })
        })
        
        return promise
    }
})

module.exports = MessageCollection