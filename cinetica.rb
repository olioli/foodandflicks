CINETICA_URL = "http://api.cineti.ca"

get '/flicks' do

  # TODO: WHERE'S THE ID?  at the end of href attributes
  
  content_type :json
  @api = RestClient::Resource.new CINETICA_URL
  body @api["/movies.json"].get.body
end


get '/flicks/:id' do
  content_type :json
  dayparam = params[:day] || "sat"
  @api = RestClient::Resource.new CINETICA_URL
  body @api["/movie/#{params[:id]}.json?day=#{dayparam}"].get.body
end