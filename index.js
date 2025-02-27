// importamos las librerías requeridas
const path = require("path");
const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const WebSocketServer = require("websocket").server;

// Creamos el servidor de sockets y lo incorporamos al servidor de la aplicación
const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

// Especificamos el puerto en una varibale port, incorporamos cors, express 
// y la ruta a los archivo estáticos (la carpeta public)
app.set("port", 3000);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

function originIsAllowed(origin) {
   
        return true;
   
}


wsServer.on("request", (request) =>{

    const connection = request.accept(null, request.origin);
    connection.on("message", (message) => {
        console.log("Mensaje recibido: " + message.utf8Data);
        connection.sendUTF("Recibido: " + message.utf8Data);
    });
    connection.on("close", (reasonCode, description) => {
        console.log("El cliente se desconecto");
    });
});


// Iniciamos el servidor en el puerto establecido por la variable port (3000)
server.listen(app.get('port'), () =>{
    console.log('Servidor iniciado en el puerto: ' + app.get('port'));
})

let cartonGanador =0;
let ultimaGanador=0;
const n = 50 // maxinmo nunmero a generar
let arr = [];    
let playing =0;
let Espera=600;
let time = 10;
let EsperaEntreBolas=10;
let countdown = setInterval(update, 1000);
function update() { 

    

let min = Math.floor(time / 60); 
let sec = time % 60; 
sec = sec < 10 ? "0" + sec : sec;
//console.log(`${min}:${sec}`); 

if (playing == 0)
{
    // enviar json con hora y ultimos 10 cartones que ganaron
    const config = { Hora: `${min}:${sec}`, Ultimo: ultimaGanador};
   //console.log(JSON.stringify(config));
    //wsServer.broadcast(`${min}:${sec}`);
    wsServer.broadcast(JSON.stringify(config));
}



if (playing == 1 && arr.length < n && time%EsperaEntreBolas==0)
{
    let randomNumber ;
    do 
    {
        randomNumber = Math.floor(Math.random() * 75) + 1
    } while(arr.includes(randomNumber));

    arr.push(randomNumber);

    cartonGanador = verificarGanador(arr);

    const config = { Numeros: arr , Hora: 0, Ultimo: ultimaGanador};

    wsServer.broadcast(JSON.stringify(config));

    

    if (arr.length >= n || cartonGanador !=0)
    {
        const config = { Numeros: arr , Hora: 0, Ultimo: ultimaGanador, Bingo :cartonGanador};

        wsServer.broadcast(JSON.stringify(config));
    
        console.log("---------------------------------")
        ultimaGanador=cartonGanador;
        playing=0;
    }
   // console.log(randomNumber)
   // console.log(arr)
 
}



time--;
    if (min == 0 && sec == 0) 
    {
            arr = []; 
            playing=1;
            time = Espera; //clearInterval(countdown);
    }
}



