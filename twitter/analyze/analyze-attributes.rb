#!/usr/bin/env ruby
#-*- coding:utf-8 -*-
require_relative '../models/twitterer'

all = Twitterer.all
insta_candidates = Twitterer.where.not(website: nil).where("website regexp ?", "twpf").pluck(:website)
p "#{insta_candidates.size}/#{all.size}"
p "#{(insta_candidates.size/all.size.to_f).round(2)*100}%"