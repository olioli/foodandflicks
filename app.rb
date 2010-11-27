require 'rubygems'
require 'sinatra'
require 'model'
require 'rest_client'

get '/' do
  "Yo dawg, I hear you like dinner and a movie so I put a dinner in your movie so you could dine while you movies."
  haml :index, :format => :html5, :page_id => 'index'
end

#get '/create' do
#  e = Event.create(:jsonstring => "WOWOWOWOW")
#  e
#end

#get '/show' do
#  Event.first().jsonstring
#end
