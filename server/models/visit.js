var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitSchema = new mongoose.Schema({
    coordinates: {
    	type: String,
    },
},{timestamps:true});

mongoose.model('visit', VisitSchema);
