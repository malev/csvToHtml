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
      output += cell.trim() + '</th>';
    });

    return output;
  },
  tableElements: function(name, row, options){
    var self = this,
        output = '',
        titles = _.keys(row),
        values = _.values(row);

    _.each(values, function(cell, idx){
      if(typeof options[idx] === 'undefined'){
        options[idx] = {};
      }
      options[idx]['data-title'] = titles[idx].trim();
      output += self.tag(name, options[idx]);
      output += (cell ? cell.toString().trim() : '') + '</' + name + '>';
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

var converter = {
  convert: function(){
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
        1: {'class': 'second-klass'},
        2: {'class': 'number'}
      },
      tdOptions: {
        0: {'class': 'center'},
        2: {'class': 'number'}
      }
    }

    _.extend(data, viewHelpers);

    $(".output textarea").html(template(data));
  }
}

function inputsPopulate(){
  var template = JST['templates/input'];
  var input = $('textarea').val();
  var parsed = $.parse(input, {
    header: true
  });
  var headers = parsed.results.fields;
  var output = '';

  _.each(headers, function(header, idx){
    output += template({header: header, idx: idx});
  });
  $('.tds').html(output);
}

$(document).ready(function(){
  $('.input textarea').on('change', function(event){
    event.preventDefault();
    converter.convert();
    inputsPopulate();
  });

  $('input.convert').on('click', function(event){
    event.preventDefault();
    converter.convert();
    inputsPopulate();
  });
});
