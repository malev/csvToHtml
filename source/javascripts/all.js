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
  theads: function(cells, options){
    var output = '',
        self = this;

    _.each(cells, function(cell, idx){
      output += self.tag('th', options[idx]);
      output += cell + '</th>';
    });

    return output;
  },
  tableElements: function(name, row, options){
    var output = '',
        self = this;

    row = _.values(row);

    _.each(row, function(cell, idx){
      output += self.tag(name, options[idx]);
      output += cell + '</' + name + '>';
    });

    return output;
  },
  tag: function(name, options){
    var output = '<' + name,
        attributes = this.buildAttributes(options);

    if(attributes.length === 0){
      output += '>';
    } else {
      output += ' '+ attributes + '>';
    }
    return output;
  },
  buildAttributes: function(options){
    var output = [];
    for (var key in options) {
      if (options.hasOwnProperty(key)){
        output.push(key + '="' + options[key] + '"');
      }
    }
    return output.join(' ');
  }
}


$(document).ready(function(){
  var template = JST['templates/table'];

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
    },
    thOptions: {
      0: {'class': 'first-klass'},
      1: {'class': 'second-klass'}
    },
    tdOptions: {
      0: {'data-title': 'Name', 'class': 'center'},
      1: {'data-title': 'Gender', 'class': 'right'}
    }
  }

  _.extend(data, viewHelpers);

  $(".output").html(template(data));
});
