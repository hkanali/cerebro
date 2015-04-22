# analyze-follower

##Requirements
```
ruby 2.1.2
mecab 0.996
```

##Install
```
brew install mecab mecab-ipadic
gem install bundler
bundle install --path vendor/bundle
```

##Usage
```
bundle exec ruby analyze-follower.rb TWITTER_ID
```

##Memo
follower数5000以上は処理に時間かかるかも
