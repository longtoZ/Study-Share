from flask import Blueprint, request, jsonify

from .config.celery import celery
from .services.celery_tasks import convert_pdf_to_webp as celery_convert_pdf_to_webp
from .services.celery_tasks import convert_docx_to_webp as celery_convert_docx_to_webp

# Create a Blueprint for the routes.
bp = Blueprint('routes', __name__, url_prefix='/')

@bp.route('/')
def index():
    return "Welcome to the File Conversion Service!"

@bp.route('/convert/pdf-to-webp', methods=['POST'])
def convert_pdf_to_webp():
    file = request.files['file']
    form = request.form.to_dict()
    file_bytes = file.read()
    file_info = {
        'filename': file.filename,
        'content_type': file.content_type,
        'data': file_bytes.hex()  # convert bytes to hex string for JSON serialization
    }
    task = celery_convert_pdf_to_webp.apply_async(args=[file_info, form])
    return jsonify({'task_id': task.id}), 202

@bp.route('/convert/docx-to-webp', methods=['POST'])
def convert_docx_to_webp():
    file_bytes = request.files['file'].read()
    form = request.form.to_dict()
    task = celery_convert_docx_to_webp.apply_async(args=[file_bytes, form])
    return jsonify({'task_id': task.id}), 202

@bp.route('/task-status/<task_id>', methods=['GET'])
def get_task_status(task_id):
    task = celery.AsyncResult(task_id)
    if task.state == 'PENDING':
        response = {
            'state': task.state,
            'status': 'Pending...'
        }
    elif task.state != 'FAILURE':
        response = {
            'state': task.state,
            'result': task.result
        }
    else:
        response = {
            'state': task.state,
            'status': str(task.info),
        }
    return jsonify(response)