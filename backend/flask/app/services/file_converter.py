from pdf2image import convert_from_path
from docx2pdf import convert
import os

def pdf_to_webp(pdf_path, output_dir, prefix, quality = 20):
    """
    Converts a PDF file to WebP images.

    Args:
        pdf_path (str): The path to the input PDF file.
        output_dir (str): The directory to save the output WebP images.
        quality (int): The quality of the WebP images (0-100).
    """
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        # Convert PDF pages to images
        images = convert_from_path(pdf_path, dpi = 140)

        # Convert each page to WebP
        for i, image in enumerate(images):
            # Define output file path
            output_path = os.path.join(output_dir, f"{prefix}_page_{i+1}.webp")

            # Convert to WebP using Pillow
            image.save(output_path, 'WEBP', quality=quality)
            print(f"Saved {output_path}")

    except Exception as e:
        # Raise an exception if conversion fails
        raise RuntimeError(f"An error occurred during PDF to WebP conversion: {str(e)}")

def docx_to_pdf(docx_path, output_dir, output_pdf_filename):
    # Add .docx extension if not present. This ensure convert() works correctly
    if not docx_path.endswith('.docx'):
        docx_path += '.docx'

    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Convert DOCX to PDF
    pdf_path = os.path.join(output_dir, output_pdf_filename)

    try:
        convert(docx_path, pdf_path)
        print(f"Converted {docx_path} to {pdf_path}")
    except Exception as e:
        raise RuntimeError(f"An error occurred during DOCX to PDF conversion: {str(e)}")