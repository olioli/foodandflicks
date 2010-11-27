require 'rubygems'
require 'sinatra'
require 'model'
require 'rest_client'
require 'json'

get '/' do
  #haml :index, :format => :html5, :page_id => 'index'
  redirect '/index.html'
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
