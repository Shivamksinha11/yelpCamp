const Campground = require('./models/campground');
const Review = require('./models/review');
const {campgroundSchema} = require('./models/campground');
const {reviewSchema} = require('./models/review');
const ExpressError=require('./utils/ExpressError');
const Joi=require('joi');
const {number}=require('joi');


module.exports.validateReview=(req,res,next)=>{          //section 46
    const reviewSchema=Joi.object({
        review: Joi.object({
           rating: Joi.number().required().min(1).max(5),
           body: Joi.string().required()
        }).required()
    })
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error','you must be signed in first!!');
        return res.redirect('/login');
    }
    next();
}
module.exports.validateCampground=(req,res,next)=>{
    const campgroundSchema=Joi.object({
        campground: Joi.object({
           title: Joi.string().required(),
           price: Joi.number().required().min(0),
           //image: Joi.string().required(),
           location: Joi.string().required(),
           description: Joi.string().required(),
        }).required(),
        deleteImages: Joi.array()
    })
    const {error}=campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}

module.exports.isAuthor= async(req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','you do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor= async(req,res,next)=>{
    const {id, reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','you do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

