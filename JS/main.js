var geojson;
var geojson2;
var toggle = "Precinct";
var reset_toggle=""
var map = L.map("map").setView([41.8781, -87.6298], 11.3);
var

 

  Johnson_Total = 0,
  Vallas_Total = 0,
  
  Votes_Total = 0,
  Winner = "Tie";

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

const response3 = fetch("./Outputs/Totals.json")
  .then((response3) => response3.json())
  .then((response3) => {
    calc_total(response3);
  });

const response = fetch("./Outputs/Precincts_Output.geojson")
  .then((response) => response.json())
  .then((response) => {
    geojson = L.geoJson(response, {
      style: style,
      onEachFeature: onEachFeature,
    });

    map.addLayer(geojson);
    reset_toggle= Winner;
    reset();
    
  });

const response2 = fetch("./Outputs/Wards_Output.geojson")
  .then((response2) => response2.json())
  .then((response2) => {
    geojson2 = L.geoJson(response2, {
      style: style,
      onEachFeature: onEachFeature,
    });
  });

function highlightFeature(e) {
  var layer = e.target;
  highlight_reset_row(layer.feature.properties);
  layer.setStyle({
    weight: 2,
    color: "#000000",

    fillOpacity: 0.7,
  });
  info(layer.feature.properties);

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }


  
 
}
function style(feature) {
  return {
    weight: 0.5,
    opacity: 0.7,
    color: getColor(feature.properties.Winner,feature.properties.Margin),
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.Winner,feature.properties.Margin)
  };
}
function resetHighlight(e) {
  
  geojson.resetStyle(e.target);
  highlight_reset_row(e.target.feature.properties.Winner);
  reset();

}

//function zoomToFeature(e) {
//        map.fitBounds(e.target.getBounds());
//}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    //click: zoomToFeature
  });
}

function getColor(d,c) {
  return d == "Johnson"
    ? choropleth(c,'#143935','#215e58','#2e847c','#3caa9f','#55c3b8','#7bd1c8','#a1ded8','#c6ebe7')
    : d == "Vallas"
    ? choropleth(c,'#600624','#900936','#c00c48','#f00f5a','#f33f7b','#f66f9c','#f99fbd','#fccfde')
    : "#ccc9c0";
}

choropleth =function(d,c1,c2,c3,c4,c5,c6,c7,c8){
  return d > 0.5
  ? c1
  : d >0.4
  ? c2
  : d >0.3
  ? c3
  : d > 0.2
  ? c4
  : d > 0.15
  ? c5
  : d > .10
  ? c6
  : d > .05
  ? c7
  : d > 0
  ? c8
  : "#ccc9c0";
};

info = function (props) {
  if (toggle == "Precinct") {
    document.getElementById("Name").innerHTML =
      "W" +
      props.ward_precinct.substring(0, 2) +
      "P" +
      props.ward_precinct.substring(3, 5);
  } else {
    document.getElementById("Name").innerHTML =
      "W" + props.Ward.padStart(2, "0");
  }

  
  document.getElementById("Johnson_votes").innerHTML =
    props.Johnson.toLocaleString("en-US");
  document.getElementById("Johnson_percent").innerHTML = (
    divide(props.Johnson, props.Votes) * 100
  ).toFixed(2);

  document.getElementById("Vallas_votes").innerHTML =
    props.Vallas.toLocaleString("en-US");
  document.getElementById("Vallas_percent").innerHTML = (
    divide(props.Vallas, props.Votes) * 100
  ).toFixed(2);

  if(props.Vallas > props.Johnson){
    var content = document.getElementById('Vallas_row');
    var parent = content.parentNode;
    parent.insertBefore(content, parent.firstChild.nextSibling);
  } else if(props.Johnson > props.Vallas){
    var content = document.getElementById('Johnson_row');
    var parent = content.parentNode;
    parent.insertBefore(content, parent.firstChild.nextSibling);
  }
  
  if(props.Vallas == props.Johnson){
    if(reset_toggle=="Vallas"){
      var content = document.getElementById('Vallas_row');
      var parent = content.parentNode;
      parent.insertBefore(content, parent.firstChild.nextSibling);
    }else{
      var content = document.getElementById('Johnson_row');
      var parent = content.parentNode;
      parent.insertBefore(content, parent.firstChild.nextSibling);
    }
  }
  highlight_row(props.Winner);
  reset_toggle=props.Winner;
};

