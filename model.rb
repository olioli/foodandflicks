# Inspired from http://ididitmyway.heroku.com/past/2010/3/30/superdo_a_sinatra_and_datamapper_to_do_list/

require 'data_mapper'

DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/development.db")

class Event
  include DataMapper::Resource  
  property :id,           Integer, :key => true
  property :jsonstring,   String
end

DataMapper.auto_upgrade!