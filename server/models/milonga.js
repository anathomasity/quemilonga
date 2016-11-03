var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MilongaSchema = new mongoose.Schema({
    date: String,
    title: String,
    start_time: String,
    end_time: String,
    _performers: [{type: Schema.Types.ObjectId, ref: 'performer'}],
    price: Number,
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
    class_start_time: String,
    class_end_time: String,
    _class_teachers: [{type: Schema.Types.ObjectId, ref: 'performer'}],
    class_price: Number,
    class_combo_price: Number,
    details: String,
    _added_by: {
        name: String,
        login_type: String,
        id: String,
    },
    event_type : {
      type : String,
      default: 'milonga',
    },
},{timestamps:true});

mongoose.model('milonga', MilongaSchema);
// Validations
MilongaSchema.path('date').required(true, 'Date cannot be blank');
MilongaSchema.path('title').required(true, 'Title cannot be blank');
MilongaSchema.path('start_time').required(true, 'Start time cannot be blank');
MilongaSchema.path('address.st_number').required(true, 'st_number error');

