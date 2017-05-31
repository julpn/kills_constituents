


$(function() {

	$(".popup").delay(15000).fadeIn(400);

	$(".share").click(function() {
		$(".popup").stop(true, true).fadeIn(400);
	});

	$(".popup .close_button").click(function() {
		$(".popup").fadeOut(400);
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

  $('#deathsBackground').attr('data-text', data.killed);
  $("#deaths").text(data.killed);

  $('#uninsuredBackground').attr('data-text', data.uninsured);
  $("#uninsured").text(data.uninsured);

  $('#debtBackground').attr('data-text', data.debt);
  $("#debt").text(data.debt);
  var title;
  var pronoun;
  if (data.gender === "M") {
    title = "Congressman";
    pronoun = "he";
  } else {
    title = "Congresswoman";
    pronoun = "she";
  };
  $("#pronoun").text(pronoun);
  title += (" (" + data.state + "-" + data.district + ")");
  $("#formalTitle").text(title);

  $(document).prop('title', title + " " + data.first_name + " " + data.last_name + " Voted to Kill " + data.killed + " " + " Constituents");

  var url = window.location.href;
  $('#fbLink').attr("href", "https://www.facebook.com/sharer/sharer.php?u=" + url);
  $('#twitterLink').attr("href", "https://twitter.com/home?status=Congressman%20%40" + data.first_name + "%20" + data.last_name + "%20voted%20to%20kill%20" + data.killed + "%20of%20his%20constituents%20by%202026%2C%20by%20repealing%20%23ACA%20(according%20to%20%40USCBO)%20pic.twitter.com/4gwVgJUG0i");
}



//clear input fields on focus, return to origin value if blank


$(document).ready(function(){
  // Get rep data
  var url = window.location.href;

  if ($.inArray( url, ["http://www.killsconstituents.com", "http://killsconstituents"] ) >= 0) {
    renderHomePage();
  };
  var rep = url.split(".")[0].replace("http://", "");
  rep = "nobody";
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
