import os
import time
import json
import requests
import pika

def get_weather(lat, lon):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": ["temperature_2m","relative_humidity_2m","wind_speed_10m","weather_code"],
        "hourly": ["precipitation_probability"],
        "timezone": "auto"
    }
    r = requests.get(url, params=params, timeout=20)
    r.raise_for_status()
    data = r.json()
    c = data.get("current", {})
    ts = c.get("time")
    rain_prob = None
    hourly = data.get("hourly", {})
    times = hourly.get("time", [])
    probs = hourly.get("precipitation_probability", [])
    if ts and times and probs and ts in times:
        idx = times.index(ts)
        rain_prob = probs[idx]
    code = c.get("weather_code")
    condition = "desconhecido"
    if code is not None:
        if code in [0]:
            condition = "ensolarado"
        elif code in [1,2,3]:
            condition = "nublado"
        elif code in [51,53,55,61,63,65,80,81,82]:
            condition = "chuvoso"
        elif code in [71,73,75,85,86]:
            condition = "neve"
    return {
        "timestamp": ts,
        "location": os.getenv("LOCATION_NAME", "Cidade"),
        "temperature": c.get("temperature_2m"),
        "humidity": c.get("relative_humidity_2m"),
        "windSpeed": c.get("wind_speed_10m"),
        "condition": condition,
        "rainProbability": rain_prob
    }

def publish(payload):
    url = os.getenv("RABBITMQ_URL", "amqp://localhost:5672")
    queue = os.getenv("QUEUE_NAME", "weather_logs")
    params = pika.URLParameters(url)
    conn = pika.BlockingConnection(params)
    ch = conn.channel()
    ch.queue_declare(queue=queue, durable=True)
    body = json.dumps(payload)
    ch.basic_publish(exchange="", routing_key=queue, body=body, properties=pika.BasicProperties(delivery_mode=2))
    conn.close()

def main():
    lat = float(os.getenv("LATITUDE", "-23.5505"))
    lon = float(os.getenv("LONGITUDE", "-46.6333"))
    interval = int(os.getenv("COLLECT_INTERVAL_MINUTES", "60"))
    while True:
        try:
            data = get_weather(lat, lon)
            publish(data)
        except Exception:
            pass
        time.sleep(interval * 60)

if __name__ == "__main__":
    main()
