
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val().toUpperCase();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('Streetview and news for ' + address);

    var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    //NY Times API

    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=85bb8793a86741959e1596f7dd05cffb'
    $.getJSON(nytimesUrl, function (data) {

        $nytHeaderElem.text('New York Times articles about ' + cityStr);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append( '<li class="article">' + '<a href="'+article.web_url+'">'+article.headline.main+'</a>' + '<p>' + article.snippet + '</p>'+ '</li>');
        };

    }).error(function(e) {
                $nytHeaderElem.text("Articles could not be loaded");
            });

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failed to get Wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        success: function(response) {
            var articleList = response[1];
            for (var i = 0; i < articleList.length; i++) {
            articleStr = articleList[i];
            var url = 'http://en.wikipedia.org/wiki/' + articleStr;
            $wikiElem.append('<li><a href="' +url+ '">' + articleStr + '</a></li>');
        };

        clearTimeout(wikiRequestTimeout);
    }
});

    return false;
};

$('#form-container').submit(loadData);
