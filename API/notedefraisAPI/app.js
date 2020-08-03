'use strict';

const process = require('process');
const {format} = require('util');
const express = require('express');
const Multer = require('multer');
const bodyParser = require('body-parser');

const {Storage} = require('@google-cloud/storage');

const storage = new Storage();

const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.json());
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
});
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
var firebase = require('firebase');
var firebaseConfig = {
    apiKey: "AIzaSyBMjM3ABZGeQM7NBU2rYU1kn6WWwVpnLGY",
    authDomain: "civic-outlet-276919.firebaseapp.com",
    databaseURL: "https://civic-outlet-276919.firebaseio.com",
    projectId: "civic-outlet-276919",
    storageBucket: "civic-outlet-276919.appspot.com",
    messagingSenderId: "330345291962",
    appId: "1:330345291962:web:4b2938ebd55875ede72283",
    measurementId: "G-CQYRHCXQM3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Display a form for uploading files.
app.get('/', (req, res) => {
    res.render('form.pug');
});
// Process the file upload and upload to Google Cloud Storage.
app.post('/upload', multer.single('file'), (req, res, next) => {
    if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
}
var Reference = firebase.database().ref("/resultat/");
Reference.on("value",
    function (snapshot)
    {
        var variable=snapshot.val();
        if(variable != null)
        {
            var sReference = firebase.database().ref('/resultat/');
            sReference.remove(
                function (error) {
                    if (error) {
                        console.log("Data could not be saved." + error);
                    }
                    else {
                        console.log("Data deleted successfully.");
                    }
                });
        }
        Reference.off("value");
    },
    function (errorObject)
    {
        console.log("The read failed: " + errorObject.code);
    });

// Create a new blob in the bucket and upload the file data.
const blob = bucket.file(req.file.originalname);
const blobStream = blob.createWriteStream({
    resumable: false,
});

blobStream.on('error', (err) => {
    next(err);
});

blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
console.log("en attente");
var resReference = firebase.database().ref('/resultat/');
//Attach an asynchronous callback to read the data
resReference.on("child_added",
    function(snapshot)
    {
        console.log(snapshot.val());
        var retour = snapshot.val();
        var scroeReference = firebase.database().ref('/resultat/');
        scroeReference.remove(
            function (error)
            {
                if (error)
                {
                    console.log("Data could not be saved." + error);
                }
                else
                {
                    console.log("Data saved successfully.");
                    res.status(200).json(retour);
                }
            });
        resReference.off("child_added");
    },
    function (errorObject)
    {
        console.log("The read failed: " + errorObject.code);
        res.send("The read failed: " + errorObject.code);
    });
//res.status(200).send(publicUrl);
});

blobStream.end(req.file.buffer);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
console.log('Press Ctrl+C to quit.');
});
// [END gae_storage_app]

module.exports = app;