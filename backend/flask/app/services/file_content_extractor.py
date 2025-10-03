import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
from types import SimpleNamespace

load_dotenv()

# Set your API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

def extract_all_pages_content(file_path, mime_type):
    """
    Extracts and summarizes the content of all pages from a PDF in a single response.
    """
    # Define the system instruction
    system_instruction = (
        "You are an expert document parser and data extractor. "
        "Your task is to analyze an entire PDF or DOC document and provide a detailed, page-by-page breakdown of its contents. "
        "For each page, you must identify and transcribe all text, describe any tables, charts, or images, "
        "and present the information clearly under a header for that specific page. "
        "Maintain the structure and logical flow of the original document. "
        "Do not miss any details."
    )

    try:
        # Upload the file to the Gemini API
        uploaded_file = client.files.upload(file=file_path, config=types.UploadFileConfig(mime_type=mime_type))
        print(f"Uploaded file '{uploaded_file.name}' as: {uploaded_file.uri}")

        # Craft a single prompt to get content for all pages
        user_prompt = "Provide a detailed, page-by-page summary of the entire document. Use '## Page [number]' as a header for each new page."
        
        # Send the request with the file and the single prompt
        response = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="text/plain"
            ),
            contents=[
                user_prompt,
                uploaded_file
            ]
        )

        # Print the entire response
        print(f"\n--- Detailed Content for the Entire Document ---")
        usageMetadata = response.usage_metadata
        
    except Exception as e:
        print(f"Gemini error occurred: {e}")
    finally:
        # Clean up the uploaded file to free up storage
        if 'uploaded_file' in locals():
            client.files.delete(name=uploaded_file.name)
            print(f"\nDeleted file '{uploaded_file.name}'.")
        
        usage_details = SimpleNamespace(
            prompt_token_count=usageMetadata.prompt_token_count,
            thoughts_token_count=getattr(usageMetadata, 'thoughts_token_count', 0),
            total_token_count=usageMetadata.total_token_count
        )

        return SimpleNamespace(
            text=response.text,
            usage=usage_details
        )