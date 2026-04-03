const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3030;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/dealershipsdb';

// ── Schemas ──────────────────────────────────────────────────────────────────

const dealerSchema = new mongoose.Schema({
  id: Number,
  full_name: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  phone: String,
  short_name: String,
});

const reviewSchema = new mongoose.Schema({
  user_id: Number,
  name: String,
  dealership: Number,
  review: String,
  purchase: Boolean,
  purchase_date: String,
  car_make: String,
  car_model: String,
  car_year: Number,
  time: { type: Date, default: Date.now },
});

const Dealer = mongoose.model('Dealer', dealerSchema);
const Review = mongoose.model('Review', reviewSchema);

// ── Routes ────────────────────────────────────────────────────────────────────

// Fetch all dealers
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealer.find({});
    res.json(dealers);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Fetch dealers by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const dealers = await Dealer.find({ state: req.params.state });
    res.json(dealers);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Fetch single dealer
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealer = await Dealer.findOne({ id: parseInt(req.params.id) });
    res.json(dealer || {});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Fetch reviews for a dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ dealership: parseInt(req.params.id) }).sort({ time: -1 });
    res.json(reviews);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Insert review
app.post('/insertReview', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.json({ status: 200, message: 'Review added' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Sentiment analysis (simple keyword-based)
app.get('/analyze-review', (req, res) => {
  const text = (req.query.text || '').toLowerCase();
  const positive = ['great','good','excellent','fantastic','amazing','love','best','wonderful','happy','satisfied','perfect'];
  const negative = ['bad','terrible','awful','horrible','worst','hate','poor','disappointed','broken','rude','slow'];
  let score = 0;
  positive.forEach(w => { if (text.includes(w)) score++; });
  negative.forEach(w => { if (text.includes(w)) score--; });
  const sentiment = score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
  res.json({ sentiment });
});

// ── Seed data ─────────────────────────────────────────────────────────────────

async function seedData() {
  const count = await Dealer.countDocuments();
  if (count > 0) return;

  const states = ['Alabama','Alaska','Arizona','California','Colorado','Florida','Georgia',
    'Illinois','Kansas','Michigan','New York','Ohio','Texas','Washington'];
  const dealers = [];
  let id = 1;
  for (const state of states) {
    for (let i = 0; i < 3; i++) {
      dealers.push({
        id: id++,
        full_name: `Best Cars ${state} #${i+1}`,
        short_name: `BC-${state.substring(0,2).toUpperCase()}-${i+1}`,
        address: `${100+i*10} Main Street`,
        city: ['Springfield','Riverside','Fairview'][i],
        state,
        zip: `${10000 + id}`,
        phone: `+1-800-555-${String(id).padStart(4,'0')}`,
      });
    }
  }
  await Dealer.insertMany(dealers);
  console.log(`Seeded ${dealers.length} dealers`);

  // Seed some reviews
  const reviews = [
    { user_id:1, name:'Alice Smith', dealership:1, review:'Fantastic service! Highly recommend.', purchase:true, purchase_date:'2024-01-15', car_make:'Toyota', car_model:'Camry', car_year:2023, time: new Date() },
    { user_id:2, name:'Bob Jones', dealership:1, review:'Good experience overall.', purchase:false, purchase_date:'', car_make:'', car_model:'', car_year:0, time: new Date() },
    { user_id:3, name:'Carol White', dealership:2, review:'Terrible customer service, very disappointed.', purchase:true, purchase_date:'2024-03-10', car_make:'Honda', car_model:'Civic', car_year:2022, time: new Date() },
  ];
  await Review.insertMany(reviews);
  console.log('Seeded sample reviews');
}

// ── Start ─────────────────────────────────────────────────────────────────────

mongoose.connect(MONGO_URL)
  .then(async () => {
    console.log('MongoDB connected');
    await seedData();
    app.listen(PORT, () => console.log(`Database service running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    console.log('Starting without MongoDB (in-memory fallback)...');
    startWithFallback();
  });

// In-memory fallback when MongoDB is unavailable
function startWithFallback() {
  const dealers = generateFallbackDealers();
  const reviews = generateFallbackReviews();

  app.get('/fetchDealers', (req, res) => res.json(dealers));
  app.get('/fetchDealers/:state', (req, res) => res.json(dealers.filter(d => d.state === req.params.state)));
  app.get('/fetchDealer/:id', (req, res) => res.json(dealers.find(d => d.id === parseInt(req.params.id)) || {}));
  app.get('/fetchReviews/dealer/:id', (req, res) => res.json(reviews.filter(r => r.dealership === parseInt(req.params.id))));
  app.post('/insertReview', (req, res) => { reviews.unshift({...req.body, time: new Date()}); res.json({status:200}); });

  app.listen(PORT, () => console.log(`Database service (fallback) running on port ${PORT}`));
}

function generateFallbackDealers() {
  const states = ['Alabama','Alaska','Arizona','California','Colorado','Florida','Georgia',
    'Illinois','Kansas','Michigan','New York','Ohio','Texas','Washington'];
  const dealers = [];
  let id = 1;
  for (const state of states) {
    for (let i = 0; i < 3; i++) {
      dealers.push({ id: id++, full_name: `Best Cars ${state} #${i+1}`, short_name: `BC${id}`,
        address: `${100+i*10} Main St`, city: ['Springfield','Riverside','Fairview'][i],
        state, zip: `${10000+id}`, phone: `+1-800-555-${String(id).padStart(4,'0')}` });
    }
  }
  return dealers;
}

function generateFallbackReviews() {
  return [
    { user_id:1, name:'Alice Smith', dealership:1, review:'Fantastic service!', purchase:true, purchase_date:'2024-01-15', car_make:'Toyota', car_model:'Camry', car_year:2023, time: new Date() },
    { user_id:2, name:'Bob Jones', dealership:1, review:'Good experience overall.', purchase:false, purchase_date:'', car_make:'', car_model:'', car_year:0, time: new Date() },
  ];
}
