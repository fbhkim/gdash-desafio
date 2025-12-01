FROM golang:1.22-alpine AS build
WORKDIR /app
ENV GOPROXY=direct
ENV GOSUMDB=off
RUN apk add --no-cache git
COPY . .
RUN rm -f go.sum && go mod tidy && go mod vendor && go build -mod=vendor -o worker

FROM alpine:3.19
WORKDIR /app
COPY --from=build /app/worker ./worker
CMD ["/app/worker"]
