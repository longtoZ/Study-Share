import os
import json
from ..config.celery import celery
from . import file_converter
from werkzeug.utils import secure_filename
from ..models.material import Material
from .file_content_extractor import extract_all_pages_content
import uuid
import time

ALLOWED_EXTENSIONS = {'pdf', 'docx'}
UPLOADS_FOLDER = 'uploads'
OUTPUT_WEBP_FOLDER = 'output_webp'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@celery.task(bind=True)
def convert_pdf_to_webp(self, file_info, form):
    print(form.get('info', '{}'))
    file_bytes = bytes.fromhex(file_info['data'])
    info = json.loads(form.get('info', '{}'))
    storage_filename = info["material_id"]
    task_id = str(uuid.uuid4())

    # Create a pending task record in Supabase
    task_record_content = "- [Step 1/5] Starting conversion task\n" # This content will be updated later
    Material.create_task_record(task_id, info["material_id"], task_record_content, "pending")
    start_time = time.time()

    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file_info['filename'] == '':
        return {'error': 'No selected file'}

    # Check if the file is a PDF and save it securely
    if file_info and allowed_file(file_info['filename']):
        # Secure the filename to prevent directory traversal attacks
        filename = secure_filename(storage_filename)
        os.makedirs(UPLOADS_FOLDER, exist_ok=True)
        pdf_path = os.path.join(UPLOADS_FOLDER, filename)
        
        # Write the bytes to a file
        with open(pdf_path, 'wb') as f:
            f.write(file_bytes)

        # Get quality from form data, default to 20 if not provided
        quality = int(form.get('quality', 20))

        # Extract content from the PDF
        content = extract_all_pages_content(pdf_path, mime_type='application/pdf')
        print("Extracted Content:", content)
        task_record_content += f"- [Step 2/5] Extracted content from PDF: {content.text[:100]}...\n"  # Preview of the content
        Material.update_pending_task_record(task_id, info["material_id"], task_record_content)

        # Convert PDF to WebP
        try:
            output_dir_webp = os.path.join(OUTPUT_WEBP_FOLDER, filename)
            prefix = filename
            file_converter.pdf_to_webp(pdf_path, output_dir_webp, prefix, quality)
            task_record_content += f"- [Step 3/5] Converted PDF to WebP: {output_dir_webp}\n"
            Material.update_pending_task_record(task_id, info["material_id"], task_record_content)

            public_links = []
            files_list = sorted(os.listdir(output_dir_webp), key=lambda x: int(x.split('_')[-1].split('.')[0])) # Sort files by page number

            for i in range(len(files_list)):
                webp_filename = files_list[i]
                webp_path = os.path.join(output_dir_webp, webp_filename)
                webp_path = webp_path.replace("\\", "/")
                print(f'Uploading {webp_path}')
                public_link = Material.upload_and_get_link(webp_path)
                public_links.append({
                    'page': i + 1,
                    'url': public_link
                })

            task_record_content += f"- [Step 4/5] Uploaded {len(public_links)} WebP files to storage\n"
            Material.update_pending_task_record(task_id, info["material_id"], task_record_content)

            # Save records to Supabase
            info['num_page'] = public_links[-1]['page'] if public_links else 0

            Material.create_material_record(info)
            Material.create_material_page_record(info["material_id"], public_links)
            Material.create_summary_record(info["user_id"], info["material_id"], content.text, {
                    'prompt_token_count': content.usage.prompt_token_count,
                    'thoughts_token_count': content.usage.thoughts_token_count,
                    'total_token_count': content.usage.total_token_count
                })
            Material.create_material_rating_record(info["material_id"])

            # Update task record to success
            end_time = time.time()
            task_record_content += f"- [Step 5/5] All steps completed successfully in {end_time - start_time:.2f} seconds\n"
            Material.update_pending_task_record(task_id, info["material_id"], task_record_content)
            Material.create_task_record(task_id, info["material_id"], f"Processed in {end_time - start_time:.2f} seconds", "success")

            return {
                'message': 'PDF converted to WebP successfully',
                'material_id': info["material_id"]
            }
        except Exception as e:
            # Handle any errors during conversion
            return {'error': f'Conversion failed: {str(e)}'}
        finally:
            # Clean up the uploaded file
            os.remove(pdf_path)

            for file in os.listdir(output_dir_webp):
                os.remove(os.path.join(output_dir_webp, file))
            os.rmdir(output_dir_webp)

    return {'error': 'File type not allowed'}

