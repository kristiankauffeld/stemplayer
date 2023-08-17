Stems are the musical building blocks of a song. Examples of the stems contained in a song might be the vocals, guitars, or drums.

build the image using the `docker build` command:

```sh
docker build -t streaming-service --file Dockerfile .
```

use the `docker run` command to instantiate the image as a container:

```sh
docker run -d -p 3000:3000 -e PORT=3000 streaming-service
```
