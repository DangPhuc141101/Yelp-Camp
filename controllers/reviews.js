const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Successfully made a new review!')
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteReview = async (req, res) =>{
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndUpdate(id, { $pull: {reviews : reviewId}});  // remove Reivew have reviewId in Campground.reviews
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted new review!')
    res.redirect(`/campgrounds/${id}`);
} 