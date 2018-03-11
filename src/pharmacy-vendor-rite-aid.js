/*
* This module handles the functionality of making the pharmacy stores visible online on Google Maps.
* It also toggles the chat functionality for stores based on the status(Online/Offline).
*
* Dependencies: Requires PubNub subscribe/publish keys
*  to register to the pubNub service .
* */


var pubnub = new PubNub({
    subscribeKey: 'sub-c-0cd4f18e-11d5-11e8-b32f-5ea260837941', // Enter your subscribe key here
    publishKey: 'pub-c-146542ff-637d-43fa-a28a-cad0dbaf697e'
});

$(document).ready(function () {

    $('#chat-box-rite-aid').hide();
    $('#go-online-rite').on('click', function () {

        var statusText = document.querySelector('#status-text');

        pubnub.publish(
            {
                // This refers to the pharmacy location on the Google Map. I have hardcoded
                // the value here just for this example.
                // Ideally latitude and longitude values should be taken
                // using navigator.geolocation and google maps apis
                message: {
                    "latitude": "32.741599",
                    "longitude": "-117.053480"
                },
                channel: 'findPharmacyRiteAid'
            },
            function (status, response) {
                if (status.error) {
                    console.log("Error");
                } else {
                    statusText.innerHTML = "Rite Aid store is now open";
                    $('#chat-box-rite-aid').show();
                }
            })
    });
});

