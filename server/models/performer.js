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
},{timestamps:true});

mongoose.model('performer', PerformerSchema);
// Validations
PerformerSchema.path('name').required(true, 'Names cannot be blank');
PerformerSchema.path('from').required(true, 'Please enter the city of origin');

