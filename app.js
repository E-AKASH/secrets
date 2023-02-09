const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const { response } = require("express")
const encrypt = require("mongoose-encryption")



mongoose.connect("mongodb://localhost:27017/appDataBase")

const app = express()

app.use(bodyParser.urlencoded({extended:true}))

app.set("view engine","ejs")

app.use(express.static("public"))

const devSchema = new mongoose.Schema({email:String,password:String})

const Devmodel = mongoose.model("Devmodel",devSchema)

const secret = "Thisisourlittlesecret"

devSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]})

app.get("/",function(req,res){
    res.render("home")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.post("/register",function(req,res){
    const newEntry = new Devmodel({
        email:req.body.username,
        password:req.body.password
    })

    newEntry.save(function(err){
        if(!err){
            res.render("secrets")
        }

        else{
            console.log(err)
        }
    })
})

app.post("/login",function(req,res){
    Devmodel.findOne({email:req.body.username},function(err,result){
        if(!err){
            if(req.body.password===result.password){
                res.render("secrets")
            }
            else{
                res.send("Incorrect Password")
            }
        }
        else{
            console.log(err)
        }
        
    })
})

app.listen(3000,function(){
    console.log("Server Started")
})