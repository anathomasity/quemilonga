var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new mongoose.Schema({
    content: String,
    _user: {type: Schema.Types.ObjectId, ref: 'user'},
    youtubeLink : String,
},{timestamps:true});

mongoose.model('comment', CommentSchema);
// Validations
CommentSchema.path('content').required(true, 'content cannot be blank');
CommentSchema.path('_user').required(true, 'USER cannot be blank');


