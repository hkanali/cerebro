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
    p "logged-in!!"
  end

  def get_user(id)
    begin
      body = @agent.get("https://www.wantedly.com/api/internal/sync/users/#{id}").body
    rescue => e
      return #データが取れなかったとかなのでなにもしない
    end
    user = JSON.parse(body)

    #get_name
    begin
      body = @agent.get("https://www.wantedly.com/users/#{id}")
    rescue => e
      return
    end
    name = $1 if body.title =~ /^(.*) プロフィール - Wantedly/


#    facebook_url = user["data"]["profile"]["facebook_url"]
    twitter_url = user["data"]["profile"]["twitter_url"]
#    linkedin_url = user["data"]["profile"]["linkedin_url"]
    twitter_id = $1 if twitter_url =~ /twitter\.com\/(.*)$/
    workspace = user["data"]["profile"]["working_histories"].first["company"] rescue nil
    college = user["data"]["profile"]["academic_records"].last["school"] rescue nil
    if user["data"]["facebook_uid"]
      id = user["data"]["facebook_uid"]
    else
      id = $1 if user["data"]["avatar_url"] =~ /graph\.facebook\.com\/(\d+)\//
    end
    {
      id: id,
      name: name,
      icon_path: user["data"]["avatar_url"],
      workspace: workspace,
      college: college,
      twitter_id: twitter_id
    }
  end

  def bulk_upsert(users_h=[{}])
    facebookers = []
    relations = []
    users_h.each{|user|
      facebookers << Facebooker.new(
        id: user[:id],
        name: user[:name],
        icon_path: user[:icon_path],
        workspace: user[:workspace],
        college: user[:college],
        created_at: nil
      )

      relations << SocialRelation.new(
        master_id: user[:id],
        social_type: 1, #twitterは1と決める
        social_id: user[:twitter_id]
      ) if user[:twitter_id]
    }

    Facebooker.import facebookers, on_duplicate_key_update: [:name, :icon_path, :post_count, :workspace, :college, :friend_count, :telphone, :email, :relations, :address], validate: false
    SocialRelation.import relations, on_duplicate_key_update: [:social_id], validate: false unless relations.empty?
  end

  def main
    login

    users = []
    for i in 1..20000000 do
      p "----------#{i}-----------"
      p user = get_user(i)
      next if user.nil? || user[:id].nil?
      users << user
      if i % 50 == 0
        bulk_upsert(users)
        p "upsert!!!!!!!"
        users = []
      end
    end
  end
end

dw = DrainWantedly.new
dw.main
