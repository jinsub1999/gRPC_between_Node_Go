package main

import (
	"fmt"
	"io"
	pb "lec07prg03/clientstreaming"
	"log"
	"net"

	"google.golang.org/grpc"
)

type ClientStreamingServer struct {
	pb.UnimplementedClientStreamingServer
}

func (s *ClientStreamingServer) GetServerResponse(stream pb.ClientStreaming_GetServerResponseServer) error {
	log.Println("Server processing gRPC client-streaming")
	var count int32 = 0
	for {
		_, err := stream.Recv()
		if err == io.EOF {
			stream.SendAndClose(&pb.Number{Value: count}) // send and close connection.
			return nil
		}
		if err != nil {
			log.Fatal(err)
		}
		count++
	}
}

func main() {
	port := 50051

	lis, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", port))
	if err != nil {
		log.Fatal(err)
	}

	s := grpc.NewServer()
	serviceServer := &ClientStreamingServer{}
	pb.RegisterClientStreamingServer(s, serviceServer)
	log.Printf("Starting server. Listening on port %d.", port)

	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
