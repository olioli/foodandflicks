require 'rubygems'
require 'json'
require 'sinatra'
require 'model'
require 'rest-client'

get '/' do
  "Yo dawg, I hear you like dinner and a movie so I put a dinner in your movie so you could dine while you movies."
end

#get '/create' do
#  e = Event.create(:jsonstring => "WOWOWOWOW")
#  e
#end

#get '/show' do
#  Event.first().jsonstring
#end
