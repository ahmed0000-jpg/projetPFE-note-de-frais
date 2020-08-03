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
exports.textMining = (event, context) => {
  const pubsubData = event.data.data || event.data;
  const jsonStr = Buffer.from(pubsubData, 'base64').toString();
  var payload = JSON.parse(jsonStr);
  var montant=price_extraction(payload);
  var date=extraction_date(payload);
  console.log(payload.classe);
  console.log(montant);
  console.log(date);
  var json=[{
    "montant" : montant,
    "date" : date,
    "classe" :payload.classe
    }];
  var resultatReference = firebase.database().ref('/resultat/res/');
	resultatReference.set({ jsonresult : json },
				 function(error) {
					if (error) {
						console.log("Data could not be saved." + error);
					} 
					else {
						console.log("Data saved successfully.");
					}
			});
      
};
var list_text=[];
var liste_prix_possible=[];
var liste_date_possible=[];

/*************************get_priority******************************* */

function get_priority()
{
  var priority = [
  { word: "montant", priority: 1 },
  { word: "total", priority: 2 },
  { word: "totaux", priority: 3},
  { word: "soustotal", priority: 4 },
  { word: "prix ttc", priority: 5 },
  { word: "tarif ttc", priority: 6},
  {word: "tarif t.t.c", priority: 7},
  {word: "tarif", priority: 8},
  {word: "prix tc", priority: 9},
  {word: "paiement", priority: 12},
  {word: "prix", priority: 10},
  {word: "prix tic", priority: 11
  }
];
priority.sort(function (a, b) {
  return a.priority - b.priority;
});
  return priority;
}
/****************************get_priority***************************************** */

/******************************text_to_list***************************** */

function text_to_list(text)
{
  list_text=[];
  if(text !='')
  {
  var liste=text.split('\n');
  for(var i=0;i<liste.length;i++)
  {
      liste[i]=liste[i].toLowerCase();
      list_text.push(liste[i]);
  }
  } 
}
/*************************text_to_list************************************************** */

/***********************price_extraction************************************ */

function price_extraction(payload)
{
  liste_prix_possible=[];
  var l=[];
  text_to_list(payload.text);
  var word=get_priority();
  l=list_text;
  if(payload.textAnnotations.length == 0)
  {
    if(l.length != 0)
    {
    for(var i=0;i<word.length;i++)
    {
      for(var j=0;j<l.length;j++)
      {
        var index = l[j].indexOf(word[i].word);
        if(index !== -1)
        {
          const regex2 =/\d{1,3}\s?\d{1,3}[.,][ ]?\d{1,2}/g;
          let matches;
          let array=[];
          let indice=0;
          while ((matches = regex2.exec(l[j])) !== null)
          {
            array[indice]=matches[0];
            indice++;
          }
          if(array.length !== 0)
          {
            for(var k=0;k<array.length;k++)
            {
              var montant=array[k].replace(/[\s]/g,'');
              liste_prix_possible.push(parseFloat(montant.replace(/[,]/g,'.')));
            }
          }
        }
      }
    }
    }
  }else
  {
    var l1=payload.textAnnotations;
    var l2=payload.textAnnotations;
    //console.log(payload.textAnnotations);
    for(var i=0;i<word.length;i++)
    {
      for(var j=1;j<l1.length;j++)
      {
        var chaine=(l1[j].description).toLowerCase();
        var index = (chaine).indexOf(word[i].word); 
        if(index !== -1)   
        {
          //console.log(word[i].word);
          var y1=l1[j].boundingPoly.vertices[3].y;
          //console.log(y1);
          var y2=l1[j].boundingPoly.vertices[0].y;
          //console.log(y2);
          var y3=l1[j].boundingPoly.vertices[2].y;
          //console.log(y3);
          var y4=l1[j].boundingPoly.vertices[1].y;
          //console.log(y4);
          var hauteur=(y1-y2)*0.8;
          //console.log(hauteur);
          var string='';
          for(var z=1 ;z< l2.length ; z++)
          {
            var y1montant=l2[z].boundingPoly.vertices[3].y;
            var y2montant=l2[z].boundingPoly.vertices[0].y;
            var y3montant=l2[z].boundingPoly.vertices[2].y;
            var y4montant=l2[z].boundingPoly.vertices[1].y;
            if((y1montant> y1-hauteur && y1montant < y1+hauteur)
            &&(y2montant> y2-hauteur && y2montant < y2+hauteur)
            &&(y3montant> y3-hauteur && y3montant < y3+hauteur)
            &&(y4montant> y4-hauteur && y4montant < y4+hauteur))
            {
              string=string+''+l2[z].description;
            }
          }
          const regex2 =/\d{1,3}\s?\d{1,3}[.,][ ]?\d{1,2}/g;
          let matches;
          let array=[];
          let indice1=0;
          while ((matches = regex2.exec(string)) !== null)
          {
            array[indice1]=matches[0];
            indice1++;
          }
          if(array.length !== 0)
          {
            for(var k=0;k<array.length;k++)
            {
              var montant=array[k].replace(/[\s]/g,'');
              liste_prix_possible.push(parseFloat(montant.replace(/[,]/g,'.')));
            }
          }
        }
      }
    }
  }
  if(liste_prix_possible.length !== 0)
  {
    //console.log("méthode 1 : ",liste_prix_possible);
    return Math.max(...liste_prix_possible);
  }else
  {
      var nouveau_liste=[];
      var word =["tva","t.v.a.","tel","km","numéro"];
      if(l.length != 0)
      {
      for(var i=0;i<l.length;i++)
      {
        var tableau_des_index=[];
        for(var j=0;j<word.length;j++)
        {
          var index = l[i].indexOf(word[j]);
          if(index !== -1)
          {
            tableau_des_index.push("yes");
          }
        }
        if(tableau_des_index.length == 0)
        {
          nouveau_liste.push(l[i]); 
        }
      }
      for(var k=0;k<nouveau_liste.length;k++)
      {
        const regex2 =/\d{1,3}\s?\d{1,3}[.,][ ]?\d{1,2}/g;
        let matches;
        let array=[];
        let indice=0;
        while ((matches = regex2.exec(nouveau_liste[k])) !== null)
        {
            array[indice]=matches[0];
            indice++;
        }
        if(array.length !== 0)
        {
          for(var i=0;i<array.length;i++)
          {
            var montant=array[i].replace(/[\s]/g,'');
            liste_prix_possible.push(parseFloat(montant.replace(/[,]/g,'.')));
          }
        }
      }
      }
      if(liste_prix_possible.length !== 0)
      {
        return Math.max(...liste_prix_possible);
      }else
      {
        return "total introuvable";
      }
  }
}
/*****************************price_extraction*********************************** */

