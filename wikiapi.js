//This function is called from wikitest.html with <button onclick="fn1()" ...
//When html button is clicked, this function will take the values of the input box
//and display all the information below

// boolean flag to track if the lists is already populated
var flag = false;

function toggleFlag() {
  flag = !flag;
}

function fn1() {
  console.log("fn1 called with flag value: " + flag);
  //This is for DOM manipulation checking if its ready, probably wont need this in swift
  $(document).ready(function () {
    // empty lists if already populated
    if (flag) {
      $("#dynamic-list").empty();
      $("#lat-list").empty();
      $("#lon-list").empty();
      $("#dist-list").empty();
      $("#pageid-list").empty();
    } else {
      toggleFlag();
    }

    var xtexInputValue = $("#xinput").val(); //create and set lat value from html
    var ytexInputValue = $("#yinput").val(); //create and set lon value from html

    //these next two lines are not needed, but I kept them because it shows you how
    //to display basic information in html
    //This method will not work for displaying iterating through arrays in a JSON object
    $("#xcoordback p span").html(xtexInputValue);
    $("#ycoordback p span").html(ytexInputValue);

    //This variable dynamically builds the URL to be sent to the MediaWiki API
    var wikiUrl =
      "https://en.wikipedia.org/w/api.php?" + //All MediaWiki API URLS start with this
      "action=query&list=geosearch&gscoord=" + //the paramaters of our search start with query, list, geosearch
      encodeURI(xtexInputValue) + //encodeURI needed to use number as string
      "|" + //Wikimedia seperates its lat and lon coordinates with a "|" symbool
      encodeURI(ytexInputValue) +
      "&gsradius=10000&gslimit=10&format=json&callback=?"; //set radius of search, limit of results, format to json,
    //callback is needed to fix "cross-origin-access" error

    //$ means I am using JQuery, which is an extension of javascript
    //I use JQuery because way javascript requires a php script to fetch api data, JQuery does not
    $.getJSON(wikiUrl, function (data) {
      for (i = 0; i < data["query"]["geosearch"].length; i++) {
        //for loop for the amount of results returned by the geosearch
        var specnode = document.createElement("li"); //creates a new list element in HTML

        var titletextnode = document.createTextNode(
          data["query"]["geosearch"][i]["title"] //creates a text node with data returned for "title" parameter
        );

        specnode.appendChild(titletextnode); //takes the HTML element created (specnode), and adds the text node to the created list element

        document.getElementById("dynamic-list").appendChild(specnode); //Finds the HTML element "dynamic-list" in document and adds it to the page

        var a = document.createElement("a");
        var link =
          "https://en.wikipedia.org/?curid=" +
          encodeURI(data["query"]["geosearch"][i]["pageid"]);
        a.setAttribute("href", link);
        a.innerHTML = "Wiki Link";
        specnode.appendChild(a);

        var a2 = document.createElement("a");
        var link = "./summary.html";
        a2.setAttribute("href", link);
        a2.setAttribute("id", "link");
        a2.innerHTML = "View summary";
        specnode.appendChild(a2);
      }
    });
  });
}

$("a").on("click", "#link", function (e) {
  currentTitle = e["currentTarget"]["parentElement"].childNodes[0].textContent;
  return false;
});

var currentTitle = "First Congregational Church of Albany";

function getSummary() {
  $(document).ready(function () {
    var wikiUrl =
      "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=" + //All MediaWiki API URLS start with this
      encodeURI(currentTitle) +
      "&callback=?";

    $.getJSON(wikiUrl, function (data) {
      var pageInfo = Object.values(data["query"]["pages"]);
      var pgID = pageInfo[0]["pageid"];
      var pageDesc = data["query"]["pages"][encodeURI(pgID)]["extract"];

      console.log(pageDesc);
      console.log(pgID);
      console.log(pageInfo);

      var summarynode = document.createElement("span");
      var summarytextnode = document.createTextNode(pageDesc);
      summarynode.appendChild(summarytextnode);
      document.getElementById("summaryspan").appendChild(summarynode);
    });
  });
}