reset = function () {
 
  
  document.getElementById("Name").innerHTML = "Total";

  document.getElementById("Johnson_votes").innerHTML =
    Johnson_Total.toLocaleString("en-US");
  document.getElementById("Johnson_percent").innerHTML = (
    divide(Johnson_Total, Votes_Total) * 100
  ).toFixed(2);

  document.getElementById("Vallas_votes").innerHTML =
    Vallas_Total.toLocaleString("en-US");
  document.getElementById("Vallas_percent").innerHTML = (
    divide(Vallas_Total, Votes_Total) * 100
  ).toFixed(2);

  highlight_row(Winner);

  if(Vallas_Total > Johnson_Total){
    var content = document.getElementById('Vallas_row');
    var parent = content.parentNode;
    parent.insertBefore(content, parent.firstChild.nextSibling);
  } else if(Johnson_Total > Vallas_Total){
    var content = document.getElementById('Johnson_row');
    var parent = content.parentNode;
    parent.insertBefore(content, parent.firstChild.nextSibling);
  } 
};

ward_click = function () {
  map.removeLayer(geojson);
  map.addLayer(geojson2);
  toggle = "Ward";

  document.getElementById("ward-btn").style.color = "rgba(0,0,0,0.75)";
  document.getElementById("ward-btn").style.backgroundColor = "#ffffff";
  document.getElementById("ward-btn").style.transition = ".5s";

  document.getElementById("precinct-btn").style.color = "#ffffff";
  document.getElementById("precinct-btn").style.backgroundColor =
    "rgba(0,0,0,0.75)";
  document.getElementById("precinct-btn").style.transition = ".5s";
};

precinct_click = function () {
  map.removeLayer(geojson2);
  map.addLayer(geojson);
  toggle = "Precinct";

  document.getElementById("precinct-btn").style.color = "rgba(0,0,0,0.75)";
  document.getElementById("precinct-btn").style.backgroundColor = "#ffffff";
  document.getElementById("precinct-btn").style.transition = ".5s";

  document.getElementById("ward-btn").style.color = "#ffffff";
  document.getElementById("ward-btn").style.backgroundColor =
    "rgba(0,0,0,0.75)";
  document.getElementById("ward-btn").style.transition = ".5s";
};

divide = function (var1, var2) {
  if (var2 == 0) {
    return 0;
  }
  return var1 / var2;
};

calc_total = function (response) {
  Votes_Total = response.Votes;
  
 
  Johnson_Total = response.Johnson;
  Vallas_Total = response.Vallas;
 
  Winner = response.Winner;
};

highlight_row = function (feature) {
  switch (feature) {
    case "Johnson":
      document.getElementById("Johnson_row").style.fontWeight = "bold";
      document.getElementById("Johnson_block").style.backgroundColor =
        "#4dc0b5";
      document.getElementById("Johnson_row").style.color = "#fff";
      break;
    case "Vallas":
      document.getElementById("Vallas_row").style.fontWeight = "bold";
      document.getElementById("Vallas_block").style.backgroundColor = "#f66d9b";
      document.getElementById("Vallas_row").style.color = "#fff";
      break;
  }
};

highlight_reset_row = function (Winner) {

  document.getElementById("Johnson_row").style.fontWeight = "normal";
  document.getElementById("Johnson_block").style.backgroundColor = "#4dc0b599";
  document.getElementById("Johnson_row").style.color = "#ffffff80";

  document.getElementById("Vallas_row").style.fontWeight = "normal";
  document.getElementById("Vallas_block").style.backgroundColor = "#f66d9b99";
  document.getElementById("Vallas_row").style.color = "#ffffff80";
}
