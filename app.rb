require 'rubygems'
require 'sinatra'
require 'model'
require 'rest_client'
require 'json'
require 'haml'
require 'pp'
require 'cinetica'
require 'yellow'

get '/' do
  @movies = Cinetica.movies
  expires Time.now + (60 * 60 * 24), :public, :must_revalidate
  haml :index
end

get '/soiree/:id/?' do
  @soiree = Event.get(params[:id])
  if @soiree == nil
    # Event not found, serve some page saying it doesn't exist
    redirect '/'
  else 
    @soiree = JSON.parse(@soiree.jsonstring)
    haml :soiree, :format => :html5, :page_id => 'soiree'
  end
end

post '/soiree/?' do
  begin
    @b = params[:json]
    @newsoiree = Event.create(:jsonstring => @b)
    puts "LOG :: Created #{@newsoiree.id} with #{@newsoiree.jsonstring}"
    redirect "/soiree/#{@newsoiree.id}"
  rescue Exception => e 
    puts "LOG :: There was a fuck up #{@b}"
    e
  end
end