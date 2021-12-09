const mongoose = require('mongoose')
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema ({
    url: String,
    filename: String
})

// https://res.cloudinary.com/duy-t-n/image/upload/w_200/v1637834398/YelpCamp/jskii6ieit1nzt2egpkd.jpg
ImageSchema.virtual('thumb').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})  

const CampgroundSchema = new Schema ({
    location: String,
    title: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    price: Number,
    description: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, { toJSON : { virtuals: true }});

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>`;
})  


CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
            await Review.deleteMany({
                _id: {
                    $in: doc.reviews
                }
            })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);