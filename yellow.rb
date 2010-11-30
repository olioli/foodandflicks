# http://api.sandbox.yellowapi.com/FindBusiness/?what=barber&where=cZ-73.61995,45.49981&fmt=JSON&pgLen=10&apikey=g4hek5ph5za79bgh9b6eqc6p&UID=127.0.0.1

YELLOW_URL = "http://api.yellowapi.com"
YELLOW_SB_URL = "http://api.sandbox.yellowapi.com"
YELLOW_API_KEY = "g4hek5ph5za79bgh9b6eqc6p"

get '/food/:cinema' do
  cinema = params[:cinema] || "amc"
  @cinema = JSON.parse((RestClient::Resource.new(CINETICA_URL))["/theater/#{cinema}.json"].get)
  #@cinemas = JSON.parse((RestClient::Resource.new(CINETICA_URL))["/theaters.json"].get)

  lat, long = @cinema["lat"], @cinema["long"]
  
  @api = RestClient::Resource.new YELLOW_SB_URL
  
  food = @api['/FindBusiness/'].get( { :params => { :what => "restaurant", 
                             :where => "cZ#{long},#{lat}", 
                             :fmt => "JSON", 
                             :pgLen => 50, 
                             :UID => "31337",
                             :apikey => YELLOW_API_KEY } })

  expires Time.now + (60 * 60 * 24 * 7), :public, :must_revalidate
  content_type :json
  body food.body
end