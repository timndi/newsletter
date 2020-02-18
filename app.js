// jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
// for our styless.css, images etc to workon our server,we need to create a public folder and apply below function
app.use(express.static('public'));

app.get('/', function(req,res){
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req,res){
  var firstName = req.body.firstName;
  var lastName= req.body.lastName;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

 // then we use JSON.stringify to stringify var data
 var jasonData = JSON.stringify(data);

  var options ={
    // url link and example below was gotten from https://mailchimp.com/developer/guides/get-started-with-mailchimp-api-3/#Code_examples, u hav to change some things in it
    url: 'https://us4.api.mailchimp.com/3.0/lists/270136c814',
    method: 'POST',
    // for Authentication credentials or Authorization for Mailchimp server or any API, we use below func
    headers: {
      "Authorization": "tim1 babf8e70dffe1952c30ca25dfb188729-us4"
    },
    body: jasonData
  };

  // we use the below Express request style/fucn to connect with Mailchimp API
  request(options,function(error,response,body){
    if(error){
      console.log(error);
      res.sendFile(__dirname + '/failure.html');
    }else{
      if(response.statusCode ===200){
        console.log(response.statusCode);
        res.sendFile(__dirname + '/success.html');
      }
      else{
        res.sendFile(__dirname + '/failure.html');
      }

    }
  });

   //console.log(req.body); // prints our all submitted form data in the entire web page in a JS BOJECT Format
  // But
  console.log(firstName,lastName,email); // only prints out specific infos and data in a specific form
  // res.sendFile(__dirname + '/success.html');
});






//for heroku or any hosting server to recognize our server 3000, we ought to add process.env to port 3000, see below func
app.listen(process.env.PORT || 3000,function(){
  console.log('Server is running on PORT 3000');
});


//API KEY  babf8e70dffe1952c30ca25dfb188729-us4
//unique id 270136c814

// curl --request POST \
// --url 'https://usX.api.mailchimp.com/3.0/lists' \
// --user 'anystring:apikey' \
// --header 'content-type: application/json' \
// --data '{"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}' \
// --include
