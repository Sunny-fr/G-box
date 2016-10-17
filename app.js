var jQuery = $ = require('jquery')
var Bb = require('backbone')
var Mn = require('backbone.marionette');
var RootView = require('./app/views/RootView');
var _ = require('lodash')
var googleAuth = require('./app/auth/google')




//ASSETS
window.jQuery = jQuery
var material = require('bootstrap-material-design/dist/js/material.js')
var ripples = require('bootstrap-material-design/dist/js/ripples.js')
$.material.init();



//Application

var App = Mn.Application.extend({
  region: '#root',
  onStart: function() {
    this.showView(new RootView());
  }
});
var myApp = new App();


//Google Auth 
googleAuth.then(function(params){
    myApp.start();
    require('./app/singletons/cron')
})
