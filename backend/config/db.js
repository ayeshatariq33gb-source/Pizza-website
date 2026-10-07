const mongoose = require('mongoose')
const Pizza = require('../models/Pizza')
const Category = require('../models/Category')
const SiteContent = require('../models/SiteContent')

const starterCategories = ['Classics', 'Signature', 'Veggie', 'Deals']

const starterPizzas = [
  { name: 'Margherita', category: 'Classics', description: 'San Marzano tomato, fior di latte, basil, extra virgin olive oil', price: 16, rating: 4.9, tag: 'Bestseller', image: 'photo-1579751626657-72bc17010498' },
  { name: 'Truffle Shuffle', category: 'Signature', description: 'Wild mushroom, black truffle cream, fontina, fresh thyme', price: 22, rating: 4.9, tag: 'House favorite', image: 'photo-1571407970349-bc81e7e96d47' },
  { name: 'Hot Honey Pepperoni', category: 'Signature', description: 'Cup-and-char pepperoni, whipped ricotta, Calabrian hot honey', price: 21, rating: 5, tag: 'A little heat', image: 'photo-1628840042765-356cda07504e' },
  { name: 'Garden Party', category: 'Veggie', description: 'Roasted zucchini, artichoke, olive, lemon, creamy mozzarella', price: 19, rating: 4.8, tag: 'Plant-forward', image: 'photo-1513104890138-7c749659a591' },
  { name: 'The Sunday Sausage', category: 'Classics', description: 'Fennel sausage, slow-roasted tomato, pecorino, oregano', price: 20, rating: 4.8, tag: 'Comfort food', image: 'photo-1604382355076-af4b0eb60143' },
  { name: 'The Green Goddess', category: 'Veggie', description: 'Pesto, stracciatella, asparagus, basil, toasted pistachio', price: 20, rating: 4.9, tag: 'Seasonal', image: 'photo-1593560708920-61dd98c46a4e' },
  { name: 'Pizza Night Bundle', category: 'Deals', description: 'Two pizzas, a house salad, and something sweet', price: 48, rating: 5, tag: 'Bundle', image: 'photo-1571407970349-bc81e7e96d47' },
]

async function connectDatabase() {
  await mongoose.connect(process.env.MONGODB_URI)
  await Category.bulkWrite(starterCategories.map((name) => ({ updateOne: { filter: { name }, update: { $setOnInsert: { name } }, upsert: true } })))
  await SiteContent.updateOne({ key: 'main' }, { $setOnInsert: { key: 'main' } }, { upsert: true })
  if (await Pizza.countDocuments() === 0) await Pizza.insertMany(starterPizzas)
  console.log(`MongoDB connected: ${mongoose.connection.name}`)
}

module.exports = connectDatabase