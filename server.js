var express  = require( 'express' ),
    path     = require( 'path' ),
    root     = __dirname,
    port     = process.env.PORT || 8000,
    bp       = require('body-parser'),
    app      = express(),
    moment   = require('moment'),
    S3 = require('aws-sdk/clients/s3');
    AWS = require('aws-sdk');



//AWS S3 CONFIGURATIONS

AWS.config.loadFromPath('./config.json');

var s3 = new AWS.S3();




app.use( express.static( path.join( root, 'client' )));
app.use( express.static( path.join( root, 'bower_components' )));
app.use(bp.json())

require('./server/config/db.js');
require('./server/config/routes.js')(app);

app.listen( port, function() {
  console.log( 'server running on port ${ port }' );
});