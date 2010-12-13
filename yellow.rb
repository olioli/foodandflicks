# http://api.sandbox.yellowapi.com/FindBusiness/?what=barber&where=cZ-73.61995,45.49981&fmt=JSON&pgLen=10&apikey=g4hek5ph5za79bgh9b6eqc6p&UID=127.0.0.1
module Yellow

  YELLOW_URL = "http://api.yellowapi.com"
  YELLOW_SB_URL = "http://api.sandbox.yellowapi.com"
  YELLOW_API_KEY = "g4hek5ph5za79bgh9b6eqc6p"  

  def Yellow.api
    RestClient::Resource.new YELLOW_SB_URL    
  end
  

  class Business
    
    def self.find(what, long, lat, fmt = 'JSON', pglen = 50, uid = "31337", apikey = Yellow::YELLOW_API_KEY)

      JSON.parse( Yellow.api['/FindBusiness/'].get({ 
        :params => { :what => what, 
                     :where => "cZ#{long},#{lat}", 
                     :fmt => fmt, 
                     :pgLen => pglen,
                     :UID => uid,
                     :apikey => apikey } 
                   }))
    end
  end
    
end


get '/food/:cinema' do
  cinema = params[:cinema] || "amc"
  @cinema = Cinetica.theater(cinema)
  lat, long = @cinema["lat"], @cinema["long"]
  
  expires Time.now + (60 * 60 * 24 * 7), :public, :must_revalidate
  content_type :json
  body Yellow::Business.find('restaurant', long, lat).to_json
end