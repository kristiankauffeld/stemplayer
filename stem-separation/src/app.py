from fastapi import FastAPI
import pika
import os
from urllib.parse import urlparse

app = FastAPI(debug=True)

# RabbitMQ server connection parameters
RABBIT = os.getenv("RABBIT")

if RABBIT is None:
    raise ValueError("RABBIT environment variable is not set")

parsed_url = urlparse(RABBIT)
queue_name = "SeparationQueue"

# Connect to RabbitMQ
connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host=parsed_url.hostname,
        port=parsed_url.port,
        credentials=pika.PlainCredentials(parsed_url.username, parsed_url.password),
    )
)

channel = connection.channel()

# Declare the queue
channel.queue_declare(queue=queue_name)


def callback(ch, method, properties, body):
    print(f"Received song data: {body}")
    # Here you would add your music separation logic
    print("Processing audio...")


# Consume messages from the RabbitMQ queue
channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)


@app.get("/")
def index():
    return {"details": "Hello world!"}


@app.post("/process_audio/")
async def create_stems():
    print("Received request")
    return {"status": "success", "message": "Received request"}
