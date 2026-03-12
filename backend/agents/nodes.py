from typing import List
from pydantic import BaseModel, Field
from utils.config import get_cheap_model, get_strong_model
from langchain_core.prompts import ChatPromptTemplate
from models.schemas import (
    AnalysisState, IntentDetection, PromptScoring, 
    ImprovementSuggestion, EnhancedPrompt, OverallScore,
    PIIWarning, ModelCompatibility
)

class CombinedDiagnostics(BaseModel):
    intent: IntentDetection
    scores: PromptScoring
    gaps: List[ImprovementSuggestion]
    benchmarks: List[ModelCompatibility]

class AnalyticalNode:
    def __call__(self, state: AnalysisState) -> dict[str, any]:
        prompt = state.original_prompt
        
        system_msg = """You are a Lead Prompt Architect. 
        Perform a full diagnostic on the prompt in ONE pass.
        
        Output MUST be a single JSON object. Do not include any text before or after the JSON.
        Required structure:
        - intent: {{intent, confidence (0-1), complexity_level}}
        - scores: {{clarity (0-10), context_completeness (0-10), constraints_defined (0-10), output_format (0-10), audience_definition (0-10), domain_specificity (0-10), examples_included (0-10), edge_cases_covered (0-10)}}
        - gaps: list of {{type, suggestion}}
        - benchmarks: list of {{model_name, rating (1-5), reasoning}}"""

        chat_prompt = ChatPromptTemplate.from_messages([
            ("system", system_msg),
            ("user", "Analyze this prompt: {prompt}")
        ])

        try:
            model = get_strong_model() # Using 70B for high-precision analysis
            structured_llm = model.with_structured_output(CombinedDiagnostics)
            result = (chat_prompt | structured_llm).invoke({"prompt": prompt})
            
            return {
                "intent": result.intent if hasattr(result, 'intent') else None,
                "structure_scores": result.scores if hasattr(result, 'scores') else None,
                "gaps": result.gaps if hasattr(result, 'gaps') else [],
                "model_benchmarks": result.benchmarks if hasattr(result, 'benchmarks') else []
            }
        except Exception as e:
            print(f"AnalyticalNode Error: {str(e)}")
            return {
                "intent": None,
                "structure_scores": None,
                "gaps": [],
                "model_benchmarks": []
            }

class PrivacyScannerNode:
    def __call__(self, state: AnalysisState) -> dict[str, any]:
        model = get_cheap_model()
        prompt = state.original_prompt
        
        system_msg = """Scan the prompt for PII (Emails, Secrets, Names, Locations). 
        If found, set 'detected' to true, provide a brief 'description', and return a 'masked_prompt' where sensitive info is replaced with [PROTECTED]."""
        chat_prompt = ChatPromptTemplate.from_messages([
            ("system", system_msg),
            ("user", "Scan: {prompt}")
        ])
        
        try:
            structured_llm = model.with_structured_output(PIIWarning)
            result = (chat_prompt | structured_llm).invoke({"prompt": prompt})
            
            return {
                "pii_analysis": result,
                "safe_prompt": result.masked_prompt if (result and result.detected) else prompt
            }
        except Exception as e:
            print(f"PrivacyScannerNode Error: {e}")
            return {"safe_prompt": prompt}

class EnhancementNode:
    def __call__(self, state: AnalysisState) -> dict[str, any]:
        model = get_strong_model()
        prompt = state.safe_prompt
        
        class EnhancementResult(BaseModel):
            examples: List[str]
            enhancements: EnhancedPrompt

        if not state.intent:
            return {} # Skip enhancement if analysis failed
            
        system_msg = """You are an Expert Prompt Engineer. 
        Generate exactly TWO few-shot 'examples' (list of strings) and one 'enhancements' object containing:
        - refined_prompt
        - structured_version
        - professional_version
        - minimal_version
        
        Output as a single JSON object matching the requested schema."""
        
        chat_prompt = ChatPromptTemplate.from_messages([
            ("system", system_msg),
            ("user", "Input: {prompt}\nIntent: {intent}\nGaps: {gaps}")
        ])
        
        try:
            structured_llm = model.with_structured_output(EnhancementResult)
            
            # Use safe dump logic
            intent_data = state.intent.model_dump() if hasattr(state.intent, 'model_dump') else str(state.intent)
            gaps_data = [g.model_dump() if hasattr(g, 'model_dump') else str(g) for g in state.gaps]
            
            result = (chat_prompt | structured_llm).invoke({
                "prompt": prompt,
                "intent": intent_data,
                "gaps": gaps_data
            })
            
            return {
                "few_shot_examples": result.examples,
                "enhanced_prompts": result.enhancements
            }
        except Exception as e:
            print(f"EnhancementNode Error: {e}")
            return {}

class ScoringEngineNode:
    def __call__(self, state: AnalysisState) -> dict[str, any]:
        s = state.structure_scores
        if not s:
            return {"final_scoring": OverallScore(total_score=0, grade="N/A", quality_level="Analysis Failed")}
            
        total_score = (
            s.clarity * 2.0 + s.context_completeness * 1.5 + 
            s.constraints_defined * 1.5 + s.output_format * 1.0 + 
            s.audience_definition * 0.5 + s.domain_specificity * 2.0 + 
            s.examples_included * 1.0 + s.edge_cases_covered * 0.5
        )
        
        grade = "F"
        if total_score >= 90: grade = "A"
        elif total_score >= 80: grade = "B"
        elif total_score >= 70: grade = "C"
        elif total_score >= 60: grade = "D"
        
        result = OverallScore(
            total_score=total_score,
            grade=grade,
            quality_level="Excellent" if total_score >= 90 else "Good" if total_score >= 70 else "Poor"
        )
        return {"final_scoring": result}
