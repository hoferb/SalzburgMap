// Using Leaflet for creating the map and adding controls for interacting with the map

//
//--- Part 1: adding base maps ---
//

//creating the map; defining the location in the center of the map (geographic coords) and the zoom level. These are properties of the leaflet map object
//the map window has been given the id 'map' in the .html file
var map = L.map('map', {
	center: [47.5, 13.05],
	zoom: 9
});

// alternatively the setView method could be used for placing the map in the window
//var map = L.map('map').setView([47.5, 13.05], 8);


//adding two base maps 
/*we use ready-made map tile layers from online providers (idealy free tile layers) as base map.
for further examples have a look at: 
https://leaflet-extras.github.io/leaflet-providers/preview/

You can add a new variable for a base map following the structure of the examples above using the respective link.
*/

var landscape = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
	attribution: 'Tiles from Thunderforest'});

var toner = L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>' });
	toner.addTo(map); 
	
var hillshade = L.tileLayer('http://c.tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png');

// for using the two base maps in the layer control, I defined a baseMaps variable
var baseMaps = {
	"Thunderforest landscape": landscape,
	"Toner": toner
}


//
//---- Part 2: Adding a scale bar
//

L.control.scale({position:'bottomright',imperial:false}).addTo(map);


//
//---- Part 3: Adding symbols ---- 
//

//Marker Version 1
//L.marker([47, 14], {title:'simplemarker', clickable:true}).addTo(map).bindPopup("newpopup");


//Marker Version 2
var mark = L.marker([47, 12], {title:'markerrrrrr', clickable:true}).addTo(map);
mark.bindPopup("this is my popup");

//Marker Version 3	
var myIcon = L.icon({
iconUrl: 'css/images/house.gif',
iconSize: [38, 38]
});

var house = L.marker([48, 13], {icon: myIcon, title:'theHouse'}).addTo(map);


//
//---- Part 4: adding polygon features from the geojson file / the geojson file is referenced in index.html
//

var myFedStyle = {
    "color": "#ff9985",
    "weight": 5,
    "opacity": 0.65
}
//the variable federalstateSBG is created in the Federalstates.js file
var fedstate = L.geoJson(federalstateSBG, 
	{style: myFedStyle, 
	onEachFeature: function(feature, layer){
		layer.bindPopup("<b>" + "Federal state: " + "</b>" + feature.properties.NAME);
	}
});

fedstate.addTo(map);

//
//---- Part 5: adding GeoJSON point features to marker object
//

var summitsJson = {
"type":"FeatureCollection",
"features":[{"type":"Feature","properties":{"NAME":"Kreuzkogel","HEIGHT":2027},"geometry":{"type":"Point","coordinates":[13.153268433907614,47.22421002245328]}},
{"type":"Feature","properties":{"NAME":"Fulseck","HEIGHT":2034},"geometry":{"type":"Point","coordinates":[13.147417093794559,47.23423788545316]}}, 
{"type":"Feature","properties":{"NAME":"Kieserl","HEIGHT":1953},"geometry":{"type":"Point","coordinates":[13.152967420479607,47.24300413792524]}}]};


 var myIconsummit = L.icon({
	iconUrl: 'css/images/Summit.png',
	iconSize: [18, 18]
}); 


var Summits = L.geoJson(summitsJson, {
	pointToLayer: function(feature, latlng) {
		return  L.marker(latlng, {icon:myIconsummit, title: "Summits in Salzburg"});
	},
	onEachFeature: function(feature, marker) {
		marker.bindPopup("Summit: " +feature.properties.NAME +  "<br>" + "with heigth: "  + feature.properties.HEIGHT + "<br>" +
		" at location: " + marker.getLatLng());
	}
});
Summits.addTo(map);



//
//---- Part 6: adding GeoJSON line features 
//

//follow the example of the GeoJSON line features for the mywalk variable

var walk = L.geoJson(mywalk, {style: {color:"#6d32a8", weight: 4, opacity: 0.65}}).addTo(map);


//
//---- Part 7: adding an event to the map
//

//when you click in the map, an alert with the latitude and longitude coordinates of the click location is shown
// e is the event object that is created on mouse click

/*
map.addEventListener('dblclick', function(e) {
    alert(e.latlng);
});
 */


//the same functionality can be realized with reference to the function onClick

/*
//definition of the function onClick
function onClick(evt){
	alert(evt.latlng);
}

//map.addEventListener('click', onClick);



//short version (on is an alias for addEventListener):
map.on('click', onClick);

*/



//
//---- Part 8: Adding GeoJSON features and interactivity
//

//Hovering over an element - the element being the data from the GeoJSON File

var parks;
/*

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

parks = L.geoJson(natparks, {
    style: {
		color: "#D34137",
		weight: 5},
    onEachFeature: function (feature, layer) {
        layer.on('click', zoomToFeature);}
		//you can also write:
		//layer.on({click: zoomToFeature}); }
});


parks.addTo(map); 
*/

//
//---- Part 9: Adding GeoJSON features and several forms of interactivity
//comment out part 8 before testing part 9
 

function highlightFeature(e) {
    var activefeature = e.target;  //access to activefeature that was hovered over through e.target
	
    activefeature.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
	
    if (!L.Browser.ie && !L.Browser.opera) {
        activefeature.bringToFront();
    }
}

//function for resetting the highlight
function resetHighlight(e) {
	parks.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

//to call these methods we need to add listeners to our features

function interactiveFunction(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
   } );
}

var myParkStyle = {
    color: "#D34137",
    weight: 5,
    opacity: 0.65
}

parks = L.geoJson(natparks, {
    style: myParkStyle,
    onEachFeature: interactiveFunction
}).addTo(map); 
 




//
//---- Part 10: Adding a layer control for base maps and feature layers
//

//the variable features lists layers that I want to control with the layer control
var features = {
	"Marker 2": mark,
	"My house": house,
	"City walk": walk,
	"National parks": parks,
	"Salzburg": fedstate
	
}

//the legend uses the layer control with entries for the base maps and two of the layers we added
//in case either base maps or features are not used in the layer control, the respective element in the properties is null

L.control.layers(baseMaps, features, {position:'topleft'}).addTo(map);






