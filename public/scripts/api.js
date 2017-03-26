var jsonContainer = document.getElementById("json-data");
var btn = document.getElementById("btn");

btn.addEventListener("click", function() {
  var ourRequest = new XMLHttpRequest();
  sernum = document.getElementById("sernum").value;
  ourRequest.open('GET', 'https://learnwebcode.github.io/json-example/animals-' + sernum + '.json');
  ourRequest.onload = function() {
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
      var jsonData = JSON.parse(ourRequest.responseText);
      renderHTML(jsonData);
    } else {
      console.log("We connected to the server, but it returned an error.");
    }    
  };

  ourRequest.onerror = function() {
    console.log("Connection error");
  };

  ourRequest.send();
  
});

function renderHTML(data) {
  var htmlString = "";

  for (i = 0; i < data.length; i++) {
    htmlString += "<p>" + data[i].name + " is a " + data[i].species + " that likes to eat ";
    
    for (ii = 0; ii < data[i].foods.likes.length; ii++) {
      if (ii == 0) {
        htmlString += data[i].foods.likes[ii];
      } else {
        htmlString += " and " + data[i].foods.likes[ii];
      }
    }

    htmlString += ' and dislikes ';

    for (ii = 0; ii < data[i].foods.dislikes.length; ii++) {
      if (ii == 0) {
        htmlString += data[i].foods.dislikes[ii];
      } else {
        htmlString += " and " + data[i].foods.dislikes[ii];
      }
    }

    htmlString += '.</p>';

  }

  jsonContainer.insertAdjacentHTML('beforeend', htmlString);
  console.log(htmlString);
}