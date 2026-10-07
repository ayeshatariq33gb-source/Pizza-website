const mongoose = require('mongoose')

const siteContentSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'main' },
  hero: {
    eyebrow: { type: String, default: 'NEAPOLITAN SOUL. NEIGHBORHOOD HEART.' },
    title: { type: String, default: 'Good pizza makes everything better.' },
    description: { type: String, default: 'Slow-fermented dough, the good stuff on top, and a little extra love in every box. Your new favorite is just around the corner.' },
    image: { type: String, default: 'photo-1513104890138-7c749659a591' },
    imageAlt: { type: String, default: 'Freshly baked artisan pizza topped with basil and melted cheese' },
    proof: { type: String, default: 'Loved by 2,000+ local pizza people' },
  },
  about: {
    eyebrow: { type: String, default: 'A SMALL OVEN WITH BIG FEELINGS' },
    title: { type: String, default: 'We believe in the long way.' },
    paragraphs: { type: [{ type: String, maxlength: 500 }], default: [
      'Good pizza can’t be rushed. So we give our dough 48 hours to become something special, source produce from people we know, and make every pie like we’re sharing it with friends.',
      'That’s how Crust & Co. started: a tiny oven, a few folding chairs, and a stubborn belief that dinner can make your day.',
    ] },
    values: { type: [{ type: String, maxlength: 500 }], default: [
      '01|✳|Time is an ingredient.|Our dough rests for 48 hours. Better flavor, happier stomachs, worth the wait.',
      '02|⌁|Good things, nearby.|Seasonal produce and dairy from farms and makers right around the corner.',
      '03|♡|Made like we mean it.|Every pie is stretched, topped, and baked by hand. You can taste the difference.',
      '04|↗|At your door, still lovely.|Insulated bags, nearby drivers, and the shortest route from our oven to your table.',
    ] },
    valuesEyebrow: { type: String, default: 'The Crust & Co. difference' },
    valuesTitle: { type: String, default: 'The little things taste different.' },
    image: { type: String, default: 'photo-1556909114-f6e7ad7d3136' },
    imageAlt: { type: String, default: 'A cook preparing fresh ingredients in the kitchen' },
    caption: { type: String, default: 'A little flour, a lot of feeling.' },
  },
  offer: {
    eyebrow: { type: String, default: 'A LITTLE SOMETHING EXTRA' },
    title: { type: String, default: 'Pizza night. Sorted.' },
    description: { type: String, default: 'Make it a proper night in. Get two of our 12-inch pizzas, a crisp little salad, and something sweet for the table.' },
    image: { type: String, default: 'photo-1571407970349-bc81e7e96d47' },
    imageAlt: { type: String, default: 'A table set for pizza night' },
    label: { type: String, default: 'THE GOOD KIND OF LEFTOVERS' },
    footnote: { type: String, default: 'Available every day, because every day deserves pizza.' },
    originalPrice: { type: Number, default: 56, min: 0 },
    serves: { type: String, default: 'Feeds 2–3' },
  },
  contact: {
    eyebrow: { type: String, default: 'SAY HEY, COME BY, OR ORDER IN' },
    title: { type: String, default: 'There’s always room at our table.' },
    description: { type: String, default: 'Whether you’ve got a question, a kind word, or a very specific pizza request, we’re listening.' },
    addressLabel: { type: String, default: 'Come find us' },
    address: { type: String, default: '214 Orchard Street, Brooklyn, NY 11211' },
    hoursLabel: { type: String, default: 'Oven’s on' },
    hours: { type: String, default: 'Every day, 11:30am – 10pm' },
    phone: { type: String, default: '(718) 555-0147' },
    responseTime: { type: String, default: 'We usually reply within a day.' },
  },
}, { timestamps: true })

module.exports = mongoose.model('SiteContent', siteContentSchema)