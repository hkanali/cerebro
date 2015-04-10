#!/usr/bin/env ruby
#-*- coding:utf-8 -*-
require 'natto'
require 'twitter'
require 'yaml'

class AnalyzeFollower
  def initialize
    @EXCLUDE_WORDS = open("./dic/stopword.txt","r").readlines.map(&:chomp)
    @EXCLUDE_REGEX = /[\d+\.\,\/:\(\);\[\]０-９]|^[\w|ぁ-ん|ァ-ヶ]$/
    @mecab = Natto::MeCab.new("-u ./dic/custom.dic")
    @YAML_PATH = "../secret/API.yml"
  end

  def get_twitter_client(num=0)
    conf = YAML::load_file(@YAML_PATH)
    @client = Twitter::REST::Client.new do |config|
      config.consumer_key = conf["tw_consumer_key#{num}"]
      config.consumer_secret = conf["tw_consumer_secret#{num}"]
      config.access_token = conf["tw_access_token#{num}"]
      config.access_token_secret = conf["tw_access_token_secret#{num}"]
    end
    @client
  end

  #REST::Client#follower_ids...5000ids/api
  def get_follower_ids(twitter_id)
    token_num = 0
    begin
      get_twitter_client(token_num)
      follower_ids = @client.follower_ids(twitter_id).to_a ##follower
    rescue Twitter::Error::TooManyRequests => error
      sec = error.rate_limit.reset_in
      #p "wait #{sec}"
      #sleep sec
      p "No.#{token_num}"
      if token_num > 51
        token_num = 0
      else
        token_num += 1
      end
      retry
    ensure
      follower_ids
    end
  end

  #REST::Client#users...100ids/api(limit: x180/15min)
  def get_followers(twitter_id)
    token_num = 0
    followers = []
    get_twitter_client(token_num)
    follower_ids = @client.follower_ids(twitter_id).to_a ##follower
    #follower_ids = @client.friend_ids(twitter_id).to_a    ##follow
    begin
      puts "follower.size: #{follower_ids.size}"
      loop_count = (follower_ids.size - 1) / 100 + 1
      loop_count.times do
        ids_temp = follower_ids.pop(100) #末尾100アカウントを毎回取って使用
        accounts_temp = @client.users(ids_temp)
        followers << accounts_temp
      end
      followers.flatten!.each.with_index(1) {|fwer,i| puts "#{i}: #{fwer.screen_name}"}
    rescue Twitter::Error::TooManyRequests => error
      sec = error.rate_limit.reset_in
      p "wait #{sec}"
      sleep sec
      #      p "No.#{token_num}"
      #      if token_num > 51
      #        token_num = 0
      #      else
      #        token_num += 1
      #      end
      #      get_twitter_client(token_num)
      retry
    ensure
      return followers
    end
  end

  #頻出語抽出
  def get_freq_words(text)
    word_h = {}
    @mecab.parse(text) do |word|
      surface = word.surface
      next if @EXCLUDE_WORDS.include?(surface)
      next unless word.feature.match("名詞")
      word = word.surface
      word_h[word] = word_h[word] ? word_h[word] + 1 : 1
    end
  return word_h.sort_by{|word,count| count}
  end

  def get_fwer_fw(twitter_id)
    puts "-----GET FOLLOWERS-----"
    followers = get_followers(twitter_id)
    puts "-----GET FOLLOWER DESCRIPTION-----"
    profile_texts = followers.map{|fwer| 
      begin
      fwer.description
      rescue
        next
      end
    }.join
    puts "-----ANALYZE FREQ_WORDS-----"
    return get_freq_words(profile_texts)
  end

  #http://tondol.hatenablog.jp/entry/20100412/1271016565
  def fetch(instance, method, name, query)
    next_cursor = -1
    while true
      query['cursor'] = next_cursor
      instance.__send__(method, query).each{|key, value|
        if key == name
          value.each{|v| yield(v)}
        elsif key == "next_cursor"
          next_cursor = value.to_i
        end
      }
      break if next_cursor <= 0
    end
  end
end

twitter_id = ARGV[0]
af = AnalyzeFollower.new
#p af.get_follower_ids(twitter_id)
af.get_fwer_fw(twitter_id).each do |k,v|
  puts "#{v}\t#{k}"
end
