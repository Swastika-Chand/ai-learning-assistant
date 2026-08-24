import fitz


def extract_text_from_pdf(pdf_path: str) -> str:
    text = ""

    pdf = fitz.open(pdf_path)

    for page in pdf:
        text += page.get_text()

    pdf.close()

    return text