CINETICA_URL = "http://api.cineti.ca"

get '/flicks' do
  content_type :json
  @api = RestClient::Resource.new CINETICA_URL
  body @api['/movies.json'].get.body
end
