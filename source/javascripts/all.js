//=require underscore/underscore
//=require jquery/dist/jquery
//=require papa-parse/jquery.parse
//=require templates/table


$(document).ready(function(){
  var template = JST['templates/table'];

  $(".convert").on('click', function(event){
    event.preventDefault();
    var input = $('textarea').val();
    var results = esults = $.parse(input, {
      header: false
    });
    $(".output").html(
      template({rows: results})
    );
  });
});
