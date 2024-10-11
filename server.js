const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(cors()); // Enable CORS to allow requests from frontend
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Test route to verify the server is running
app.get('/test', (req, res) => {
    res.send('Test route is working!');
});

// POST route to handle contact form submissions
app.post('/contact', (req, res) => {
    console.log('Received POST request to /contact');
    console.log('Request body:', req.body); // Log the body of the request

    const { name, email, subject, message } = req.body;

    // Create the email transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS  // Your email password
        }
    });

    // Define email options
    const mailOptions = {
        from: email, // Sender's email
        to: process.env.EMAIL_USER, // Your receiving email
        subject: `New Contact Form Submission: ${subject}`,
        text: `You have a new message from ${name} (${email}):\n\n${message}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email', error });
        }
        console.log('Email sent successfully:', info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
