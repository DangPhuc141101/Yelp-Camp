const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoding = mbxGeocoding({ accessToken : mapBoxToken });

module.exports.index = async (req, res) => {
    const page = parseInt(req.query.page);
    const pageSize = 20;

    Campground.find({})
        .skip(pageSize * (page - 1 ))
        .limit(pageSize)
        .then(camps =>{
            Campground.countDocuments({}, (err, total) =>{
                var numPage = Math.ceil(total / pageSize);
                res.render('campgrounds/index', {campgrounds : camps, numPage});
            })
        })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => { 
    console.log(req.body);
    const geoData = await geocoding.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const camp = new Campground(req.body.campground);   
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({url: f.path, filename: f.filename }));
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCampground = async (req, res) => {
    const {id} = req.params;
    try {
        const camp = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
        res.render('campgrounds/show', {camp});
    }
    catch(e){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
}

module.exports.renderEditForm = async (req, res) => {
    try{
        const { id } = req.params;
        const camp = await Campground.findById(id);
        res.render('campgrounds/edit', {camp});
    }
    catch(e){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
}

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true, new: true});
    const images = req.files.map(f => ({url: f.path, filename: f.filename }));
    campground.images.push(...images);
    await campground.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: {images: {filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated Camground!')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Camground!')
    res.redirect('/campgrounds');
}