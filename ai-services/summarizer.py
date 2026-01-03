import os
from pathlib import Path
import re
import numpy as np
import pandas as pd
import ollama
from sentence_transformers import SentenceTransformer
import PyPDF2


def read_file(file_path: Path) -> str:
    """
    Read file content from .txt or .pdf.
    """
    if file_path.suffix.lower() == ".txt":
        return file_path.read_text(encoding="utf-8")
    elif file_path.suffix.lower() == ".pdf":
        text = ""
        with file_path.open("rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    else:
        raise ValueError(f"Unsupported file type: {file_path.suffix}")


def clean_text(text: str) -> str:
    """
    Remove sections like 'Bibliography' or 'References' if present.
    """
    match = re.search(r"(Bibliography|References)", text, re.IGNORECASE)
    return text[:match.start()] if match else text


def chunk_text(text: str, max_chunk_length: int = 2500) -> list:
    """
    Split text into smaller chunks; for RAG, shorter chunks are easier to retrieve.
    """
    paragraphs = text.split("\n")
    chunks = []
    current_chunk = ""
    for para in paragraphs:
        if len(current_chunk) + len(para) + 1 > max_chunk_length:
            chunks.append(current_chunk.strip())
            current_chunk = para + "\n"
        else:
            current_chunk += para + "\n"
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks


def embed_chunks(chunks: list, embedder) -> np.ndarray:
    """
    Compute embedding for each chunk.
    """
    return np.array([embedder.encode(chunk) for chunk in chunks])


def retrieve_relevant_chunks(query: str, chunks: list, chunk_embeddings: np.ndarray,
                              embedder, top_k: int = 3) -> list:
    """
    Retrieve top_k chunks that are most similar to the query.
    """
    query_embedding = embedder.encode(query)
    norms = np.linalg.norm(chunk_embeddings, axis=1) * np.linalg.norm(query_embedding)
    similarities = np.dot(chunk_embeddings, query_embedding) / (norms + 1e-10)
    top_indices = np.argsort(similarities)[-top_k:][::-1]
    return [chunks[i] for i in top_indices]


def rag_summarize(document_text: str, query: str) -> str:
    """
    Given a document and a query, retrieve top relevant chunks and use them to prompt the LLM.
    """
    cleaned_text = clean_text(document_text)
    chunks = chunk_text(cleaned_text)
    print(f"Document split into {len(chunks)} chunks.")

    embedder = SentenceTransformer("all-MiniLM-L6-v2")
    embeddings = embed_chunks(chunks, embedder)
    relevant_chunks = retrieve_relevant_chunks(query, chunks, embeddings, embedder, top_k=3)
    context = "\n".join(relevant_chunks)

    prompt = (f"Question: {query}\n\nContext:\n{context}\n\n"
              "Provide a detailed yet concise summary in 2–10 paragraphs based strictly on the context:")
    response = ollama.generate(model="gemma3:1b", prompt=prompt)
    return response.get("response", "").strip()


def process_file(file_path: Path, output_folder: Path, query: str) -> tuple[str, str] or None:
    """
    Process a file using RAG: read the file, summarize it,
    save the summary as a .txt file, and return (filename, summary).
    """
    try:
        text = read_file(file_path)
    except Exception as e:
        print(f"Error reading {file_path.name}: {e}")
        return None

    try:
        answer = rag_summarize(text, query)
        output_file = output_folder / f"{file_path.stem}_rag_answer.txt"
        output_file.write_text(answer, encoding="utf-8")
        print(f"RAG answer for {file_path.name} saved to {output_file}")
        return file_path.name, answer
    except Exception as e:
        print(f"Error summarizing {file_path.name}: {e}")
        return None


def main():
    input_folder = Path("input")
    output_folder = Path("output_rag")
    output_folder.mkdir(exist_ok=True)

    query = "Summarize the key points of this document or the main argument."
    files = list(input_folder.glob("*.txt")) + list(input_folder.glob("*.pdf")) + list(input_folder.glob("*.PDF"))

    if not files:
        print("No supported files found in the input folder.")
        return

    results = []
    for file in files:
        print(f"\nProcessing file: {file.name} with RAG.")
        result = process_file(file, output_folder, query)
        if result:
            results.append(result)

    if results:
        df = pd.DataFrame(results, columns=["Filename", "Summary"])
        excel_path = output_folder / "summaries.xlsx"
        df.to_excel(excel_path, index=False)
        print(f"\nAll summaries saved to {excel_path}")


if __name__ == "__main__":
    main()