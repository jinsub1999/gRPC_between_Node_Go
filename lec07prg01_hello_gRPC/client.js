const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader") 
// https://grpc.io/docs/languages/node/basics/#loading-service-descriptors-from-proto-files

var PROTO_PATH = __dirname + "/hello_grpc/hello_grpc.proto";
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

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition).hellogrpc;
// console.log(protoDescriptor);
var client = new protoDescriptor.MyService("localhost:50051", grpc.credentials.createInsecure());
// stub

function main(){
    var arg = {value:4}; // message
    client.MyFunction(arg, function(err, ret){ // callback
        if (err){
            console.log(err);
        }else{
            console.log(`gRPC result: ${ret.value}`);
        }
    });
}

main();