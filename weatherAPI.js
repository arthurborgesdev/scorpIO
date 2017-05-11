var request = require("request");
var HourMs = 3600000;
var timeOfRequest = 1 * HourMs;
var testTime = 10000;

var openWeatherMapKey = "9f40801a18714bf398604207e50a336a";
var ipAPIURL = "http://ip-api.com/json";

var getWeather = function(lat, lon) {
  var targetURL =  "http://api.openweathermap.org/data/2.5/weather?"
                    + "lat="
                    + lat
                    + "&lon="
                    + lon
                    + "&APPID="
                    + openWeatherMapKey;
  request.get(targeURL, function(error, response, body) {
    if (error) throw error;
    console.log(body);
  });
}

var getIP = function(ipAPIURL) {
  request.get(ipAPIURL, function(error, response, body) {
    if (error) throw error;
    var jP = JSON.parse(body);
    var geoCoordinates = { "lat": jP.lat, "lon": jP.lon};
    //return geoCoordinates;
  });
  console.log(geoCoordinates);
}


getIP(ipAPIURL);
  //.pipe(request.put('http://mysite.com/img.png'))

/*

setInterval(function(targetURL) {
  requestTargetURL(targetURL);
}, testTime);



// create callback in getCity to redirect to requestTargetURL when completed
// http://stackoverflow.com/questions/2190850/create-a-custom-callback-in-javascript


var processLocale = function() {
  var apiIP = JSON.parse(this.responseText);
  var city = apiIP.city;
  var lat = apiIP.lat;
  var lon = apiIP.lon;
  document.getElementById("cidade").innerHTML = city;
  getTemperature(lat, lon, city);
}

var getTemperature = function(lat, lon, city) {
      var requestString = "http://api.openweathermap.org/data/2.5/weather?"
                        + "lat="
                        + lat
                        + "&lon="
                        + lon
                        + "&APPID="
                        + openWeatherMapKey;
      console.log(requestString);
      var city = city;
      var request = new XMLHttpRequest();
      request.onload = processResults;
      request.open("get", requestString, true);
      request.send();
}

var processResults = function() {
  var tempJson = JSON.parse(this.responseText);
  var temp = tempJson.main.temp;
  document.getElementById("temperature").innerHTML = temp;
}

var runsOnce = function() {
  runsOnce = function() {};
  getWeather();
}


//window.onload = runsOnce;
*/
