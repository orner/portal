/* portal.js */

/*
 * Lance Orner, December 22, 2014
 * April 6, 2015: Header is now fixed height, and doesn't change with
 * callbacks
 */

window.onload = init;

// Use when debugging to prevent lots of hits to server
var use_local = false;

function init() {
	getSparksWeather();
  getStirlingWeather();
  getStock();
}

/*
 * Link functions
 */


/*
 * Weather functions
 */

function getSparksWeather() {
  var url = "http://api.wunderground.com/api/b37c48462659c2fe/geolookup/conditions/forecast/q/39.64018250,-119.72023010.json";
  if (use_local) {
    url = "http://localhost/~lance/portal/weather.json";
  }
  var request = new XMLHttpRequest();
  request.open("GET", url);
	request.onload = function() {
		if (request.status == 200) {
			updateWeather(request.responseText, "sparksWeather");
		}
	};
	request.send(null);
}

function getStirlingWeather() {
  var url = "http://api.wunderground.com/api/b37c48462659c2fe/geolookup/conditions/forecast/q/39.90683934719737,-121.52741432189941.json";
  if (use_local) {
    url = "http://localhost/~lance/portal/weather.json";
  }
  var request = new XMLHttpRequest();
  request.open("GET", url);
	request.onload = function() {
		if (request.status == 200) {
			updateWeather(request.responseText, "stirlingWeather");
		}
	};
	request.send(null);

}

function updateWeather(responseText, weatherId) {
  var weatherDiv = document.getElementById(weatherId);
  var weather = JSON.parse(responseText);

  var location = weather['location']['city'];
  var temp_f = weather['current_observation']['temp_f'];
  var temp = weather['current_observation']['temperature_string'];
  var observation = weather['current_observation']['weather'];

  var div = document.createElement("div");
  div.setAttribute("class", "tempurature");
  div.innerHTML = observation + " and " + temp;
  weatherDiv.innerHTML += div.innerHTML;
  //weatherDiv.appendChild(div);
}


function getStock() {
  var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("IGT","GOOG","MSFT","JCP","TSLA")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
  var request = new XMLHttpRequest();
  request.open("GET", url);
	request.onload = function() {
		if (request.status == 200) {
			updateStock(request.responseText);
		}
	};
	request.send(null);
}

function updateStock(responseText) {
  var stockDiv = document.getElementById("stock");
  var stock = JSON.parse(responseText);

  var quotes = stock.query.results.quote;
  var quoteline = "";
  for (var i = 0; i < quotes.length; ++i)
  {
    var quote = quotes[i];
    var name = quote.Symbol;
    var price = quote.LastTradePriceOnly;
    var change = quote.Change;
    var changePercent = quote.ChangeinPercent;
    var quoteSpan = document.createElement("span");
    quoteSpan.setAttribute("class", "quote");
    quoteSpan.innerText = name + ": " + price;

    var changeSpan = document.createElement("span");
    changeSpan.setAttribute("class", "quotechange");
    if (change>0) {
      changeSpan.setAttribute("delta", "positive");
    } else if (change < 0) {
      changeSpan.setAttribute("delta", "negative");
    }
    changeSpan.innerText = "("+changePercent + ")";

    quoteSpan.appendChild(changeSpan);
    quoteSpan.innerHTML += "  ";

    stockDiv.innerHTML += quoteSpan.innerHTML;
  }

}
