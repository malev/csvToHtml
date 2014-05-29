//=require underscore/underscore
//=require jquery/dist/jquery
//=require papa-parse/jquery.parse
//=require templates/table

var viewHelpers = {
  table: function(klass, options){
    if (klass){
      return '<table class="' + klass + '"">';
    } else {
      return '<table>';
    }
  },
  tag: function(name, options){
    var id = options['id'],
        klass = options['klass'],
        output = '<' + name;

    if(id){
      output += ' id="' + id + '"';
    }
    if(klass){
      output += ' class="' + klass + '"';
    }
    output += '>'
    return output;
  }
}

$(document).ready(function(){
  var template = JST['templates/table'];

  // $(".convert").on('click', function(event){
    // event.preventDefault();
    var input = $('textarea').val();
    var parsed = $.parse(input, {
      header: true
    });

    var data = {
      rows: parsed.results.rows,
      fields: parsed.results.fields,
      tableOptions: {
        klass: 'table-klass',
        id: 'table-id'
      }
    }

    _.extend(data, viewHelpers);

    $(".output").html(template(data));
  // });
});
