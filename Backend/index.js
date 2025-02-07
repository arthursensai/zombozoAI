const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const credential = require('./firebase-admin.json');
const app = express();
const { createUser } = require('./firebase');
const { addUser } = require('./mongodb');
const { default: mongoose } = require('mongoose');

//load .env 
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const MongoDB_URI = process.env.MongoDB_URI;

//add some middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
admin.initializeApp({
  credential: admin.credential.cert(credential)
});
app.use(cors());

//set routes 
app.post('/signup', async (req, res) => {
  try {
      const { username, email, password } = req.body;
      
      // First try Firebase
      const firebaseResponse = await createUser({ email, password, username });
      
      // Check Firebase result
      if (firebaseResponse.status === 500) {
          return res.status(500).json({ message: firebaseResponse.message });
      }
      
      // Then try MongoDB
      const mongodbResponse = await addUser({ 
          username, 
          email, 
          firebaseUID: firebaseResponse.userUID 
      });
      
      // Send final response
      return res.status(mongodbResponse.status).json({ 
          message: mongodbResponse.message 
      });
  } catch (error) {
      return res.status(500).json({ 
          message: "Internal server error", 
          error: error.message 
      });
  }
});

app.get('/', (req, res) => {
    res.status(200).send('ZombozoAI is working');
});

//make sure to connect to mongodb before starting the server
mongoose.connect(MongoDB_URI).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});