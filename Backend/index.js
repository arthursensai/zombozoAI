const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const credential = require('./firebase-admin.json');
const app = express();
const User = require('./Modules/User');

//load .env 
require('dotenv').config();
const PORT = process.env.PORT || 5000;

//add some middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
admin.initializeApp({
  credential: admin.credential.cert(credential)
});
app.use(cors());

//set routes 
app.post('/signup', async(req, res) => {
  const { email, password, username } = req.body;
  try {
    const userResponse = await admin.auth().createUser({
      email: email,
      password: password,
      username: username,
      emailVerified: false,
      disabled: false
    });
    console.log(userResponse)
    res.status(200).send('User Created!');
    // i should find a way to get the uid from userResponse object to add it to mongodb
    try {
      const user = await User.create(email, username)
    } catch (error){
      res.status(500).json({message: error.message})
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

app.get('/', (req, res) => {
    res.status(200).send('ZombozoAI is working');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})