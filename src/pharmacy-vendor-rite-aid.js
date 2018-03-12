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

var riteAidPharmacyLatitude = null;
var riteAidPharmacyLongitude = null;
var riteAidPharmacyLocationAdjustment = 0.04;


$(document).ready(function () {

    $('#chat-box-rite-aid').hide();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(foundLocation, noLocation);
    } else {
        alert("Geolocation error !!");
    }

    function foundLocation(position) {
        riteAidPharmacyLatitude = position.coords.latitude;
        riteAidPharmacyLongitude = position.coords.longitude;
    }


    function noLocation() {
        alert("Please provide access to Global Positioning System");
    }


    $('#go-online-rite').on('click', function () {

        var statusText = document.querySelector('#status-text');

        pubnub.publish(
            {
                // This refers to the pharmacy location on the Google Map.
                // The riteAidPharmacyLocationAdjustment is to adjust the pharmacy location so that
                // it doesn't overlap with the current location when running from the same machine.
                // Current location is fetched using navigator.geolocation and Google map apis
                message: {
                    "latitude": riteAidPharmacyLatitude - riteAidPharmacyLocationAdjustment,
                    "longitude": riteAidPharmacyLongitude
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

