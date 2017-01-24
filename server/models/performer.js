var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PerformerSchema = new mongoose.Schema({
    name: String,
    from: String,
    _milongas_attending: [{
    	milonga: [
    	{	type: Schema.Types.ObjectId, 
    		ref: 'milonga',
    	}],
        class: [
        {   type: Schema.Types.ObjectId, 
            ref: 'class',
        }],
    	action: String,
    }],
    _user: {type: Schema.Types.ObjectId, ref: 'user'},
    pending : {
        type : Boolean,
        default: true,
    },
    requested_by: {
        _id:String,
        fb_id: String,
        first_name: String,
        last_name: String,
    },
    fb_id: String,
    userId: String,
    introduction: String,
    _partner: {
        _id: {type: Schema.Types.ObjectId, ref: 'performer'},
        name: String,
    },
    youtubeLink: String,
    _favorite_dancers: [{
        _id: {type: Schema.Types.ObjectId, ref: 'performer'},
        name: String,
    }],
    _comments: [{type: Schema.Types.ObjectId, ref: 'comment'}],
    _followers: [{type: Schema.Types.ObjectId, ref: 'user'}],
    _endorsers: [{type: Schema.Types.ObjectId, ref: 'user'}],
    destinations: [{
            city: String,
            lat: Number,
            lng: Number,
            start_date: String,
            end_date: String,
        }]

},{timestamps:true});

mongoose.model('performer', PerformerSchema);
// Validations
PerformerSchema.path('name').required(true, 'Names cannot be blank');

