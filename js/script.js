
function loadData(e) {
    e.preventDefault();
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var gsvkey = 'AIzaSyB4Sx-EmG0FVrUBwkOuk9Btwv2cW3jjuZg';
    var strStreet = $('#street').val();
    var strCity = $('#city').val();
    var address = strStreet + ', ' + strCity;

    $greeting.text('So, you want to live at ' + address + '?');
    strStreetViewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address;

    $body.append('<img class="bgimg" src="'+strStreetViewURL+'">');

    //NY Times - get articles
    var nytArticleURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q='+strCity+'&sort=newest&api-key=8d7a9993eaab46ae990a74b3f755faa6';

    $.getJSON(nytArticleURL, function( data ) {

        $nytHeaderElem.text('New York Times Articles About '+strCity);

        articles = data.response.docs;

        for (var i=0; i < articles.length; i++){
            var article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>' + article.snippet + '</p>'+ '</li>');
        }

        return false;
    }).fail(function() {
    	$nytHeaderElem.text('New York Times Articles could not be loaded at this time.');
  });

  //Wikipedia Ajax Request  
  var wikiUrl = 'http://en.wikipedia.com/w/api.php?action=opensearch&search=' + strCity +'&format=json&callback=wikiCallback';

  var wikiRequestTimeout = setTimeout(function(){
      $wikiElem.text("failed to get wikipedia resources");
  }, 8000);

  $.ajax({
      url: wikiUrl,
      dataType: "jsonp",

      success: function(response) {
          var articleList = response[1];

          for (var i=0; i<articleList.length; i++) {
              articleStr = articleList[i];
              var url = 'http://en.wikipedia.org/wiki/' + articleStr;
              $wikiElem.append('<li><a href="'+url + '">' + articleStr + '</a></li>');
          }

          clearTimeout(wikiRequestTimeout);
      }
  });

}

$('#form-container').submit(loadData);
