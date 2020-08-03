window.alert = function(titre, message) {
    document.getElementById("alertPanel").innerHTML = "<span class=\"close\" onclick=\"closealert();\"></span><h2>" + titre + "</h2><div class=\"texte\">" + message + "</div>";
    document.getElementById('alertPanel').style.display='block';
    document.getElementById('overlay').style.display='block';
}
function closealert()
{
    document.getElementById('alertPanel').style.display='none';
    document.getElementById('overlay').style.display='none';
}
function load() {
    var AvionTest = $('#avion :input').map(function () {
        return $(this).val();
    }).get();
    console.log(AvionTest);
    var Avion =[]
    for(var i=0;i<AvionTest.length;i++)
    {
        if(AvionTest[i]!=='')
        {
            Avion.push(AvionTest[i]);
        }
    }
    var TrainTest = $('#train :input').map(function () {
        return $(this).val();
    }).get();
    console.log(TrainTest);
    var Train =[]
    for(var i=0;i<TrainTest.length;i++)
    {
        if(TrainTest[i]!=='')
        {
            Train.push(TrainTest[i]);
        }
    }
    var HôtelTest = $('#hotel :input').map(function () {
        return $(this).val();
    }).get();
    console.log(HôtelTest);
    var Hôtel =[]
    for(var i=0;i<HôtelTest.length;i++)
    {
        if(HôtelTest[i]!=='')
        {
            Hôtel.push(HôtelTest[i]);
        }
    }
    var RestaurantTest = $('#restaurant :input').map(function () {
        return $(this).val();
    }).get();
    console.log(RestaurantTest);
    var Restaurant =[]
    for(var i=0;i<RestaurantTest.length;i++)
    {
        if(RestaurantTest[i]!=='')
        {
            Restaurant.push(RestaurantTest[i]);
        }
    }
    var ParkingTest = $('#parking :input').map(function () {
        return $(this).val();
    }).get();
    console.log(ParkingTest);
    var Parking =[]
    for(var i=0;i<ParkingTest.length;i++)
    {
        if(ParkingTest[i]!=='')
        {
            Parking.push(ParkingTest[i]);
        }
    }
    var PéageTest = $('#peage :input').map(function () {
        return $(this).val();
    }).get();
    console.log(PéageTest);
    var Péage =[]
    for(var i=0;i<PéageTest.length;i++)
    {
        if(PéageTest[i]!=='')
        {
            Péage.push(PéageTest[i]);
        }
    }
    var JSON = {
        topics: [
            {
                "Restaurant": Restaurant
            },
            {
                "Hôtel": Hôtel
            },
            {
                "Train": Train
            },
            {
                "Avion": Avion
            },
            {
                "Parking": Parking
            },
            {
                "Péage": Péage
            }
        ],
        names: [
            "Restaurant",
            "Hôtel",
            "Train",
            "Avion",
            "Parking",
            "Péage"
        ]
    };
   /* var firebaseConfig = {
        apiKey: "AIzaSyAQPybN7z4ZRp5cDi52cwQ7ZFOY2JDYD2M",
        authDomain: "notedefrais.firebaseapp.com",
        databaseURL: "https://notedefrais.firebaseio.com",
        projectId: "notedefrais",
        storageBucket: "notedefrais.appspot.com",
        messagingSenderId: "1003347869132",
        appId: "1:1003347869132:web:170795ac5d50b9ab3bb169"
    };*/
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
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var classInvReference = firebase.database().ref("/categories/");

    classInvReference.set(JSON,
        function(error) {
            if (error) {
                console.log("Data could not be saved." + error);
            }
            else {
                console.log("Data saved successfully.");
            }
        });
    classInvReference.off("value");
    alert('Message','Les données sont stockées dans la base de données');
}
$(document).ready(function(){
    var i=1;
    var variable;
    $('#res').click(function(e)
    {
        i++;
        variable="res";
        var element= $("<span id='"+variable+i+"'><span><input type=\"text\" ><button id='"+variable+i+"' class='btn_remove'>X</button ></span></span>");
        element.appendTo('#restaurant');
    });
    $('#pea').click(function(e)
    {
        i++;
        variable="pea";
        var element= $("<span id='"+variable+i+"'><span><input  type=\"text\" ><button id='"+variable+i+"' class='btn_remove'>X</button ></span></span>");
        element.appendTo('#peage');
    });
    $('#par').click(function(e)
    {
        i++;
        variable="par";
        var element= $("<span id='"+variable+i+"'><span><input type=\"text\"><button id='"+variable+i+"' class='btn_remove'>X</button ></span></span>");
        element.appendTo('#parking');
    });
    $('#trai').click(function(e)
    {
        i++;
        variable="trai";
        var element= $("<span id='"+variable+i+"'><span><input  type=\"text\" ><button id='"+variable+i+"' class='btn_remove'>X</button ></span></span>");
        element.appendTo('#train');
    });
    $('#hote').click(function(e)
    {
        i++;
        variable="hote";
        var element= $("<span id='"+variable+i+"'><span><input type=\"text\"><button id='"+variable+i+"' class='btn_remove'>X</button></span></span>");
        element.appendTo('#hotel');
    });
    $('#avi').click(function(e)
    {

        i++;
        variable="avi";
        var element= $("<span id='"+variable+i+"'><span><input  type=\"text\"><button id='"+variable+i+"' class='btn_remove'>X</button></span></span>");
        element.appendTo('#avion');
    });

    $(document).on('click','.btn_remove',function()
    {
        var button_id=$(this).attr("id");
        $("#"+button_id+"").remove();
    });
});