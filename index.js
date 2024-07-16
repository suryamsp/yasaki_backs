// const express = require("express"); // "type": "commonjs"
import express from "express"; // "type": "module"
import bcrypt from "bcrypt";


// Now you can use the hash() function directly

import cors from 'cors';
import { MongoClient } from "mongodb";


import * as dotenv from 'dotenv';


dotenv.config()

const app = express();
const PORT = process.env.PORT; // Default to 3000 if PORT is not set in the environment
const mongo_url = process.env.MONGO_URL;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


export const client = new MongoClient(mongo_url);


try {
    await client.connect();
    console.log("MongoDB is connected");
} catch (error) {
    console.error("Error connecting to MongoDB:", error);
}





app.get("/", async function (request, response) {
  const list= await client
  .db("oladb")
  .collection("olaname")
  .find({})
  .toArray();
  response.send(list);
});
app.get("/output", async function (request, response) {
  const list= await client
  .db("oladb")
  .collection("olaoutput")
  .find({})
  .toArray();
  response.send(list);
});





app.post("/",async function (req, response) {
  const {body}= req;
  
  const results = await Add({
      name: body, 
  });
  response.send(results);
});

async function Add(data) {
  return await client
    .db("oladb")
    .collection("olaname")
    .insertOne(data);
}

app.post("/output",async function (req, response) {
  const {body}= req;
  
  const results = await Addout({
      name: body, 
  });
  response.send(results);
});

async function Addout(data) {
  return await client
    .db("oladb")
    .collection("olaoutput")
    .insertOne(data);
}




app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
