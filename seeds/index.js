const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log('mongo connection open!!!');
})
.catch(err=>{
    console.log('Oh no mongo connection error!!!!');
    console.log(err);
})

const sample = (array)=> array[Math.floor(Math.random() * array.length)];

const seedDB= async ()=>{
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000= Math.floor(Math.random() * 1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '604625bb1ad4a24b28f2d1b5',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: '  Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit eos eaque at officia expedita, libero repellendus magni aperiam corrupti ad ab tenetur soluta consequuntur reiciendis porro nesciunt consectetur adipisci a.',
            price:  price,
            images: [
             
                {
                    url: 'https://res.cloudinary.com/dh9sgaklf/image/upload/v1615891551/yelpCamp/j7w015idyvrwtkonjgt0.jpg',
                    filename: 'yelpCamp/j7w015idyvrwtkonjgt0'
                  }
              ]
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
});