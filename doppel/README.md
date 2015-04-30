# Doppel Project in Cerebro
===

## [LINK](https://cerebro1989.herokuapp.com)

## Install&Run

```
$ npm install; npm start
```

## deploy on heroku

### add remote url
```
$ git remote add heroku https://git.heroku.com/cerebro1989.git
```

### login heroku
```
$ heroku login
$ heroku run bash
```

### deploy
```
$ heroku login
$ heroku config:add BUILDPACK_URL=https://github.com/heroku/heroku-buildpack-multi.git
$ git push heroku master

# confirm
$ heroku ps:scale web=1
$ heroku logs --tail
```

#### install vim

```
$ mkdir vim
$ curl https://s3.amazonaws.com/heroku-vim/vim-7.3.tar.gz --location --silent | tar xz -C vim
$ export PATH=$PATH:/app/vim/bin
```
