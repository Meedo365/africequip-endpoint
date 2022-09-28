const Userp = require('../../models/usersP');
const Token = require('../../models/token');
require('dotenv').config()

let routes = (app) => {

  var crypto = require('crypto');
  var nodemailer = require('nodemailer');

  /**
  * POST /signup
  */
  exports.signupPost = function (req, res, next) {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password must be at least 8 characters long').len(8);
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    // Check for validation errors    
    var errors = req.validationErrors();
    if (errors) { return res.status(400).send(errors); }

    // Make sure this account doesn't already exist
    Userp.findOne({ email: req.body.email }, function (err, user) {

      // Make sure user doesn't already exist
      if (user) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });

      // Create and save the user
      user = new User({ name: req.body.name, email: req.body.email, password: req.body.password });
      user.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }

        // Create a verification token for this user
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the verification token
        token.save(function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }

          // Send the email
          var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
          var mailOptions = { from: 'no-reply@yourwebapplication.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
          transporter.sendMail(mailOptions, function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send('A verification email has been sent to ' + user.email + '.');
          });
        });
      });
    });
  };
}

module.exports = routes;
