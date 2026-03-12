from langgraph.graph import StateGraph, END
from models.schemas import AnalysisState
from agents.nodes import (
    AnalyticalNode,
    EnhancementNode,
    ScoringEngineNode,
    PrivacyScannerNode
)

def create_graph():
    workflow = StateGraph(AnalysisState)
    
    # Consolidate nodes for speed
    workflow.add_node("privacy_scanner", PrivacyScannerNode())
    workflow.add_node("analytical", AnalyticalNode())
    workflow.add_node("enhancer", EnhancementNode())
    workflow.add_node("scorer", ScoringEngineNode())
    
    # Entry: Analysis can start immediately
    workflow.set_entry_point("analytical")
    
    # Logic flow
    workflow.add_edge("analytical", "privacy_scanner")
    workflow.add_edge("privacy_scanner", "enhancer")
    workflow.add_edge("enhancer", "scorer")
    workflow.add_edge("scorer", END)
    
    return workflow.compile()

# Lazy graph creation — only builds when first accessed
_graph = None

def get_graph():
    global _graph
    if _graph is None:
        _graph = create_graph()
    return _graph
