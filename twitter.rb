require "yaml"
require 'tweetstream'

conf = YAML::load_file("./config.yml")

TweetStream.configure do |config|
    config.consumer_key        = conf["twitter"]["consumer_key"]
    config.consumer_secret     = conf["twitter"]["consumer_secret"]
    config.oauth_token        = conf["twitter"]["access_token"]
    config.oauth_token_secret = conf["twitter"]["access_token_secret"]
    config.auth_method        = :oauth
end

TweetStream::Client.new.sample do |status|
    if status.user.lang == "ja" && !status.text.index("RT")
        puts "#{status.user.screen_name}: #{status.text}"
    end
end
