from fastapi import FastAPI
import pika
import os
from urllib.parse import urlparse
import threading

app = FastAPI(debug=True)

# RabbitMQ server connection parameters
RABBIT = os.getenv("RABBIT")

if RABBIT is None:
    raise ValueError("RABBIT environment variable is not set")

parsed_url = urlparse(RABBIT)
queue_name = "StemSeparation"

# Connect to RabbitMQ
connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host=parsed_url.hostname,
        port=parsed_url.port,
        credentials=pika.PlainCredentials(parsed_url.username, parsed_url.password),
    )
)

channel = connection.channel()

# Check if queue already exists, and create if necessary
channel.queue_declare(
    queue=queue_name, durable=True
)  # Durable ensures the queue survives broker restarts


# A message handler function to receive incoming messages
def consume_separation_message(ch, method, properties, body):
    print(f"Received audio for stem separation: {body.decode('utf-8')}")
    # TODO: Add your stem separation logic here
    ch.basic_ack(delivery_tag=method.delivery_tag)  # Acknowledge receipt of message


# Start receiving messages from the "StemSeparation" queue
channel.basic_consume(
    queue=queue_name, on_message_callback=consume_separation_message, auto_ack=False
)


def start_rabbitmq_consumer():
    channel.start_consuming()


# Start the RabbitMQ consumer in a separate thread
rabbitmq_thread = threading.Thread(target=start_rabbitmq_consumer)
rabbitmq_thread.start()


@app.get("/")
def index():
    return {"details": "Hello world!"}
