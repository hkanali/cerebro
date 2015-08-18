#!/usr/bin/env ruby
#-*- coding:utf-8 -*-
require 'yaml'
require 'mechanize'

class DrainWantedly
  def initialize
    @conf = YAML::load_file("../config.yml")
    @agent = Mechanize.new

    @top_url = "https://www.wantedly.com"
  end

  def login
    begin
      @agent.get(@top_url).link_with(href: "#login_modal").click
      @agent.page.form_with(action: "/user/sign_in") do |form|
        form.field_with(id: "user_email").value = @conf["wantedly"]["email"]
        form.field_with(id: "user_password").value = @conf["wantedly"]["pw"]
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
    end

    #あと保存処理かく
  end
end

dw = DrainWantedly.new
dw.main
