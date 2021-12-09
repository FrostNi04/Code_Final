//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));


//find the info from data base
app.get('/messages', (req, res) => {
    db.find({}).sort({ date: 1 }).exec((err, docs) => {
        res.send(docs)
    })
})


//NEDB Initial CODE
let Datastore = require('nedb');
let db = new Datastore('rocket.db');
db.loadDatabase();

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

//Listen for individual clients/users to connect
io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    //Listen for a message named 'msg' from this client
    socket.on('msg', function(data) {

        //Data can be numbers, strings, objects
        console.log("Received a 'msg' event");
        console.log(data);

        //Insert info to database
        db.insert(data, (err, newDocs) => {
            console.log('new doc inserted');
        })

        //Send a response to all clients, including this one
        io.sockets.emit('msg', data);


    });

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });
});