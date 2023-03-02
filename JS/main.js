var geojson;
var geojson2;
var toggle = "Precinct";
var map = L.map("map").setView([41.8781, -87.6298], 11.3);
var Green_Total = 0,
  King_Total = 0,
  Buckner_Total = 0,
  Wilson_Total = 0,
  Johnson_Total = 0,
  Vallas_Total = 0,
  Lightfoot_Total = 0,
  Sawyer_Total = 0,
  Garcia_Total = 0,
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
  return d == "Green"
    ? choropleth(c,'#e3342f','#871612','#b41e18','#e0251f','#e7514b','#ed7c78,','#f3a8a5','#f9d3d2')
    : d == "King"
    ? choropleth(c,'#613305','#914d08','#c2660a','#f2800d','#f5993d','#f7b36e','#facc9e','#fce6cf')
    : d == "Buckner"
    ? choropleth(c,'#665c00','#998a00','#ccb800','#ffe600','#ffeb33','#fff066','#fff599','#fffacc')
    : d == "Wilson"
    ? choropleth(c,'#174f2e','#227745','#2d9f5c','#38c774','#60d28f','#88ddab','#afe9c7','#d7f4e3')
    : d == "Johnson"
    ? choropleth(c,'#4dc0b5','#277269','#34988c','#41beaf','#67cbbf','#8dd8cf','#b3e5df','#d9f2ef')
    : d == "Vallas"
    ? choropleth(c,'#0c365a','#125087','#186bb4','#1f86e0','#4b9ee7','#78b6ed','#a5cff3','#d2e7f9')
    : d == "Lightfoot"
    ? choropleth(c,'#19214d','#253174','#31419b','#3d51c2','#6474ce','#8b97da','#b1b9e7','#d8dcf3')
    : d == "Sawyer"
    ? choropleth(c,'#2c1056','#421881','#5820ac','#6e28d7','#8b53df','#a87ee7','#c5a9ef','#e2d4f7')
    : d == "Garcia"
    ? choropleth(c,'#600624','#900936','#c00c48','#f00f5a','#f33f7b','#f66f9c','#f99fbd','#fccfde')
    : "#ccc9c0";
}

/* old colors
 return d == "Green"
    ? "#e3342f"
    : d == "King"
    ? "#f6993f"
    : d == "Buckner"
    ? "#ffed4a"
    : d == "Wilson"
    ? "#38c172"
    : d == "Johnson"
    ? "#4dc0b5"
    : d == "Vallas"
    ? "#3490dc"
    : d == "Lightfoot"
    ? "#6574cd"
    : d == "Sawyer"
    ? "#9561e2"
    : d == "Garcia"
    ? "#f66d9b"
    : "#ccc9c0";
*/

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

  document.getElementById("Green_votes").innerHTML =
    props.Green.toLocaleString("en-US");
  document.getElementById("Green_percent").innerHTML = (
    divide(props.Green, props.Votes) * 100
  ).toFixed(2);

  document.getElementById("King_votes").innerHTML =
    props.King.toLocaleString("en-US");
  document.getElementById("King_percent").innerHTML = (
    divide(props.King, props.Votes) * 100
  ).toFixed(2);

  document.getElementById("Buckner_votes").innerHTML =
    props.Buckner.toLocaleString("en-US");
  document.getElementById("Buckner_percent").innerHTML = (
    divide(props.Buckner, props.Votes) * 100
  ).toFixed(2);

  document.getElementById("Wilson_votes").innerHTML =
    props.Wilson.toLocaleString("en-US");
  document.getElementById("Wilson_percent").innerHTML = (
    divide(props.Wilson, props.Votes) * 100
  ).toFixed(2);

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

  document.getElementById("Lightfoot_votes").innerHTML =
    props.Lightfoot.toLocaleString("en-US");
  document.getElementById("Lightfoot_percent").innerHTML = (
    divide(props.Lightfoot, props.Votes) * 100
  ).toFixed(2);

  document.getElementById("Sawyer_votes").innerHTML =
    props.Sawyer.toLocaleString("en-US");
  document.getElementById("Sawyer_percent").innerHTML = (
    divide(props.Sawyer, props.Votes) * 100
  ).toFixed(2);

  document.getElementById("Garcia_votes").innerHTML =
    props.Garcia.toLocaleString("en-US");
  document.getElementById("Garcia_percent").innerHTML = (
    divide(props.Garcia, props.Votes) * 100
  ).toFixed(2);

  highlight_row(props.Winner);
};

