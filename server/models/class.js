var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClassSchema = new mongoose.Schema({
    date: String,
    class_start_time: String,
    class_end_time: String,
    address: {
        details: String,
    	st_number: Number,
    	st_name: String,
    	city: String,
    	state: String,
    	zip_code: Number,
    	country: String,
        coords: {
            lat: Number,
            lng: Number
        },
    },
    _class_teachers: [{type: Schema.Types.ObjectId, ref: 'performer'}],
    class_price: Number,
    topic: String,
    details: String,
    _added_by: {
        name: String,
        login_type: String,
        id: String,
    },
},{timestamps:true});

mongoose.model('class', ClassSchema);

// Validations
ClassSchema.path('date').required(true, 'Date cannot be blank');
ClassSchema.path('class_start_time').required(true, 'Start time cannot be blank');
ClassSchema.path('class_end_time').required(true, 'END time cannot be blank');
ClassSchema.path('address.st_number').required(true, 'st_number error');
ClassSchema.path('_class_teachers').required(true, 'CLASS TEACHERS cannot be blank');

