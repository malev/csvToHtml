require "jshintrb/jshinttask"

Jshintrb::JshintTask.new :jshint do |t|
  t.pattern = 'source/js/**/*.js'
  t.options = JSON.parse(IO.read('.jshintrc'))
end
