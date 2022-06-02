package main

import (
	"fmt"
	pb "lec07prg04/serverstreaming"
	"log"
	"net"

	"google.golang.org/grpc"
)

type ServerStreamingServer struct {
	pb.UnimplementedServerStreamingServer
}

func (s *ServerStreamingServer) GetServerResponse(in *pb.Number, stream pb.ServerStreaming_GetServerResponseServer) error {
	log.Println("Server processing gRPC server-streaming")
	var i = 0
	var msgs []string
	for i := 1; i <= 5; i++ {
		msgs = append(msgs, fmt.Sprintf("message #%d", i))
	}
	for i < int(in.Value) {
		if err := stream.Send(&pb.Message{Message: msgs[i]}); err != nil {
			return err
		}
		i++
	}
	return nil
}

func main() {
	port := 50051

	lis, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", port))
	if err != nil {
		log.Fatal(err)
	}

	s := grpc.NewServer()
	serviceServer := &ServerStreamingServer{}
	pb.RegisterServerStreamingServer(s, serviceServer)
	log.Printf("Starting server. Listening on port %d.", port)

	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
