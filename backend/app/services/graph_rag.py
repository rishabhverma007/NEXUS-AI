import networkx as nx
from typing import List, Dict, Any, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.domain import KnowledgeGraphEntity, KnowledgeGraphRelation
from app.services.hybrid_search import hybrid_search_engine


class GraphRAGEngine:
    """
    Enterprise GraphRAG Engine:
    1. Entity & Relationship Extraction
    2. NetworkX Graph Representation & Traversal
    3. Graph-guided Context Sub-graph Extraction
    4. Multi-hop Reasoning Path Generation
    """

    async def build_workspace_graph(self, session: AsyncSession, workspace_id: str) -> nx.DiGraph:
        G = nx.DiGraph()

        # Fetch Entities
        stmt_ent = select(KnowledgeGraphEntity).where(KnowledgeGraphEntity.workspace_id == workspace_id)
        ent_res = await session.execute(stmt_ent)
        entities = ent_res.scalars().all()

        for ent in entities:
            G.add_node(
                ent.id,
                name=ent.name,
                type=ent.entity_type,
                description=ent.description,
                properties=ent.properties
            )

        # Fetch Relations
        stmt_rel = select(KnowledgeGraphRelation).where(KnowledgeGraphRelation.workspace_id == workspace_id)
        rel_res = await session.execute(stmt_rel)
        relations = rel_res.scalars().all()

        for rel in relations:
            G.add_edge(
                rel.source_entity_id,
                rel.target_entity_id,
                id=rel.id,
                relation_type=rel.relation_type,
                weight=rel.weight,
                description=rel.description
            )

        return G

    async def query_subgraph(
        self,
        session: AsyncSession,
        workspace_id: str,
        query: str,
        max_depth: int = 2,
        max_nodes: int = 15
    ) -> Dict[str, Any]:
        """
        Retrieves graph entities matching query and builds sub-graph context.
        """
        G = await self.build_workspace_graph(session, workspace_id)
        if G.number_of_nodes() == 0:
            return {"nodes": [], "edges": [], "context_summary": "Graph is currently empty."}

        query_words = set(query.lower().split())
        matched_node_ids = []

        # Simple seed node finding based on matching node name/description or entity_type
        for node_id, data in G.nodes(data=True):
            name = str(data.get("name", "")).lower()
            desc = str(data.get("description", "")).lower()
            etype = str(data.get("type", "")).lower()
            if any(w in name or w in desc or w in etype for w in query_words if len(w) > 2):
                matched_node_ids.append(node_id)

        if not matched_node_ids:
            # Fallback to first few nodes if no keyword match
            matched_node_ids = list(G.nodes())[:3]

        # Extract ego subgraphs for seed nodes up to max_depth
        subgraph_nodes = set(matched_node_ids)
        for seed in matched_node_ids:
            ego = nx.ego_graph(G, seed, radius=max_depth, undirected=True)
            subgraph_nodes.update(ego.nodes())
            if len(subgraph_nodes) >= max_nodes:
                break

        subgraph_nodes = list(subgraph_nodes)[:max_nodes]
        subgraph = G.subgraph(subgraph_nodes)

        nodes_output = []
        for nid in subgraph.nodes():
            ndata = G.nodes[nid]
            nodes_output.append({
                "id": nid,
                "name": ndata.get("name"),
                "entity_type": ndata.get("type"),
                "description": ndata.get("description"),
                "properties": ndata.get("properties", {})
            })

        edges_output = []
        for u, v, edata in subgraph.edges(data=True):
            edges_output.append({
                "id": edata.get("id", f"{u}->{v}"),
                "source_entity_id": u,
                "target_entity_id": v,
                "relation_type": edata.get("relation_type", "RELATED_TO"),
                "weight": edata.get("weight", 1.0),
                "description": edata.get("description", "")
            })

        # Synthesize Graph Context Summary
        context_lines = []
        for e in edges_output:
            src_name = G.nodes[e["source_entity_id"]].get("name", "Entity")
            tgt_name = G.nodes[e["target_entity_id"]].get("name", "Entity")
            context_lines.append(f"- ({src_name}) --[{e['relation_type']}]--> ({tgt_name}): {e['description']}")

        return {
            "nodes": nodes_output,
            "edges": edges_output,
            "context_summary": "\n".join(context_lines) if context_lines else "No explicit relations discovered for query."
        }


graph_rag_engine = GraphRAGEngine()
