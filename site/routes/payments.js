const express = require('express');
const stripe = require('stripe')(process.env.stripe_secret);
const router = express.Router();

router.post('/stripe', (req, res) => {
    stripe.charges.create({
        amount: parseFloat(req.body.amount) * 100,
        currency: 'usd',
        source: req.body.token,
        description: 'Donation for Discord pleb bot'
    }, (err, charge) => {
        if(err) req.session.error = err.message;
        else req.session.success = `The payment was a great success!  Thanks for the $${charge.amount / 100}!`;
        res.redirect('back');
    });
});

module.exports = router;