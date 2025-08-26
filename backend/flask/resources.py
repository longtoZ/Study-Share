from pdf2image import convert_from_path
from docx2pdf import convert
from PIL import Image
import os

def docx_to_pdf(docx_path, output_dir):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Convert DOCX to PDF
    pdf_path = os.path.join(output_dir, "output.pdf")
    convert(docx_path, pdf_path)
    print(f"Converted {docx_path} to {pdf_path}")

def pdf_to_webp(pdf_path, output_dir, quality):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Convert PDF pages to images
    images = convert_from_path(pdf_path, dpi=140)

    # Convert each page to WebP
    for i, image in enumerate(images):
        # Define output file path
        output_path = os.path.join(output_dir, f"page_{i+1}.webp")
        
        # Convert to WebP using Pillow
        image.save(output_path, 'WEBP', quality=quality)
        print(f"Saved {output_path}")

# Example usage
docx_path = "cnvmt.docx"
output_dir = "output_pdf"
docx_to_pdf(docx_path, output_dir)

pdf_path = os.path.join(output_dir, "output.pdf")
output_dir_webp = "output_webp"
pdf_to_webp(pdf_path, output_dir_webp, quality=20)