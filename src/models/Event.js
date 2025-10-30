const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    location: {
      name: { type: String, required: true },
      lat: Number,
      lng: Number
    },
    startAt: { type: Date, required: true },
    endAt: Date,
    capacity: Number,
    organizerId: { type: Schema.Types.ObjectId, ref: 'User' },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

eventSchema.index({ category: 1 });
eventSchema.index({ startAt: 1 });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
