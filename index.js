// const express = require("express"); // "type": "commonjs"
import express, { request, response } from "express"; // "type": "module"
const app = express();
import bcrypt, { hash } from "bcrypt";
import cors from 'cors';
import { MongoClient } from "mongodb";
import  jwt  from "jsonwebtoken";
import { authe } from "./middleware/auth.js";
import multer from "multer";
import path from "path";

const PORT = 4000;

app.use(express.json({ limit: '10mb' }));
app.use(cors());


const mongo_url = "mongodb://127.0.0.1";


export const client = new MongoClient(mongo_url); // dial
await client.connect(); // call and top level await
console.log("mongodb is connected ");





app.get("/Triplist", async function (request, response) {
  const list= await client
  .db("Tripdb")
  .collection("addlist")
  .find({})
  .toArray();
  response.send(list);
});

app.get("/Updatelist", async function (request, response) {
  const list= await client
  .db("Tripdb")
  .collection("updatelist")
  .find({})
  .toArray();
  response.send(list);
});



app.post("/Add_trip",async function (req, response) {
  const {trip_name,status,description,image}= req.body;
  
  const results = await Add_trip({
      trip_name: trip_name,
      status:      status,
      description: description,
      image: image,
      
  });
  response.send(results);
});
app.post("/update_trip",async function (req, response) {
  const {trip_name,city,str_date,end_date,route,website,budjet,member,command}= req.body;
  
  const results = await Update_trip({
      trip_name: trip_name,
      city:      city,
      str_date:      str_date,
      end_date:      end_date,
      route:      route,
      website:      website,
      budjet:      budjet,
      member:      member,
      command:      command,
      
  });
  response.send(results);
});

async function Add_trip(data) {
  return await client
    .db("Tripdb")
    .collection("addlist")
    .insertOne(data);
}

async function Update_trip(data) {
  return await client
    .db("Tripdb")
    .collection("updatelist")
    .insertOne(data);
}


app.post("/signup", async function (request, response) {
  const {name, email, new_pass}= request.body;
  const userfrondb = await getUsername(name);
  if(userfrondb){
    response.status(400).send({message:"username alreadyy exit"})
  } else{
    const hashedpassword = await gen_password(new_pass);
    const result = await createUsers({
      username: name,
      Email: email,
      password: hashedpassword,
      
    });
    response.send(result);
  }
 
});
app.post("/login", async function (request, response) {
  const {name, password}= request.body;
  const userfrondb = await getUsername(name);
  if(!userfrondb){
    response.status(400).send({message:"invalid credentials"})
  }else{
    const storedpassword =  userfrondb.password;
    const checkstoredpassword= await bcrypt.compare(password,storedpassword);
    console.log(checkstoredpassword);
    if(checkstoredpassword){
      const token = jwt.sign({id: userfrondb._id},"suryamsp")
      response.send({message:"succssful login", token:token});
    }else{
      response.status(400).semd({message:"invalid credentials"});
    }
  } 
});


async function createUsers(data) {
  return await client
    .db("Tripdb")
    .collection("login")
    .insertOne(data);
}

async function gen_password(new_pass){
  const no_round=10;
  const salt = await bcrypt.genSalt(no_round);
  const hashedpassword = await bcrypt.hash(new_pass, salt);
  console.log(salt);
  console.log(hashedpassword);
  return hashedpassword;
}

async function getUsername(name) {
  return await client
    .db("Tripdb")
    .collection("login")
    .findOne({ username: name });
}




app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
