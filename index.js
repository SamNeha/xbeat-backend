const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Connect to your MongoDB database (replace 'your-database-uri' with your actual URI)
mongoose.connect('mongodb+srv://nehapn21it:neha250103@cluster0.owt0jmk.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a user schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Signup route
app.post('/api/signup', async (req, res) => {
    console.log('Request body:', req.body);
    const { username, email, password, conf_password } = req.body;

    try {
        const existingUser = await User.findOne({ email }).exec();;

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        if (password !== conf_password) {
            return res.status(400).json({ message: 'Password and confirm password do not match' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ message: 'An error occurred while registering' });
    }
});
const billingSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    country: String,
    state: String,
    pincode: String,
    gender: String,
    agree: Boolean,
  });
  
  const Billing = mongoose.model('Billing', billingSchema);
  
  app.post('/api/billing', async (req, res) => {
    try {
      const { firstName, lastName, email, address, country, state, pincode, gender, agree } = req.body;
  
      const billingData = new Billing({
        firstName,
        lastName,
        email,
        address,
        country,
        state,
        pincode,
        gender,
        agree,
      });
  
      await billingData.save();
  
      res.status(201).json({ message: 'Billing information stored successfully' });
    } catch (error) {
      console.error('Error storing billing information:', error);
      res.status(500).json({ message: 'An error occurred while storing billing information' });
    }
  });

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        res.status(200).json({ email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while logging in' });
    }
});

app.get('/', (req, res)=> {
});
app.get('bill', (req, res)=> {
});
app.get('cart', (req, res)=> {
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});