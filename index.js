const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

//mongodb

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.1mu84.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("todo").collection("product");

        // read all task
        app.get("/tasks", async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });

        // read task by single id
        app.get("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.findOne(query);
            res.send(result);
        });

        // get add task data by post
        app.post("/tasks", async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        });

        // delete task
        app.delete("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        });

        //Update
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const updateTasks = req.body
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    selected: updateTasks.newSelected
                }
            }

            const result = await taskCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })
    } finally {
    }
}

run().catch(console.dir);


// read the server
app.get("/", (req, res) => {
    res.send("HELLO WORLD!");
});

// port
app.listen(port, () => {
    console.log(`server is running on ${port}`);
});


// [
//     {
//         "selected": false,
//         "name": "Shaw",
//         "details": "GINK"
//     },
//     {
//         "selected": false,
//         "name": "Amanda",
//         "details": "ISOLOGIX"
//     },
//     {
//         "selected": false,
//         "name": "Eve",
//         "details": "ZINCA"
//     },
//     {
//         "selected": false,
//         "name": "Jennifer",
//         "details": "TERASCAPE"
//     }
// ]