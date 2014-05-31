//=require underscore/underscore
//=require jquery/dist/jquery
//=require papa-parse/jquery.parse
//=require templates/table
//=require templates/input


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

function CSV(){
  this.input = '';
  this.parsed = {};
  this.headers = [];

  this.extend = function(options){
    options.rows = this.parsed.results.rows;
    options.fields = this.parsed.results.fields;

    return options;
  };

  this.update = function(){
    this.input = $('textarea.input').val();
    this.parsed = $.parse(this.input, {
      header: true
    });
    this.headers = this.parsed.results.fields;
  };

  this.update();
}

function InputsPopulator(headers){
  this.template = JST['templates/input'];

  this.populate = function(headers){
    var self = this,
        output;

    _.each(['th', 'td'], function(tag){
      output = ''
      _.each(headers, function(header, idx){
        output += self.template({header: header, idx: idx, tag: tag});
      });
      $('.'+ tag +'s').html(output);
    });
  }

  this.populate(headers);
}

function Configuration(){
  this.options = {
    tableOptions: {},
    thOptions: {},
    tdOptions: {}
  };

  this.updateTagClasses = function( tag ){
    var classSelector = '.' + tag + '-class',
        tagOption = tag + 'Options',
        self = this,
        className;

    $(classSelector).each(function( index ){
      className = $(this).val().trim();
      if ( className.length !== 0 ) {
        self.options[tagOption][index] = {'class': className};
      }
    });
  };

  this.update = function(){
    this.options.tableOptions.class = $('#table-class').val().trim();
    this.options.tableOptions.id = $('#table-id').val().trim();
    this.updateTagClasses('th');
    this.updateTagClasses('td');

    return this.options;
  }
}

function inputsPopulate(){
  var template = JST['templates/input'];
  var input = $('textarea').val();
  var parsed = $.parse(input, {
    header: true
  });
  var headers = parsed.results.fields;

  var outputTh = '';
  _.each(headers, function(header, idx){
    outputTh += template({header: header, idx: idx, tag: 'th'});
  });
  $('.ths').html(outputTh);

  var outputTd = '';
  _.each(headers, function(header, idx){
    outputTd += template({header: header, idx: idx, tag: 'td'});
  });
  $('.tds').html(outputTd);

}

$(document).ready(function(){
  var csv = new CSV(),
      config = new Configuration(),
      inputs = new InputsPopulator(csv.headers);

  $('.input textarea').on('change', function(event){
    event.preventDefault();
    csv.update();
    inputs.populate(csv.headers);
  });
});
