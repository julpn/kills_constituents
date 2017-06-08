
//makes long text smaller
function shortenText() {

  if ($("h1 span").text().length > 10) {
    $("h1").addClass("smaller");
  }

  if ($("#deaths").text().length > 3) {
    $("#deaths").parent().addClass("smaller");
  }

  if ($("#uninsured").text().length > 5) {
    $("#uninsured").parent().addClass("smaller");
  }


});




$(function() {
	$(".popup").delay(15000).fadeIn(400);

  $('body').on('click','.popup .close_button', function(){
     $(".popup").fadeOut(100);
  });

  $('body').on('click','.share', function(){
     $(".popup").stop(true, true).fadeIn(100);
  });
});

function renderHomePage() {
  $("body").load('extra_html/find_rep.html');
  $("body").addClass("find_page");
};

function renderSubdomain(data){
  $("body").load('extra_html/subdomain.html', function() {
    $("body").addClass("allContent");
    updateContent(data);
  });
};


function updateContent(data) {
  $("#firstName").text(data.first_name);
  $("#lastName").text(data.last_name);
  $("#lastNameParagraph").text(data.last_name);
  $("#lastNameDescriptionA").text(data.last_name);
  $("#lastNameDescriptionB").text(data.last_name);
  $("#districtDescription").text(data.state);
  $("#districtNumber").text(data.district);

  $('#deathsBackground').attr('data-text', data.killed);
  $("#deaths").text(data.killed);

  $('#uninsuredBackground').attr('data-text', data.uninsured);
  $("#uninsured").text(data.uninsured);

  $('#costBackground').attr('data-text', data.pre_exist_premium);
  $("#cost").text(data.pre_exist_premium);

  $('#debtBackground').attr('data-text', data.debt);
  $("#debt").text(data.debt);
  var title;
  var pronoun;
  var possessive;
  if (data.gender === "F") {
    title = "Congresswoman";
    pronoun = "she";
    possessive = "her";
  } else {
    title = "Congressman";
    pronoun = "he";
    possessive = "his";
  };
  $("#possessive").text(possessive);
  title += (" (" + data.state + "-" + data.district + ")");
  $("#formalTitle").text(title);

  $(document).prop('title', title + " " + data.first_name + " " + data.last_name + " Voted to Kill " + data.killed + " " + " Constituents");

  var url = window.location.href;
  $('#fbLink').attr("href", "https://www.facebook.com/sharer/sharer.php?u=" + url);
  $('#twitterLink').attr("href", "https://twitter.com/home?status=Congressman%20%40" + data.twitter_handle + "%20voted%20to%20kill%20" + data.killed + "%20of%20" + possessive + "%20constituents%20by%20repealing%20%23ACA%20(according%20to%20%40USCBO)%20" + data.last_name + ".killsconstituents.com");
  var fbPost = "Within " + possessive + " district alone, " + title + " " + data.last_name + "'s vote will cost about " + data.killed + " lives by 2026 and cause " + data.uninsured + " to lose healthcare coverage.";
  $('meta[name=og\\:description]').attr('content', fbPost);
  $('meta[name=og\\:url]').attr('content', url);
  $('meta[name=og\\:site_name]').attr('content', data.first_name + " " + data.last_name + " Kills Constituents");

  var page_title = title + " " + data.first_name + " " + data.last_name + " voted to kill " + data.killed + " of " + possessive + " constituents by repealing the Affordable Care Act";
  $("title").text(page_title);
  
  shortenText();
  
}

function otherPages(url) {
  var otherPage = false;
  otherPages = ["about", "action"];

  otherPages.forEach(function (page) {
    if (url.includes(page)) {
      otherPage = true;
    }
  });
  return otherPage;
  
  
  
}


