# Inspired from http://ididitmyway.heroku.com/past/2010/3/30/superdo_a_sinatra_and_datamapper_to_do_list/

require 'data_mapper'

DataMapper::Model.raise_on_save_failure = true
DataMapper::Property::String.length(13337)

DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/development.db")

class Event
  include DataMapper::Resource  
  property :id,           Serial
  property :jsonstring,   String
end

DataMapper.auto_upgrade!