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

def build_prompt(query, context):
    return f"""
You are an academic tutor.

Task:
{query}

Context:
{context}

Rules:
- Use simple language
- Use bullet points with hyphens (-) ONLY
- Do NOT use asterisks (*)
- Do NOT use markdown formatting
- No hallucinations

Format example:
- First point
- Second point
- Third point
"""


def rag_summarize(document_text: str, query: str) -> str:
    cleaned_text = clean_text(document_text)
    chunks = chunk_text(cleaned_text)

    context = chunks[0]  # basic RAG

    prompt = build_prompt(query, context)  # ✅ use the new function

    print("===== PROMPT SENT TO LLM =====")
    print(prompt)

    response = ollama.generate(
        model="gemma3:1b",
        prompt=prompt
    )

    return response.get("response", "").strip()
