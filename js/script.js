// Initialize the map on the "map" div with a given center and zoom
var map = L.map("map", {
  center: [-1.3007, 36.7884],
  zoom: 13,
});

// Adding OSM layer
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);




//#####################################################3
var otherLayers = {};

function addLinesToMap(lines, layerName, color) {
  var lineLayer = L.geoJSON(lines, {
    style: function (feature) {
      return {
        color: color,
        weight: 2,
      };
    },
  });
  lineLayer.addTo(map);

  // add the line layer to the thematic layers object
  otherLayers[layerName] = lineLayer;
}

// define an array of line data with layer names and colors
var lines = [  
  {    file: "data/boundary/kibra_division_boundary.geojson",    name: "Kibra Division",    color: "red",  },
  {    file: "data/boundary/kibra_location_boundary.geojson",    name: "Kibra Location",    color: "blue",  },
  {    file: "data/boundary/kibra_subcounty_boundary.geojson",    name: "Kibra Subcounty",    color: "green",  },
  {    file: "data/boundary/kibra_sublocation_boundary.geojson",    name: "Kibra Sublocation",    color: "orange",  },
  {    file: "data/boundary/kibra_village_boundary.geojson",    name: "Kibra Village",    color: "purple",  },
  {    file: "data/boundary/mugumoini_location_boundary.geojson",    name: "mugumoini Location",    color: "black",  },
  {    file: "data/boundary/mugumoini_sublocation_boundary.geojson",    name: "mugumoini Sublocation",    color: "gray",  },
  {    file: "data/boundary/mugumoini_village_boundary.geojson",    name: "mugumoini Village",    color: "brown",  },
];

// loop through the lines array and add each line to the map and layer switcher
lines.forEach(function (line) {
  $.getJSON(line.file, function (data) {
    addLinesToMap(data, line.name, line.color);
    createLayerSwitcher(null, otherLayers);
  });
});
//#############################################################


//######################################################
function addDataToMap(data, map) {
  var dataLayer = L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return new L.CircleMarker(latlng, {
        radius: 7,
        fillColor: "#f1a721",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
      });
    },
    onEachFeature: function (feature, layer) {
      var popupText =
        "Toilet Name: " + feature.properties.ToiletName +
        "<br>Area: " + feature.properties.Area +
        "<br>Region: " + feature.properties.Region;
      layer.bindPopup(popupText);
    },

  });

  

  // add all layers to the map
  dataLayer.addTo(map);
  
  
  // call createLayerSwitcher function and pass basemaps and thematic layers as arguments
  createLayerSwitcher(dataLayer, otherLayers);
}
$.getJSON("data/data.geojson", function (data) {
  addDataToMap(data, map);
});
//######################################################

console.log("otherLayers",otherLayers)
// function to create a layer switcher control
function createLayerSwitcher(dataLayer, otherLayers) {
  // define basemap layers
  var basemaps = {
    "OpenStreetMap": L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }),
  };

  // define thematic layers
  var thematicLayers = {
    "Fresh Life Toilets": dataLayer,
  };

  for (var key in otherLayers) {
    thematicLayers[key] = otherLayers[key];
  }

  // add layer switcher control to the map
  L.control.layers(basemaps, thematicLayers).addTo(map);
}
