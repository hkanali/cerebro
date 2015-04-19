# botweetstream
===

## Install&Run

```
$ npm install; npm start
```

## deploy on heroku

### add remote url
```
$ git remote add heroku https://git.heroku.com/safe-river-1164.git
```

### login heroku
```
$ heroku login
$ heroku run bash
```

### deploy
```
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
