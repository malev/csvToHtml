set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

activate :bower
activate :livereload
activate :deploy do |deploy|
  deploy.method = :rsync
  deploy.host   = "codingnews.info"
  deploy.path   = "/home/malev/apps/csv.codingnews.info"
  deploy.user   = "malev"
  deploy.build_before = true
end
