require 'rubygems'
require 'sinatra'
require 'model'
require 'rest_client'
require 'json'
require 'haml'

require 'cinetica'
require 'yellow'

get '/' do
  haml :index, :format => :html5, :page_id => 'index'
end

get '/soiree/:id' do
  current = Event.get(params[:id])
  if current == nil
    # Event not found, serve some page saying it doesn't exist
    redirect '/'
  else 
    haml :soiree, :format => :html5, :page_id => 'soiree'
  end
end

post '/soiree' do
  @b = params[:json]
  begin
    @newsoiree = Event.create(:jsonstring => @b)
    puts "LOG :: Created #{@newsoiree.id} with id #{@newsoiree.jsonstring}"
    redirect "/soiree/#{@newsoiree.id}"
  rescue Exception => e 
    puts "LOG :: There was a fuck up #{@b}"
    e
  end
end