Stems are the musical building blocks of a song. Examples of the stems contained in a song might be the vocals, guitars, or drums.

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
