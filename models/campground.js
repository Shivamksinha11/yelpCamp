const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema=new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
});

const campgroundSchema = new Schema({
    title: String,
    images:[ImageSchema],
    price: Number,
    description: String,
    location:  String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}); 


campgroundSchema.post('findOneAndDelete', async function(doc) {     //to delete all the reviews when we delete the campground
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews  //the id field is in our document which is being deleted
            }
        })
    }
})

module.exports=mongoose.model('campground', campgroundSchema);