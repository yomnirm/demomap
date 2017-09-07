//Data
var cities = [
              
              {
                  city : 'Oslo',
                  desc : 'Capital City',
                  latitude : 59.911491,
                  longitude : 10.757933
              },
              {
                  city : 'Trondheim',
                  desc : '',
                  latitude : 63.446827,
                  longitude : 10.421906
              },
              {
                  city : 'Bergen',
                  desc : '',
                  latitude : 60.397076,
                  longitude : 5.324383
              },
              {
                  city : 'Stavanger',
                  desc : '',
                  latitude : 58.969975,
                  longitude : 5.733107
              }
          ];

var branches = {
      "Bergen" : [
            {"branchID":"NOR11101", "branchName":"DNB Åsane Branch", "branchAddress":"Åsane senter", "zipCode":"5116", "city":"Bergen", "country":"Norway", "latitude":"60.465978", "longitude":"5.322385"},
          
            {"branchID":"NOR11105", "branchName":"DNB Bergen Branch", "branchAddress":"Torgalmenningen 2", "zipCode":"5020", "city":"Bergen", "country":"Norway", "latitude":"60.393700", "longitude":"5.325543"}
        ],
      
      "Oslo" : [
            {"branchID":"NOR11111", "branchName":"DNB Fornebu Branch", "branchAddress":"Forneburingen 209", "zipCode":"1364", "city":"Oslo", "country":"Norway", "latitude":"59.893639", "longitude":"10.619933"},
		  
		    {"branchID":"NOR11121", "branchName":"DNB Karl Johan Branch", "branchAddress":"Karl Johans gate 27", "zipCode":"0159", "city":"Oslo", "country":"Norway", "latitude":"59.913649", "longitude":"10.740151"},
		    
		  {"branchID":"NOR11131", "branchName":"DNB Nordstrand Branch", "branchAddress":"Ekebergveien 228A", "zipCode":"1162", "city":"Oslo", "country":"Norway", "latitude":"59.861647", "longitude":"10.800451"}
        ],
	
	   "Stavanger" : [
            {"branchID":"NOR11142", "branchName":"DNB Stavanger Branch", "branchAddress":"Haakon VIIs gt 9", "zipCode":"4005", "city":"Stavanger", "country":"Norway", "latitude":"58.969253", "longitude":"5.730015"},
          
        ],
	   
	   "Trondheim" : [
            {"branchID":"NOR11151", "branchName":"DNB Trondheim, Torvet Branch", "branchAddress":"Munkegt. 22", "zipCode":"7013", "city":"Trondheim", "country":"Norway", "latitude":"63.429935", "longitude":"10.394514"},
          
        ]
  };

    //Angular App Module and Controller
          var sampleApp = angular.module('mapsApp', []);
          sampleApp.controller('MapCtrl', function ($scope) {

              var mapOptions = {
                  center: new google.maps.LatLng(60.472024,8.468946),
                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                  
                  control: {},
                  
                  zoom: 5
              }

              $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
              
              var theMap = $scope.map;
              
              var selectedCity;

              $scope.markers = [];
			  
			  var markers = $scope.markers;
			  
			  $scope.branches = [];
              
              var infoWindow = new google.maps.InfoWindow();
			  
			  var currentLocationLat;
			  var currentLocationLong;
			  var getCurrentLocation = function(theMap, infoWindow){
				  
				  // Try HTML5 geolocation.
				  if (navigator.geolocation) {
					  navigator.geolocation.getCurrentPosition(function(position) {
						  var pos = {
              				lat: position.coords.latitude,
              				lng: position.coords.longitude
						  };

            		infoWindow.setPosition(pos);
            		infoWindow.setContent('You are here :)');
            		infoWindow.open(theMap);
            		theMap.setCenter(pos);
				    currentLocationLat = pos.lat;
					currentLocationLong = pos.lng;
					console.log("Current Location : " + currentLocationLat + " " + currentLocationLong);
						  currentLocationLat
          		}, function() {
            		handleLocationError(true, infoWindow, theMap.getCenter());
          		});
        	} else {
          		// Browser doesn't support Geolocation
				handleLocationError(false, infoWindow, theMap.getCenter());
        	}
			  
     		function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        		infoWindow.setPosition(pos);
        		infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        		infoWindow.open(theMap);
      		}
				  
			  }
			 
			   //
			  getCurrentLocation(theMap, infoWindow);
			 
              var cityMarkers = [];
              var createMarker = function (info){
                  
				  var anyObject;
                  var marker = new google.maps.Marker({
                      map: theMap,
                      position: new google.maps.LatLng(info.latitude, info.longitude),
		      animation: google.maps.Animation.DROP,	  
                      title: info.city
                  });
                  marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
                  
                  //console.log("createMarker called.. : " );
                  
                  google.maps.event.addListener(marker, 'click', function(){
                      infoWindow.setContent('<h5>' + marker.title + '</h5>' + marker.content);
                      infoWindow.open(theMap, marker);
                      theMap.panTo(marker.getPosition());
                      theMap.setZoom(12);
                      
                  });
                  
                  $scope.markers.push(marker);
				  cityMarkers.push(marker);
                  
              }  
              
              for (i = 0; i < cities.length; i++){
                  createMarker(cities[i]);
              }

              $scope.openInfoWindow = function(e, selectedMarker){
                  //e.preventDefault();
                  google.maps.event.trigger(selectedMarker, 'click');
                  selectedCity = selectedMarker.title;
				  $scope.branches.length = 0;
				  $scope.selectedBranch = null;
				  // clear existing city markers
				  clearCityMarkers();
				  var branchObj;
                 
                 if(selectedCity === "Bergen"){
                     
                     branchObj = branches.Bergen;
                     createBranches(branchObj);
                 }
                  else if(selectedCity === "Oslo"){
                          
                     branchObj = branches.Oslo;  
                     createBranches(branchObj);   
                 }
				 
				 else if(selectedCity === "Stavanger"){
                          
                     branchObj = branches.Stavanger;  
                     createBranches(branchObj);   
                 }
				 
				 else if(selectedCity === "Trondheim"){
                          
                     branchObj = branches.Trondheim;  
                     createBranches(branchObj);   
                 }
				 
				// console.log("befor : " + directionsDisplay.getMap; 
				 //directionsDisplay.setDirections(null); 
				 directionsDisplay.setMap(null); 
				 directionsDisplay.setPanel(null); 
				 document.getElementById('directionsList').style.display = "none"; 
				  
			  }
			  
              // Custom Functions
			  
			  function clearCityMarkers(){
                  for(i=0; i<cityMarkers.length; i++){
        		  cityMarkers[i].setMap(null);
			  }
            }
              
              var createBranches = function(branchObj){
				  
                  var branchId;
                  for (i = 0; i < branchObj.length; i++){
                    
					 branchId = branchObj[i].branchID;
					 var branchInfoWindow = new google.maps.InfoWindow(); 
                     var markers = new google.maps.Marker({
                     position: new google.maps.LatLng(branchObj[i].latitude, branchObj[i].longitude),
                     map: theMap,
                     animation: google.maps.Animation.DROP,		 
                     title: branchObj[i].branchName
                     
                         
                 });  
					  
					  /*markers.addListener('click', function(branchId) {
          			  alert('Lets get to the branch');
					  $scope.selectedBranch = branchId;
					  $scope.getDirections();	  
						  
				  });*/
                      
					  $scope.branches.push({"id" : branchObj[i].branchID , "address" : branchObj[i].branchName });
					  var content = '<div class="infoWindowContent">' + branchObj[i].branchAddress + '<br>' + branchObj[i].city + '&nbsp' + branchObj[i].zipCode + '<br>' + "Branch Id: " + branchObj[i].branchID + '</div>';
                     
                     
                      google.maps.event.addListener(markers, 'click', (function(markers, content, branchInfoWindow){
                      branchInfoWindow.setContent('<h6>' + branchObj[i].branchName + '</h6>' + content);
                      branchInfoWindow.open(theMap, markers);
                      //theMap.panTo(markers.getPosition());
                      theMap.setZoom(12);
					  mapIdtoLatLang(branchObj[i].branchID, branchObj[i].latitude, branchObj[i].longitude);	 
					  
                      
                  })(markers, content, branchInfoWindow));
                 }
				  
              }
			  
			  $scope.myBranchIdInfos = []; 
			  var mapIdtoLatLang = function(id, lat, lang){
				  
				  $scope.myBranchIdInfos.push({"id" : id , "lat" : lat, "lang" : lang });
			  }
              
              $scope.getBranches = function(){
                 
                 //var infowindow = new google.maps.InfoWindow();  
                 var branchObj;
                 
                 if(selectedCity === "Bergen"){
                     
                     branchObj = branches.Bergen;
                      
                     createBranches(branchObj);
                }
                  else if(selectedCity === "Oslo"){
                          
                     branchObj = branches.Oslo;
                      
                     createBranches(branchObj);   
                 }
                  
                  
            } 

   var destinationLat;			  
   var destinationLong;				  
			  
   var onBranchChange = function(selectedBranchId){
	 
	 var branchInfos = $scope.myBranchIdInfos;
	 
	 for (i = 0; i < branchInfos.length; i++){
		 
		 if(selectedBranchId === branchInfos[i].id){
			 
			  destinationLat = branchInfos[i].lat;
			  destinationLong = branchInfos[i].lang;
			  
		}
		 
	 }
	 
 };	
			  
 var modeofTravel = 'DRIVING';
			  
 $scope.onTravleModeChange = function(){
	 modeofTravel = $scope.travelMode;
	 $scope.getDirections();
 };				  
			  
              
  // instantiate google map objects for directions
		  
  var directionsDisplay = new google.maps.DirectionsRenderer({
          draggable: true
        });
  var directionsService = new google.maps.DirectionsService();
  var geocoder = new google.maps.Geocoder();
  
  // directions object -- with defaults
  $scope.directions = {
    origin: "My Location",
    destination: "",
    //showList: false
  }
  
  $scope.travelModes = [
	{mode : "DRIVING"}, 
	{mode : "WALKING"},
	{mode : "BICYCLING"},
	{mode : "TRANSIT"}
  ]
  // get directions using google maps api
    
    //var start = new google.maps.LatLng('60.465978', '5.322385');
  		  
    //var end = new google.maps.LatLng(destinationLat, destinationLong);		  
    
  $scope.getDirections = function () {
	  
	  var selectedBranchId = $scope.selectedBranch;
	 if(selectedBranchId === null || selectedBranchId === "null" || selectedBranchId === undefined){
		 
		alert('Select Destination Branch');
		return; 
	 } 
	
	onBranchChange(selectedBranchId);  
    var request = {
      //origin: $scope.directions.origin,
      //destination: $scope.directions.destination,
      //origin: start,
	  origin: new google.maps.LatLng(currentLocationLat, currentLocationLong),
      destination: new google.maps.LatLng(destinationLat, destinationLong),
      travelMode: modeofTravel,
      optimizeWaypoints: true		
    };
     
	 
    //marker.setMap(null);
    directionsService.route(request, function (response, status) {
	  	
      if (status === google.maps.DirectionsStatus.OK) {
		//directionsDisplay.setMap(null);   
        directionsDisplay.setDirections(response);  
        directionsDisplay.setMap(theMap); 
        directionsDisplay.setPanel(document.getElementById('directionsList'));
        document.getElementById('directionsList').style.display = ""; 
        
      } else {
		 
        alert('Something went wrong. Google route was unsuccesfull!');
      }
    });
	 
  }
              
              
              
});
