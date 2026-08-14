const express = require('express'); 
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose'); 
require('dotenv').config({ path: './backend/.env' }); //loads the .env variables 

const app = express(); 
const PORT = 5000;

console.log("My URI is: " + process.env.MONGO_URI); 

app.use(bodyParser.urlencoded({ extended: false })); 

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Successfully connected to MongoDB!"))
.catch((error) => console.error("Connection Error: ", error)); 


let userSchema = new mongoose.Schema({
  username: {
    type: String, 
    required: true, 
    unique: true, //prevents duplicate users 
    trim: true 
  }, 
  password: {
    type: String, 
    required: true, 
    minlength: 6 
  }
}); 

const userInfo = new mongoose.model("user-acc-info", userSchema);


app.get('/api/data', (req, res) => {
  res.json({ message: "Hello from the Node.js backend!" });
});

app.get('/api/hello', (req, res) => {
    res.json({hello: "Hello World!"}); 
}); 

app.post('/api/submit/login', async (req, res) => {
  const userReq = req.body['name-field']?.trim(); 
  const passReq = req.body.password?.trim(); 
  if (!(userReq && passReq))
    return res.status(401).json({error: "Username or password entered incorrectly."}); 
  
  try {
    const user = await userInfo.findOne({ username: userReq }); //grab the collection 
    if (!user) {
      return res.status(401).json({error: "Username or password entered incorrectly."}); 
    } else {
      console.log("Username: " + user.username + ", Password: " + user.password); 
      if (user.password === passReq)
        return res.json({success: "Successfully logged in!", user: {id: user.id, username: user.username}});
      return res.status(401).json({error: "Username or password entered incorrectly."}); 
    }
  } catch (error) {
    console.log(error); 
    return res.status(500).json({error: "Internal Server Error."}); 
  }
}); 

app.post('/api/submit/sign-in', async (req, res) => {
  console.log("Recieved username: " + req.body['name-field']); 
  console.log("Recieved Password: " + req.body.password); 
  const username = req.body['name-field']?.trim(); 
  const password = req.body.password?.trim(); 
  if (username && password) { 
    try { 
      const newRow = new userInfo({username: username, password: password}); 
      await newRow.save(); //stops fxn execution until data is saved 
      //do if successful 
      console.log("User info successfully stored!"); 
      return res.json({success: "User info successfully stored!"});
    } catch (error) {
        console.log("ERROR: " + error.name); 
        console.log("ERROR: " + error); 
        console.log("ERROR: " + error.kind); 
        if (error.code === 11000)
          return res.status(400).json({error: "Username already exists."}); //400: client-side error 
        else if (error.name === 'ValidationError') {
          const errorMessages = Object.values(error.errors).map(e => {
            console.log("Error Kind: " + e.kind); 
            if (e.kind === 'minlength')
              return res.status(400).json({error: "Password must have a minimum length of 6 characters."})
          })
        } 
        return res.status(500).json({ error: "Internal server error."}); //500: Internal server error 
    }
  }
}); 

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
