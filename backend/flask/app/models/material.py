from ..config.supabase_client import SUPABASE_BUCKET, supabase
import uuid
from ..constants.table import TABLE

class Material:
    @staticmethod
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

    @staticmethod
    def create_task_record(task_id: str, material_id: str, content: str, status: str):
        data = {
            "task_id": task_id,
            "material_id": material_id,
            "content": content,
            "status": status
        }

        response = supabase.table(TABLE.TASK.value).insert(data).execute()
        print(f'Created task record in Supabase: {response}')
        return response

    @staticmethod
    def update_pending_task_record(task_id: str, material_id: str):
        data = {
            "status": "pending",
            "material_id": material_id
        }

        response = supabase.table(TABLE.TASK.value).update(data).eq("task_id", task_id).eq("status", "pending").execute()
        print(f'Updated task record in Supabase: {response}')
        return response
    
    @staticmethod
    def create_material_record(info: dict):
        response = supabase.table(TABLE.MATERIAL.value).insert(info).execute()
        print(f'Created material record in Supabase: {response}')
        return response
    
    @staticmethod
    def create_material_page_record(material_id: str, public_links: list):
        records = [
            {
                "material_id": material_id,
                "page": link_info["page"],
                "url": link_info["url"]
            }
            for link_info in public_links
        ]

        response = supabase.table(TABLE.MATERIAL_PAGE.value).insert(records).execute()
        print(f'Created material page records in Supabase: {response}')
        return response

    @staticmethod
    def create_summary_record(user_id: str, material_id: str, content: str, usage: dict):
        data = {
            "summary_id": f"{user_id}-{str(uuid.uuid4())}",
            "material_id": material_id,
            "content": content,
            "prompt_token_count": usage["prompt_token_count"],
            "thoughts_token_count": usage["thoughts_token_count"],
            "total_token_count": usage["total_token_count"]
        }

        response = supabase.table(TABLE.MATERIAL_SUMMARY.value).insert(data).execute()
        print(f'Created summary record in Supabase: {response}')
        return response
    
    @staticmethod
    def create_material_rating_record(material_id: str):
        MAX_STAR_LEVEL = 5
        records = [
            {
                "material_id": material_id,
                "star_level": star_level,
                "count": 0
            }
            for star_level in range(1, MAX_STAR_LEVEL + 1)
        ]

        response = supabase.table(TABLE.RATING.value).insert(records).execute()
        print(f'Created material rating records in Supabase: {response}')
        return response
