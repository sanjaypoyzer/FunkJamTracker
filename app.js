$(document).ready(function(){

  jQuery.getJSON("/data",function(data){
    for(var i = 0; i < data.length ; i++) {
      var currCard = data[i];
      var newCard = $("<div class='new-card'><h1></h1><div class='scale'></div><a class='delete-card' href='#'>X</a></div>");

      for(var j = 0; j < currCard["audioClips"].length; j++) {
        var audioTag =  $("<audio>");
        audioTag.attr("src",currCard["audioClips"][j]);
        newCard.find(".scale").append(audioTag);
      }

      newCard.find(".scale").data("notes", currCard["notes"]);
      newCard.find("h1").text(currCard["label"]);

      $(".new-cards").append(newCard);
    }

  });

  //Add New Row
  $(".add-row").on("click",function(){
    var row = $(".tracker .row:first-child").clone();
    row.find(".cell").html("");
    $(".tracker").append(row);
  });

  //Delete Card
  $(".card").on("click",".delete-card", function(){
    $(this).closest(".card").remove();
  });

  //Delete Card
  $(".row").on("click",".delete-row", function(){
    $(this).closest(".row").remove();
  });

  startTime = new Date().getTime();

  $(".new-cards").sortable({
    connectWith : ".tracker .cell",
    stop : function(event,ui){
      // ui.item.removeClass("new-card").addClass("card");
    }
  });

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
  
  window.webkitRequestAnimationFrame(step);
};


function startBeat(measure, beat){

  var cards = $(".cell:nth-child("+measure+") .card");
  
   if(cards.length > 0) {

     cards.each(function(){
      var notes = $(this).find(".scale").data("notes");
      var audio = $(this).find("audio");
      var beatNotes = notes[beat-1];
      var audio = $(this).find("audio");
       for(var i = 0; i < beatNotes.length; i++){
         var sound = audio[i];
        sound.play();
      }
     });
    
   }
}
