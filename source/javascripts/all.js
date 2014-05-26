//=require underscore/underscore
//=require jquery/dist/jquery
//=require papa-parse/jquery.parse
//=require templates/table


$(document).ready(function(){
  var template = JST['templates/table'];

  $(".convert").on('click', function(event){
    event.preventDefault();
    var input = $('textarea').val();
    var parsed = $.parse(input, {
      header: true
    });
    $(".output").html(
      template({rows: parsed.results.rows, fields: parsed.results.fields})
    );
  });
});
