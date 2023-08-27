from fastapi import FastAPI

app = FastAPI(debug=True)


@app.get("/")
def index():
    return {"details": "Hello world!"}


@app.post("/process_audio/")
async def create_stems():
    print("Received request")
    return {"status": "success", "message": "Received request"}
