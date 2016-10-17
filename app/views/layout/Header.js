var Mn = require('backbone.marionette')
var Bb = require('backbone')
var fs = require('fs')
var _ = require('lodash')
var checked = require('../../singletons/checkedLabels')

var Dropdown = require('./Dropdown')

var header = fs.readFileSync('./app/views/layout/header.html', {encoding:'utf8'})
var Header = Mn.View.extend({
    events: {
        'click .refresh':'up'
    },
    template: _.template(header),
    up () {
        this.options.refresh()
    },
    initialize(){
        this.labels = this.options.labels
        this.listenTo(this.labels, 'update', this.onRender, this)
    },
    onRender(){
        var list = this.labels.toJSON().map(label => {
            return Object.assign({}, label, {
                label: label.name,
                action: () => {
                    if (!!checked.get(label.id)) {
                        checked.remove(checked.get(label.id))
                    }else{
                        checked.add(label)
                    }
                    checked.trigger('update')
                }
            })
        }).sort((a, b) => {
            if (a.label < b.label)
                return -1;
            if (a.label > b.label)
                return 1;
            return 0;
        })
        var dropdown = new Dropdown({
            checked: checked,
            collection: new Bb.Collection(list), 
            checkable: true
        })
        this.$el.find('.more-tools').html(dropdown.render().el)
    }
})

module.exports = Header