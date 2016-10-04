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
		required: true
	},
	password: {
		type: String,
		required: true
	},
	_milongas_added: [{type: Schema.Types.ObjectId, ref: 'milonga'}],
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
