window.addEventListener('load', function() {

    //fetch chat mesage
    fetch("/messages")
        .then(response => response.json())
        .then(data => {

            //display the total number of user interaction(how many people clicked "send")
            let counterEl = document.createElement('p');
            counterEl.innerHTML = data.length;
            lunchcounter.appendChild(counterEl)

            //display the chat history
            for (let i = 0; i < data.length; i++) {

                let infoMsg = data[i];
                let infoEl = document.createElement('p');
                infoEl.innerHTML = infoMsg.name + "'s unhappiness is at planet" + " " + infoMsg.stars + " " + "which is" + " " + infoMsg.distance + " " + "away!";
                chatBox.appendChild(infoEl);

            }
        })



    //Open and connect socket
    let socket = io();
    //Listen for confirmation of connection
    socket.on('connect', function() {
        console.log("Connected");
    });

    /* --- Code to RECEIVE a socket message from the server --- */
    let chatBox = document.getElementById('chat-box-msgs');
    let lunchcounter = document.getElementById('lunch-number');

    //Listen for messages named 'msg' from the server
    socket.on('msg', function(data) {

        //Create a message string and page element
        let displayedMsg = data.name + "'s unhappiness is at planet" + " " + data.stars + " " + "which is" + " " + data.distance + " " + "away!";
        let msgEl = document.createElement('p');
        msgEl.innerHTML = displayedMsg;
        //Add the element with the message to the page
        chatBox.appendChild(msgEl);
        //Add a bit of auto scroll for the chat box
        chatBox.scrollTop = chatBox.scrollHeight;

    });

    /* --- Code to SEND a socket message to the Server --- */
    let nameInput = document.getElementById('name-input')
    let msgInput = document.getElementById('msg-input');
    let sendButton = document.getElementById('send-button');
    let planet_distance;
    let planet_name;


    sendButton.addEventListener('click', function() {

        let curName = nameInput.value;
        let curMsg = msgInput.value;
        let curDate = Date();
        let curPlan = planet_name;
        let curDis = planet_distance;

        //get elements out of JSON
        fetch("planets.json")
            .then(response => response.json())
            .then(data => {

                let imageElement = document.getElementById('planet-image')
                let linkElement = document.getElementById('p-link');
                let planetArray = data.planets;
                let randomNumer = Math.floor(Math.random() * planetArray.length);
                planet_name = planetArray[randomNumer].planetname;
                planet_distance = planetArray[randomNumer].distance;
                imageElement.src = planetArray[randomNumer].Image;
                linkElement.href = planetArray[randomNumer].Link;
                console.log(planet_name);
                console.log(planet_distance);

            })

        let msgObj = { "name": curName, "msg": curMsg, "date": curDate, "stars": curPlan, "distance": curDis };

        //Send the message object to the server
        socket.emit('msg', msgObj);

        nameInput.value = '';
        msgInput.value = '';
    });

});