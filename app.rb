require 'rubygems'
require 'json'
require 'sinatra'
require 'model'
require 'rest-client'

get '/' do
  #haml :index, :format => :html5, :page_id => 'index'
  redirect '/index.html'
end

get '/soiree/:id' do
  current = Event.get(params[:id])
  if current == nil
    # Event not found, serve some page saying it doesn't exist
    redirect '/'
  else 
    current.jsonstring
  end
end

#get '/create' do
#  e = Event.create(:jsonstring => "WOWOWOWOW")
#  e
#end

#get '/show' do
#  Event.first().jsonstring
#end
