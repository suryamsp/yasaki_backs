import * as dotenv from 'dotenv';

dotenv.config()

import express from 'express';
const app = express();
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";




app.use(express.json());


const PORT = process.env.PORT; 
const mongo_url = process.env.MONGO_URL;

const allowedOrigins = ['http://localhost:5173','https://snegamsp.netlify.app'];

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use((request, response, next) => {
  const origin = request.headers.origin;
  if (allowedOrigins.includes(origin)) {
    response.header('Access-Control-Allow-Origin', origin);
  }
  response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


export const client = new MongoClient(mongo_url);
console.log("mongodb is connected ");


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





app.get("/leave", async function (request, response) {
  const list= await client
  .db("oladb")
  .collection("olaleave")
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

app.post("/Leave",async function (req, response) {
  const {name,str_date,end_date,reason}= req.body;
  
  const results = await Addleave({
      name: name,
      str_date:str_date,
      end_date:end_date,
      reason:reason, 
  });
  response.send(results);
});

async function Addleave(data) {
  return await client
    .db("oladb")
    .collection("olaleave")
    .insertOne(data);
}


app.delete("/delete/:name", async function (req, response) {
  try {
    const name = req.params.name;

    const results = await deleteLeave(name);

    if (results.deletedCount > 0) {
      response.status(200).send({ message: 'Leave record deleted successfully.' });
    } else {
      response.status(404).send({ message: 'Leave record not found.' });
    }
  } catch (error) {
    response.status(500).send({ error: 'An error occurred while processing your request.' });
  }
});

async function deleteLeave(name) {
 
  return await client
    .db("oladb")
    .collection("olaleave")
    .deleteOne({ name: name });
}


app.delete("/output/:id", async function (request, response) {
    const id = request.params.id; 
    const objectId = new ObjectId(id)
    const results = await deletedata(objectId);
  response.send(results);
 
});

async function deletedata(data) {

  return await client
    .db("oladb")
    .collection('olaoutput')
    .deleteOne({ _id: data });
}




app.delete("/deleteall", async function (req, response) {
  try {
    const resultsOlaname = await deleteAll('olaname');
    const resultsOlaoutput = await deleteAll('olaoutput');

    response.status(200).send({
      message: 'All records deleted successfully.',
      olaname: resultsOlaname.deletedCount,
      olaoutput: resultsOlaoutput.deletedCount
    });
  } catch (error) {
    response.status(500).send({ error: 'An error occurred while processing your request.' });
  }
});

async function deleteAll(collectionName) {

  return await client
    .db("oladb")
    .collection(collectionName)
    .deleteMany({});
}



app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
