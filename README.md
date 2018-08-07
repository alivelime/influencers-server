# influs
This site is or some of stuff.
https://influs.link

## for developing

info: Run react and go api, in development React server is main.
React port:3000
	webserver
	proxy api (like http://localhost:3000/api/...) -> http://localhost:3001/api/...
	set package.json (proxy)
Go API port:3001
	api server

caution: if you access http://localhost:3000/api/... by browser in directory,
You could get 404 not found. Because npm server doesn't proxy.

```
# set env and secret.key
.env.development
app/secret_dev.yaml

# go api server
$ dev_appserver.py app/dev.yaml --host 0.0.0.0 --enable_host_checking 0 --port 3001

# run react (set package.json to "proxy":"http://localhost:3000" )
$ npm start

# access to http://ip.3000/
```

## for deploy

info: In production, GAE handles request.
set app/prod.yaml

```
# set env and secret.key
.env.production
app/secret_prod.yaml

# build react
$ npm run build

# deploy Google App Engine
$ gcloud app deploy app/prod.yaml
```

