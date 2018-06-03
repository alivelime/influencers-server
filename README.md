# influs
https://asagakita-170822.appspot.com/

## for developing

```
# go api server
$ dev_appserver.py app/app.yaml --host 0.0.0.0 --enable_host_checking 0 --port 3001

# run react (set package.json to "proxy":"http://localhost:3000" )
$ npm start

# access to http://ip.3000/
```

## for deploy

```
# build react
$ npm run build

# deploy Google App Engine
$ gcloud app deploy app/app.yaml
```

