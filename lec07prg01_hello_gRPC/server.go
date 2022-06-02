package main

import (
	"context"
	"fmt"
	pb "lec07prg01/hello_grpc"
	"log"
	"net"

	"google.golang.org/grpc"
)

type MyServiceServer struct {
	pb.UnimplementedMyServiceServer

	// mu sync.Mutex
}

func my_func(a int32) int32 {
	return a * a
}

func (s *MyServiceServer) MyFunction(ctx context.Context, in *pb.MyNumber) (*pb.MyNumber, error) {
	return &pb.MyNumber{Value: my_func(in.Value)}, nil // return to client.
}

func main() {
	port := 50051

	lis, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", port)) // binding.
	if err != nil {
		log.Fatal(err)
	}

	s := grpc.NewServer()
	serviceServer := &MyServiceServer{}
	pb.RegisterMyServiceServer(s, serviceServer)
	log.Printf("Starting server. Listening on port %d.", port)

	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
