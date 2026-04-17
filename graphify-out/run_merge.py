import json
from pathlib import Path

# Save chunk to cache and merge
chunk = json.loads(Path('graphify-out/.graphify_chunk_00.json').read_text())

# Merge cached + new
cached = json.loads(Path('graphify-out/.graphify_cached.json').read_text()) if Path('graphify-out/.graphify_cached.json').exists() else {'nodes':[],'edges':[],'hyperedges':[]}

all_nodes = cached['nodes'] + chunk.get('nodes', [])
all_edges = cached['edges'] + chunk.get('edges', [])
all_hyperedges = cached.get('hyperedges', []) + chunk.get('hyperedges', [])
seen = set()
deduped = []
for n in all_nodes:
    if n['id'] not in seen:
        seen.add(n['id'])
        deduped.append(n)

merged = {
    'nodes': deduped,
    'edges': all_edges,
    'hyperedges': all_hyperedges,
    'input_tokens': chunk.get('input_tokens', 0),
    'output_tokens': chunk.get('output_tokens', 0),
}
Path('graphify-out/.graphify_semantic.json').write_text(json.dumps(merged, indent=2))
print('Semantic: {} nodes, {} edges'.format(len(deduped), len(all_edges)))

# Part C: Merge AST + semantic
ast = json.loads(Path('graphify-out/.graphify_ast.json').read_text())
sem = merged

seen = {n['id'] for n in ast['nodes']}
merged_nodes = list(ast['nodes'])
for n in sem['nodes']:
    if n['id'] not in seen:
        merged_nodes.append(n)
        seen.add(n['id'])

merged_edges = ast['edges'] + sem['edges']
merged_hyperedges = sem.get('hyperedges', [])
final = {
    'nodes': merged_nodes,
    'edges': merged_edges,
    'hyperedges': merged_hyperedges,
    'input_tokens': sem.get('input_tokens', 0),
    'output_tokens': sem.get('output_tokens', 0),
}
Path('graphify-out/.graphify_extract.json').write_text(json.dumps(final, indent=2))
print('Merged: {} nodes, {} edges ({} AST + {} semantic)'.format(
    len(merged_nodes), len(merged_edges), len(ast['nodes']), len(sem['nodes'])))
