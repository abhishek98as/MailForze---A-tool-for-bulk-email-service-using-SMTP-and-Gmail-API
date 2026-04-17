import sys, json
from graphify.build import build_from_json
from graphify.cluster import score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_html
from pathlib import Path

extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text())
detection  = json.loads(Path('graphify-out/.graphify_detect.json').read_text())
analysis   = json.loads(Path('graphify-out/.graphify_analysis.json').read_text())

G = build_from_json(extraction)
communities = {int(k): v for k, v in analysis['communities'].items()}
cohesion = {int(k): v for k, v in analysis['cohesion'].items()}
tokens = {'input': extraction.get('input_tokens', 0), 'output': extraction.get('output_tokens', 0)}

# Community labels based on the detected node clusters
labels = {
    0:  "API Route Handlers",
    1:  "Campaign Management",
    2:  "Email Sending Engine",
    3:  "MongoDB Data Models",
    4:  "Recipient Tracking",
    5:  "AI Smart Analyzer",
    6:  "Dashboard & Stats",
    7:  "Authentication & Settings",
    8:  "Email Templates",
    9:  "Activity Logs",
    10: "IMAP Sync & Cron",
    11: "UI Components",
    12: "Project Documentation",
    13: "Reports & Analytics",
    14: "React Context & Hooks",
    15: "Next.js Infrastructure",
}
# Fill remaining community IDs with generic names
for cid in communities:
    if cid not in labels:
        labels[cid] = "Module " + str(cid)

questions = suggest_questions(G, communities, labels)

report = generate(G, communities, cohesion, labels, analysis['gods'], analysis['surprises'], detection, tokens, '.', suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding='utf-8')
Path('graphify-out/.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}), encoding='utf-8')

to_html(G, communities, 'graphify-out/graph.html', community_labels=labels)
print('graph.html written - open in any browser')
print('GRAPH_REPORT.md updated with community labels')