function verificarGanador (arr)
{


    const card = [
        { "B0":1,  "B1":5,  "B2":2,  "B3":7,  "B4":12,  "I0":16,  "I1":21,  "I2":29,  "I3":22,  "I4":43,  "N0":18,  "N1":44,  "N2":33,  "N3":31,  "N4":32,  "G0":47,  "G1":50,  "G2":48,  "G3":48,  "G4":55,  "O0":65,  "O1":73,  "O2":72,  "O3":71,  "O4":68 },
        { "B0":11,  "B1":4,  "B2":2,  "B3":12,  "B4":7,  "I0":16,  "I1":29,  "I2":21,  "I3":19,  "I4":22,  "N0":43,  "N1":31,  "N2":35,  "N3":32,  "N4":44,  "G0":47,  "G1":58,  "G2":57,  "G3":48,  "G4":50,  "O0":65,  "O1":64,  "O2":73,  "O3":72,  "O4":66 },
        { "B0":14,  "B1":7,  "B2":10,  "B3":1,  "B4":4,  "I0":29,  "I1":27,  "I2":18,  "I3":24,  "I4":26,  "N0":35,  "N1":43,  "N2":32,  "N3":39,  "N4":41,  "G0":59,  "G1":56,  "G2":49,  "G3":58,  "G4":50,  "O0":65,  "O1":71,  "O2":61,  "O3":73,  "O4":66 },
        { "B0":2,  "B1":10,  "B2":4,  "B3":5,  "B4":11,  "I0":26,  "I1":16,  "I2":22,  "I3":28,  "I4":21,  "N0":34,  "N1":43,  "N2":41,  "N3":33,  "N4":38,  "G0":57,  "G1":55,  "G2":49,  "G3":58,  "G4":53,  "O0":63,  "O1":65,  "O2":68,  "O3":70,  "O4":67 },
        { "B0":4,  "B1":3,  "B2":8,  "B3":1,  "B4":9,  "I0":21,  "I1":29,  "I2":17,  "I3":20,  "I4":19,  "N0":38,  "N1":43,  "N2":32,  "N3":37,  "N4":34,  "G0":52,  "G1":50,  "G2":56,  "G3":46,  "G4":54,  "O0":72,  "O1":73,  "O2":61,  "O3":64,  "O4":66 },
        { "B0":2,  "B1":10,  "B2":4,  "B3":9,  "B4":1,  "I0":29,  "I1":24,  "I2":26,  "I3":18,  "I4":25,  "N0":38,  "N1":44,  "N2":33,  "N3":35,  "N4":41,  "G0":53,  "G1":48,  "G2":52,  "G3":57,  "G4":55,  "O0":66,  "O1":61,  "O2":73,  "O3":63,  "O4":74 },
        { "B0":10,  "B1":1,  "B2":6,  "B3":7,  "B4":2,  "I0":21,  "I1":28,  "I2":27,  "I3":20,  "I4":17,  "N0":32,  "N1":35,  "N2":37,  "N3":39,  "N4":34,  "G0":47,  "G1":52,  "G2":48,  "G3":58,  "G4":53,  "O0":65,  "O1":71,  "O2":68,  "O3":64,  "O4":74 },
        { "B0":12,  "B1":14,  "B2":4,  "B3":13,  "B4":8,  "I0":29,  "I1":22,  "I2":18,  "I3":25,  "I4":21,  "N0":34,  "N1":31,  "N2":41,  "N3":33,  "N4":32,  "G0":57,  "G1":59,  "G2":58,  "G3":56,  "G4":48,  "O0":64,  "O1":73,  "O2":69,  "O3":65,  "O4":62 },
        { "B0":10,  "B1":2,  "B2":9,  "B3":8,  "B4":14,  "I0":17,  "I1":29,  "I2":16,  "I3":27,  "I4":19,  "N0":43,  "N1":40,  "N2":39,  "N3":34,  "N4":33,  "G0":59,  "G1":46,  "G2":56,  "G3":48,  "G4":49,  "O0":69,  "O1":70,  "O2":62,  "O3":61,  "O4":67 },
        { "B0":12,  "B1":4,  "B2":5,  "B3":6,  "B4":1,  "I0":18,  "I1":20,  "I2":24,  "I3":25,  "I4":23,  "N0":42,  "N1":44,  "N2":36,  "N3":43,  "N4":35,  "G0":53,  "G1":55,  "G2":58,  "G3":54,  "G4":57,  "O0":68,  "O1":64,  "O2":67,  "O3":74,  "O4":62 },
        { "B0":10,  "B1":11,  "B2":5,  "B3":7,  "B4":13,  "I0":29,  "I1":16,  "I2":27,  "I3":22,  "I4":28,  "N0":38,  "N1":41,  "N2":34,  "N3":36,  "N4":31,  "G0":49,  "G1":53,  "G2":57,  "G3":47,  "G4":59,  "O0":63,  "O1":68,  "O2":69,  "O3":61,  "O4":70 },
        { "B0":12,  "B1":10,  "B2":14,  "B3":8,  "B4":9,  "I0":23,  "I1":20,  "I2":29,  "I3":21,  "I4":19,  "N0":40,  "N1":37,  "N2":44,  "N3":34,  "N4":38,  "G0":46,  "G1":52,  "G2":47,  "G3":48,  "G4":55,  "O0":63,  "O1":69,  "O2":71,  "O3":72,  "O4":64 },
        { "B0":13,  "B1":1,  "B2":6,  "B3":4,  "B4":9,  "I0":19,  "I1":17,  "I2":18,  "I3":20,  "I4":21,  "N0":40,  "N1":34,  "N2":31,  "N3":39,  "N4":33,  "G0":58,  "G1":51,  "G2":54,  "G3":53,  "G4":46,  "O0":65,  "O1":62,  "O2":61,  "O3":68,  "O4":69 },
        { "B0":10,  "B1":1,  "B2":8,  "B3":5,  "B4":14,  "I0":18,  "I1":19,  "I2":26,  "I3":23,  "I4":29,  "N0":33,  "N1":38,  "N2":37,  "N3":42,  "N4":39,  "G0":58,  "G1":57,  "G2":46,  "G3":56,  "G4":54,  "O0":72,  "O1":71,  "O2":70,  "O3":61,  "O4":69 },
        { "B0":12,  "B1":7,  "B2":11,  "B3":8,  "B4":1,  "I0":17,  "I1":18,  "I2":29,  "I3":26,  "I4":23,  "N0":34,  "N1":39,  "N2":38,  "N3":42,  "N4":36,  "G0":50,  "G1":58,  "G2":46,  "G3":54,  "G4":52,  "O0":68,  "O1":69,  "O2":67,  "O3":66,  "O4":61 },
        { "B0":1,  "B1":14,  "B2":11,  "B3":13,  "B4":12,  "I0":22,  "I1":23,  "I2":20,  "I3":16,  "I4":27,  "N0":36,  "N1":37,  "N2":38,  "N3":41,  "N4":43,  "G0":50,  "G1":57,  "G2":48,  "G3":51,  "G4":52,  "O0":63,  "O1":70,  "O2":67,  "O3":73,  "O4":71 },
        { "B0":8,  "B1":10,  "B2":1,  "B3":9,  "B4":6,  "I0":21,  "I1":26,  "I2":23,  "I3":18,  "I4":16,  "N0":43,  "N1":32,  "N2":40,  "N3":38,  "N4":31,  "G0":48,  "G1":53,  "G2":50,  "G3":52,  "G4":47,  "O0":72,  "O1":62,  "O2":64,  "O3":69,  "O4":65 },
        { "B0":3,  "B1":2,  "B2":7,  "B3":6,  "B4":14,  "I0":16,  "I1":22,  "I2":28,  "I3":29,  "I4":21,  "N0":40,  "N1":33,  "N2":39,  "N3":35,  "N4":36,  "G0":48,  "G1":50,  "G2":55,  "G3":46,  "G4":58,  "O0":71,  "O1":73,  "O2":63,  "O3":65,  "O4":61 },
        { "B0":10,  "B1":1,  "B2":9,  "B3":12,  "B4":7,  "I0":26,  "I1":25,  "I2":21,  "I3":18,  "I4":16,  "N0":32,  "N1":31,  "N2":41,  "N3":33,  "N4":34,  "G0":51,  "G1":53,  "G2":48,  "G3":52,  "G4":56,  "O0":65,  "O1":69,  "O2":67,  "O3":72,  "O4":70 },
        { "B0":13,  "B1":5,  "B2":10,  "B3":11,  "B4":14,  "I0":24,  "I1":20,  "I2":28,  "I3":26,  "I4":25,  "N0":38,  "N1":39,  "N2":33,  "N3":37,  "N4":41,  "G0":53,  "G1":50,  "G2":58,  "G3":51,  "G4":52,  "O0":68,  "O1":65,  "O2":73,  "O3":67,  "O4":66 },
        { "B0":10,  "B1":2,  "B2":5,  "B3":8,  "B4":12,  "I0":22,  "I1":18,  "I2":21,  "I3":17,  "I4":27,  "N0":35,  "N1":40,  "N2":36,  "N3":41,  "N4":33,  "G0":55,  "G1":59,  "G2":58,  "G3":51,  "G4":46,  "O0":74,  "O1":69,  "O2":63,  "O3":73,  "O4":70 },
        { "B0":8,  "B1":12,  "B2":5,  "B3":6,  "B4":2,  "I0":28,  "I1":23,  "I2":19,  "I3":21,  "I4":26,  "N0":43,  "N1":42,  "N2":41,  "N3":38,  "N4":31,  "G0":48,  "G1":59,  "G2":53,  "G3":49,  "G4":54,  "O0":64,  "O1":68,  "O2":73,  "O3":62,  "O4":67 },
        { "B0":4,  "B1":1,  "B2":11,  "B3":7,  "B4":13,  "I0":20,  "I1":25,  "I2":27,  "I3":29,  "I4":22,  "N0":32,  "N1":35,  "N2":38,  "N3":33,  "N4":43,  "G0":57,  "G1":59,  "G2":58,  "G3":55,  "G4":46,  "O0":67,  "O1":68,  "O2":74,  "O3":69,  "O4":70 },
        { "B0":2,  "B1":10,  "B2":6,  "B3":9,  "B4":7,  "I0":19,  "I1":17,  "I2":16,  "I3":20,  "I4":29,  "N0":39,  "N1":34,  "N2":40,  "N3":35,  "N4":32,  "G0":51,  "G1":58,  "G2":50,  "G3":46,  "G4":48,  "O0":64,  "O1":67,  "O2":73,  "O3":72,  "O4":70 },
        { "B0":5,  "B1":6,  "B2":12,  "B3":1,  "B4":4,  "I0":27,  "I1":17,  "I2":21,  "I3":25,  "I4":20,  "N0":40,  "N1":35,  "N2":44,  "N3":31,  "N4":37,  "G0":57,  "G1":54,  "G2":50,  "G3":58,  "G4":51,  "O0":62,  "O1":69,  "O2":66,  "O3":70,  "O4":71 },
        { "B0":9,  "B1":2,  "B2":10,  "B3":14,  "B4":7,  "I0":27,  "I1":26,  "I2":20,  "I3":25,  "I4":22,  "N0":36,  "N1":41,  "N2":40,  "N3":43,  "N4":32,  "G0":54,  "G1":46,  "G2":55,  "G3":56,  "G4":59,  "O0":73,  "O1":71,  "O2":69,  "O3":64,  "O4":67 },
        { "B0":13,  "B1":3,  "B2":5,  "B3":14,  "B4":1,  "I0":20,  "I1":26,  "I2":25,  "I3":23,  "I4":19,  "N0":35,  "N1":42,  "N2":44,  "N3":33,  "N4":36,  "G0":53,  "G1":52,  "G2":57,  "G3":46,  "G4":48,  "O0":69,  "O1":68,  "O2":70,  "O3":74,  "O4":62 },
        { "B0":11,  "B1":4,  "B2":8,  "B3":3,  "B4":14,  "I0":19,  "I1":22,  "I2":26,  "I3":18,  "I4":25,  "N0":44,  "N1":33,  "N2":40,  "N3":39,  "N4":41,  "G0":51,  "G1":53,  "G2":46,  "G3":52,  "G4":47,  "O0":74,  "O1":65,  "O2":67,  "O3":70,  "O4":61 },
        { "B0":7,  "B1":10,  "B2":13,  "B3":3,  "B4":14,  "I0":18,  "I1":28,  "I2":29,  "I3":22,  "I4":25,  "N0":42,  "N1":37,  "N2":44,  "N3":40,  "N4":31,  "G0":46,  "G1":47,  "G2":56,  "G3":58,  "G4":48,  "O0":69,  "O1":68,  "O2":70,  "O3":64,  "O4":74 },
        { "B0":12,  "B1":3,  "B2":4,  "B3":11,  "B4":9,  "I0":26,  "I1":25,  "I2":27,  "I3":22,  "I4":29,  "N0":43,  "N1":31,  "N2":42,  "N3":39,  "N4":41,  "G0":57,  "G1":51,  "G2":48,  "G3":52,  "G4":50,  "O0":73,  "O1":69,  "O2":70,  "O3":62,  "O4":74 },
        { "B0":1,  "B1":11,  "B2":9,  "B3":4,  "B4":12,  "I0":27,  "I1":20,  "I2":26,  "I3":18,  "I4":19,  "N0":35,  "N1":33,  "N2":42,  "N3":36,  "N4":44,  "G0":51,  "G1":57,  "G2":56,  "G3":50,  "G4":46,  "O0":71,  "O1":68,  "O2":66,  "O3":65,  "O4":64 },
        { "B0":1,  "B1":9,  "B2":12,  "B3":6,  "B4":2,  "I0":18,  "I1":23,  "I2":25,  "I3":24,  "I4":17,  "N0":38,  "N1":32,  "N2":36,  "N3":40,  "N4":35,  "G0":59,  "G1":49,  "G2":57,  "G3":54,  "G4":55,  "O0":73,  "O1":67,  "O2":66,  "O3":71,  "O4":74 },
        { "B0":8,  "B1":10,  "B2":2,  "B3":11,  "B4":3,  "I0":21,  "I1":18,  "I2":23,  "I3":24,  "I4":16,  "N0":37,  "N1":31,  "N2":35,  "N3":34,  "N4":36,  "G0":53,  "G1":56,  "G2":59,  "G3":52,  "G4":46,  "O0":70,  "O1":67,  "O2":72,  "O3":65,  "O4":66 },
        { "B0":6,  "B1":1,  "B2":8,  "B3":14,  "B4":3,  "I0":24,  "I1":26,  "I2":22,  "I3":16,  "I4":27,  "N0":31,  "N1":36,  "N2":37,  "N3":39,  "N4":43,  "G0":46,  "G1":59,  "G2":57,  "G3":49,  "G4":55,  "O0":70,  "O1":73,  "O2":63,  "O3":67,  "O4":66 },
        { "B0":13,  "B1":11,  "B2":14,  "B3":5,  "B4":10,  "I0":24,  "I1":17,  "I2":18,  "I3":25,  "I4":27,  "N0":37,  "N1":42,  "N2":32,  "N3":43,  "N4":40,  "G0":48,  "G1":53,  "G2":56,  "G3":50,  "G4":52,  "O0":74,  "O1":70,  "O2":72,  "O3":71,  "O4":62 },
        { "B0":6,  "B1":5,  "B2":12,  "B3":7,  "B4":10,  "I0":27,  "I1":19,  "I2":22,  "I3":25,  "I4":23,  "N0":40,  "N1":42,  "N2":31,  "N3":32,  "N4":39,  "G0":54,  "G1":57,  "G2":47,  "G3":46,  "G4":50,  "O0":73,  "O1":68,  "O2":64,  "O3":62,  "O4":63 },
        { "B0":5,  "B1":6,  "B2":14,  "B3":8,  "B4":11,  "I0":26,  "I1":28,  "I2":22,  "I3":17,  "I4":29,  "N0":40,  "N1":36,  "N2":32,  "N3":37,  "N4":39,  "G0":53,  "G1":55,  "G2":57,  "G3":52,  "G4":46,  "O0":63,  "O1":73,  "O2":65,  "O3":74,  "O4":62 },
        { "B0":11,  "B1":13,  "B2":2,  "B3":1,  "B4":5,  "I0":17,  "I1":29,  "I2":16,  "I3":26,  "I4":28,  "N0":38,  "N1":35,  "N2":33,  "N3":41,  "N4":32,  "G0":59,  "G1":57,  "G2":46,  "G3":50,  "G4":58,  "O0":62,  "O1":72,  "O2":70,  "O3":65,  "O4":73 },
        { "B0":3,  "B1":10,  "B2":8,  "B3":9,  "B4":7,  "I0":24,  "I1":17,  "I2":23,  "I3":20,  "I4":25,  "N0":40,  "N1":31,  "N2":34,  "N3":44,  "N4":32,  "G0":49,  "G1":48,  "G2":56,  "G3":55,  "G4":47,  "O0":67,  "O1":73,  "O2":72,  "O3":64,  "O4":71 },
        { "B0":6,  "B1":2,  "B2":12,  "B3":14,  "B4":10,  "I0":25,  "I1":19,  "I2":26,  "I3":18,  "I4":16,  "N0":38,  "N1":37,  "N2":43,  "N3":36,  "N4":31,  "G0":49,  "G1":56,  "G2":46,  "G3":52,  "G4":47,  "O0":72,  "O1":73,  "O2":63,  "O3":64,  "O4":66 },
        { "B0":11,  "B1":4,  "B2":3,  "B3":9,  "B4":2,  "I0":24,  "I1":17,  "I2":20,  "I3":18,  "I4":26,  "N0":42,  "N1":43,  "N2":34,  "N3":44,  "N4":37,  "G0":53,  "G1":51,  "G2":46,  "G3":59,  "G4":58,  "O0":64,  "O1":70,  "O2":74,  "O3":72,  "O4":65 },
        { "B0":10,  "B1":8,  "B2":13,  "B3":3,  "B4":11,  "I0":24,  "I1":17,  "I2":16,  "I3":27,  "I4":22,  "N0":31,  "N1":38,  "N2":34,  "N3":33,  "N4":43,  "G0":58,  "G1":53,  "G2":47,  "G3":50,  "G4":54,  "O0":71,  "O1":64,  "O2":63,  "O3":68,  "O4":70 },
        { "B0":1,  "B1":5,  "B2":14,  "B3":10,  "B4":6,  "I0":18,  "I1":17,  "I2":25,  "I3":19,  "I4":24,  "N0":38,  "N1":39,  "N2":44,  "N3":41,  "N4":37,  "G0":56,  "G1":49,  "G2":58,  "G3":50,  "G4":54,  "O0":70,  "O1":72,  "O2":67,  "O3":65,  "O4":69 },
        { "B0":5,  "B1":7,  "B2":1,  "B3":4,  "B4":2,  "I0":25,  "I1":22,  "I2":18,  "I3":26,  "I4":17,  "N0":37,  "N1":33,  "N2":32,  "N3":43,  "N4":44,  "G0":57,  "G1":59,  "G2":46,  "G3":51,  "G4":52,  "O0":74,  "O1":63,  "O2":69,  "O3":65,  "O4":61 },
        { "B0":9,  "B1":1,  "B2":5,  "B3":7,  "B4":2,  "I0":25,  "I1":17,  "I2":24,  "I3":27,  "I4":26,  "N0":39,  "N1":41,  "N2":33,  "N3":42,  "N4":40,  "G0":50,  "G1":53,  "G2":58,  "G3":51,  "G4":55,  "O0":71,  "O1":63,  "O2":68,  "O3":67,  "O4":65 },
        { "B0":10,  "B1":8,  "B2":2,  "B3":1,  "B4":7,  "I0":23,  "I1":29,  "I2":16,  "I3":21,  "I4":24,  "N0":42,  "N1":40,  "N2":38,  "N3":39,  "N4":37,  "G0":57,  "G1":53,  "G2":49,  "G3":56,  "G4":59,  "O0":71,  "O1":64,  "O2":67,  "O3":68,  "O4":63 },
        { "B0":2,  "B1":8,  "B2":10,  "B3":3,  "B4":14,  "I0":16,  "I1":29,  "I2":20,  "I3":28,  "I4":23,  "N0":39,  "N1":41,  "N2":31,  "N3":33,  "N4":34,  "G0":54,  "G1":52,  "G2":53,  "G3":58,  "G4":59,  "O0":72,  "O1":64,  "O2":70,  "O3":61,  "O4":71 },
        { "B0":12,  "B1":1,  "B2":9,  "B3":2,  "B4":8,  "I0":22,  "I1":23,  "I2":28,  "I3":25,  "I4":27,  "N0":38,  "N1":33,  "N2":42,  "N3":31,  "N4":37,  "G0":48,  "G1":47,  "G2":57,  "G3":56,  "G4":53,  "O0":61,  "O1":67,  "O2":73,  "O3":63,  "O4":64 },
        { "B0":10,  "B1":6,  "B2":11,  "B3":13,  "B4":14,  "I0":28,  "I1":27,  "I2":17,  "I3":24,  "I4":18,  "N0":38,  "N1":41,  "N2":37,  "N3":39,  "N4":34,  "G0":48,  "G1":46,  "G2":55,  "G3":49,  "G4":47,  "O0":66,  "O1":61,  "O2":62,  "O3":72,  "O4":70 },
        { "B0":8,  "B1":7,  "B2":11,  "B3":10,  "B4":1,  "I0":16,  "I1":29,  "I2":28,  "I3":19,  "I4":22,  "N0":41,  "N1":43,  "N2":32,  "N3":37,  "N4":36,  "G0":54,  "G1":51,  "G2":53,  "G3":58,  "G4":57,  "O0":69,  "O1":65,  "O2":71,  "O3":72,  "O4":61 },
        { "B0":2,  "B1":6,  "B2":3,  "B3":10,  "B4":9,  "I0":17,  "I1":18,  "I2":26,  "I3":24,  "I4":21,  "N0":41,  "N1":34,  "N2":42,  "N3":32,  "N4":35,  "G0":54,  "G1":46,  "G2":50,  "G3":55,  "G4":57,  "O0":67,  "O1":72,  "O2":64,  "O3":65,  "O4":68 },
        { "B0":7,  "B1":12,  "B2":11,  "B3":5,  "B4":2,  "I0":27,  "I1":18,  "I2":22,  "I3":28,  "I4":17,  "N0":43,  "N1":31,  "N2":32,  "N3":33,  "N4":37,  "G0":56,  "G1":57,  "G2":48,  "G3":46,  "G4":53,  "O0":67,  "O1":72,  "O2":73,  "O3":61,  "O4":64 },
        { "B0":8,  "B1":4,  "B2":13,  "B3":5,  "B4":7,  "I0":21,  "I1":29,  "I2":26,  "I3":25,  "I4":17,  "N0":33,  "N1":38,  "N2":39,  "N3":31,  "N4":42,  "G0":49,  "G1":50,  "G2":53,  "G3":52,  "G4":58,  "O0":64,  "O1":74,  "O2":72,  "O3":63,  "O4":70 },
        { "B0":1,  "B1":7,  "B2":2,  "B3":4,  "B4":12,  "I0":21,  "I1":29,  "I2":27,  "I3":19,  "I4":17,  "N0":41,  "N1":39,  "N2":32,  "N3":37,  "N4":31,  "G0":54,  "G1":52,  "G2":58,  "G3":53,  "G4":46,  "O0":74,  "O1":65,  "O2":70,  "O3":68,  "O4":61 },
        { "B0":1,  "B1":13,  "B2":9,  "B3":8,  "B4":11,  "I0":21,  "I1":17,  "I2":24,  "I3":27,  "I4":20,  "N0":31,  "N1":34,  "N2":39,  "N3":36,  "N4":37,  "G0":58,  "G1":53,  "G2":55,  "G3":46,  "G4":50,  "O0":63,  "O1":74,  "O2":71,  "O3":70,  "O4":66 },
        { "B0":3,  "B1":5,  "B2":7,  "B3":9,  "B4":2,  "I0":28,  "I1":26,  "I2":23,  "I3":24,  "I4":16,  "N0":38,  "N1":43,  "N2":41,  "N3":40,  "N4":31,  "G0":55,  "G1":49,  "G2":58,  "G3":52,  "G4":57,  "O0":64,  "O1":73,  "O2":61,  "O3":70,  "O4":71 },
        { "B0":12,  "B1":14,  "B2":7,  "B3":2,  "B4":5,  "I0":27,  "I1":22,  "I2":17,  "I3":16,  "I4":25,  "N0":42,  "N1":43,  "N2":36,  "N3":35,  "N4":39,  "G0":46,  "G1":49,  "G2":50,  "G3":59,  "G4":48,  "O0":63,  "O1":72,  "O2":67,  "O3":66,  "O4":65 },
        { "B0":5,  "B1":14,  "B2":13,  "B3":11,  "B4":12,  "I0":26,  "I1":18,  "I2":21,  "I3":23,  "I4":28,  "N0":37,  "N1":40,  "N2":44,  "N3":42,  "N4":33,  "G0":46,  "G1":51,  "G2":48,  "G3":49,  "G4":52,  "O0":72,  "O1":70,  "O2":63,  "O3":74,  "O4":73 },
        { "B0":10,  "B1":4,  "B2":6,  "B3":8,  "B4":14,  "I0":25,  "I1":18,  "I2":27,  "I3":22,  "I4":16,  "N0":33,  "N1":44,  "N2":40,  "N3":37,  "N4":35,  "G0":57,  "G1":56,  "G2":58,  "G3":54,  "G4":46,  "O0":72,  "O1":61,  "O2":71,  "O3":68,  "O4":64 },
        { "B0":11,  "B1":12,  "B2":7,  "B3":3,  "B4":10,  "I0":28,  "I1":29,  "I2":27,  "I3":16,  "I4":26,  "N0":42,  "N1":37,  "N2":36,  "N3":32,  "N4":35,  "G0":51,  "G1":48,  "G2":54,  "G3":47,  "G4":55,  "O0":62,  "O1":68,  "O2":67,  "O3":69,  "O4":63 },
        { "B0":8,  "B1":9,  "B2":14,  "B3":11,  "B4":5,  "I0":18,  "I1":22,  "I2":28,  "I3":25,  "I4":16,  "N0":32,  "N1":44,  "N2":41,  "N3":42,  "N4":43,  "G0":47,  "G1":46,  "G2":54,  "G3":52,  "G4":57,  "O0":64,  "O1":69,  "O2":67,  "O3":66,  "O4":73 },
        { "B0":8,  "B1":13,  "B2":7,  "B3":3,  "B4":11,  "I0":20,  "I1":22,  "I2":24,  "I3":27,  "I4":17,  "N0":34,  "N1":44,  "N2":39,  "N3":43,  "N4":32,  "G0":54,  "G1":57,  "G2":58,  "G3":49,  "G4":47,  "O0":64,  "O1":72,  "O2":74,  "O3":73,  "O4":70 },
        { "B0":4,  "B1":1,  "B2":3,  "B3":13,  "B4":10,  "I0":26,  "I1":28,  "I2":18,  "I3":19,  "I4":25,  "N0":44,  "N1":33,  "N2":36,  "N3":38,  "N4":43,  "G0":58,  "G1":57,  "G2":53,  "G3":47,  "G4":50,  "O0":69,  "O1":61,  "O2":70,  "O3":65,  "O4":64 },
        { "B0":6,  "B1":2,  "B2":14,  "B3":11,  "B4":1,  "I0":19,  "I1":27,  "I2":20,  "I3":25,  "I4":29,  "N0":43,  "N1":41,  "N2":34,  "N3":44,  "N4":40,  "G0":49,  "G1":57,  "G2":50,  "G3":51,  "G4":54,  "O0":73,  "O1":70,  "O2":74,  "O3":67,  "O4":63 },
        { "B0":9,  "B1":10,  "B2":14,  "B3":11,  "B4":2,  "I0":25,  "I1":21,  "I2":27,  "I3":19,  "I4":17,  "N0":43,  "N1":35,  "N2":44,  "N3":34,  "N4":38,  "G0":48,  "G1":51,  "G2":49,  "G3":52,  "G4":47,  "O0":65,  "O1":67,  "O2":62,  "O3":64,  "O4":61 },
        { "B0":1,  "B1":14,  "B2":5,  "B3":2,  "B4":7,  "I0":19,  "I1":24,  "I2":18,  "I3":22,  "I4":28,  "N0":35,  "N1":33,  "N2":36,  "N3":43,  "N4":42,  "G0":59,  "G1":58,  "G2":49,  "G3":51,  "G4":54,  "O0":68,  "O1":71,  "O2":61,  "O3":73,  "O4":74 },
        { "B0":12,  "B1":14,  "B2":5,  "B3":4,  "B4":13,  "I0":26,  "I1":23,  "I2":19,  "I3":17,  "I4":22,  "N0":42,  "N1":34,  "N2":40,  "N3":41,  "N4":36,  "G0":49,  "G1":54,  "G2":50,  "G3":58,  "G4":56,  "O0":63,  "O1":62,  "O2":72,  "O3":65,  "O4":61 },
        { "B0":14,  "B1":6,  "B2":1,  "B3":9,  "B4":3,  "I0":19,  "I1":23,  "I2":18,  "I3":27,  "I4":29,  "N0":44,  "N1":32,  "N2":34,  "N3":31,  "N4":37,  "G0":52,  "G1":53,  "G2":56,  "G3":54,  "G4":51,  "O0":68,  "O1":65,  "O2":70,  "O3":67,  "O4":63 },
        { "B0":8,  "B1":9,  "B2":14,  "B3":1,  "B4":13,  "I0":17,  "I1":28,  "I2":29,  "I3":23,  "I4":27,  "N0":41,  "N1":38,  "N2":44,  "N3":37,  "N4":36,  "G0":54,  "G1":58,  "G2":57,  "G3":53,  "G4":49,  "O0":68,  "O1":70,  "O2":63,  "O3":64,  "O4":73 },
        { "B0":1,  "B1":3,  "B2":2,  "B3":13,  "B4":11,  "I0":20,  "I1":19,  "I2":26,  "I3":18,  "I4":21,  "N0":42,  "N1":38,  "N2":44,  "N3":32,  "N4":39,  "G0":54,  "G1":55,  "G2":52,  "G3":59,  "G4":49,  "O0":71,  "O1":63,  "O2":70,  "O3":68,  "O4":61 },
        { "B0":12,  "B1":5,  "B2":1,  "B3":13,  "B4":6,  "I0":21,  "I1":16,  "I2":26,  "I3":17,  "I4":29,  "N0":41,  "N1":32,  "N2":31,  "N3":33,  "N4":36,  "G0":54,  "G1":51,  "G2":56,  "G3":55,  "G4":49,  "O0":61,  "O1":74,  "O2":65,  "O3":72,  "O4":66 },
        { "B0":10,  "B1":13,  "B2":14,  "B3":1,  "B4":3,  "I0":27,  "I1":20,  "I2":18,  "I3":21,  "I4":23,  "N0":37,  "N1":38,  "N2":31,  "N3":33,  "N4":34,  "G0":58,  "G1":57,  "G2":53,  "G3":52,  "G4":54,  "O0":70,  "O1":62,  "O2":72,  "O3":66,  "O4":73 },
        { "B0":11,  "B1":6,  "B2":14,  "B3":8,  "B4":10,  "I0":20,  "I1":26,  "I2":16,  "I3":22,  "I4":27,  "N0":44,  "N1":31,  "N2":37,  "N3":41,  "N4":38,  "G0":56,  "G1":53,  "G2":51,  "G3":49,  "G4":47,  "O0":72,  "O1":61,  "O2":74,  "O3":62,  "O4":71 },
        { "B0":14,  "B1":12,  "B2":4,  "B3":8,  "B4":13,  "I0":24,  "I1":27,  "I2":20,  "I3":23,  "I4":22,  "N0":37,  "N1":36,  "N2":35,  "N3":43,  "N4":41,  "G0":49,  "G1":54,  "G2":52,  "G3":53,  "G4":55,  "O0":67,  "O1":71,  "O2":62,  "O3":69,  "O4":72 },
        { "B0":10,  "B1":5,  "B2":12,  "B3":9,  "B4":11,  "I0":16,  "I1":28,  "I2":27,  "I3":26,  "I4":17,  "N0":42,  "N1":32,  "N2":31,  "N3":34,  "N4":43,  "G0":52,  "G1":54,  "G2":47,  "G3":48,  "G4":57,  "O0":65,  "O1":72,  "O2":73,  "O3":61,  "O4":66 },
        { "B0":5,  "B1":8,  "B2":11,  "B3":2,  "B4":3,  "I0":25,  "I1":26,  "I2":27,  "I3":28,  "I4":24,  "N0":43,  "N1":35,  "N2":31,  "N3":39,  "N4":37,  "G0":53,  "G1":54,  "G2":56,  "G3":51,  "G4":59,  "O0":68,  "O1":74,  "O2":71,  "O3":64,  "O4":67 },
        { "B0":4,  "B1":5,  "B2":12,  "B3":7,  "B4":8,  "I0":27,  "I1":20,  "I2":19,  "I3":29,  "I4":25,  "N0":44,  "N1":35,  "N2":42,  "N3":31,  "N4":37,  "G0":56,  "G1":51,  "G2":49,  "G3":55,  "G4":47,  "O0":68,  "O1":64,  "O2":70,  "O3":73,  "O4":66 },
        { "B0":3,  "B1":2,  "B2":5,  "B3":8,  "B4":9,  "I0":23,  "I1":27,  "I2":18,  "I3":24,  "I4":20,  "N0":43,  "N1":42,  "N2":32,  "N3":39,  "N4":44,  "G0":59,  "G1":46,  "G2":47,  "G3":53,  "G4":52,  "O0":62,  "O1":68,  "O2":72,  "O3":63,  "O4":61 },
        { "B0":6,  "B1":7,  "B2":8,  "B3":3,  "B4":4,  "I0":20,  "I1":21,  "I2":29,  "I3":16,  "I4":18,  "N0":41,  "N1":43,  "N2":39,  "N3":36,  "N4":33,  "G0":50,  "G1":54,  "G2":55,  "G3":57,  "G4":51,  "O0":63,  "O1":74,  "O2":64,  "O3":65,  "O4":69 },
        { "B0":6,  "B1":4,  "B2":2,  "B3":9,  "B4":10,  "I0":18,  "I1":16,  "I2":28,  "I3":19,  "I4":29,  "N0":37,  "N1":38,  "N2":44,  "N3":31,  "N4":41,  "G0":55,  "G1":53,  "G2":52,  "G3":59,  "G4":47,  "O0":70,  "O1":68,  "O2":72,  "O3":66,  "O4":74 },
        { "B0":4,  "B1":6,  "B2":13,  "B3":3,  "B4":9,  "I0":25,  "I1":18,  "I2":24,  "I3":22,  "I4":27,  "N0":36,  "N1":43,  "N2":38,  "N3":33,  "N4":31,  "G0":49,  "G1":50,  "G2":56,  "G3":57,  "G4":48,  "O0":71,  "O1":73,  "O2":70,  "O3":74,  "O4":72 },
        { "B0":10,  "B1":7,  "B2":6,  "B3":14,  "B4":8,  "I0":22,  "I1":25,  "I2":26,  "I3":27,  "I4":16,  "N0":43,  "N1":35,  "N2":41,  "N3":38,  "N4":44,  "G0":48,  "G1":54,  "G2":53,  "G3":59,  "G4":56,  "O0":73,  "O1":69,  "O2":70,  "O3":66,  "O4":67 },
        { "B0":8,  "B1":3,  "B2":10,  "B3":13,  "B4":5,  "I0":21,  "I1":28,  "I2":19,  "I3":24,  "I4":29,  "N0":39,  "N1":36,  "N2":42,  "N3":44,  "N4":41,  "G0":46,  "G1":56,  "G2":50,  "G3":47,  "G4":52,  "O0":72,  "O1":61,  "O2":70,  "O3":62,  "O4":65 },
        { "B0":11,  "B1":14,  "B2":1,  "B3":4,  "B4":8,  "I0":18,  "I1":17,  "I2":22,  "I3":20,  "I4":16,  "N0":44,  "N1":41,  "N2":31,  "N3":32,  "N4":36,  "G0":46,  "G1":54,  "G2":52,  "G3":55,  "G4":47,  "O0":72,  "O1":63,  "O2":61,  "O3":65,  "O4":66 },
        { "B0":1,  "B1":7,  "B2":11,  "B3":9,  "B4":10,  "I0":16,  "I1":27,  "I2":20,  "I3":23,  "I4":22,  "N0":44,  "N1":31,  "N2":39,  "N3":40,  "N4":32,  "G0":48,  "G1":56,  "G2":52,  "G3":46,  "G4":59,  "O0":65,  "O1":66,  "O2":63,  "O3":69,  "O4":67 },
        { "B0":12,  "B1":5,  "B2":2,  "B3":6,  "B4":3,  "I0":26,  "I1":29,  "I2":17,  "I3":27,  "I4":22,  "N0":42,  "N1":41,  "N2":37,  "N3":34,  "N4":32,  "G0":55,  "G1":52,  "G2":58,  "G3":54,  "G4":53,  "O0":67,  "O1":70,  "O2":63,  "O3":66,  "O4":61 },
        { "B0":5,  "B1":7,  "B2":3,  "B3":8,  "B4":11,  "I0":17,  "I1":27,  "I2":22,  "I3":25,  "I4":19,  "N0":43,  "N1":41,  "N2":40,  "N3":37,  "N4":38,  "G0":52,  "G1":53,  "G2":59,  "G3":56,  "G4":50,  "O0":64,  "O1":66,  "O2":69,  "O3":70,  "O4":65 },
        { "B0":5,  "B1":4,  "B2":6,  "B3":7,  "B4":8,  "I0":22,  "I1":24,  "I2":16,  "I3":26,  "I4":25,  "N0":32,  "N1":40,  "N2":43,  "N3":31,  "N4":41,  "G0":53,  "G1":52,  "G2":56,  "G3":48,  "G4":46,  "O0":67,  "O1":71,  "O2":68,  "O3":69,  "O4":73 },
        { "B0":4,  "B1":14,  "B2":12,  "B3":1,  "B4":3,  "I0":21,  "I1":28,  "I2":18,  "I3":26,  "I4":19,  "N0":34,  "N1":38,  "N2":41,  "N3":35,  "N4":32,  "G0":47,  "G1":46,  "G2":59,  "G3":51,  "G4":54,  "O0":73,  "O1":74,  "O2":68,  "O3":70,  "O4":65 },
        { "B0":8,  "B1":3,  "B2":11,  "B3":6,  "B4":2,  "I0":27,  "I1":16,  "I2":25,  "I3":22,  "I4":23,  "N0":32,  "N1":36,  "N2":41,  "N3":33,  "N4":38,  "G0":49,  "G1":48,  "G2":54,  "G3":52,  "G4":50,  "O0":62,  "O1":67,  "O2":63,  "O3":69,  "O4":65 },
        { "B0":13,  "B1":3,  "B2":7,  "B3":4,  "B4":2,  "I0":29,  "I1":21,  "I2":28,  "I3":25,  "I4":23,  "N0":41,  "N1":31,  "N2":43,  "N3":38,  "N4":44,  "G0":48,  "G1":54,  "G2":55,  "G3":58,  "G4":53,  "O0":68,  "O1":67,  "O2":73,  "O3":69,  "O4":71 },
        { "B0":1,  "B1":13,  "B2":8,  "B3":11,  "B4":14,  "I0":17,  "I1":28,  "I2":27,  "I3":25,  "I4":20,  "N0":32,  "N1":39,  "N2":35,  "N3":33,  "N4":34,  "G0":53,  "G1":57,  "G2":54,  "G3":48,  "G4":50,  "O0":67,  "O1":61,  "O2":64,  "O3":71,  "O4":66 },
        { "B0":12,  "B1":11,  "B2":10,  "B3":6,  "B4":3,  "I0":18,  "I1":17,  "I2":29,  "I3":20,  "I4":23,  "N0":40,  "N1":43,  "N2":32,  "N3":31,  "N4":41,  "G0":57,  "G1":46,  "G2":59,  "G3":53,  "G4":56,  "O0":73,  "O1":63,  "O2":71,  "O3":64,  "O4":69 },
        { "B0":2,  "B1":1,  "B2":13,  "B3":6,  "B4":7,  "I0":26,  "I1":21,  "I2":19,  "I3":28,  "I4":27,  "N0":43,  "N1":34,  "N2":38,  "N3":44,  "N4":40,  "G0":59,  "G1":51,  "G2":50,  "G3":57,  "G4":46,  "O0":65,  "O1":69,  "O2":61,  "O3":67,  "O4":62 },
        { "B0":13,  "B1":14,  "B2":2,  "B3":8,  "B4":5,  "I0":27,  "I1":16,  "I2":29,  "I3":28,  "I4":20,  "N0":35,  "N1":42,  "N2":39,  "N3":33,  "N4":44,  "G0":52,  "G1":51,  "G2":53,  "G3":46,  "G4":54,  "O0":65,  "O1":69,  "O2":72,  "O3":74,  "O4":62 },
        { "B0":3,  "B1":7,  "B2":14,  "B3":8,  "B4":11,  "I0":19,  "I1":21,  "I2":20,  "I3":29,  "I4":27,  "N0":38,  "N1":41,  "N2":32,  "N3":42,  "N4":39,  "G0":56,  "G1":58,  "G2":50,  "G3":59,  "G4":53,  "O0":74,  "O1":67,  "O2":70,  "O3":61,  "O4":64 },
        { "B0":3,  "B1":1,  "B2":2,  "B3":8,  "B4":12,  "I0":23,  "I1":20,  "I2":19,  "I3":28,  "I4":26,  "N0":40,  "N1":32,  "N2":44,  "N3":38,  "N4":42,  "G0":52,  "G1":51,  "G2":54,  "G3":56,  "G4":55,  "O0":70,  "O1":71,  "O2":63,  "O3":61,  "O4":73 },
        { "B0":9,  "B1":11,  "B2":13,  "B3":14,  "B4":1,  "I0":26,  "I1":25,  "I2":29,  "I3":19,  "I4":28,  "N0":37,  "N1":38,  "N2":43,  "N3":39,  "N4":41,  "G0":49,  "G1":52,  "G2":58,  "G3":53,  "G4":59,  "O0":67,  "O1":68,  "O2":62,  "O3":66,  "O4":61 },
        { "B0":8,  "B1":10,  "B2":9,  "B3":2,  "B4":1,  "I0":25,  "I1":23,  "I2":29,  "I3":19,  "I4":18,  "N0":34,  "N1":42,  "N2":32,  "N3":41,  "N4":36,  "G0":59,  "G1":58,  "G2":53,  "G3":52,  "G4":51,  "O0":73,  "O1":65,  "O2":67,  "O3":70,  "O4":62 },
        { "B0":1,  "B1":4,  "B2":13,  "B3":8,  "B4":10,  "I0":16,  "I1":28,  "I2":23,  "I3":25,  "I4":20,  "N0":41,  "N1":32,  "N2":34,  "N3":40,  "N4":36,  "G0":49,  "G1":56,  "G2":59,  "G3":47,  "G4":46,  "O0":73,  "O1":72,  "O2":65,  "O3":61,  "O4":74 },
        { "B0":1,  "B1":7,  "B2":6,  "B3":4,  "B4":9,  "I0":21,  "I1":22,  "I2":27,  "I3":23,  "I4":24,  "N0":32,  "N1":44,  "N2":36,  "N3":35,  "N4":33,  "G0":55,  "G1":49,  "G2":53,  "G3":51,  "G4":54,  "O0":67,  "O1":69,  "O2":74,  "O3":65,  "O4":63 } 
        ];
        
    
    //console.log(arr);   
    let ganador=0;
    for (let x = 0; x < 99; x++) 
    {
        // 4 esquinas 
        //console.log(card[x]["B0"]);

        if (arr.includes(card[x]["B0"]) && arr.includes(card[x]["I1"]) && arr.includes(card[x]["N2"])  && arr.includes(card[x]["G3"]) && arr.includes(card[x]["O4"]) )
        {
            ganador= x;
           console.log("Carton "+ x + " diagonal 1 . . .")
        }

        if (arr.includes(card[x]["B4"]) && arr.includes(card[x]["I3"]) && arr.includes(card[x]["N2"])  && arr.includes(card[x]["G1"]) && arr.includes(card[x]["O0"]) )
        {
            ganador= x;
           console.log("Carton "+ x + " diagonal 2 . . .")
        }

    }

    return ganador;
}
