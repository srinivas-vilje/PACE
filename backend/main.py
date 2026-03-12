from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from agents.graph import get_graph
from models.schemas import AnalysisState
from db.database import init_db, get_db, PromptRecord, FeedbackRecord
from utils.config import LLMFactory
import json

app = FastAPI(title="PACE — Prompt Analysis & Composition Engine API")

# Initialize DB
@app.on_event("startup")
def startup_event():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/analyze")
async def analyze_prompt(request: Dict[str, Any], db: Session = Depends(get_db)):
    prompt_text = request.get("prompt")
    if not prompt_text:
        raise HTTPException(status_code=400, detail="Prompt text is required")
    
    # Initialize state
    state = {
        "original_prompt": prompt_text,
        "domain": request.get("domain"),
        "target_llm": request.get("target_llm"),
        "desired_format": request.get("desired_format"),
        "comparison_enabled": request.get("comparison_enabled", False),
        "iterations": 0
    }
    
    # Run graph
    try:
        graph = get_graph()
        final_state = graph.invoke(state)
        # Ensure final_state is a dict for the following extraction logic
        # We use dict() instead of model_dump() to avoid recursive conversion,
        # as subsequent lines expect individual fields to be Pydantic models.
        if not isinstance(final_state, dict):
            final_state = dict(final_state)
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    
    # Convert Pydantic models to dicts for DB and response
    analysis = {}
    if final_state.get("intent"):
        analysis["intent"] = final_state["intent"].model_dump()
    if final_state.get("structure_scores"):
        analysis["structure_scores"] = final_state["structure_scores"].model_dump()
    if final_state.get("gaps"):
        analysis["gaps"] = [g.model_dump() for g in final_state["gaps"]]
    if final_state.get("enhanced_prompts"):
        analysis["enhanced_prompts"] = final_state["enhanced_prompts"].model_dump()
    if final_state.get("final_scoring"):
        analysis["final_scoring"] = final_state["final_scoring"].model_dump()
    
    # New Features data
    if final_state.get("pii_analysis"):
        analysis["pii_analysis"] = final_state["pii_analysis"].model_dump()
    if final_state.get("few_shot_examples"):
        analysis["few_shot_examples"] = final_state["few_shot_examples"]
    if final_state.get("model_benchmarks"):
        analysis["model_benchmarks"] = [m.model_dump() for m in final_state["model_benchmarks"]]
    
    # Feature 3: Store in Database
    new_record = PromptRecord(
        original_prompt=prompt_text,
        domain=request.get("domain"),
        target_llm=request.get("target_llm"),
        intent=analysis.get("intent"),
        structure_scores=analysis.get("structure_scores"),
        gaps=analysis.get("gaps"),
        pii_analysis=analysis.get("pii_analysis"),
        few_shot_examples=analysis.get("few_shot_examples"),
        model_benchmarks=analysis.get("model_benchmarks"),
        enhanced_prompts=analysis.get("enhanced_prompts"),
        final_scoring=analysis.get("final_scoring"),
        iterations=final_state.get("iterations", 0)
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    
    return {
        "id": new_record.id,
        "analysis": analysis
    }

@app.get("/history")
async def get_history(db: Session = Depends(get_db)):
    records = db.query(PromptRecord).order_by(PromptRecord.created_at.desc()).limit(20).all()
    return records

@app.post("/execute")
async def execute_prompt(request: Dict[str, Any]):
    prompt = request.get("prompt")
    model_name = request.get("model", "gpt-4o-mini")
    
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
    
    try:
        model = LLMFactory.get_model(model_name=model_name)
        response = model.invoke(prompt)
        return {"output": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
