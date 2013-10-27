
$(document).ready(function(){


  
  for(var k = 0; k < 6; k++ ){
    var row = $(".row:first-child").clone();
    $(".tracker").append(row);
  }

  jQuery.getJSON("/data",function(data){
    for(var i = 0; i < data.length ; i++) {
      var currCard = data[i];
      var newCard = $("<div class='new-card'><h1></h1><div class='scale'></div><a class='delete-card' href='#'>X</a></div>");
      for(var j = 0; j < currCard["audioClips"].length; j++) {
        var audioTag =  $("<audio preload='auto'>");
        audioTag.attr("src",currCard["audioClips"][j]);
        newCard.find(".scale").append(audioTag);
      }
      newCard.find(".scale").data("notes", currCard["notes"]);
      newCard.find("h1").text(currCard["label"]);
      $(".new-cards").append(newCard);
    }

  });

  $(".new-cards").sortable({
    connectWith : ".tracker .cell",
    start: function(e, ui) {
      var data = ui.item.find(".scale").data("notes");
      var name = ui.item.find("h1").text();
    },
    helper: function(e,el) {
     var notes = el.find(".scale").data("notes");
     copyHelper = el.clone().insertAfter(el);
     copyHelper.find(".scale").data("notes",notes);
     el.find(".scale").attr("data-notes",notes);
     return el;
    },
    stop: function() {
      copyHelper && copyHelper.remove();
    }
  });



  //Add New Row
  $(".add-row").on("click",function(){
    var row = $(".tracker .row:first-child").clone();
    row.find(".cell").html("");
    $(".tracker").append(row);
  });

  //Delete Card
  $(".tracker").on("click",".delete-card", function(){
    $(this).closest(".card").remove();
    console.log("remove");
  });

  //Delete Card
  $(".row").on("click",".delete-row", function(){
    $(this).closest(".row").remove();
  });

  startTime = new Date().getTime();



  //Sortable Card Tiles
  $(".tracker .cell").sortable({
    connectWith : ".tracker .cell",
    scroll : false,
    over : function(event,ui){
      // console.log($(this).find(".card").length);
      // if($(this).find(".card").length == 1){
        $(this).addClass("drop-hover");
      // }
    },
    out : function(event,ui){
      $(this).removeClass("drop-hover");
    },
    receive : function(event,ui) {
      if(ui.item.hasClass("new-card") && !$(this).hasClass("new-cards")) {
        var clone = ui.item.clone();
        $(".new-cards").append(clone);
      }

      ui.item.removeClass("new-card").addClass("card");

      if($(this).find(".card").length > 1){
        ui.sender.sortable("cancel");
      }
    }

  });





  playhead = $(".playhead")

   step();

});

var bpm, previousTime, startTime;
bpm = 100;
var beatLength = 60000 / bpm;
var measureTime = beatLength * 16;



var elapsed = 0;
var currentTime = 0;
var delta = 0;
var lastCalledTime = new Date().getTime();
var playhead;

var beat = 1;
var measure = 1;
var percent = 0;
var totalElapsed;


function step(){

  // currentTime = new Date().getTime();
  delta = new Date().getTime() - lastCalledTime;
  lastCalledTime = new Date().getTime();
  elapsed = elapsed + delta;


  if(elapsed >= beatLength * beat ) {
    beat++;
    if(beat < 65 && measure < 5) {
      startBeat(measure, beat - (measure*16) + 15);
    }
  }

  if(beat > 16 * measure) {
    measure++
  }

  if(elapsed >= beatLength * 64){
    elapsed = 0;
    beat = 0;
  }

  if(measure > 4) {
    measure = 0;
  }

  percent = elapsed/(beatLength * 64);

  playhead.css("left",.8*100*percent + "%");

  window.requestAnimationFrame(step);
};


function startBeat(measure, beat){

  var cards = $(".cell:nth-child("+measure+") .card");

  if (cards.length > 0) {

    cards.each(function(){
      var notes = $(this).find(".scale").data("notes");
      var audio = $(this).find("audio");

      if (!notes) {
        return;
      }

      var beatNotes = notes[beat-1];
      var audio = $(this).find("audio");

      for (var i = 0; i < beatNotes.length; i++) {
        audio[beatNotes[i]].play();
      }
    });
  }
}
