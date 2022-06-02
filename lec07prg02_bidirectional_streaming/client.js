const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader") 
// https://grpc.io/docs/languages/node/basics/#loading-service-descriptors-from-proto-files

var PROTO_PATH = __dirname + "/bidirectional/bidirectional.proto";
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition).bidirectional;
// console.log(protoDescriptor);
var client = new protoDescriptor.Bidirectional("localhost:50051", grpc.credentials.createInsecure());
// stub

function make_message(message){
    return {message: message}
}

function generate_message(){
    messages=[
        make_message("message #1"),
        make_message("message #2"),
        make_message("message #3"),
        make_message("message #4"),
        make_message("message #5"),
    ]
    for (idx in messages)
        console.log(`[client to server] ${messages[idx].message}`);

    return messages;
}

function main(){
    var call = client.GetServerResponse(); 
    call.on('data', function(retMsg){ // stream from server : callback. 
        console.log(`[server to client] ${retMsg.message}`)
    })

    var msgs = generate_message();

    for (var i = 0; i < 5; i++){ // streaming to server
        var msg = msgs[i];
        call.write(msg);
    }
    setTimeout(()=>{}, 1500); // wait 1.5s
    call.end();
}

main();