
   /*
    * Version 0.2
    * To make your life easier when you receive this 75 lines tracking document
    * 
    * 1. Include GA tracking code
    * 2. Link this file
    * 3. Enjoy!
    *
    * Reading:
    * Google Analytics: 
    * https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
    * https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingSocial
    * Facebook: 
    * https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/
    * Twitter: 
    * https://dev.twitter.com/docs/intents/events
    *
    */

var TRKNG = TRKNG || {};


TRKNG.init = function(){
    TRKNG.buttons();
}

TRKNG.buttons = function(){

   /* Usage:
    * <a href="url" data-trkng data-trkng-cat="my category" data-trkng-act="my action" data-trkng-lbl="my label">Tracked link</a>
    * data-trkng is the main attribute for this function to work since its used in the selector to bind the behaviors
    * can be inbound or if left empty it will be a normal event (like downloading a pdf, opening a modal box, etc)
    */

    $("[data-trkng]").click(function(){
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

TRKNG.facebook = function(){

   /* Requirements:
    * - Loading the facebook Javascript SDK asynchronously
    * Usage:
    * call TRKNG.facebook(); in the fbAsyncInit function
    */

    //When a user like
    FB.Event.subscribe('edge.create', function(href, widget){
        _gaq.push(['_trackSocial', 'Facebook', 'Like', href]);
    });

    //When a user unlike
    FB.Event.subscribe('edge.remove', function(targetUrl) {
      _gaq.push(['_trackSocial', 'facebook', 'Unlike', targetUrl]);
    });
}

TRKNG.twitter = function(){

   /* Requirements:
    * - Twitter widjet.js
    * Usage:
    * call TRKNG.twitter(); after widget.js was loaded
    */

    twttr.ready(function(twttr) {
        twttr.events.bind('tweet', function(event) { //the tweet event 
            _gaq.push(['_trackSocial', 'twitter', 'tweet']);
        });
    });
}

TRKNG.recordInboundLink = function(link, category, action, label) {
    _gat._getTrackerByName()._trackEvent(category, action, label);
    setTimeout('document.location = "' + link + '"', 100);
}