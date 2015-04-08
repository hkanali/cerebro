require 'yaml'
require 'twitter'
require 'tweetstream'

class DrainTwitter
  def initialize
    @conf = YAML::load_file("../config.yml")
    get_rest_api_client
  end

  def get_rest_api_client(token_num=0)
    @client = Twitter::REST::Client.new do |config|
      config.consumer_key        = @conf["twitter"]["consumer_key"]
      config.consumer_secret     = @conf["twitter"]["consumer_secret"]
      config.access_token        = @conf["twitter"]["access_token"]
      config.access_token_secret = @conf["twitter"]["access_token_secret"]
    end
    return @client
  end

  def get_user_info(id)
    user = @client.user(id)
    p user.connections
    p user.description
    p user.favourites_count
    p user.followers_count
    p user.friends_count
    p user.lang
    p user.listed_count
    p user.location
    p user.name
    p user.profile_background_color
    p user.profile_link_color
    p user.profile_sidebar_border_color
    p user.profile_sidebar_fill_color
    p user.profile_text_color
    p user.statuses_count
    p user.time_zone
    p user.utc_offset
    p user.screen_name
    p user.id
#    p user.attrs
  end

  def shed_stream
    TweetStream.configure do |config|
      config.consumer_key        = @conf["twitter"]["consumer_key"]
      config.consumer_secret     = @conf["twitter"]["consumer_secret"]
      config.oauth_token        = @conf["twitter"]["access_token"]
      config.oauth_token_secret = @conf["twitter"]["access_token_secret"]
      config.auth_method        = :oauth
    end
    TweetStream::Client.new.sample do |status|
      if status.user.lang == "ja" && !status.text.index("RT")
        puts "#{status.user.screen_name}: #{status.text}"
      end
    end
  end
end

dt = DrainTwitter.new
#dt.shed_stream
dt.get_user_info("masason")
