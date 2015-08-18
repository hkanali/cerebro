#!/usr/bin/env ruby
#-*- coding:utf-8 -*-
require 'yaml'
require 'mechanize'
require 'active_record'
require 'activerecord-import'

$conf = YAML::load_file("../config.yml")
ActiveRecord::Base.establish_connection($conf["mysql"]["prd"])
class Facebooker < ActiveRecord::Base
end
class SocialRelation < ActiveRecord::Base
end

class DrainWantedly
  def initialize
    @agent = Mechanize.new

    @top_url = "https://www.wantedly.com"
  end

  def login
    begin
      @agent.get(@top_url).link_with(href: "#login_modal").click
      @agent.page.form_with(action: "/user/sign_in") do |form|
        form.field_with(id: "user_email").value = $conf["wantedly"]["email"]
        form.field_with(id: "user_password").value = $conf["wantedly"]["pw"]
      end.click_button
    rescue => e
      p e
      puts "error: failed to login"
      exit
    end
    p "logged-in"
  end

  def get_user(id)
    begin
      body = @agent.get("https://www.wantedly.com/api/internal/sync/users/#{id}").body
    rescue => e
      return #データが取れなかったとかなのでなにもしない
    end
    user = JSON.parse(body)

    {
      uid: user["data"]["facebook_uid"],
      facebook_url: user["data"]["profile"]["facebook_url"],
      twitter_url: user["data"]["profile"]["twitter_url"],
      linkedin_url: user["data"]["profile"]["linkedin_url"]
    }
  end

  def main
    login
    #p get_user(450212)
    for i in 1..20000000 do
      p "----------#{i}-----------"
      user = get_user(i)
      next if user.nil? || user[:uid].nil?
      p user
      #ここでhttps://www.wantedly.com/users/#{i}に入ってユーザ名抜く処理かく
      
      #Facebooker、SocialRelationモデルに整形してUpsertする処理かく
    end

    #あと保存処理かく
  end
end

dw = DrainWantedly.new
dw.main
