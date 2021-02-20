const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const fieldSchema = new Schema(
  {
    fieldName: String,
    polygon: String,
    location: String,
    size: Number,
    serviceHistory: [
      {
          service: {
            type: Schema.Types.ObjectId,
            ref: 'Service'
          },
          date: Date
      }
    ],
  },
  {
    timestamps: true
  }
);

const Field = mongoose.model("Field", fieldSchema)
module.exports = Field;