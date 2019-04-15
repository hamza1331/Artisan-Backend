//Imports
const express = require('express')
const app = express()
const process = require('process')
const bodyParser = require('body-parser')
const User = require('./models/User')
const mongoose = require('mongoose')
const Listings = require('./models/Listings')
const Activity = require('./models/ProfileActivity')
const Shipping = require('./models/Shipping')
const Category = require('./models/Categories')
const port = process.env.PORT || 8000
app.use(bodyParser.json())  //Body Parser MiddleWare
app.use(express.json())
mongoose.connect('mongodb://demo:demo123@ds137441.mlab.com:37441/artisan',{useNewUrlParser:true}) //MongoDB connection using Mongoose
var db = mongoose.connection //Mongo Connection Instance
db.on('open',()=>console.log('database connected'))
app.get('/',function(req,res){  //HomePage for API
    res.json({message:'Welcome'})
})

app.post('/api/addUser',(req,res)=>{
    const user = req.body
    User.create(user,(err,doc)=>{
        if(err){
            res.json(err).status(500)
        }
        console.log(doc._id)
        Activity.create({firebaseUID:doc.firebaseUID})
        res.json({
            message:"Success",
            user:doc
        }).status(200)
    })
})
app.put('/api/login',(req,res)=>{
    const firebaseUID = req.body
    User.findOneAndUpdate(firebaseUID,{$set:{isLoggedIn:true}},{new:true},(err,doc)=>{
        if(err)res.json(err).status(500)
        res.json({
            message:'Success',
            user:doc
        }).status(200)
    })
})
app.put('/api/logout',(req,res)=>{
    const firebaseUID = req.body
    User.findOneAndUpdate(firebaseUID,{isLoggedIn:false},{new:true},(err,doc)=>{
        if(err)res.json(err).status(500)
        res.json({
            message:'Success',
            user:doc
        }).status(200)
    })
})
app.post('/api/addListing',(req,res)=>{
    const data = req.body
    Listings.create(data,(err,doc)=>{
        if(err)res.json(err).status(500)
        Activity.findOneAndUpdate({firebaseUID:doc.firebaseUID},{$push:{onSale:doc._id}},{new:true},(err,docs)=>{
               
        })
        res.json({
            message:'Success',
            data:doc
        }).status(200)
    })
})
app.get('/api/getListings:page',(req,res)=>{
    const query = Object.assign({},req.body)
    console.log(query)    
    var perPage = 10
    var page = req.params.page || 1
   if(query.hasOwnProperty("minPrice")){
     delete query.minPrice
     delete query.maxPrice
     console.log(req.body)
    Listings.find({...query,price:{
        $lte:req.body.maxPrice,
        $gte:req.body.minPrice
    }}).skip((perPage*page)-perPage).limit(perPage).exec((err,data)=>{
        Listings.estimatedDocumentCount().exec((err, count) => {
            if (err) return res.json({message:err})
            res.json({
                data,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        })
    })
   }
   else
   {
    Listings.find(query).skip((perPage*page)-perPage).limit(perPage).exec((err,data)=>{
        Listings.estimatedDocumentCount().exec((err, count) => {
            if (err) return res.json({message:err})
            res.json({
                data,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        })
    })  
   }
})
app.get('/api/getShipping',(req,res)=>{
    Shipping.findOne({firebaseUID:req.body.firebaseUID},(err,docs)=>{
        if(err)res.json(err).status(500)
        res.json({
            message:"Success",
            data:docs
        })
    })
})
app.post('/api/addShipping',(req,res)=>{
    Shipping.findOne({firebaseUID:req.body.firebaseUID},(err,docs)=>{
        if(err)res.json(err).status(500)
        if(docs===null){    //insert
            let data = req.body
            Shipping.create(data,(err,docs)=>{
                if(err)res.json(err).status(500)
                res.json({
                    message:"Success",
                    data:docs
                }).status(200)
            })
        }
        else{           //update
            let data = req.body
            Shipping.findOneAndUpdate({firebaseUID:req.body.firebaseUID},data,{new:true},(err,doc)=>{
                if(err)res.json(err).status(500)
                res.json({
                    message:"Success",
                    data:doc
                })
            })
        }
    })
})
app.get('/api/getProfile',(req,res)=>{
    User.findOne({firebaseUID:req.body.firebaseUID},(err,doc)=>{
        if(err)res.json(err).status(500)
        let data = doc
        Activity.findOne({firebaseUID:req.body.firebaseUID},(err,docs)=>{
            if(err)res.json(err).status(500)
            console.log(data)
           let userData =  {
               data,docs
           }
            res.json({
                message:'Success',
                user:userData
            }).status(200)
        })
    })
})
app.post('/api/addCategory',(req,res)=>{
    Category.create(req.body,(err,docs)=>{
        if(err)res.json(err).status(500)
        res.json({
            message:"Success",
            category:docs
        })
    })
})
app.post('/api/addSubCategory',(req,res)=>{
    Category.findOneAndUpdate({_id:req.body.id},{$push:{subCategories:req.body.subCategory}},{new:true},(err,docs)=>{
        if(err)res.json(err).status(500)
        res.json({
            message:"Success",
            data:docs
        })
    })
})
app.delete('/api/deleteCategory',(req,res)=>{
    Category.findByIdAndRemove(req.body.id,(err,doc)=>{
        if(err)res.json(err).status(500)
        res.json({
            message:"Success",
            data:doc
        })
    })
})
app.put('/api/addFavorite',(req,res)=>{
    Activity.findOneAndUpdate({firebaseUID:req.body.firebaseUID},{$push:{Favorites:req.body.id}},{new:true},(err,docs)=>{
               if(err)res.json(err).status(500)
               res.json({
                   message:"Success",
                   data:docs
               })
    })
})
//Server
app.listen(port,function(){
    console.log('Listening on port'+port)
})