@celery.task(bind=True)
def convert_docx_to_webp(self, file_info, form):
    print(form.get('info', '{}'))
    file_bytes = bytes.fromhex(file_info['data'])
    info = json.loads(form.get('info', '{}'))
    storage_filename = info["material_id"]
    task_id = str(uuid.uuid4())

    # Create a pending task record in Supabase
    task_record_content = "- [Step 1/5] Starting conversion task\n" # This content will be updated later
    Material.create_task_record(task_id, info["material_id"], task_record_content, "pending")
    start_time = time.time()

    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file_info['filename'] == '':
        return {'error': 'No selected file'}

    # Check if the file is a DOCX and save it securely
    if file_info and allowed_file(file_info['filename']):
        # Secure the filename to prevent directory traversal attacks
        filename = secure_filename(storage_filename)
        upload_folder = 'uploads'
        os.makedirs(upload_folder, exist_ok=True)
        docx_path = os.path.join(upload_folder, filename)

        # Save the uploaded DOCX file with the correct extension
        with open(docx_path + '.docx', 'wb') as f:
            f.write(file_bytes)

        try:
            # Call the file conversion service
            output_dir_pdf = 'output_pdf'
            output_pdf_filename = f"{filename}.pdf"
            file_converter.docx_to_pdf(docx_path, output_dir_pdf, output_pdf_filename)
            pdf_filename = os.path.join(output_dir_pdf, output_pdf_filename)

            # Extract content from the DOCX (via the converted PDF)
            content = extract_all_pages_content(pdf_filename, mime_type='application/pdf')
            print("Extracted Content:", content)
            task_record_content += f"- [Step 2/5] Extracted content from PDF: {content.text[:100]}...\n"  # Preview of the content
            Material.update_pending_task_record(task_id, info["material_id"], task_record_content)

            # Convert PDF to WebP
            output_dir_webp = os.path.join('output_webp', filename)
            prefix = filename
            os.makedirs(output_dir_webp, exist_ok=True)
            file_converter.pdf_to_webp(pdf_filename, output_dir_webp, prefix)
            task_record_content += f"- [Step 3/5] Converted PDF to WebP: {output_dir_webp}\n"
            Material.update_pending_task_record(task_id, info["material_id"], task_record_content)
            
            public_links = []
            files_list = sorted(os.listdir(output_dir_webp), key=lambda x: int(x.split('_')[-1].split('.')[0])) # Sort files by page number

            for i in range(len(files_list)):
                webp_filename = files_list[i]
                webp_path = os.path.join(output_dir_webp, webp_filename)
                webp_path = webp_path.replace("\\", "/")
                print(f'Uploading {webp_path}')
                public_link = Material.upload_and_get_link(webp_path)
                public_links.append({
                    'page': i + 1,
                    'url': public_link
                })
            
            task_record_content += f"- [Step 4/5] Uploaded {len(public_links)} WebP files to storage\n"
            Material.update_pending_task_record(task_id, info["material_id"], task_record_content)

            # Save records to Supabase
            info['num_page'] = public_links[-1]['page'] if public_links else 0

            Material.create_material_record(info)
            Material.create_material_page_record(info["material_id"], public_links)
            Material.create_summary_record(info["user_id"], info["material_id"], content.text, {
                    'prompt_token_count': content.usage.prompt_token_count,
                    'thoughts_token_count': content.usage.thoughts_token_count,
                    'total_token_count': content.usage.total_token_count
                })
            Material.create_material_rating_record(info["material_id"])

            # Update task record to success
            end_time = time.time()
            task_record_content += f"- [Step 5/5] All steps completed successfully in {end_time - start_time:.2f} seconds\n"
            Material.update_pending_task_record(task_id, info["material_id"], task_record_content)
            Material.create_task_record(task_id, info["material_id"], f"Processed in {end_time - start_time:.2f} seconds", "success")

            return {
                'message': 'DOCX converted to WebP successfully',
                'material_id': info["material_id"]
            }
        except Exception as e:
            # Handle any errors during conversion
            return {'error': f'Conversion failed: {str(e)}'}, 500
        finally:
            # Clean up the uploaded file
            os.remove(docx_path + '.docx')

            # Clean up the converted files
            os.remove(os.path.join(output_dir_pdf, output_pdf_filename))

            for file in os.listdir(output_dir_webp):
                os.remove(os.path.join(output_dir_webp, file))
            os.rmdir(output_dir_webp)

    return {'error': 'File type not allowed'}, 400