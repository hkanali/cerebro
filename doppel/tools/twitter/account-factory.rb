#!/usr/bin/env ruby
#-*- coding:utf-8 -*-
require 'selenium-webdriver'
require 'csv'

class AccountFactory
  def initialize
    @driver = Selenium::WebDriver.for :firefox
  end

  def register_twitter(screen_name, email, password, user_name)
    # あとで登録成功チェックする
    begin
      @driver.get("https://twitter.com/signup")
      @driver.find_element(id: "full-name").send_keys screen_name
      @driver.find_element(id: "email").send_keys email
      @driver.find_element(id: "password").send_keys password
      @driver.find_element(id: "username").send_keys user_name
      sleep(2)
      @driver.find_element(id: "submit_button").click

      # logout
      @driver.get("https://twitter.com/")

      sleep(1)
      @driver.find_element(xpath: "//*[@id='user-dropdown-toggle']").click
      @driver.find_element(xpath: "//*[@id='signout-button']/button").click
    rescue => e
      p e
    ensure
      @driver.close
    end
  end

  def create_screen_name(basename, num)
    num = "%02d" % num
    "#{basename}10#{num}" #numが0~99前提
  end

  def get_sweets_h
    sweets_h = {}
    CSV.foreach("./sweets.txt") do |num, sweet_name|
      next if create_screen_name(sweet_name,num).size > 15
      sweets_h[sweet_name] = num
    end
    return sweets_h
  end

  def main
    sweets_h = get_sweets_h
    sweets_h.each do |sweet_name, num|
      p screen_name = user_name = create_screen_name(sweet_name,num)
      password = sweet_name
      email = "haruhiro.kanai2308+#{screen_name}@gmail.com"
      register_twitter(screen_name, email, password, user_name)
    end
  end
end

af = AccountFactory.new
af.main
p "finish!!!!!!!!!!!!!!!!"

#debug用
#p screen_name = user_name = "testmelonnnn1234"
#password = "testmelonnnn"
#email = "haruhiro.kanai2308+#{screen_name}@gmail.com"
#af.register_twitter(screen_name, email, password, user_name)
#p "fin!"
