getRepData();

function getRepData(){
  var url = document.referrer;

  var rep = url.split(".")[0].replace("http://", "");

  var baseUrl = 'https://ahca.herokuapp.com/api/?rep=';

  $.get( baseUrl + rep, function( data ) {
    $( ".result" ).html( data );
    updateActions(data);
  }).fail(function(){
    return;
  });

};

function updateActions(data){
  var title = "Congressman";
  var pronoun = "he";
  var possessive = "her";
  if (data.gender === "F") {
    title = "Congresswoman";
    pronoun = "she";
    possessive = "her";
  }
  $('#actionTwitterLink').attr("href", "https://twitter.com/home?status=" + title + "%20%40" + data.twitter_handle + "%20voted%20to%20kill%20" + data.killed + "%20of%20" + possessive + "%20constituents%20by%20repealing%20%23ACA%20(according%20to%20%40USCBO)%20" + data.last_name + ".killsconstituents.com");
  $("#actionPhoneNumber").text(title + " " + data.first_name + " " + data.last_name + "'s phone number is " + data.phone_number + ".");
}
