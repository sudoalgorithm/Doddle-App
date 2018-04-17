var database;
var drawing = [];
var currentPath = [];

var isDrawing = false;

function setup() {
    var config = {
        apiKey: "AIzaSyAYm3vTsSajue53DhTJ1ZsIkiGBQsyFzBk",
        authDomain: "p3js-fea24.firebaseapp.com",
        databaseURL: "https://p3js-fea24.firebaseio.com",
        projectId: "p3js-fea24",
        storageBucket: "",
        messagingSenderId: "509556737674"
      };

    firebase.initializeApp(config);
    database = firebase.database();

    canvas=createCanvas(screen.width*0.95, screen.height * 0.5);
    canvas.parent('canvascontainer');

    canvas.mousePressed(startPath);
    canvas.mouseReleased(endPath);

    var saveButton = select('#saveButton');
    saveButton.mousePressed(saveDrawing);

    var clearButton = select('#clearButton');
    clearButton.mousePressed(clearDrawing);

    var ref = database.ref("drawings");
    ref.on('value', gotData, errData);
}

function startPath(){
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath);
}

function endPath(){
    isDrawing = false;
}

function draw()
{
    background(0);

    if (isDrawing)
    {
        var point = {x: mouseX, y: mouseY}
        currentPath.push(point);
    }

    stroke(255);
    strokeWeight(4);
    noFill();

    for (var i=0; i < drawing.length; i++){
        var path = drawing[i];
        beginShape();
        for (var j=0; j<path.length; j++){
            vertex(path[j].x, path[j].y);
        }
        endShape();

    }
}

function saveDrawing()
{
    var ref = database.ref("drawings");
    var data = {
        name: "The Assembly",
        drawing: drawing
    }

    ref.push(data, dataSent);
    function dataSent(status)
    {
        console.log(status);
    }
}

function gotData(data) {
    var elts = selectAll('.listing');
    for (var i = 0; i < elts.length; i++)
    {
        elts[i].remove();
    }

    var drawings = data.val();
    var keys = Object.keys(drawings);
    for (var i = 0; i<keys.length; i++)
    {
        var key = keys[i];
        var li = createElement ('li', '');
        li.class('listing');

        var ahref = createA('#', key);
        ahref.mousePressed(showDrawing);
        ahref.parent(li);
        li.parent('drawingList');
    }
}

function errData(err)
{
    console.log(err);
}

function showDrawing()
{
    key=this.html();

    var ref = database.ref('drawings/' + key)
    ref.once('value', oneDrawing, errData);

    function oneDrawing(data)
    {
        var dbDrawing = data.val();
        drawing = dbDrawing.drawing;
    }
}

function clearDrawing()
{
    drawing = [];
}