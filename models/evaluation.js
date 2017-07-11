var mongoose = require('mongoose');
var schema = mongoose.Schema;

var user = require('./user');

var evaluation_schema = new schema({
	scores:{
		formulation:Number,
		calculation:Number,
		method:Number,
		packing:Number,
		storageLabel:Number,
		mainLabel:Number,
		auxLabel:Number
	},
	comments:{
		formulation:String,
		calculation:String,
		method:String,
		packing:String,
		storageLabel:String,
		mainLabel:String,
		auxLabel:String
	},
	evaluatedBy:{
		type: schema.Types.ObjectId,
		ref: 'user',
		required:true
	}
},{
	timeStamps: true
});
//creating the model of dish
var evaluation = mongoose.model('evaluation',evaluation_schema);
// make this available to Node application
module.exports = evaluation;
