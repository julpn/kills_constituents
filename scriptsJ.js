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
  $("body").load('find_rep.html');
  $("body").addClass("find_page");
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
  $("#pronoun").text(pronoun);
  title += (" (" + data.state + "-" + data.district + ")");
  $("#formalTitle").text(title);

  $(document).prop('title', title + " " + data.first_name + " " + data.last_name + " Voted to Kill " + data.killed + " " + " Constituents");

  var url = window.location.href;
  $('#fbLink').attr("href", "https://www.facebook.com/sharer/sharer.php?u=" + url);
  $('#twitterLink').attr("href", "https://twitter.com/home?status=Congressman%20%40" + data.twitter_handle + "%20voted%20to%20kill%20" + data.killed + "%20of%20" + possessive + "%20constituents%20by%202026%2C%20by%20repealing%20%23ACA%20(according%20to%20%40USCBO)%20pic.twitter.com/4gwVgJUG0i");
  var fbPost = "Within " + possessive + " district alone, " + title + " " + data.last_name + "'s vote will cost about " + data.killed + " lives by 2026 and cause " + data.uninsured + " to lose healthcare coverage.";
  $('meta[name=og\\:description]').attr('content', fbPost);
  $('meta[name=og\\:url]').attr('content', url);
  $('meta[name=og\\:site_name]').attr('content', data.first_name + " " + data.last_name + " Kills Constituents");

}



$(document).ready(function(){
  // Get rep data
  var url = window.location.href;

  if ($.inArray( url, ["http://www.killsconstituents.com", "http://killsconstituents"] ) >= 0) {
    renderHomePage();
  };
  var rep = url.split(".")[0].replace("http://", "");

  var baseUrl = 'https://ahca.herokuapp.com/api/?rep=';

  $.get( baseUrl + rep, function( data ) {
    $( ".result" ).html( data );
    updateContent(data);
  }).fail(function(){
    renderHomePage();
  });

	$("input:not(input[type='submit'])").focus(function() {

		if ($(this).val() == $(this).attr('value')) {
			$(this).val('');
		}

    });

	$("input").blur(function() {

		if ($(this).val() == '') {
			$(this).val($(this).attr('value'));
		}

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
  $("body").load('good_rep.html', function() {
    var headlineTitle = "Representative (" + state + "-" + district + ")";
    $("#headlineTitle").text(headlineTitle);
    $("#headlineFirstName").text(firstName);
    $("#headlineLastName").text(lastName);

  });
  $("body").removeAttr('class');
}
