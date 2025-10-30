const mongoose = require('mongoose');
const { Schema } = mongoose;

const routeSchema = new Schema(
  {
    title: { type: String, required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    origin: {
      address: { type: String, required: true },
      lat: Number,
      lng: Number
    },
    meetingPoint: String,
    destination: { type: String, required: true },
    dateTime: { type: Date, required: true },
    availableSeats: { type: Number, required: true },
    passengers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

routeSchema.index({ dateTime: 1 });

const Route = mongoose.model('Route', routeSchema);
module.exports = Route;
