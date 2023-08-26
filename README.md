Stems are the musical building blocks of a song. Examples of the stems contained in a song might be the vocals, guitars, or drums.

### Services:

1. Streaming Service: For serving the separated stems to the client.
2. Song separation/Demucs: For processing a song and creating separated stems (drums, bass, vocals, etc.).
3. Song Upload Service: For handling the song input (in this simple version, reading a song from the local filesystem).

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
