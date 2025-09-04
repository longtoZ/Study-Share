import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Use environment variables for credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET")

# Initialize the Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def upload_and_get_link(file_path: str) -> str:
    with open(file_path, "rb") as file:
        response = supabase.storage.from_(SUPABASE_BUCKET).upload(file=file, path=file_path)
        print(response)

    if response.path is not None:
        public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(file_path)
        print(f'Uploaded {file_path} to Supabase storage. Public URL: {public_url}')
        return public_url
    else:
        raise Exception("Failed to upload file to Supabase storage")
