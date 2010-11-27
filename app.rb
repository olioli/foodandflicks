require 'rubygems'
require 'json'
require 'sinatra'
require 'model'
require 'rest-client'

get '/' do
  haml :index
end

get '/soiree/:id' do
  current = Event.get(params[:id])
  if current == nil
    redirect '/'
  end
end

#get '/create' do
#  e = Event.create(:jsonstring => "WOWOWOWOW")
#  e
#end

#get '/show' do
#  Event.first().jsonstring
#end
