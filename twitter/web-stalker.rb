#!/usr/bin/ruby
# -*- coding: utf-8 -*-
#twilogに接続して,指定twitter垢のtumblrやinstagram垢があったら拾ってまとめる
#Input:@twitter Output:@twitterの他のSNS垢

require 'open-uri'
require 'nokogiri'
require 'rexml/document'
require 'kconv'
require 'benchmark'

class WebStalker
  def initialize
    twitterID = "8thLuna"
    snsName = "instagram"
    url = "http://twilog.org/"#{twitterID}/search?word=#{snsName}"
    @doc = Nokogiri::HTML.parse(open(url))
    @hiddenids = []
  end

  def main
    #begin
    #@doc.xpath('//*[@id="tw407021450852564992"]/p[4]').each do |b_day|
    @doc.each do |row|
      #@b_days << b_day.to_s.gsub(/<\/?td|>|<br>/,"")
      p row
    end
=begin
    @groups.size.times do |i|
      #flattenだとエラーでzipだとうまくnilになる - www.dreamedge.net/archives/96
      mem_bday =  @members[i].split("\n").zip(@b_days[i].split("\n"))
      mem_bday = Hash[*mem_bday.flatten]
      #一行処理より代入を挟んだ方がなぜか速い
      @usrlist.store(@groups[i].chomp,[@debuts[i],mem_bday])
    end

    #member全員のリストを作る
    @members = @members.join("\n").split("\n").delete_if{|n| n=="" }
    memcount = @members.size
    i = 0
      open("./querylist","a+") do |f|
        #debut,team,name,b-day
        @usrlist.each do |group,v|
          v[1].each do |name,bday|
            i += 1
            puts "writing ... #{i}/#{memcount}"
            f.puts "#{v[0]},#{group},#{name},#{bday}"
          end
        end
      end
      puts "	done"
    #rescue
    #	p $!
    #end
=end
  end
end

wbs = WebStalker.new
wbs.main
