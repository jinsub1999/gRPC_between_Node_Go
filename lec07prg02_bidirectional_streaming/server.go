package main

import (
	"fmt"
	"io"
	pb "lec07prg02/bidirectional"
	"log"
	"net"

	"google.golang.org/grpc"
)

type MyServiceServer struct {
	pb.UnimplementedBidirectionalServer

	// mu sync.Mutex
}

func (s *MyServiceServer) GetServerResponse(stream pb.Bidirectional_GetServerResponseServer) error {
	log.Printf("Server processing gRPC bidirectional streaming.\n")
	for {
		in, err := stream.Recv()
		if err == io.EOF { // client ended connection.
			return nil
		}
		if err != nil {
			return err
		}
		if err := stream.Send(in); err != nil { // send back to client.
			return err
		}
	}
}

func main() {
	port := 50051

	lis, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", port))
	if err != nil {
		log.Fatal(err)
	}

	s := grpc.NewServer()
	serviceServer := &MyServiceServer{}
	pb.RegisterBidirectionalServer(s, serviceServer)
	log.Printf("Starting server. Listening on port %d.\n", port)

	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
