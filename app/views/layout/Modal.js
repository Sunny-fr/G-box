var Mn = require('backbone.marionette')
var fs = require('fs')
var _ = require('lodash')
var modal = fs.readFileSync('./app/views/layout/modal.html', {encoding:'utf8'})
var Modal = Mn.View.extend({
    className: 'modal',
    template: _.template(modal),
    events:{
        'click .closeModal': 'destroy'
    },
    show(){
        this.$el.css({display: 'block'})
    }
})

module.exports = Modal