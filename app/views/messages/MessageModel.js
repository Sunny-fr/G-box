var Bb = require('backbone')

var google = require('googleapis')
var gmail = google.gmail('v1')
var auth = require('../../singletons/auth')
var _ = require('lodash')


var clean = function (str) {
    var chars = ['"', "'"]
    var cleaned = str.trim()
    _.each(chars, function(char){
        if (cleaned.substr(0,1) == char && cleaned.substr(-1) == char ) {
            cleaned = cleaned.substr(1, cleaned.length-2)
        }
    })
    return cleaned
}



var MessageModel = Bb.Model.extend({
    defaults: {
        snippet:'',
        labelIds:[],
        from:'',
        subject:''
    },
    source(){
        return {auth: auth.google, format:'full', id: this.id, userId: 'me'}
    },
    toggleDone(){
        var params = _.omit(this.source(), ['format']) 
        var labels = this.get('labelIds')
        if (labels.indexOf('INBOX') > -1) {
            params.resource = {
                removeLabelIds: ['INBOX']
            }
        }else {
            params.resource = {
                addLabelIds: ['INBOX']
            }
        }
        var promise = new Promise((resolve, reject)=>{
            gmail.users.messages.modify(params, (err, response) => {
                if (err) { console.log('The API returned an error: ' + err); return; }
                this.set(response)
                this.trigger('update')
                resolve(response)
            })
        })
        return promise
    },
    toggleRead(){
        var params = _.omit(this.source(), ['format']) 
        var labels = this.get('labelIds')
        if (labels.indexOf('UNREAD') > -1) {
            params.resource = {
                removeLabelIds: ['UNREAD']
            }
        }else {
            params.resource = {
                addLabelIds: ['UNREAD']
            }
        }
        var promise = new Promise((resolve, reject)=>{
            gmail.users.messages.modify(params, (err, response) => {
                if (err) { console.log('The API returned an error: ' + err); return; }
                this.set(response)
                this.trigger('update')
                resolve(response)
            })
        })
        return promise
    },
    fetch() {
        var promise = new Promise((resolve, reject)=>{
            gmail.users.messages.get(this.source(), (err, response) => {
                if (err) { console.log('The API returned an error: ' + err); return; }
                var from = clean(_.find(response.payload.headers, o => o.name == 'From').value.substr(0, _.find(response.payload.headers, o => o.name == 'From').value.indexOf("<")))
                var subject = _.find(response.payload.headers, o => o.name == 'Subject').value
                this.set(Object.assign({}, response, {from, subject}))
                this.trigger('update')
                resolve(response)
            })
        })
        return promise
    }
})

module.exports = MessageModel