reset = function () {
  document.getElementById("Name").innerHTML = "Total";

  document.getElementById("Green_votes").innerHTML =
    Green_Total.toLocaleString("en-US");
  document.getElementById("Green_percent").innerHTML = (
    divide(Green_Total, Votes_Total) * 100
  ).toFixed(2);

  document.getElementById("King_votes").innerHTML =
    King_Total.toLocaleString("en-US");
  document.getElementById("King_percent").innerHTML = (
    divide(King_Total, Votes_Total) * 100
  ).toFixed(2);

  document.getElementById("Buckner_votes").innerHTML =
    Buckner_Total.toLocaleString("en-US");
  document.getElementById("Buckner_percent").innerHTML = (
    divide(Buckner_Total, Votes_Total) * 100
  ).toFixed(2);

  document.getElementById("Wilson_votes").innerHTML =
    Wilson_Total.toLocaleString("en-US");
  document.getElementById("Wilson_percent").innerHTML = (
    divide(Wilson_Total, Votes_Total) * 100
  ).toFixed(2);

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

  document.getElementById("Lightfoot_votes").innerHTML =
    Lightfoot_Total.toLocaleString("en-US");
  document.getElementById("Lightfoot_percent").innerHTML = (
    divide(Lightfoot_Total, Votes_Total) * 100
  ).toFixed(2);

  document.getElementById("Sawyer_votes").innerHTML =
    Sawyer_Total.toLocaleString("en-US");
  document.getElementById("Sawyer_percent").innerHTML = (
    divide(Sawyer_Total, Votes_Total) * 100
  ).toFixed(2);

  document.getElementById("Garcia_votes").innerHTML =
    Garcia_Total.toLocaleString("en-US");
  document.getElementById("Garcia_percent").innerHTML = (
    divide(Garcia_Total, Votes_Total) * 100
  ).toFixed(2);
  highlight_row(Winner);
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
  Green_Total = response.Green;
  King_Total = response.King;
  Buckner_Total = response.Buckner;
  Wilson_Total = response.Wilson;
  Johnson_Total = response.Johnson;
  Vallas_Total = response.Vallas;
  Lightfoot_Total = response.Lightfoot;
  Sawyer_Total = response.Sawyer;
  Garcia_Total = response.Garcia;
  Winner = response.Winner;
};

highlight_row = function (feature) {
  switch (feature) {
    case "Green":
      document.getElementById("Green_row").style.fontWeight = "bold";
      document.getElementById("Green_block").style.backgroundColor = "#e3342f";
      document.getElementById("Green_row").style.color = "#fff";
      break;
    case "King":
      document.getElementById("King_row").style.fontWeight = "bold";
      document.getElementById("King_block").style.backgroundColor = "#f6993f";
      document.getElementById("King_row").style.color = "#fff";
      break;
    case "Buckner":
      document.getElementById("Buckner_row").style.fontWeight = "bold";
      document.getElementById("Buckner_block").style.backgroundColor =
        "#ffed4a";
      document.getElementById("Buckner_row").style.color = "#fff";
      break;
    case "Wilson":
      document.getElementById("Wilson_row").style.fontWeight = "bold";
      document.getElementById("Wilson_block").style.backgroundColor = "#38c172";
      document.getElementById("Wilson_row").style.color = "#fff";
      break;
    case "Johnson":
      document.getElementById("Johnson_row").style.fontWeight = "bold";
      document.getElementById("Johnson_block").style.backgroundColor =
        "#4dc0b5";
      document.getElementById("Johnson_row").style.color = "#fff";
      break;
    case "Vallas":
      document.getElementById("Vallas_row").style.fontWeight = "bold";
      document.getElementById("Vallas_block").style.backgroundColor = "#3490dc";
      document.getElementById("Vallas_row").style.color = "#fff";
      break;
    case "Lightfoot":
      document.getElementById("Lightfoot_row").style.fontWeight = "bold";
      document.getElementById("Lightfoot_block").style.backgroundColor =
        "#6574cd";
      document.getElementById("Lightfoot_row").style.color = "#fff";
      
      break;
    case "Sawyer":
      document.getElementById("Sawyer_row").style.fontWeight = "bold";
      document.getElementById("Sawyer_block").style.backgroundColor = "#9561e2";
      document.getElementById("Sawyer_row").style.color = "#fff";
      break;
    case "Garcia":
      document.getElementById("Garcia_row").style.fontWeight = "bold";
      document.getElementById("Garcia_block").style.backgroundColor = "#f66d9b";
      document.getElementById("Garcia_row").style.color = "#fff";
      break;
  }
};

highlight_reset_row = function (Winner) {
  document.getElementById("Green_row").style.fontWeight = "normal";
  document.getElementById("Green_block").style.backgroundColor = "#e3342f99";
  document.getElementById("Green_row").style.color = "#ffffff80";

  document.getElementById("King_row").style.fontWeight = "normal";
  document.getElementById("King_block").style.backgroundColor = "#f6993f99";
  document.getElementById("King_row").style.color = "#ffffff80";

  document.getElementById("Buckner_row").style.fontWeight = "normal";
  document.getElementById("Buckner_block").style.backgroundColor = "#ffed4a99";
  document.getElementById("Buckner_row").style.color = "#ffffff80";

  document.getElementById("Wilson_row").style.fontWeight = "normal";
  document.getElementById("Wilson_block").style.backgroundColor = "#38c17299";
  document.getElementById("Wilson_row").style.color = "#ffffff80";

  document.getElementById("Johnson_row").style.fontWeight = "normal";
  document.getElementById("Johnson_block").style.backgroundColor = "#4dc0b599";
  document.getElementById("Johnson_row").style.color = "#ffffff80";

  document.getElementById("Vallas_row").style.fontWeight = "normal";
  document.getElementById("Vallas_block").style.backgroundColor = "#3490dc99";
  document.getElementById("Vallas_row").style.color = "#ffffff80";

  document.getElementById("Lightfoot_row").style.fontWeight = "normal";
  document.getElementById("Lightfoot_block").style.backgroundColor =
    "#6574cd99";
  document.getElementById("Lightfoot_row").style.color = "#ffffff80";

  document.getElementById("Sawyer_row").style.fontWeight = "normal";
  document.getElementById("Sawyer_block").style.backgroundColor = "#9561e299";
  document.getElementById("Sawyer_row").style.color = "#ffffff80";

  document.getElementById("Garcia_row").style.fontWeight = "normal";
  document.getElementById("Garcia_block").style.backgroundColor = "#f66d9b99";
  document.getElementById("Garcia_row").style.color = "#ffffff80";
};
