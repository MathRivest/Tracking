   /*
    * Version 0.4
    * Now on Gitub
    * To make your life easier when you receive this 75 lines tracking document
    * 
    * 1. Include GA tracking code
    * 2. Link this file
    * 3. Enjoy!
    *
    * Reading:
    * Google Analytics: 
    * - https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
    * - https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingSocial
    * Facebook: 
    * - https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/
    * Twitter: 
    * - https://dev.twitter.com/docs/intents/events
    *
    */

var TRKNG = TRKNG || {};


TRKNG.init = function(){

    //console.log('TRKNG.init');
    TRKNG.buttons();
}

TRKNG.buttons = function(){

   /* Usage:
    * - <a href="url" data-trkng data-trkng-cat="my category" data-trkng-act="my action" data-trkng-lbl="my label">Tracked link</a>
    * - data-trkng is the main attribute for this function to work since its used in the selector to bind the behaviors
    * - can be inbound or if left empty it will be a normal event (like downloading a pdf, opening a modal box, etc)
    */

    $(document).on('click', '[data-trkng]', function(){
        var type = $(this).data("trkng"),
        category = $(this).data("trkng-cat"),
          action = $(this).data("trkng-act"),
           label = $(this).data("trkng-lbl"),
            link = $(this).attr("href");

        if(!type){
            _gat._getTrackerByName()._trackEvent(category, action, label);
        }else if(type == "inbound"){
            TRKNG.recordInboundLink(link, category, action, label);
            return false;
        }
        if(!category || !action || !label){
            //console.log("Please define all attributes for optimal tracking (data-cat, data-act, data-label)");
        }
    });
}

TRKNG.event = function(category, action, opt_label, opt_value, opt_noninteraction){ 
   /* Usage:
    * call TRKNG.event(params); on any event
    */

    _gaq.push(['_trackEvent', category, action, opt_label, opt_value, opt_noninteraction]);
}

TRKNG.facebook = {
    
    /*
    * Requirements:
    * - Loading the facebook Javascript SDK asynchronously
    */

    event : function(opt_label, opt_value, opt_noninteraction){

        /*
        * What it does:
        * - sends Facebook tracking events in a normal event, so that it can be compiled with the rest of the analytics 
        * Usage:
        * - call TRKNG.facebook.event(); in the fbAsyncInit function
        */

        //When a user like
        FB.Event.subscribe('edge.create', function(href, widget){
            _gaq.push(['_trackEvent', 'Facebook', 'Like', opt_label, opt_value, opt_noninteraction]);
        });

        //When a user unlike
        FB.Event.subscribe('edge.remove', function(targetUrl) {
            _gaq.push(['_trackEvent', 'facebook', 'Unlike', opt_label, opt_value, opt_noninteraction]);
        });
    },
    social : function(opt_pagePath){

       /* Requirements:
        * What it does:
        * - sends Facebook tracking events in a normal event, so that it can be compiled with the rest of the analytics
        * Usage:
        * - call TRKNG.facebook.social(); in the fbAsyncInit function
        */

        //When a user like
        FB.Event.subscribe('edge.create', function(href, widget){
            _gaq.push(['_trackSocial', 'Facebook', 'Like', href, opt_pagePath]);
        });

        //When a user unlike
        FB.Event.subscribe('edge.remove', function(targetUrl) {
          _gaq.push(['_trackSocial', 'facebook', 'Unlike', targetUrl, opt_pagePath]);
        });
    }
}

TRKNG.twitter = function(opt_target, opt_pagePath){

   /* Requirements:
    * - Twitter widjet.js
    * Usage:
    * - call TRKNG.twitter(); after widget.js was loaded
    */

    twttr.ready(function(twttr) {
        twttr.events.bind('tweet', function(event) { //the tweet event
            _gaq.push(['_trackSocial', 'twitter', 'tweet', opt_target, opt_pagePath]);
        });
    });
}

TRKNG.recordInboundLink = function(link, category, action, label) {
    _gat._getTrackerByName()._trackEvent(category, action, label);
    setTimeout('document.location = "' + link + '"', 100);
}





// Track page load time in Google Analytics
// _gaq.push(['_trackPageLoadTime']);

// Add a Javascript error handler so that it creates an event in Google Analytics
// whenever there's a CLIENT-SIDE javascript error
// window.onerror = function(message, file, line) { 
//     var sFormattedMessage = '[' + file + ' (' + line + ')] ' + message; 
//     _gaq.push(['_trackEvent', 'Errors', 'Browser', sFormattedMessage, null, true]);
// }