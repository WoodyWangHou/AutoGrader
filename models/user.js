var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),

    assignments = require('./assignment');

var user_schema = new schema({
  //username needs to be matric number; add verification method afterwards
	username:{
		type: String,
		unique: true,
		required:true
	},
	first_name:String,
	last_name: String,
	enrollment_year: Number,
  	is_instructor:{
	    type: Boolean,
	    default: false
  	},
  	assignments:[{
		type: schema.Types.ObjectId,
		ref: 'assignment'
  	}]
},{
	timeStamps: true
});
//plugin passportlocalstrategy to User schema
user_schema.plugin(passportLocalMongoose);
//expose user model
module.exports = mongoose.model('user', user_schema);
