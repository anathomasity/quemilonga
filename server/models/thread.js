var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ThreadSchema = new mongoose.Schema({
    title: String,
    content: String,
    _comments: [{type: Schema.Types.ObjectId, ref: 'comment'}],
    _user: {type: Schema.Types.ObjectId, ref: 'user'},
    views : Number,
},{timestamps:true});

mongoose.model('thread', ThreadSchema);
// Validations
ThreadSchema.path('title').required(true, 'title cannot be blank');
ThreadSchema.path('content').required(true, 'content cannot be blank');
ThreadSchema.path('_user').required(true, 'USER cannot be blank');


