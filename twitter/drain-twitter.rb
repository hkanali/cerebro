require 'yaml'
require 'twitter'
require 'tweetstream'
require_relative 'models/twitterer'

class DrainTwitter
  def initialize
    @conf = YAML::load_file("../config.yml")
    get_rest_api_client
  end

  def get_rest_api_client(token_num=0)
    @client = Twitter::REST::Client.new do |config|
      config.consumer_key        = @conf["twitter"]["consumer_key#{token_num}"]
      config.consumer_secret     = @conf["twitter"]["consumer_secret#{token_num}"]
      config.access_token        = @conf["twitter"]["access_token#{token_num}"]
      config.access_token_secret = @conf["twitter"]["access_token_secret#{token_num}"]
    end
    return @client
  end

  def add_user_info(id)
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
    p user.tweets_count
    p user.time_zone
    p user.utc_offset
    p user.screen_name
    p user.id
    p user.profile_banner_uri
    p user.profile_image_uri.to_s
    p user.uri.to_s
    p user.website.to_s


    Twitterer.create(
      id:              user.id,
      screen_name:     user.screen_name,
      name:            user.name,
      description:     user.description,
      website:         user.website,
      location:        user.location,
      icon_path:       user.profile_image_uri.to_s,
      posts_count:     user.tweets_count,
      favorites_count: user.favourites_count,
      follows_count:   user.friends_count,
      followers_count: user.followers_count,
      listed_count:    user.listed_count
    )
    p Twitterer.all
  end

  def shed_stream
    TweetStream.configure do |config|
      config.consumer_key       = @conf["twitter"]["consumer_key0"]
      config.consumer_secret    = @conf["twitter"]["consumer_secret0"]
      config.oauth_token        = @conf["twitter"]["access_token0"]
      config.oauth_token_secret = @conf["twitter"]["access_token_secret0"]
      config.auth_method        = :oauth
    end

    ids = []
    TweetStream::Client.new.sample do |status|
      if status.user.lang == "ja" && !status.text.index("RT")
        # puts "#{status.user.screen_name}: #{status.text}"
        if ids.size >= 180
          return ids
        else
          screen_name = status.user.screen_name
          p "#{ids.size}:::#{screen_name}"
          ids << screen_name
          ids.uniq!
        end
      end
    end
  end

  def infinity_token(id, token_num=0)
    begin
      get_rest_api_client(token_num)
      user = @client.user(id)
    rescue Twitter::Error::TooManyRequests => error
      if token_num > 52
        token_num = 0
      else
        p token_num += 1
      end
      retry
    ensure
      user
    end
  end

  #limit 180req/15min
  def add_users_info(ids)
    return if ids.size > 180
    users = ids.map { |id|
      begin
        user = @client.user(id)
      rescue
        user = infinity_token(id)
      end
      p Twitterer.new(
          id:              user.id,
          screen_name:     user.screen_name,
          name:            user.name,
          description:     user.description,
          website:         user.website,
          location:        user.location,
          icon_path:       user.profile_image_url.to_s,
          posts_count:     user.tweets_count,
          favorites_count: user.favorites_count,
          follows_count:   user.friends_count,
          followers_count: user.followers_count,
          listed_count:    user.listed_count,
          born_at:         user.created_at,
          created_at:      DateTime.now
        )
    }
    Twitterer.import users.to_a, :on_duplicate_key_update => [:screen_name, :name, :description, :website, :location, :icon_path, :posts_count, :favorites_count, :follows_count, :followers_count, :listed_count], :validate => false
  end

  def fill_in_column
    ids = Twitterer.where(born_at: nil).pluck(:id)
    ids.each do |id|
      begin
        user = @client.user(id)
      rescue
        user = infinity_token(id)
      end
      p user
      born_at = user.created_at
      Twitterer.find(id).update(born_at: born_at)
    end
  end

  def main
    p "-----start-----"
    ids = shed_stream
    p "========add_users_info======"
    add_users_info(ids)
    p "-----end-----"
  end

end

dt = DrainTwitter.new
# dt.shed_stream
# dt.add_user_info("masason")
dt.main
# dt.fill_in_column
