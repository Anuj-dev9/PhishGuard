import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements
    new_content = content
    # Replace transparent backgrounds
    new_content = re.sub(r'bg-white/5', 'bg-slate-800', new_content)
    new_content = re.sub(r'bg-white/10', 'bg-slate-700', new_content)
    new_content = re.sub(r'bg-white/20', 'bg-slate-600', new_content)
    # Replace transparent borders
    new_content = re.sub(r'border-white/5', 'border-slate-800', new_content)
    new_content = re.sub(r'border-white/10', 'border-slate-700', new_content)
    new_content = re.sub(r'border-white/20', 'border-slate-600', new_content)
    new_content = re.sub(r'border-white/30', 'border-slate-500', new_content)

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

src_dir = r"c:\Users\Administrator\Desktop\vs code\phishing-ai-project\frontend\src"

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.tsx') or file.endswith('.js') or file.endswith('.css'):
            process_file(os.path.join(root, file))

print("Done")
