from pathlib import Path
import re
import numpy as np
import ollama
from sentence_transformers import SentenceTransformer
import PyPDF2

def read_file(file_path: Path) -> str:
    if file_path.suffix.lower() == ".pdf":
        text = ""
        with file_path.open("rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    elif file_path.suffix.lower() == ".txt":
        return file_path.read_text(encoding="utf-8")
    else:
        raise ValueError("Unsupported file type")

def clean_text(text: str) -> str:
    match = re.search(r"(Bibliography|References)", text, re.IGNORECASE)
    return text[:match.start()] if match else text

def chunk_text(text: str, max_chunk_length: int = 2500) -> list:
    return [text[i:i+max_chunk_length] for i in range(0, len(text), max_chunk_length)]

def rag_summarize(document_text: str, query: str) -> str:
    cleaned_text = clean_text(document_text)
    chunks = chunk_text(cleaned_text)

    embedder = SentenceTransformer("all-MiniLM-L6-v2")
    embeddings = [embedder.encode(chunk) for chunk in chunks]

    prompt = f"""
    Question: {query}

    Context:
    {chunks[0]}

    Provide a concise summary.
    """

    response = ollama.generate(
        model="gemma3:1b",
        prompt=prompt
    )

    return response["response"]
