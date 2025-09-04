import os
from flask import Blueprint, request, jsonify
from .services import file_converter
from werkzeug.utils import secure_filename
from .services.supabase_client import upload_and_get_link
from .services.file_content_extractor import extract_all_pages_content

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
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    storage_filename = request.form.get('storage_filename', None)
    print(file, storage_filename)

    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Check if the file is a PDF and save it securely
    if file and allowed_file(file.filename):
        # Secure the filename to prevent directory traversal attacks
        filename = secure_filename(storage_filename)
        upload_folder = 'uploads'
        os.makedirs(upload_folder, exist_ok=True)
        pdf_path = os.path.join(upload_folder, filename)
        file.save(pdf_path)

        # Get quality from form data, default to 20 if not provided
        quality = int(request.form.get('quality', 20))

        # Extract content from the PDF
        content = extract_all_pages_content(pdf_path, mime_type='application/pdf')
        print("Extracted Content:", content)

        # Convert PDF to WebP
        try:
            output_dir_webp = os.path.join('output_webp', filename)
            prefix = filename
            file_converter.pdf_to_webp(pdf_path, output_dir_webp, prefix, quality)

            public_links = []
            files_list = sorted(os.listdir(output_dir_webp), key=lambda x: int(x.split('_')[-1].split('.')[0])) # Sort files by page number

            for i in range(len(files_list)):
                webp_filename = files_list[i]
                webp_path = os.path.join(output_dir_webp, webp_filename)
                webp_path = webp_path.replace("\\", "/")
                print(f'Uploading {webp_path}')
                public_link = upload_and_get_link(webp_path)
                public_links.append({
                    'page': i + 1,
                    'url': public_link
                })

            return jsonify({
                'message': 'PDF converted to WebP successfully',
                'public_links': public_links,
                'content': content.text,
                'usage': {
                    'prompt_token_count': content.usage.prompt_token_count,
                    'thoughts_token_count': content.usage.thoughts_token_count,
                    'total_token_count': content.usage.total_token_count
                }
            }), 200
        except Exception as e:
            # Handle any errors during conversion
            return jsonify({'error': f'Conversion failed: {str(e)}'}), 500
        finally:
            # Clean up the uploaded file
            os.remove(pdf_path)

            for file in os.listdir(output_dir_webp):
                os.remove(os.path.join(output_dir_webp, file))
            os.rmdir(output_dir_webp)

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
    storage_filename = request.form.get('storage_filename', None)

    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Check if the file is a DOCX and save it securely
    if file and allowed_file(file.filename):
        # Secure the filename to prevent directory traversal attacks
        filename = secure_filename(storage_filename)
        upload_folder = 'uploads'
        os.makedirs(upload_folder, exist_ok=True)
        docx_path = os.path.join(upload_folder, filename)

        # Save the uploaded DOCX file with the correct extension
        file.save(docx_path + '.docx')

        try:
            # Call the file conversion service
            output_dir_pdf = 'output_pdf'
            output_pdf_filename = f"{filename}.pdf"
            file_converter.docx_to_pdf(docx_path, output_dir_pdf, output_pdf_filename)
            pdf_filename = os.path.join(output_dir_pdf, output_pdf_filename)

            # Convert PDF to WebP
            output_dir_webp = os.path.join('output_webp', filename)
            prefix = filename
            os.makedirs(output_dir_webp, exist_ok=True)
            file_converter.pdf_to_webp(pdf_filename, output_dir_webp, prefix)
            
            public_links = []
            files_list = os.listdir(output_dir_webp)

            for i in range(len(files_list)):
                webp_filename = files_list[i]
                webp_path = os.path.join(output_dir_webp, webp_filename)
                webp_path = webp_path.replace("\\", "/")
                print(f'Uploading {webp_path}')
                public_link = upload_and_get_link(webp_path)
                public_links.append({
                    'page': i + 1,
                    'url': public_link
                })

            return jsonify({'message': 'DOCX converted to WebP successfully', 'public_links': public_links}), 200
        except Exception as e:
            # Handle any errors during conversion
            return jsonify({'error': f'Conversion failed: {str(e)}'}), 500
        finally:
            # Clean up the uploaded file
            os.remove(docx_path + '.docx')

            # Clean up the converted files
            os.remove(os.path.join(output_dir_pdf, output_pdf_filename))

            for file in os.listdir(output_dir_webp):
                os.remove(os.path.join(output_dir_webp, file))
            os.rmdir(output_dir_webp)

    return jsonify({'error': 'File type not allowed'}), 400