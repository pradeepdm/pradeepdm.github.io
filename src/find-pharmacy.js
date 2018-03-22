
/*
*  This file makes use of Google Places API to locate the nearest drug stores for a given radius.
*  This also lets user explore both offline and online pharmaceutical store within the given radius.
*
*  Dependencies: Requires Google API key to use google maps and PubNub subscribe/publish keys
*  to register to the pubNub service.
* */

// Creating an instance of pubNub to Subscribe to the open Pharmaceutical store.
var pubnub = new PubNub({
    subscribeKey: 'sub-c-0cd4f18e-11d5-11e8-b32f-5ea260837941', // Enter your subscribe key here
    publishKey: 'pub-c-146542ff-637d-43fa-a28a-cad0dbaf697e'
});

var imagePath = 'http://m.schuepfen.ch/icons/helveticons/black/60/Pin-location.png';


var options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
};

function initMap() {

    // Fetching the current location inorder to fine the near by restaurants using the google Places API
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(foundLocation, noLocation, options);
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    // Using the modal here to handle the chat discussion with the pharmacist.
    var modal = document.getElementById('largeModal');
    var infoWindow;


    function foundLocation(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        var latLong = new google.maps.LatLng(lat, lon);

        var mapOptions = {
            zoom: 11,
            center: latLong,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // Map instance displayed on the web page with the pharmaceutical stores.
        var mapDisplayingResults = new google.maps.Map(document.getElementById('map'), mapOptions);

       // Setting the current location of the customer here.
        var infoWindowForCurrentLocation = new google.maps.InfoWindow({
            content: "Current Location",
            maxWidth: 300
        });

        //Adding Marker to display the current page
        var currentLocationMarker = new google.maps.Marker({
            position: latLong,
            map: mapDisplayingResults
        });


        // Handling resize and click events on the Google Maps InfoWindow and Marker
        google.maps.event.addListener(currentLocationMarker, 'click', function() {
            infoWindowForCurrentLocation.open(mapDisplayingResults, currentLocationMarker);
        });

        google.maps.event.addDomListener(window, "resize", function() {
            center = mapDisplayingResults.getCenter();
            google.maps.event.trigger(mapDisplayingResults, "resize");
            mapDisplayingResults.setCenter(center);
        });


        // Creating a Places API request to find the near by Durg stores within 5-10 mile radius.
        var searchDrugStoreRequest = {
            location: latLong,
            radius: 9000,
            types:['pharmacy', 'Drugstore']
        };

        infoWindow = new google.maps.InfoWindow();


        var drugStoreSearchService = new google.maps.places.PlacesService(mapDisplayingResults);
        drugStoreSearchService.nearbySearch(searchDrugStoreRequest, onPharmacySearch);


        // Adding all the result on to the map using Google Maps Marker objects
        function onPharmacySearch(results, status) {
            if(status == google.maps.places.PlacesServiceStatus.OK){
                for (i=0; i< results.length; i++)
                    createMarker(results[i]);
            }
        }

        function createMarker(place) {
            var placeLocation = place.geometry.location;
            var marker = new google.maps.Marker({
                position: placeLocation,
                map: mapDisplayingResults
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent(place.name),
                infoWindow.open(mapDisplayingResults, this);
                infoWindow.setLabel({ color: "black"});
            })
        }

        // subscribe to the channel that is published through PubNub publish()
        pubnub.subscribe({
            channels: ['findPharmacyCvs','findPharmacyRiteAid']
        });

        // Adding Listener to get notification as and when the pharmacy is open and published.
        pubnub.addListener({

            message: function(response){

                // Fetching the pharmacy current location coordinates from the
                // response and adding it over the map so that the user can initiate a discussion with the
                // pharmacist.

                latValue = parseFloat(response.message.latitude);
                longValue = parseFloat(response.message.longitude);

                var latLong = {lat: latValue, lng: longValue};
                var pharmacyAvailableForChatMarker = new google.maps.Marker({
                    position: latLong,
                    map: mapDisplayingResults,
                    icon: imagePath
                });

                google.maps.event.addListener(pharmacyAvailableForChatMarker, 'click', function () {
                    infoWindow.setContent(" Online ");
                    infoWindow.open(mapDisplayingResults, this);
                    infoWindow.setZIndex(3);

                    // Initiating a chat online with the pharmacist
                    $('#largeModal').modal({
                        show: 'true'
                    });
                })
            }
        });

    }

    function noLocation() {
        alert("Could not find location");
    }

}