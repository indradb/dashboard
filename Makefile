.PHONY: run
default: run

node_modules:
	npm install

static/lib: node_modules
	mkdir static/lib
	cp ./node_modules/graphiql/graphiql.css static/lib
	cp ./node_modules/graphiql/graphiql.js static/lib
	cp ./node_modules/whatwg-fetch/fetch.js static/lib
	cp ./node_modules/react/umd/react.production.min.js static/lib
	cp ./node_modules/react-dom/umd/react-dom.production.min.js static/lib
	cp ./node_modules/es6-promise/dist/es6-promise.auto.min.js static/lib

static/index.js: node_modules
	./node_modules/.bin/babel jsx/index.jsx --presets react --out-file static/index.js

run: static/lib static/index.js
	node index.js
