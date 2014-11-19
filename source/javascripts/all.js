//=require underscore/underscore
//=require jquery/dist/jquery
//=require papa-parse/jquery.parse
//=require templates/table
//=require templates/input


function Converter(config) {
  this.config = config;
  this.template = JST['templates/table'];

  this.viewHelpers = {
    table: function(klass, options){
      if (klass){
        return '<table class="' + klass + '"">';
      } else {
        return '<table>';
      }
    },

    theads: function(cells, options) {
      var output = '',
          self = this;

      _.each(cells, function(cell, idx) {
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
        if(typeof options[idx] === 'undefined') {
          options[idx] = {};
        }
        options[idx]['data-title'] = titles[idx].trim();
        output += self.tag(name, options[idx]);
        output += cell.toString().trim() + '</' + name + '>';
      });

      return output;
    },

    tag: function(name, options) {
      var output = '<' + name,
          attributes = this.buildAttributes(options);

      if(attributes.length === 0) {
        output += '>';
      } else {
        output += ' '+ attributes + '>';
      }
      return output;
    },

    buildAttributes: function(options) {
      var output = [],
          key;
      for (key in options) {
        if (options.hasOwnProperty(key)) {
          output.push(key + '="' + options[key] + '"');
        }
      }
      return output.join(' ');
    }
  };

  this.generate = function() {
    this.config.update();

    $(".output textarea").val(
      this.template(_.extend(this.config.options, this.viewHelpers))
      );
  }
}

function CSV() {
  this.input = '';
  this.parsed = {};
  this.headers = [];
  this.rows = [];

  this.update = function() {
    this.input = $('textarea.input').val();
    this.parsed = $.parse(this.input, {
      header: true
    });
    this.headers = this.parsed.results.fields;
    this.rows = this.parsed.results.rows;
  };

  this.update();
}

function InputsPopulator(headers) {
  this.template = JST['templates/input'];

  this.populate = function(csv) {
    var self = this,
        output;

    _.each(['th', 'td'], function(tag) {
      output = ''
      _.each(csv.headers, function(header, idx) {
        output += self.template({header: header, idx: idx, tag: tag});
      });
      $('.'+ tag +'s').html(output);
    });
  }

  this.populate(headers);
}

function Configuration(csv) {
  this.csv = csv;
  this.options = {
    tableOptions: {},
    thOptions: {},
    tdOptions: {},
    fields: [],
    rows: []
  };

  this.updateTagClasses = function( tag ) {
    var classSelector = '.' + tag + '-class',
        tagOption = tag + 'Options',
        self = this,
        className;

    $(classSelector).each(function( index ) {
      className = $(this).val().trim();
      if ( className.length !== 0 ) {
        self.options[tagOption][index] = {'class': className};
      }
    });
  };

  this.update = function() {
    this.csv.update();
    this.options.rows = this.csv.rows;
    this.options.fields = this.csv.headers;
    this.options.tableOptions.class = $('#table-class').val().trim();
    this.options.tableOptions.id = $('#table-id').val().trim();
    this.updateTagClasses('th');
    this.updateTagClasses('td');

    return this.options;
  }
}

$(document).ready(function() {
  var csv = new CSV(),
      config = new Configuration(csv),
      inputs = new InputsPopulator(csv),
      converter = new Converter(config),
      $input;

  $('.example').on('click', function(event) {
    event.preventDefault();
    $.get($(this).attr('href'), function(csvData) {
      $input = $('textarea.input');
      $input.val(csvData);
      $('.controls .convert').trigger('click');
    })
  });

  $('.controls .convert').on('click', function(event) {
    event.preventDefault();
    config.update();
    converter.generate();
  });

  $('.controls input').on('change', function(event) {
    event.preventDefault();
    config.update();
    converter.generate();
  });
});
