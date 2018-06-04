var path = require('path');
var express = require('express');
var proxy = require('express-http-proxy');

var port = process.env.PORT || 27615;
var graphqlEndpoint = process.env.GRAPHQL_ENDPOINT || 'localhost:8000';

var app = express();
app.use(express.static(path.join(__dirname, 'static')));
app.use('/graphql', proxy(graphqlEndpoint, {
    proxyReqPathResolver: function() {
        return '/graphql';
    }
}));
app.listen(port);
console.log(`Listening on port ${port}`);
