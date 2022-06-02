const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader") 
// https://grpc.io/docs/languages/node/basics/#loading-service-descriptors-from-proto-files

var PROTO_PATH = __dirname + "/clientstreaming/clientstreaming.proto";
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

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition).clientstreaming;

var client = new protoDescriptor.ClientStreaming("localhost:50051", grpc.credentials.createInsecure());
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
    var call = client.GetServerResponse( // response : callback.
        function(err, retMsg){
            if (err){
                console.log(err);
            }else{
                console.log(`[server to client] ${retMsg.value}`);
            }
        }
    );
    var msgs = generate_message();
    for (idx in msgs)
        call.write(msgs[idx]); // client streaming.
    
    setTimeout(() => {
        call.end();        
    }, 1500); // wait 1.5s
}

main();