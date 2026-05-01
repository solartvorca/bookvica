#!/usr/bin/env python3
import re
import json
import os

# Read the UTF-8 file
with open("d:/bookvisa/буквица_utf8.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Split by pattern: number. Буквица Name (Letter)
entries = re.split(r'\n(?=\d+\. Буквица)', content)

bukvitsy = []

for entry in entries:
    entry = entry.strip()
    if not entry or len(entry) < 50:
        continue
    
    # Extract title: "1. Буквица Азъ (А)"
    title_match = re.match(r'^(\d+)\.\s+Буквица\s+([^(]+)\s*\(([^)]+)\)', entry)
    if not title_match:
        continue
    
    num = title_match.group(1)
    name = title_match.group(2).strip()
    letter = title_match.group(3).strip()
    
    # Split sections
    # Find "Основные ключи смысла:"
    keys_match = re.search(r'Основные\s+(?:грани|ключи)\s+(?:образа|смысла):(.*?)(?=Пример|Тайны|Гадальное|$)', entry, re.DOTALL)
    
    # Find example/"глупости"
    example_match = re.search(r'Пример\s+.*?(?:глупости|illust).*?:(.*?)(?=Тайны|Гадальное|$)', entry, re.DOTALL)
    
    # Find "Тайны"
    mystery_match = re.search(r'Тайны.*?:(.*?)(?=Гадальное|$)', entry, re.DOTALL)
    
    # Find "Гадальное"
    divination_match = re.search(r'Гадальное.*?:(.*?)$', entry, re.DOTALL)
    
    # Extract semantic modules (bullet points)
    modules = []
    if keys_match:
        keys_text = keys_match.group(1)
        # Find all bullet points: * Text
        module_list = re.findall(r'\*\s+([^:]+):\s*(.+?)(?=\*|Пример|$)', keys_text, re.DOTALL)
        for module_name, module_text in module_list:
            modules.append({
                "name": module_name.strip(),
                "description": module_text.strip()[:500]
            })
    
    bukvitsy.append({
        "number": int(num),
        "name": name,
        "letter": letter,
        "description": entry[len(title_match.group(0)):len(title_match.group(0))+300].strip(),
        "semantic_modules": modules,
        "example": example_match.group(1).strip()[:300] if example_match else "",
        "mysteries": mystery_match.group(1).strip()[:300] if mystery_match else "",
        "divination": divination_match.group(1).strip()[:300] if divination_match else ""
    })

# Sort by number
bukvitsy.sort(key=lambda x: x["number"])

# Save to JSON
with open("d:/booквица/bukvitsy.json", "w", encoding="utf-8") as f:
    json.dump(bukvitsy, f, ensure_ascii=False, indent=2)

print(f"Parsed {len(bukvitsy)} bukvits")
for b in bukvitsy[:5]:
    print(f"  {b['number']}. {b['name']} ({b['letter']}) - {len(b['semantic_modules'])} modules")
