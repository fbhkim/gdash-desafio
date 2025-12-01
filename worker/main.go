package main

import (
  "bytes"
  "encoding/json"
  "io"
  "net/http"
  "os"
  "time"
  amqp "github.com/rabbitmq/amqp091-go"
)

type Weather struct {
  Location        string   `json:"location"`
  Temperature     float64  `json:"temperature"`
  Humidity        float64  `json:"humidity"`
  WindSpeed       float64  `json:"windSpeed"`
  Condition       string   `json:"condition"`
  RainProbability *float64 `json:"rainProbability"`
  Timestamp       string   `json:"timestamp"`
}

func postToAPI(w Weather) error {
  url := os.Getenv("API_URL")
  token := os.Getenv("INGEST_TOKEN")
  b, _ := json.Marshal(w)
  req, _ := http.NewRequest("POST", url, bytes.NewReader(b))
  req.Header.Set("Content-Type", "application/json")
  req.Header.Set("X-Ingest-Token", token)
  client := &http.Client{Timeout: 20 * time.Second}
  resp, err := client.Do(req)
  if err != nil {
    return err
  }
  io.Copy(io.Discard, resp.Body)
  resp.Body.Close()
  if resp.StatusCode >= 300 {
    return err
  }
  return nil
}

func main() {
  url := os.Getenv("RABBITMQ_URL")
  queue := os.Getenv("QUEUE_NAME")
  conn, err := amqp.Dial(url)
  if err != nil {
    time.Sleep(5 * time.Second)
    conn, err = amqp.Dial(url)
  }
  ch, err := conn.Channel()
  if err != nil {
    os.Exit(1)
  }
  _, err = ch.QueueDeclare(queue, true, false, false, false, nil)
  if err != nil {
    os.Exit(1)
  }
  msgs, err := ch.Consume(queue, "", false, false, false, false, nil)
  if err != nil {
    os.Exit(1)
  }
  for d := range msgs {
    var w Weather
    json.Unmarshal(d.Body, &w)
    err := postToAPI(w)
    if err != nil {
      ch.Nack(d.DeliveryTag, false, true)
      continue
    }
    ch.Ack(d.DeliveryTag, false)
  }
}
