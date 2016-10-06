var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new mongoose.Schema({
    user: {
    	name: String,
    	id: String,
    	first_name: String,
    	last_name: String,
    },
    dancer_name: String,
	dancer_from: String,
},{timestamps:true});

mongoose.model('request', RequestSchema);