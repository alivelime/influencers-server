# influs
https://asagakita-170822.appspot.com/

## for developing

```
# go api server
$ dev_appserver.py app/app.yaml --host 0.0.0.0 --enable_host_checking 0 --port 3001

# run react
$ npm start
```

## for deploy

```
# build react
$ npm run build

# deploy Google App Engine
$ gcloud app deploy app/app.yaml
```

