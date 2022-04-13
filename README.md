# Wiki Geolocator WebPage
Webpage that searches for Wikipedia pages near the given coordinates. Made with HTML/CSS and JavaScript.  
View WebPage : https://nickblaauboer.com/geolocator/  

## How it works
The HTML page has two user input boxes for latitude and longitude. When the user hits "Click for GeoSearch"
the wikiapi.js script will use these values to fetch nearby landmarks and update the "dynamic-list" in the HTML file.  
After the results are displayed, the user can go to one of the wikipedia pages listed or click "View summary" to be
redirected to a different HTML document that will only display its summary.

### Building the MediaWiki GeoSearch URL
```javascript
    //This variable dynamically builds the URL to be sent to the MediaWiki API
    var wikiUrl =
      "https://en.wikipedia.org/w/api.php?" + //All MediaWiki API URLS start with this
      "action=query&list=geosearch&gscoord=" + //the paramaters of our search start with query, list, geosearch
      encodeURI(xtexInputValue) + //encodeURI needed to use number as string
      "|" + //Wikimedia seperates its lat and lon coordinates with a "|" symbool
      encodeURI(ytexInputValue) +
      "&gsradius=10000&gslimit=10&format=json&callback=?"; //set radius of search, limit of results, format to json,
```

### Appending GeoSearch results to HTML
```javascript
  var specnode = document.createElement("li"); //creates a new list element in HTML

  var titletextnode = document.createTextNode(
    data["query"]["geosearch"][i]["title"] //creates a text node with data returned for "title" parameter
  );

  specnode.appendChild(titletextnode); //takes the HTML element created (specnode), and adds the text node to the created list element

  document.getElementById("dynamic-list").appendChild(specnode); //Finds the HTML element "dynamic-list" in document and adds it to the page
```

### Building the MediaWiki Summary-by-Title URL
```javascript
  var wikiUrl =
      "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=" + //All MediaWiki API URLS start with this
      encodeURI(currentTitle) +
      "&callback=?";
```
