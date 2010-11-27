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
    "showing page with json string #{current.jsonstring}"
  end
end

post '/soiree' do

  begin
    @b = request.body.read
    puts @b.class
    @parsed_object = JSON.parse(@b)
    puts @parse_object.class
    #newsoiree = Event.new
    #@parsed_object['id'] = newsoiree.id
    #newsoiree.jsonstring = @parsed_object.to_json
    #newsoiree.save
    #puts "create #{newsoiree.id} with id #{newsoiree.jsonstring}"
  rescue Exception => e 
    puts "there was a fuck up #{@b}"
    e
  end
end

#get '/create' do
#  e = Event.create(:jsonstring => "WOWOWOWOW")
#  e
#end

#get '/show' do`
#  Event.first().jsonstring
#end
