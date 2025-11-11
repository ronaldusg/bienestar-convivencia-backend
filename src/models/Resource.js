const mongoose = require('mongoose');
const { Schema } = mongoose;

const resourceSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    // type: { type: String, enum: ['news', 'resource'], default: 'resource' },
    type: {
      type: String,
      enum: ['Salud', 'Académico', 'Financiero', 'Desarrollo', 'Cultura'],
      required: true,
    },
    contact: {
      name: String,
      email: String,
      phone: String
    },
    visible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
