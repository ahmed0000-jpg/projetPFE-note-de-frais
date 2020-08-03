const {PubSub} = require('@google-cloud/pubsub');
const pubsub = new PubSub();
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
exports.classification = (event, context) => {
  console.log("début");
  const pubsubData = event.data.data || event.data;
  const jsonStr = Buffer.from(pubsubData, 'base64').toString();
  var payload = JSON.parse(jsonStr);
  //console.log(payload.text);
  var texte=payload.text;
  var score = [0, 0, 0, 0, 0, 0];
  var categorieReference = firebase.database().ref("/categories/");
  categorieReference.on("value",
   function (snapshot)
   {
      console.log(snapshot.val());
      console.log(snapshot.val().topics.length);
      for (var i = 0; i < snapshot.val().topics.length; i++)
      {
        var topic = snapshot.val().names[i];
        for (var j = 0; j < snapshot.val().topics[i][topic].length; j++)
         {
          var mot = snapshot.val().topics[i][topic][j];
          if (texte.toLowerCase().indexOf(mot) != -1)
           {
             score[i]++;
           }
        }
      }
      var classe="type inconnu";
      console.log(score);
      if(Math.max(...score)!==0)
      {
        classe = snapshot.val().names[score.indexOf(Math.max(...score))];
      }
      console.log(classe);
      let topicName = "TopicFromClassification";
      payload["classe"]=classe;
      categorieReference.off("value");
      console.log("fin");
      return publishResult(topicName, payload);
  },
  function (errorObject)
  {
    console.log("ahmed");
    console.log("The read failed: " + errorObject.code);
  });
};
const publishResult = async (topicName, data) =>
{
  const dataBuffer = Buffer.from(JSON.stringify(data));
  const [topic] = await pubsub.topic(topicName).get({autoCreate: true});
  topic.publish(dataBuffer);
};

