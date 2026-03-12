package main

import (
	"bytes"
	"context"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/traefik/yaegi/interp"
	"github.com/traefik/yaegi/stdlib"
)

type Event struct {
	Code string `json:"code"`
}

type Response struct {
	Output string `json:"output"`
	Error  string `json:"error,omitempty"`
}

func handler(ctx context.Context, event Event) (Response, error) {
	var output bytes.Buffer

	i := interp.New(interp.Options{Stdout: &output, Stderr: &output})
	i.Use(stdlib.Symbols)

	if _, err := i.Eval(`import "fmt"`); err != nil {
		return Response{Error: err.Error()}, nil
	}

	if _, err := i.Eval(event.Code); err != nil {
		return Response{Error: err.Error()}, nil
	}

	return Response{Output: output.String()}, nil
}

func main() {
	lambda.Start(handler)
}
