const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader") 
// https://grpc.io/docs/languages/node/basics/#loading-service-descriptors-from-proto-files

var PROTO_PATH = __dirname + "/serverstreaming/serverstreaming.proto";
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

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition).serverstreaming;

var client = new protoDescriptor.ServerStreaming("localhost:50051", grpc.credentials.createInsecure());
// stub

function main(){
    var call = client.GetServerResponse({value:5});

    call.on('data', function(msg){ // streaming from server. five msgs.
        console.log(`[server to client] ${msg.message}`);
    })
    setTimeout(() => {
        
    }, 500); // wait 0.5s
}

main();