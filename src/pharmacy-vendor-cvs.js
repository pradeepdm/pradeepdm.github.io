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

var cvsPharmacyLatitude = null;
var cvsPharmacyLongitude = null;
var cvsPharmacyLocationAdjustment = 0.02;

$(document).ready(function () {

    $('#chat-box-cvs').hide();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(foundLocation, noLocation);
    } else {
        alert("Geolocation error !!");
    }

    function foundLocation(position) {
        cvsPharmacyLatitude = position.coords.latitude;
        cvsPharmacyLongitude = position.coords.longitude;
    }


    function noLocation() {
        alert("Please provide access to Global Positioning System");
    }

    $('#go-online-cvs').on('click', function () {

        var statusText = document.querySelector('#status-text');

        pubnub.publish(
            {
                message: {

                    // This refers to the pharmacy location on the Google Map.
                    // The cvsPharmacyLocationAdjustment is to adjust the pharmacy location so that
                    // it doesn't overlap with the current location when running from the same machine.
                    // Current location is fetched using navigator.geolocation and Google map apis
                    "latitude": cvsPharmacyLatitude - cvsPharmacyLocationAdjustment,
                    "longitude": cvsPharmacyLongitude
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

