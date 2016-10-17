var Mn = require('backbone.marionette')
var fs = require('fs')
var _ = require('lodash')
var dropdown = fs.readFileSync('./app/views/layout/dropdown.html', {encoding:'utf8'})
var dropdownItem = fs.readFileSync('./app/views/layout/dropdown-item.html', {encoding:'utf8'})
var Item = Mn.View.extend({
    className: '',
    template: _.template(dropdownItem),
    tagName:'li',
    events: {
        'click':'go'
    },
    go(){
        this.model.get('action')()
    },
    templateContext(){
        return {
            checked: this.options.checked && !!this.options.checked.get(this.model.id)
        }
    },
    initialize(){
        if (this.options.checked) {
            this.listenTo(this.options.checked, 'update', this.render, this)
        }
    },
    onRender(){
        this.$el.toggleClass('checked', this.options.checked && !!this.options.checked.get(this.model.id))
    }
})
var Dropdown = Mn.CompositeView.extend({
    template: _.template(dropdown),
    events: {
        'click .toggle-dropdown':'toggle',
        'mouseleave': 'hide' 
    },
    className:'',
    childViewOptions: function(){
        return {
            checked: this.options.checked
        }
    },
    hide(){
        this.$el.find('.dropdown-wrapper').addClass('hidden')
    },
    toggle: function(){
        this.$el.find('.dropdown-wrapper').toggleClass('hidden')
    },
    onRender(){
        if (this.options.checkable) this.$el.find('.dropdown').addClass('checkable')
    },
    childView: Item,
    childViewContainer: 'ul'
})

module.exports = Dropdown