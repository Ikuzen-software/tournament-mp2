import WebSocket from 'ws';

const client = new WebSocket('ws://localhost:8080');

console.log("test")
client.on('open', (ws:WebSocket)=>{
    console.log('connected', ws);
    client.send('sade')
} )

client.on('close',(e)=>{
    console.log("error",e)
})

client.on('message',(message)=>{
    console.log('received from server : ', message)
})