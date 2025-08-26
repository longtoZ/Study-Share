import os
from flask import Blueprint, request, jsonify
from .services import file_converter
from werkzeug.utils import secure_filename

# Create a Blueprint for the routes. A blueprint is a way to organize a group
# of related views and other functions.
bp = Blueprint('routes', __name__, url_prefix='/')

# Define allowed extensions for file uploads
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

def allowed_file(filename):
    """
    Check if the file extension is allowed.
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/convert/pdf-to-webp', methods=['POST'])
def convert_pdf_to_webp():
    """
    API endpoint to convert a PDF file to WebP images.
    """

    print(request.files)
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Check if the file is a PDF and save it securely
    if file and allowed_file(file.filename):
        # Secure the filename to prevent directory traversal attacks
        filename = secure_filename(file.filename)
        upload_folder = 'uploads'
        os.makedirs(upload_folder, exist_ok=True)
        pdf_path = os.path.join(upload_folder, filename)
        file.save(pdf_path)

        # Get quality from form data, default to 20 if not provided
        quality = int(request.form.get('quality', 20))

        try:
            # Call the file conversion service
            output_dir_webp = 'output_webp'
            file_converter.pdf_to_webp(pdf_path, output_dir_webp, quality)
            return jsonify({'message': 'PDF converted to WebP successfully'}), 200
        except Exception as e:
            # Handle any errors during conversion
            return jsonify({'error': f'Conversion failed: {str(e)}'}), 500
        # finally:
            # Clean up the uploaded file
            # os.remove(pdf_path)
            # You might want to handle cleanup of converted files as well

    return jsonify({'error': 'File type not allowed'}), 400

@bp.route('/convert/docx-to-webp', methods=['POST'])
def convert_docx_to_webp():
    """
    API endpoint to convert a DOCX file to WebP images.
    """
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Check if the file is a DOCX and save it securely
    if file and allowed_file(file.filename):
        # Secure the filename to prevent directory traversal attacks
        filename = secure_filename(file.filename)
        upload_folder = 'uploads'
        os.makedirs(upload_folder, exist_ok=True)
        docx_path = os.path.join(upload_folder, filename)
        file.save(docx_path)

        try:
            # Call the file conversion service
            output_dir_pdf = 'output_pdf'
            file_converter.docx_to_pdf(docx_path, output_dir_pdf)
            pdf_filename = os.path.join(output_dir_pdf, "output.pdf")

            # Convert PDF to WebP
            output_dir_webp = 'output_webp'
            os.makedirs(output_dir_webp, exist_ok=True)
            file_converter.pdf_to_webp(pdf_filename, output_dir_webp)
            return jsonify({'message': 'DOCX converted to WebP successfully'}), 200
        except Exception as e:
            # Handle any errors during conversion
            return jsonify({'error': f'Conversion failed: {str(e)}'}), 500
        # finally:
            # Clean up the uploaded file
            # os.remove(docx_path)
            # You might want to handle cleanup of converted files as well

    return jsonify({'error': 'File type not allowed'}), 400