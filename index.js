const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const port = 8080


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello world");
})

const uri = "mongodb+srv://admin:123@cluster0.9cfe8cq.mongodb.net/"

app.post('/users/create', async (req, res) => {
    const user = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db("mydb").collection("users").insertOne({
        id: parseInt(user.id),
        fname: user.fname,
        lname: user.lname,
        username: user.username,
        email: user.email,
        avater: user.avater
    });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "User with ID" + user.Id + "is created",
        "user": user
    })
})

app.get('/users', async (req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db("mydb").collection("users").find({}).toArray();
    await client.close();
    res.status(200).send(users)
})

app.get('/users/:Id', async (req, res) => {
    const id = parseInt(req.params.Id);
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db("mydb").collection("users").findOne({ "id": id });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "user": users
    })
})

app.put('/users/update', async (req, res) => {
    const user = req.body;
    const id = user.id;
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db("mydb").collection("users").updateOne({ "id": id }, {
        "$set": {
            fname: user.fname,
            lname: user.lname,
            username: user.username,
            email: user.email,
            avater: user.avater
        }
    });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "User with ID =" + id + "is updata." ,
        "user": users
    })
})

app.delete('/users/delete', async (req, res) => {
    const id = req.body.id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db("mydb").collection("users").deleteOne({"id": id});
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "User with ID =" + id + "is delete." 
    })
})



app.listen(port, () => {
    console.log(`Example app listening at port ${port}`)
})