$(document).ready(function(){
  // Render html depending on location
  var url = window.location.href;

  var homepages = ["http://killsconstituents.com/", "http://www.killsconstituents.com/", "https://killsconstituents.com/"];
  var otherPage = otherPages(url);

  if (otherPage) {
    return;
  } else if ($.inArray(url, homepages) !== -1) {
    renderHomePage();
  } else {
    var rep = url.split(".")[0].replace("http://", "");

    var baseUrl = 'https://ahca.herokuapp.com/api/?rep=';

    $.get( baseUrl + rep, function( data ) {
      $( ".result" ).html( data );
      renderSubdomain(data);
      updateContent(data);
    }).fail(function(){
      renderHomePage(); // if subdomain is not found then render homepage
    });
  };

  $('body').on('focus','.input', function(){
     $(".input").val("");
  });
  $('body').on('click','.input', function(event){
     $(".input").val("");
  });

});


/// Address Searching

function submitAddress(){
  var geocoder = new google.maps.Geocoder();
  address = document.getElementById('address').value;

  geocoder.geocode({
    'address': address,
    'region': 'US',
    'componentRestrictions': {
      country: 'US',
    }
  }, function(results, status) {
    if (status === 'OK') {
      var lat = results[0].geometry.location.lat()
      var lng = results[0].geometry.location.lng()
      redirectToLegislator('latitude='+lat+'&longitude='+lng)
    } else {
      alert('Sorry, your district could not be found.');
      console.log(status)
    }
  });
  return false;
};


function submitZip(){
  var zip = document.getElementById("zip").value;
  redirectToLegislator('zip='+zip)
  return false;
};


//For use current location, we need to use navigator.geolocation:
function submitCurrentLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      redirectToLegislator('latitude='+lat+'&longitude='+lng)
    }, function() {
      //Geolocation service failed
      alert("Sorry, your district could not be found.");
    });
  } else {
    // Browser doesn't support Geolocation
    alert("Sorry, your district could not be found.");
  }
  return false;
};



//This function makes a request to the sunlightfoundation API. They say that an API key is needed, but it appears not...
//JSONP is used for browser compatibility
function redirectToLegislator(paramString){
  var s = document.createElement('script');
  s.src = 'https://congress.api.sunlightfoundation.com/legislators/locate?'+paramString+'&callback=redirectToLegislatorCallback';
  document.body.appendChild(s);
};

//this function simply redirects to the first house member that fits the zip or lat long. For zip, we may want to disambiguate.
//Also, we need to check if this congress person is on our list
function redirectToLegislatorCallback(response) {
  if('results' in response){
    var legislators = response['results'];
    for(var i = 0; i < legislators.length; i++){
      if(legislators[i]['chamber'] == 'house'){
        var firstName = legislators[i]['first_name']
        var lastName = legislators[i]['last_name'];
        var twitter = legislators[i]['twitter_id'];
        var state = legislators[i]['state'];
        var district = legislators[i]['district'];
        checkIfRepublican(firstName, lastName, state, district, twitter);
      }
    }
  }
};


function checkIfRepublican(firstName, lastName, state, district, twitter) {
  var name = firstName + lastName;
  var baseUrl = 'https://ahca.herokuapp.com/api/?rep=';
  $.get( baseUrl + name, function( data ) {
    $( ".result" ).html( data );
    window.location.href = 'http://' + name + '.killsconstituents.com/';
  }).fail(function(){
    showDemocratDisplay(firstName, lastName, state, district, twitter);
  });
};

function showDemocratDisplay(firstName, lastName, state, district, twitter) {
  $("body").load('extra_html/good_rep.html', function() {
    var headlineTitle = "Representative (" + state + "-" + district + ")";
    $("#headlineTitle").text(headlineTitle);
    $("#headlineFirstName").text(firstName);
    $("#headlineLastName").text(lastName);

  });
  $("body").removeAttr('class');
};

function randomRedirect(){
  var randomUrl = 'https://ahca.herokuapp.com/api/random/'
  $.get( randomUrl, function( data ) {
    $( ".result" ).html( data );
    if (data.first_name && data.last_name) {
      window.location.href = 'http://' + data.first_name + data.last_name + '.killsconstituents.com/';
    }
  });
};
