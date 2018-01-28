const express = require('express');

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

var app = express();
const port = process.env.PORT || 3000;

const stripe = require("stripe")(keySecret);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/getListOfCustomers', (req, res) => {
  stripe.customers.list(
    { limit: 10 },
    function(err, customers) {
      if(err) {
        console.log(err);
        res.send(err);
      }
      else{
        console.log(customers);
        res.json(customers);
      }
    }
  )
});

app.get('/getListOfSubscriptionPlans', (req, res) => {
  stripe.plans.list(
    { limit: 10 },
    function(err, plans) {
      if(err) {
        console.log(err);
        res.send(err);
      }
      else{
        console.log(plans);
        res.json(plans);
      }
    }
  )
});

app.post('/createSubscription', (req, res) => {
  console.log('body: '+JSON.stringify(req.body));
  var customerId = req.body.customerId;
  var planIds = req.body.planIds;
  var billing = req.body.billing;
  var paymentDue = req.body.paymentDue;

  for(let i = 0; i < planIds.length; i++) {
    if(billing == 'send_invoice') {
      stripe.subscriptions.create({
        customer: customerId,
        items: [
          {        
            plan: planIds[i],
          },
        ],
        billing: billing,
        days_until_due: paymentDue,
      }, function(err, subscription) {
          if(err) {
            console.log(err);
            res.send(err);
          }
          else{
            console.log(subscription);
            res.json(subscription);
          }
      }
    )}
    else {
      stripe.subscriptions.create({
        customer: customerId,
        billing: billing,
        items: [
          {
          plan: planIds[i],
          },
        ]
      },function(err,subscription) {
        if(err) {
          console.log(err);
          res.send(err);
        } else {
          console.log(subscription);
          res.json(subscription);
        }
      })
    }}
});

app.listen(port, () => console.log(`Listening on port ${port}`));