/******************************extraction_date*********************************** */

function extraction_date(payload)
{
  liste_date_possible=[]
  var l=[];
  text_to_list(payload.text);
  l=list_text;
  var months =[" janvier"," fevrier"," mars"," avril"," mai"," juin"," sept"," févr",
  " juillet"," aout"," septembre"," octobre"," novembre"," decembre"," décembre"," août","février",
  "lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"];
  //" jan","janv"," février"," fe"," fev"," fevr"," fé"," fév"," févr"," mar"," avr"," juil"," aou"," août"," aoû",
 // " se"," sep"," sept"," oct"," no"," nov"," de"," dec"," dé"," déc"];
  //console.log(months);
  //console.log(l);
  //console.log(liste_date_possible);
  var liste_date_inter =[];
  if(l.length == 0)
  {
    return "date introuvable";
  }
  for(var i=0;i<l.length;i++)
  {
    var tableau_des_index=[];
    for(var j=0;j<months.length;j++)
    {
      var index = l[i].indexOf(months[j]);
      if(index !=  -1)
      {
        tableau_des_index.push("yes");
      }
    }
    if(tableau_des_index.length !== 0)
    {
      liste_date_inter.push(l[i]); 
    }
  }
  if(liste_date_inter.length != 0 )
  {
    for(var z=0;z<liste_date_inter.length;z++)
    {
      const regex1 =/2[0-9][0-9][0-9]/g;
      let matches1;
      let array1=[];
      let indice1=0;
      while ((matches1 = regex1.exec(liste_date_inter[z])) !== null)
      {
        array1[indice1]=matches1[0];
        indice1++;
      }
      if(array1.length !== 0)
      {
        liste_date_possible.push(liste_date_inter[z]);
      }
    }
  }
  if(liste_date_possible.length != 0)
  {
    //console.log(liste_date_possible);
    return liste_date_possible[0];
  }else
  {
      for(var k=0;k<l.length;k++)
      {
        const regex2 =/[0-3][0-9][-/][0-1][0-9][-/]\d{2,4}/g;
        let matches;
        let array=[];
        let indice=0;
        while ((matches = regex2.exec(l[k])) !== null)
        {
            array[indice]=matches[0];
            indice++;
        }
        if(array.length !=  0)
        {
          for(var i=0;i<array.length;i++)
          {
            liste_date_possible.push(array[i]);
          }
        }
      }
      if(liste_date_possible.length != 0)
      {
        if(liste_date_possible[0].length == 10)
        {
          var max=liste_date_possible[0];
          for(var i=1;i<liste_date_possible.length;i++)
          {
            var anneemax=parseInt(max.substr(6,4));
            var moimax=parseInt(max.substr(3,2));
            var jourmax=parseInt(max.substr(0,2));
            var annee=parseInt(liste_date_possible[i].substr(6,4));
            var moi=parseInt(liste_date_possible[i].substr(3,2));
            var jour=parseInt(liste_date_possible[i].substr(0,2));
            if(anneemax < annee)
            {
              max=liste_date_possible[i];
            }else if (anneemax == annee)
            {
              if(moimax < moi)
              {
                max=liste_date_possible[i];
              }else if (moimax == moi)
              {
                if(jourmax < jour)
                {
                  max=liste_date_possible[i];
                }
              }
            }
          }
          return (max);
        }else
        {
          var max=liste_date_possible[0];
          for(var i=1;i<liste_date_possible.length;i++)
          {
            var anneemax=parseInt(max.substr(6,2));
            var moimax=parseInt(max.substr(3,2));
            var jourmax=parseInt(max.substr(0,2));
            var annee=parseInt(liste_date_possible[i].substr(6,2));
            var moi=parseInt(liste_date_possible[i].substr(3,2));
            var jour=parseInt(liste_date_possible[i].substr(0,2));
            if(anneemax < annee)
            {
              max=liste_date_possible[i];
            }else if (anneemax == annee)
            {
              if(moimax < moi)
              {
                max=liste_date_possible[i];
              }else if (moimax == moi)
              {
                if(jourmax < jour)
                {
                  max=liste_date_possible[i];
                }
              }
            }
          }
          return (max);
        }
        console.log(liste_date_possible);
        return liste_date_possible[0];
      }else
      {
        for(var k=0;k<l.length;k++)
        {
          const regex2 =/[0-3][0-9][ ][0-1][0-9][ ]\d{2,4}/g;
          let matches;
          let array=[];
          let indice=0;
          while ((matches = regex2.exec(l[k])) !== null)
          {
            array[indice]=matches[0];
            indice++;
          }
          if(array.length !== 0)
          {
            for(var i=0;i<array.length;i++)
            {
              liste_date_possible.push(array[i]);
            }
          }
        }
        if(liste_date_possible.length !==0)
        {
          if(liste_date_possible[0].length == 10)
          {
            var max=liste_date_possible[0];
            for(var i=1;i<liste_date_possible.length;i++)
            {
              var anneemax=parseInt(max.substr(6,4));
              var moimax=parseInt(max.substr(3,2));
              var jourmax=parseInt(max.substr(0,2));
              var annee=parseInt(liste_date_possible[i].substr(6,4));
              var moi=parseInt(liste_date_possible[i].substr(3,2));
              var jour=parseInt(liste_date_possible[i].substr(0,2));
              if(anneemax < annee)
              {
                max=liste_date_possible[i];
              }else if (anneemax == annee)
              {
                if(moimax < moi)
                {
                  max=liste_date_possible[i];
                }else if (moimax == moi)
                {
                  if(jourmax < jour)
                  {
                    max=liste_date_possible[i];
                  }
                }
              }
            }
            return (max);
          }else
          {
            var max=liste_date_possible[0];
            for(var i=1;i<liste_date_possible.length;i++)
            {
              var anneemax=parseInt(max.substr(6,2));
              var moimax=parseInt(max.substr(3,2));
              var jourmax=parseInt(max.substr(0,2));
              var annee=parseInt(liste_date_possible[i].substr(6,2));
              var moi=parseInt(liste_date_possible[i].substr(3,2));
              var jour=parseInt(liste_date_possible[i].substr(0,2));
              if(anneemax < annee)
              {
                max=liste_date_possible[i];
              }else if (anneemax == annee)
              {
                if(moimax < moi)
                {
                  max=liste_date_possible[i];
                }else if (moimax == moi)
                {
                  if(jourmax < jour)
                  {
                    max=liste_date_possible[i];
                  }
                }
              }
            }
            return (max);
          }
          console.log(liste_date_possible);
          return liste_date_possible[0];
        }else
        {
          for(var k=0;k<l.length;k++)
          {
            const regex2 =/[0-1][0-9][-/][0-9][0-9]/g;
            let matches;
            let array=[];
            let indice=0;
            while ((matches = regex2.exec(l[k])) !== null)
            {
              array[indice]=matches[0];
              indice++;
            }
            if(array.length != 0)
            {
              for(var i=0;i<array.length;i++)
              {
                liste_date_possible.push(array[i]);
              }
            }
          }
          if(liste_date_possible.length != 0)
          {
            
              var max=liste_date_possible[0];
              for(var i=1;i<liste_date_possible.length;i++)
              {
                var anneemax=parseInt(max.substr(3,2));
                var moimax=parseInt(max.substr(0,2));
                var annee=parseInt(liste_date_possible[i].substr(3,2));
                var moi=parseInt(liste_date_possible[i].substr(0,2));
                if(anneemax < annee)
                {
                  max=liste_date_possible[i];
                }else if (anneemax == annee)
                {
                  if(moimax < moi)
                  {
                    max=liste_date_possible[i];
                  }
                }
              }

              return (max); 
            console.log(liste_date_possible);
            return liste_date_possible[0];
            }else
            {
              return "date introuvable";
            }
        }
      }
  }
}
/************************************extraction_date****************************** */