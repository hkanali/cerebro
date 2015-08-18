#!/usr/bin/ruby
# -*- coding: utf-8 -*-
#SNSテーブルの情報から他のSNS情報を割り出して登録する
require_relative 'models/twitterer'
require_relative 'models/pixiver'
require_relative 'models/social_relation'

sitename = "pixiv"
result   = Twitterer.where("website regexp ?", sitename) #.pluck(:website)

ids          = names = []
pixivers = []
social_relations = []
result.each { |site|
  site  = site.website
  tw_id = site.id
  if site =~ /.*id=(\d+)/
    pixiv_id = $1
    pixivers << Pixiver.new(
      id: pixiv_id
       )
  elsif site =~ /.*pixiv\.me\/(.*)/
    pixiv_name = $1
     pixivers << Pixiver.new(
      name: pixiv_name
       )
  end
  twid_pxvid_h[tw_id] = pixiv_id
  social_relations << SocialRelation.new(
    master_id: xxx, #users.id
    social_type: xxx, #pixiv
    social_id: pixiv_id
  )
}

# on_duplicat以下各テーブル用に修正する
Pixiver.import pixivers.to_a, :on_duplicate_key_update => [:screen_name, :name, :description, :website, :location, :icon_path, :posts_count, :favorites_count, :follows_count, :followers_count, :listed_count], :validate => false
SocialRelation.import social_relations.to_a, :on_duplicate_key_update => [:screen_name, :name, :description, :website, :location, :icon_path, :posts_count, :favorites_count, :follows_count, :followers_count, :listed_count], :validate => false
