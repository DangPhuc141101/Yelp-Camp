const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoding = mbxGeocoding({ accessToken : 'pk.eyJ1IjoiZGFuZ3BodWMiLCJhIjoiY2t3cDFzMGh6MDhocTJyazBhMnZ3Y3BuNSJ9.QA1VaJarRhGuLO-4kxlNdg' });

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log('Database connected');
})

const myRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomPrice = () => Math.floor(Math.random() * 10 +1 ) * 100;

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i=0; i<300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const location = `${cities[random1000].city}, ${cities[random1000].state}`;
        const geoData = await geocoding.forwardGeocode({
            query: location,
            limit: 1
        }).send()
        
        const camp = new Campground({
            author: '61985da721a25eda3d9bcfad',
            geometry: geoData.body.features[0].geometry,
            location : location,
            title : `${myRandom(descriptors)}, ${myRandom(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem atque repudiandae quasi nostrum laborum facilis reiciendis, magni illo. Quod aliquid excepturi itaque. Quis repudiandae mollitia, aspernatur dolor saepe nihil blanditiis.',
            price: randomPrice(),
            images: [
                {
                    url: 'https://res.cloudinary.com/duy-t-n/image/upload/v1637834390/YelpCamp/b9qfhvaaiyrcwf6adoev.jpg',
                    filename: 'YelpCamp/b9qfhvaaiyrcwf6adoev',
                  },
                  {
                    url: 'https://res.cloudinary.com/duy-t-n/image/upload/v1637834398/YelpCamp/jskii6ieit1nzt2egpkd.jpg',
                    filename: 'YelpCamp/jskii6ieit1nzt2egpkd',
                  }
            ]
        })
        await camp.save();
    }
    console.log('COMPLETE!!!');
}

seedDB();