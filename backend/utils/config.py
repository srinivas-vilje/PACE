import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq


# Load .env from the same directory as this file
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=env_path)

class LLMFactory:
    @staticmethod
    def get_model(provider=None, model_name=None, temperature=0):
        # Default to environment variable if provider not specified
        provider = provider or os.getenv("LLM_PROVIDER", "openai")
        
        if provider == "openai":
            return ChatOpenAI(model=model_name or "gpt-4o-mini", temperature=temperature)
        elif provider == "anthropic":
            return ChatAnthropic(model=model_name or "claude-3-5-sonnet-20240620", temperature=temperature)
        elif provider == "google":
            api_key = os.getenv("GOOGLE_API_KEY")
            return ChatGoogleGenerativeAI(model=model_name or "gemini-2.0-flash", google_api_key=api_key, temperature=temperature)
        elif provider == "groq":
            api_key = os.getenv("GROQ_API_KEY")
            return ChatGroq(model=model_name or "llama-3.3-70b-versatile", groq_api_key=api_key, temperature=temperature)
        else:
            raise ValueError(f"Unsupported provider: {provider}")

def get_cheap_model():
    # Used for classification and scoring
    return LLMFactory.get_model(provider="groq", model_name="llama-3.1-8b-instant")

def get_strong_model():
    # Used for enhancement and comparison
    return LLMFactory.get_model(provider="groq", model_name="llama-3.3-70b-versatile")
