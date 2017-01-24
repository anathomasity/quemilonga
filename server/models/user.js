var mongoose = require('mongoose');
// var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var Userschema = new mongoose.Schema({
	first_name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	},
	fb_id: {
		type: String,
		required: true,
		index: {unique: true},
	},
	city_preference: {
		city: String,
		state: String,
		utc_offset: Number,
		coordinates: {
			lat: String,
			lng: String,
		},
	},
	performerId: String,
	_favorites: [{type: Schema.Types.ObjectId, ref: 'milonga'}],
	_attending: [{type: Schema.Types.ObjectId, ref: 'milonga'}],
	_class_favorites: [{type: Schema.Types.ObjectId, ref: 'class'}],
	_class_attending: [{type: Schema.Types.ObjectId, ref: 'class'}],
	_performers_following: [{type: Schema.Types.ObjectId, ref: 'performer'}],
},{timestamps:true});

// Userschema.methods.generateHash = function(password) {
//    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
// };

// // checking if password is valid
// Userschema.methods.validPassword = function(password) {
//     //console.log(" entered password " + this.generateHash(password) + " stored pass " + this.password);
//     valid = bcrypt.compareSync(password, this.password);
//     //console.log(" validPassword return " + valid)
//    return valid;
// };

// Userschema.pre('save', function(done) {
//    if (this.password.length > 15 && this.password.startsWith("$2a")){

//    } else {
//        this.password = this.generateHash(this.password);
//    }
//    done();
// });

mongoose.model('user', Userschema);
