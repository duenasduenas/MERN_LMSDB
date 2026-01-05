from fastapi import FastAPI, UploadFile, Form
from pathlib import Path
import shutil

from rag import read_file, rag_summarize  # ✅ REQUIRED

app = FastAPI()

@app.post("/rag-summarize")
async def rag_summarize_api(
    file: UploadFile,
    query: str = Form("Provide a detailed yet concise summary in 2–10 paragraphs based strictly on the context:")
):
    temp_path = Path("temp") / file.filename
    temp_path.parent.mkdir(exist_ok=True)

    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    text = read_file(temp_path)
    summary = rag_summarize(text, query)

    return {
        "filename": file.filename,
        "summary": summary
    }


