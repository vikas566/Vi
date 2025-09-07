const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const nodemailer = require('nodemailer');

router.post('/signup', async (req, res) => {
  const { name, email } = req.body;
  try {
    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const token = crypto.randomBytes(20).toString('hex');
    const user = new User({ name, email, verificationToken: token });
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const link = `${process.env.CLIENT_URL}/thankyou.html?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `<h3>Welcome, ${name}!</h3><p>Click <a href="${link}">here</a> to verify your email.</p>`
    });

    res.json({ message: 'Verification email sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).send('Invalid token');

    user.verified = true;
    user.verificationToken = null;
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/thankyou.html`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;