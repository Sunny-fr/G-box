var Mn = require('backbone.marionette')
var Bb = require('backbone')
var fs = require('fs')
var _ = require('lodash')
var Modal = require('../layout/Modal')
var message = fs.readFileSync('./app/views/messages/message.html', {encoding:'utf8'})
var modal = fs.readFileSync('./app/views/messages/modal-message.html', {encoding:'utf8'})
var MessageBody = require('./MessageBodyModel')
var base64 = require('js-base64').Base64 


var Dropdown = require('../layout/Dropdown')

var MessageModal = Modal.extend({
    template: _.template(modal),
    initialize(){
        this.undelegateEvents();
        this.events['click .load-message-text'] = 'expandMessagePlainText'
        this.events['click .load-message-html'] = 'expandMessageHTML'
        this.delegateEvents()
    },
    decode (bodyData) {
        return base64.decode(bodyData.replace(/-/g, '+').replace(/_/g, '/'))
    },
    loadMessage (mimeType) {
        var promises = []
        if (this.model.get('payload').mimeType == mimeType) {
            promises.push(new Promise((resolve, reject) => {
                resolve(this.decode(this.model.get('payload').body.data))
            }))
        } else {
            _.each(this.model.get('payload').parts, (part)=>{
                if (part.mimeType == mimeType){
                    if (part.body.size > 0 && part.body.data ) {
                        promises.push(new Promise((resolve, reject) => {
                            resolve(this.decode(part.body.data))
                        }))
                    } else {
                        if (!part.body.attachmentId) {
                            console.info('no attachmentId ?')
                        }else {
                            var promise = new Promise((resolve, reject) => {
                                var model = new MessageBody({
                                    messageId: this.model.id,
                                    id: part.body.attachmentId
                                })
                                model.fetch().then(m=>{
                                    var body = model.toJSON().data
                                    resolve(this.decode(body))
                                })  
                            })
                            promises.push(promise)
                        }
                    }
                }
            })
        }
        return Promise.all(promises)
    },

    expandMessage (mimeType) {
        this.$el.find('.modal-body').html('...')
        this.loadMessage(mimeType).then(bodyparts => {
            this.$el.find('.modal-body').html('')
            _.each(bodyparts, body => {
                this.$el.find('.modal-body').addClass('full')
                var content = mimeType == 'text/plain' 
                ?  '<pre style="white-space: pre-line; word-break: break-word;">'+body+'</pre>' 
                : body 
                this.$el.find('.modal-body').append(content)
            })
        })
    },

    expandMessagePlainText () {
        this.expandMessage('text/plain')
    },

    expandMessageHTML () {
        this.expandMessage('text/html')
    },
    onRender(){
        var dropdown = new Dropdown({collection: new Bb.Collection([
            { 
                label : '<i class="material-icons">markunread</i> toggle read/unread',
                action : ()=>{
                    this.model.toggleRead()
                }
            },
            { 
                label : '<i class="material-icons">check</i> done',
                action : ()=>{
                    this.model.toggleDone()
                }
            }
        ])})

        this.$el.find('.more-tools').html(dropdown.render().el)
    }
})

var Message = Mn.View.extend({
    events: {
        'click':'show'
    },
    className: 'list-item animated fadeIn',
    template: _.template(message),
    initialize(){
        this.model.fetch()
        this.listenTo(this.model, 'update', this.render, this)
    },
    show(){
        var modal = new MessageModal({model:this.model})
        this.options.showModal(modal.render().el)
        modal.show()
    },
    onRender(){
        var found = false
        this.model.get('labelIds').map(label=>{
            if (found == false && this.model.collection.labels.indexOf(label) > -1) found = true
        })
        this.$el.toggleClass('hidden', !found)
    }
})

var ListMessage = Mn.CompositeView.extend({
    childView: Message,
    childViewContainer:'.list-group',
    className: 'panel panel-default animated fadeIn',
    childViewOptions: function(){
        return { 
            showModal: this.options.showModal
        }
    },
    template: _.template('<div class="panel-body"><div class="list-group"></div></div>')
})

module.exports = ListMessage