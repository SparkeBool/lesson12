const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

dotenv.config();

app.use(express.json());

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 4,
    trim: true,
    maxlength: 50
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    minlength: 4,
    trim: true,
    maxlength: 50
  },
  phone: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 4,
    trim: true,
    maxlength: 50
  }
});

const User = mongoose.model("User", userSchema);

app.post('/signup', async (req, res) => {
 
    const { name, age, gender, phone, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email Already Exist" });
    }

    
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: "Phone Already Exist" });
    }


    const user = new User({
      name,
      age,
      gender,
      phone,
      email,
      password
    });

    await user.save();
    res.status(201).json({ message: 'User Created', user });

});

app.post('/login', async (req, res) => {
  
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    console.log(user.email);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    user.password = undefined;

    res.status(200).json({ message: "Login Successful", user });
 
});

app.get('/users', async (req, res)=>{

    const users = await User.find({});

    res.status(200).json({users});

});

app.get('/users/:id', async (req, res)=>{

    const id = req.params.id;

    const user = await User.findById(id) ;

    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }

      user.password = undefined;

    res.status(200).json({user});

});

app.patch('/users/update/:id', async (req, res) => {
 const id = req.params.id;

  const {phone}  = req.body;

  if(!phone){
    return res.status(400).json("FIll all Fields ")
  }

  const user = await User.findByIdAndUpdate(
    id, 
    {
      phone
    },

    { new: true }

  ).select("-password");

 
 return res.status(200).json({message: "User updated", user});
 

});

app.delete('/users/delete/:id', async (req, res)=>{
  const id = req.params.id;

  if(!id){
    return res.status(400).json('Please Enter user Id')
  }

  const user = await User.findByIdAndDelete(req.params.id);


  res.status(200).json({msg:"User Deleted", user});

  });    
mongoose.connect("mongodb://localhost:27017/sample-db")
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB', error));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to server on port ${port}`);
});