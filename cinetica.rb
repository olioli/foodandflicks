CINETICA_URL = "http://api.cineti.ca"

get '/flicks' do  
  @api = RestClient::Resource.new CINETICA_URL
  
  content_type :json
  body @api["/movies.json"].get.body
end


get '/flicks/:id' do
  @api = RestClient::Resource.new CINETICA_URL
  url = "/movie/#{params[:id]}.json"  
  url << "?day=#{params[:day]}" unless params[:day].nil?  

  content_type :json
  body @api[url].get.body
end