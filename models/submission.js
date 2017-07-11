var mongoose = require('mongoose');
var schema = mongoose.Schema;

var assignment = require('./assignment');
var evaluation = require('./evaluation');

var submission_schema = new schema({
	formulation:[{
		ingredient_name:String,
		official_quantity:Number,
		used_quantity:Number,
		actual_quantity_weighted:Number,
		signature:String
	}],
	calculation: String,
	method:String,
	packing:String,
	// storage, main and auxi is reference to url. Represented in String
	storage:String,
	main: String,
	Auxiliary: String,
	submission_date:Date,
	status:{
		type:String,
		required:true,
		default:"new",
		enum:["new","updated","submitted","evaluated"]
	},
	evaluation:{
		type:schema.Types.ObjectId,
		ref:'evaluation'
	},
	assignment:{
		type:schema.Types.ObjectId,
		ref:'assignment',
		required:true
	}
},{
	timeStamps: true
});
//creating the model of dish
var submission = mongoose.model('submission',submission_schema);
// make this available to Node application
module.exports = submission;
