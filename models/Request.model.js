const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema(
  {
    service: { 
      type: Schema.Types.ObjectId, 
      ref: 'Service' 
    },
    field: { 
      type: Schema.Types.ObjectId, 
      ref: 'Field' 
    },
    date: Date,
    transport: {
      type: Boolean,
      default: false
    },
    destination: String,
    description: String,
    reqOwner: { 
      type: Schema.Types.ObjectId, 
      ref: "Farmer" 
    },
    responses: [
      {
        type: Schema.Types.ObjectId, 
        ref: "Response"
      }
    ],
  },
  {
    timestamps: true
  }  
);

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;