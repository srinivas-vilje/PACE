from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class IntentDetection(BaseModel):
    intent: str = Field(..., description="The detected task type (e.g., Code generation, Explanation, etc.)")
    confidence: float = Field(..., description="Confidence score for the detected intent (0-1)")
    complexity_level: str = Field(..., description="Complexity level (Simple, Moderate, Complex)")

class PromptScoring(BaseModel):
    clarity: int = Field(..., description="Score 0-10")
    context_completeness: int = Field(..., description="Score 0-10")
    constraints_defined: int = Field(..., description="Score 0-10")
    output_format: int = Field(..., description="Score 0-10")
    audience_definition: int = Field(..., description="Score 0-10")
    domain_specificity: int = Field(..., description="Score 0-10")
    examples_included: int = Field(..., description="Score 0-10")
    edge_cases_covered: int = Field(..., description="Score 0-10")

class ImprovementSuggestion(BaseModel):
    type: str = Field(..., description="Type of gap (e.g., No constraints, Ambiguous wording)")
    suggestion: str = Field(..., description="Detailed suggestion for improvement")

class EnhancedPrompt(BaseModel):
    refined_prompt: str = Field(..., description="The main optimized prompt")
    structured_version: str = Field(..., description="Prompt with clear sections")
    professional_version: str = Field(..., description="Formal tone version")
    minimal_version: str = Field(..., description="Concise but improved version")

class OverallScore(BaseModel):
    total_score: float = Field(..., description="Weighted average score out of 100")
    grade: str = Field(..., description="Grade (A, B, C, D, F)")
    quality_level: str = Field(..., description="Qualitative assessment")

class PIIWarning(BaseModel):
    detected: bool
    description: Optional[str] = None
    masked_prompt: Optional[str] = None

class ModelCompatibility(BaseModel):
    model_name: str
    rating: int = Field(..., description="Rating 1-5")
    reasoning: str

class AnalysisState(BaseModel):
    original_prompt: str
    safe_prompt: Optional[str] = None  # After PII masking
    domain: Optional[str] = None
    target_llm: Optional[str] = None
    desired_format: Optional[str] = None
    
    intent: Optional[IntentDetection] = None
    structure_scores: Optional[PromptScoring] = None
    gaps: List[ImprovementSuggestion] = []
    pii_analysis: Optional[PIIWarning] = None
    few_shot_examples: List[str] = []
    model_benchmarks: List[ModelCompatibility] = []
    
    enhanced_prompts: Optional[EnhancedPrompt] = None
    final_scoring: Optional[OverallScore] = None
    
    comparison_enabled: bool = False
    original_output: Optional[str] = None
    enhanced_output: Optional[str] = None
    comparison_analysis: Optional[str] = None
    
    iterations: int = 0  # For Feature 1 (Self-Correction)
