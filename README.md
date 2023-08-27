Stems are the musical building blocks of a song. Examples of the stems contained in a song might be the vocals, guitars, or drums.

### Services:

1. Streaming Service: For serving the separated stems to the client.
2. Song separation/Demucs: For processing a song and creating separated stems (drums, bass, vocals, etc.).
3. Song Upload Service: For handling the song input (in this simple version, reading a song from the local filesystem).

### Asynchronous vs. Synchronous Communication Style:

This application uses an asynchronous communication style since a synchronous communication would have issues like:

- Back Pressure: If the separation service can't process requests as fast as they're coming in, it could get overwhelmed.

- Coupling: This form of interaction creates a tight coupling between the services. If the separation service is down, the upload service can't proceed with its task.

- Resource Utilization: The upload service would have to keep the HTTP connection open until the separation service finishes the task, which could be resource-intensive for long operations.

Therefore there is a message queue between the song-upload service and the stem-separation service. The upload service can push a message into the queue, and the separation service (the consumer service) can pull from it at its own pace. This approach is fundamentally different from a direct HTTP POST, where the receiver must process the request immediately or fail.

### Single-Cecipient Messages vs. Multiple-Recipient (or broadcast-style) Messages

The interaction between the song-upload service and the stem-separation service, uses the single-recipient model to ensure that each uploaded song gets processed exactly once.

Once the song has been processed into stems, we use the multiple-recipient message model to notify multiple services that may be interested in this event, such as the streaming-service, a caching service, or perhaps an analytics service that tracks how many songs have been processed.

### RabbitMQ:

RabbitMQ dashboard can be accessed at http://localhost:15672/. You can login with the default user name, guest, and the default password, guest.

### Testing:

Use a tool like Postman or Insomnia and send a POST request to "http://localhost:4001/upload", and you should receive the following JSON response:

```sh
{
	"status": "success",
	"message": "Received request"
}
```

the HTTP POST request received by the song upload microservice's endpoint "/upload", is forwarded to the Music Source Separation microservice's endpoint "process_audio" which returns this simple JSON response.

### Build and boot a single service:

build the image using the `docker build` command:

```sh
docker build -t streaming-service --file Dockerfile .
```

use the `docker run` command to instantiate the image as a container:

```sh
docker run -d -p 3000:3000 -e PORT=3000 streaming-service
```

### Build and boot a whole application:

invoke the `docker compose up` command:

```sh
docker compose up --build
```

stop the containers with:

```sh
docker compose down
```
