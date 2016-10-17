var Mn = require('backbone.marionette')
var Bb = require('backbone')
var _ = require('lodash')
var $ = require('jquery')
var fs = require('fs')


var google = require('googleapis')
var gmail = google.gmail('v1')
var auth = require('../singletons/auth')
var ListMessage = require('./messages/Messages')
var Header = require('./layout/Header')
var MessageCollection = require('./messages/MessageCollection')
var LabelCollection = require('./labels/LabelCollection')
var checked = require('../singletons/checkedLabels')

var View = Mn.View.extend({
    template: _.template('<div class="core"></div>'),
    initialize(){
        this.collection = new MessageCollection()
        this.updateLabels()
        this.listenTo(this, 'up', e=>{
            this.refresh()
        })
        this.listenTo(checked, 'change update', this.updateLabels, this)
        this.trigger('up')
    },
    updateLabels(){
        var labels = checked.toJSON().map(label=>label.id)
        this.collection.setLabels(labels)
        this.trigger('up')
    },
    showModal(el){
        this.$el.append(el)
    },
    refresh(){
        this.collection.fetch()
    },
    onRender(){
        var labelCollection = new LabelCollection();
        this.$el.prepend(new Header({
            refresh: e => this.refresh(),
            labels: labelCollection
        }).render().el)
        labelCollection.fetch()
        var list = new ListMessage({collection: this.collection, showModal: el => this.showModal(el)})
        this.$el.find('.core').html(list.render().el)
    }
})



module.exports = View
