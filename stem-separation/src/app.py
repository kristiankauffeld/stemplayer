from fastapi import FastAPI

app = FastAPI(debug=True)


@app.get("/")
def index():
    return {"details": "Hello world!"}
