const Event = require('../models/Event');
const { events: defaultEvents } = require('../data/defaultData');

async function ensureEvents() {
  const count = await Event.countDocuments();
  if (count === 0) {
    await Event.insertMany(defaultEvents);
  }
}

async function getEvents(req, res, next) {
  try {
    await ensureEvents();
    const events = await Event.find({}, { title: 1, slug: 1, description: 1, image: 1, date: 1, deadline: 1, participants: 1, prizes: 1 }).sort({ date: 1 });

    return res.status(200).json({ message: 'Events fetched successfully', data: events });
  } catch (error) {
    console.error('getEvents error:', error);
    return next(error);
  }
}

async function getEventById(req, res, next) {
  try {
    await ensureEvents();
    const event = await Event.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json({ message: 'Event fetched successfully', data: event });
  } catch (error) {
    console.error('getEventById error:', error);
    return next(error);
  }
}

async function createEvent(req, res, next) {
  try {
    const { title, description, date, deadline, participants = 0, image = '', prizes = [] } = req.body;

    if (!title || !description || !date || !deadline) {
      return res.status(400).json({ message: 'title, description, date, and deadline are required' });
    }

    const slug = String(title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      date,
      deadline,
      participants: Number(participants) || 0,
      image: image.trim(),
      prizes: Array.isArray(prizes) ? prizes : [],
      slug,
    });

    return res.status(201).json({ message: 'Event created successfully', data: event });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An event with this slug already exists' });
    }

    console.error('createEvent error:', error);
    return next(error);
  }
}

async function registerEvent(req, res, next) {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'eventId is required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const alreadyRegistered = event.registrations.some((registration) => String(registration.user) === String(req.user.id));
    if (alreadyRegistered) {
      return res.status(200).json({ message: 'You are already registered', data: event });
    }

    event.registrations.push({ user: req.user.id, registeredAt: new Date() });
    event.participants += 1;
    await event.save();

    return res.status(200).json({ message: 'Event registration successful', data: event });
  } catch (error) {
    console.error('registerEvent error:', error);
    return next(error);
  }
}

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  registerEvent,
};