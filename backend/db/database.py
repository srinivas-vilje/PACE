from sqlalchemy import create_engine, Column, Integer, String, Float, Text, JSON, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Using SQLite for easier local setup as discussed
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pace_history.db")

Base = declarative_base()

class PromptRecord(Base):
    __tablename__ = "prompts"
    
    id = Column(Integer, primary_key=True, index=True)
    original_prompt = Column(Text, nullable=False)
    domain = Column(String, nullable=True)
    target_llm = Column(String, nullable=True)
    
    # New history columns
    intent = Column(JSON, nullable=True)
    structure_scores = Column(JSON, nullable=True)
    gaps = Column(JSON, nullable=True)
    pii_analysis = Column(JSON, nullable=True)
    few_shot_examples = Column(JSON, nullable=True)
    model_benchmarks = Column(JSON, nullable=True)
    
    enhanced_prompts = Column(JSON, nullable=True)
    final_scoring = Column(JSON, nullable=True)
    iterations = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class FeedbackRecord(Base):
    __tablename__ = "feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, ForeignKey("prompts.id"))
    helpful_score = Column(Integer)  # 1-5
    better_output = Column(String)  # Yes/No/Maybe
    use_again = Column(String)  # Yes/No
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
