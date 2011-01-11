#module_function <- check out
RestClient.log = Logger.new(STDOUT)

class Cinetica
  CINETICA_URL = "http://api.cineti.ca"

  def self.movie(movie_id, day = nil)
    url = "/movie/#{movie_id}.json"
    url << "?day=#{day}" unless day.nil?
    JSON.parse( self.api[url].get.body)
  end
  
  def self.movies
    JSON.parse( self.api["/movies.json"].get.body)
  end
  
  def self.theater(theater_id)
    JSON.parse( self.api["/theater/#{theater_id}.json"].get.body )
  end

  def self.api
    RestClient::Resource.new CINETICA_URL 
  end
end

get '/flicks' do  
  expires Time.now + (60 * 60 * 24), :public, :must_revalidate
  content_type :json
  body Cinetica.movies.to_json
end

# deep, man.
get '/flicks/all/?' do
  movies = Cinetica.movies
    
  deep_movies = movies.map do |m|
    Cinetica.movie( m["id"] )
  end
  
  expires Time.now + (60 * 60 * 24), :public, :must_revalidate
  content_type :json
  body deep_movies.to_json
end

get '/flicks/:id' do
  expires Time.now + (60 * 60 * 24), :public, :must_revalidate
  content_type :json
  movie = Cinetica.movie(params[:id], params[:day])
  movie[:id] = params[:id]
  body movie.to_json
end
