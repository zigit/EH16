var appId = 'AIzaSyC5OBoKIt75SzmcU8PBRJ96o5aYMsI3_vg';

var homePoint = { lat: 57.653284, lng: 11.896307 };

var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: homePoint
});

var labelA = 'H';
var labelB = 'V';

var homeMarker= new google.maps.Marker({
label:labelA[0],
  position: homePoint,
  map: map
});
var vehicleMarker= new google.maps.Marker({
   label:labelB[0],
  map: map
 
});

var callback = function(args){
    if (args[0] && args[0].positioning_system && args[0].positioning_system.location) {
        var lat = parseFloat(args[0].positioning_system.location.lat);
        var lng = parseFloat(args[0].positioning_system.location.lng);
        var newPoint = new google.maps.LatLng(lat, lng);
        vehicleMarker.setPosition(newPoint);
        map.panTo(newPoint);
    }
};

var connection = new autobahn.Connection({
   url: 'wss://api.interchange.ericsson.net/v1',
   realm: 'interchange',
   authmethods: ['wampcra'],
   authid: '754bc222-96f5-46fd-a22f-d638b59caa47', // APP-ID: The public ID of the app
   onchallenge: function(session,method,extra) {
      // SECRET: The secret for the app, found at the developer page
       return autobahn.auth_cra.sign('4CCj7V3H6Hh59BycJ5ApAIfyq0kYgEPiepWWK1nzmBL', extra.challenge);
   }
});
connection.onclose = function(reason, details) {
    console.warn('Disconnected:', details.reason ? details.reason : reason);
};
connection.onopen = function(session, details) {
    console.log('Connected, yay!');
    var uri = 'interchange.vehicle.'+ appId +'.stream';
    session.subscribe(uri, callback).then(null, function(err) { console.error(err); });
};
connection.open();
