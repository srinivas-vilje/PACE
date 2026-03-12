import os
from groq import Groq
from dotenv import load_dotenv

# Load .env
env_path = os.path.join(os.getcwd(), ".env")
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    print("No GROQ_API_KEY found in .env")
    exit(1)

client = Groq(api_key=api_key)

print("Listing available models using Groq...")
try:
    models = client.models.list()
    for m in models.data:
        print(f"Model ID: {m.id}, Owned By: {m.owned_by}")
except Exception as e:
    print(f"Error: {e}")
