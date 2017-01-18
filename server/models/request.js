var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new mongoose.Schema({
	type: String,
    fb_id: String,
    user: {type: Schema.Types.ObjectId, ref: 'user'},
    performer: {type: Schema.Types.ObjectId, ref: 'performer'},
},{timestamps:true});

mongoose.model('request', RequestSchema);