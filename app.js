
// google's recaptcha has a lot of fans
// http://www.wired.com/2014/12/google-one-click-recaptcha/

// this guy recommends recaptcha
// http://stackoverflow.com/questions/810493/recommendations-for-java-captcha-libraries 

// another article about captcha
// http://www.theverge.com/2014/12/3/7325925/google-is-killing-captcha-as-we-know-it

var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var app = express();
 
var https = require('https');
 
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('html', ejs.renderFile);

app.set('view engine', 'ejs');
 
app.get('/', function(req, res) {
	res.render('index.html');
});
 
app.post('/register', function(req, res) {
    verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
        if (success) {
        	res.end("Success!");
            // TODO: do registration using params in req.body
        } else {
	        res.end("Captcha failed, sorry.");
	        // TODO: take them back to the previous page
	        // and for the love of everyone, restore their inputs
        }
    });
});
 
app.listen(3000);

// secret key should be on server side so it remains secret
var SECRET = "6LdpDAgTAAAAAAi9mw6ktkWAW34Hb_ZTturzyViX";
 
// Helper function to make API call to recatpcha and check response
function verifyRecaptcha(key, callback) {
    https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function(res) {
        var data = "";
        res.on('data', function (chunk) {
        	data += chunk.toString();
        });
        res.on('end', function() {
            try {
                var parsedData = JSON.parse(data);
                callback(parsedData.success);
                console.log( parsedData, "parsedData" );
            } catch (e) {
                callback(false);
            }
        });
    });
}