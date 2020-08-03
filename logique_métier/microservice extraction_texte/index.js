'use strict';
const Storage = require('@google-cloud/storage');
const storage = new Storage();
const {PubSub} = require('@google-cloud/pubsub');
const pubsub = new PubSub();
/****************************************************** */
exports.extraction = async (event, context) =>
{
    const {bucket, name} = event;
    var tableau=name.split('.');
    if(tableau[tableau.length-1] =='pdf')
    {
      console.log("extraction2");
      await detectPdfText(bucket,name);
    }else
    {
      await detectImageText(bucket, name);
    }
};
/********************************************************* */
const detectPdfText = async (bucketName, fileName) => 
{
  const {ImageAnnotatorClient} = require('@google-cloud/vision').v1;
  const client = new ImageAnnotatorClient();
  const gcsSourceUri = `gs://${bucketName}/${fileName}`;
  const inputConfig = {
    mimeType: 'application/pdf',
    gcsSource: {
      uri: gcsSourceUri,
    },
  };
  const features = [{type: 'DOCUMENT_TEXT_DETECTION'}];
  const fileRequest = {
    inputConfig: inputConfig,
    features: features,
    // Annotate the first two pages and the last one (max 5 pages)
    // First page starts at 1, and not 0. Last page is -1.
    pages: [],
  };
  const request = {
    requests: [fileRequest],
  };
  const [result] = await client.batchAnnotateFiles(request);
  const responses = result.responses[0].responses;
  var texte='';
  for (const response of responses)
  {
    texte=texte+'\n'+response.fullTextAnnotation.text;
  //responses[0].fullTextAnnotation.text;
  }
  console.log(texte);
  let topicName = "TopicFromExtract";
  var messageData = {};
  messageData={ text: texte, textAnnotations :[] };
  console.log("success");
  return publishResult(topicName, messageData);
};
/******************************************************* */
const detectImageText = async (bucketName, filename) => 
{
 const vv = require('@google-cloud/vision');

  // Creates a client
  const vision = new vv.ImageAnnotatorClient();
 const [textDetections] = await vision.documentTextDetection(
    `gs://${bucketName}/${filename}`
  );  
 //console.log(textDetections);
 var messageData={};
 if(textDetections.textAnnotations.length != 0)
 {
   var textAnnotations=textDetections.textAnnotations;
   messageData["textAnnotations"] =textAnnotations;
   messageData["text"] = textDetections.textAnnotations[0].description;
 }else
 {
   messageData["text"] ='';
   messageData["textAnnotations"] =[];
 }
 //console.log(messageData);
 let topicName = "TopicFromExtract";
 console.log("success");
 return publishResult(topicName, messageData);
};
const publishResult = async (topicName, data) =>
{
  const dataBuffer = Buffer.from(JSON.stringify(data));
  const [topic] = await pubsub.topic(topicName).get({autoCreate: true});
  topic.publish(dataBuffer);
};
/********************************************************** */

