from fastapi import FastAPI, UploadFile, Form
from pathlib import Path
import shutil

app = FastAPI()

@app.post("/rag-summarize")
async def rag_summarize_api(
    file: UploadFile,
    query: str = Form("Summarize the key points of this document")
):
    temp_path = Path("temp") / file.filename
    temp_path.parent.mkdir(exist_ok=True)

    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    text = read_file(temp_path)
    answer = rag_summarize(text, query)

    return {
        "filename": file.filename,
        "summary": answer
    }
