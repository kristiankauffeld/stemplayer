from fastapi import FastAPI

app = FastAPI(debug=True)


@app.get("/")
def index():
    return {"details": "Hello world!"}


@app.post("/process_audio/")
async def process_audio():
    print("Received request")
    return {"status": "success", "message": "Received request"}
