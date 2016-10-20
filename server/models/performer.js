var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PerformerSchema = new mongoose.Schema({
    name: String,
    from: String,
    _milongas_attending: [{
    	milonga: [
    	{	type: Schema.Types.ObjectId, 
    		ref: 'milonga',
    		index: {unique: true},
    	}],
    	action: String,
    }],
    _user: {type: Schema.Types.ObjectId, ref: 'user'}
},{timestamps:true});

mongoose.model('performer', PerformerSchema);
// Validations
PerformerSchema.path('name').required(true, 'Names cannot be blank');
PerformerSchema.path('from').required(true, 'Please enter the city of origin');

