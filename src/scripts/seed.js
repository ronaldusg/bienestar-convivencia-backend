const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Event = require('../models/Event');
const Route = require('../models/Route');
const Resource = require('../models/Resource');

const SALT_ROUNDS = 12;

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Promise.all([User.deleteMany({}), Event.deleteMany({}), Route.deleteMany({}), Resource.deleteMany({})]);

  // Users
  const passwordHash = await bcrypt.hash('Password123!', SALT_ROUNDS);
  const admin = await User.create({ name: 'Admin', email: 'admin@demo.edu', passwordHash, role: 'admin', faculty: 'General', nationality: 'CO', interests: ['Gestión', 'Cultura'] });
  const student1 = await User.create({ name: 'Student One', email: 'student1@demo.edu', passwordHash, role: 'student', faculty: 'Ingeniería', nationality: 'CO', interests: ['Tecnología', 'Cultura'] });
  const student2 = await User.create({ name: 'Student Two', email: 'student2@demo.edu', passwordHash, role: 'student', faculty: 'Artes', nationality: 'PE', interests: ['Bienestar'] });

  // Events
  const now = new Date();
  const addDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
  const events = await Event.insertMany([
    { title: 'Feria Cultural', category: 'Cultura', location: { name: 'Campus Central' }, startAt: addDays(2), endAt: addDays(2), capacity: 50, organizerId: admin._id, attendees: [] },
    { title: 'Jornada de Bienestar', category: 'Bienestar', location: { name: 'Campus Norte' }, startAt: addDays(5), capacity: 30, organizerId: admin._id, attendees: [] },
    { title: 'Taller de Tecnología', category: 'Tecnología', location: { name: 'Campus Sur' }, startAt: addDays(10), capacity: 20, organizerId: admin._id, attendees: [] }
  ]);

  // Routes
  const routes = await Route.insertMany([
    {
      title: 'Ruta Centro → Sur',
      driverId: student1._id,
      origin: { address: 'Centro' },
      meetingPoint: 'Puerta 1',
      destination: 'Campus Sur',
      dateTime: addDays(1),
      availableSeats: 3,
      passengers: []
    },
    {
      title: 'Ruta Norte → Central',
      driverId: student2._id,
      origin: { address: 'Barrio Norte' },
      meetingPoint: 'Parque',
      destination: 'Campus Central',
      dateTime: addDays(3),
      availableSeats: 2,
      passengers: []
    }
  ]);

  // Resources
  const resources = await Resource.insertMany([
    { title: 'Atención Psicológica', content: 'Contacta al centro de bienestar estudiantil.', type: 'resource', contact: { name: 'Bienestar', email: 'bienestar@demo.edu', phone: '+57 300 000 0000' }, visible: true },
    { title: 'Convocatoria Cultural', content: '¡Inscríbete a los talleres!', type: 'news', contact: { name: 'Cultura', email: 'cultura@demo.edu', phone: '+57 300 111 1111' }, visible: true }
  ]);

  console.log('Seed completed.');
  console.log('Admin login -> email: admin@demo.edu | password: Password123!');
  console.log('Students -> student1@demo.edu / student2@demo.edu | password: Password123!');
  console.log('Event IDs:', events.map(e => e._id.toString()));
  console.log('Route IDs:', routes.map(r => r._id.toString()));
  console.log('Resource IDs:', resources.map(r => r._id.toString()));

  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
