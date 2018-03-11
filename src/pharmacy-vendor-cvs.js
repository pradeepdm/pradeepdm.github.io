/*
* This module handles the functionality of making the pharmacy stores visible online on Google Maps.
* It also toggles the chat functionality for stores based on the status(Online/Offline).
*
* Dependencies: Requires PubNub subscribe/publish keys
*  to register to the pubNub service .
* */



// Creating an instance of pubNub to Subscribe to the open Pharmaceutical store.
var pubnub = new PubNub({
    subscribeKey: 'sub-c-0cd4f18e-11d5-11e8-b32f-5ea260837941', // Enter your subscribe key here
    publishKey: 'pub-c-146542ff-637d-43fa-a28a-cad0dbaf697e'
});



$(document).ready(function () {

    $('#chat-box-cvs').hide();
    $('#go-online-cvs').on('click', function () {

        var statusText = document.querySelector('#status-text');

        pubnub.publish(
            {
                message: {

                    // This refers to the pharmacy location on the Google Map. I have hardcoded
                    // the value here just for this example.
                    // Ideally latitude and longitude values should be taken
                    // using navigator.geolocation and google maps apis

                    "latitude": "32.708282",
                    "longitude": "-117.155739"
                },
                channel: 'findPharmacyCvs'
            },
            function (status, response) {
                if (status.error) {
                    console.log("Error");
                } else {
                    statusText.innerHTML = "CVS store is now open";
                    $('#chat-box-cvs').show();
                }
            })
    });
});

