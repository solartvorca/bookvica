#!/usr/bin/env python3
import re
import json
import os

# Read the UTF-8 file
with open("d:/bookvisa/999Буквица Азъ.txt", "r", encoding="cp1251") as f:
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
    
    # Remove the title from entry
    body = entry[len(title_match.group(0)):].strip()
    
    # Find "Основные грани образа:"
    gran_match = re.search(r'Основные\s+грани\s+образа:(.*?)(?=Пример|$)', body, re.DOTALL)
    
    # Find "Пример «глупости»"
    example_match = re.search(r'Пример\s+«глупости».*?:?(.*?)(?=Практика|$)', body, re.DOTALL)
    
    # Find "Практика"
    practice_match = re.search(r'Практика\s+«[^»]*».*?:?(.*?)(?=Скажу|$)', body, re.DOTALL)
    
    # Find the question (last line, starts with Как ты думаешь)
    question_match = re.search(r'(Как\s+ты\s+думаешь.*?)$', body, re.DOTALL)
    
    # Description is from start to Основные
    desc_end = gran_match.start() if gran_match else len(body)
    description = body[:desc_end].strip()
    
    # Semantic modules from Основные грани
    modules = []
    if gran_match:
        gran_text = gran_match.group(1)
        # Find * Name: desc
        module_list = re.findall(r'\*\s+([^:]+):\s*(.+?)(?=\*|$)', gran_text, re.DOTALL)
        for module_name, module_desc in module_list:
            modules.append(module_name.strip())
    
    # Transliterations and meanings - we need to map
    transliterations = {
        1: "Az", 2: "Bogi", 3: "Vedi", 4: "Glagoli", 5: "Dobro", 6: "Est'", 7: "Yo", 8: "Zhivot", 9: "Sъlo", 10: "Ꙁємля", 11: "Izhє", 12: "iжєи", 13: "ïнить", 14: "Гєрвь", 15: "Kako", 16: "Lyudïє", 17: "Myslitѣ", 18: "Nash'", 19: "OnЪ", 20: "Pokoi", 21: "Rѣci", 22: "Slovo", 23: "Tvѣrdo", 24: "Ukъ", 25: "Oukъ", 26: "Fѣrt'", 27: "Khѣrъ", 28: "Otъ", 29: "Ci", 30: "Yєrвl'", 31: "Sha", 32: "Shta", 33: "Єrъ", 34: "Єry", 35: "Єr'", 36: "Yat'", 37: "Yunъ", 38: "Ary", 39: "Edo", 40: "Omъ", 41: "Єnъ", 42: "Od'", 43: "Ëta", 44: "Ota", 45: "Ksi", 46: "Psi", 47: "Fita", 48: "Izhica", 49: "Izha"
    }
    meanings = {
        1: "Я, начало, единство", 2: "Множественность, движение, развитие", 3: "Знание, видение, мудрость", 4: "Речь, слово, творческая сила звука", 5: "Благость, деяние, благодать", 6: "Бытие, существование, наличие", 7: "Свобода, вольность, расширение", 8: "Жизнь, движение, энергия", 9: "Земля, основа, материя", 10: "Земля, основа, материя", 11: "Связь, единение, Бог", 12: "Связь, единение, Бог", 13: "Начало, инициация", 14: "Движение, червь, трансформация", 15: "Как, вопрос, поиск", 16: "Люди, общество, Род", 17: "Мышление, мысль, разум", 18: "Наш, принадлежность, Род", 19: "Он, другой, отражение", 20: "Покой, мир, гармония", 21: "Речь, слово, выражение", 22: "Слово, речь, творение", 23: "Твёрдость, устойчивость, сила", 24: "Ук, указ, направление", 25: "Ук, указ, направление", 26: "Ферт, жертва, отдача", 27: "Хер, круг, цикл", 28: "От, отрицание, выход", 29: "Ци, число, счёт", 30: "Червь, движение, трансформация", 31: "Ша, шум, звук", 32: "Шта, что, вопрос", 33: "Ер, звук, вибрация", 34: "Еры, двойственность", 35: "Ерь, мягкость", 36: "Ять, древность, мудрость", 37: "Юн, юность, обновление", 38: "Ярь, ярость, сила", 39: "Едо, еда, питание", 40: "Ом, звук, вибрация", 41: "Ен, единство", 42: "Один, единственность", 43: "Ета, буква, звук", 44: "Ота, отрицание", 45: "Кси, крест, пересечение", 46: "Пси, душа, психика", 47: "Фита, свет, знание", 48: "Ижица, жизнь, энергия", 49: "Ижа, огонь, трансформация"
    }
    
    bukvitsy.append({
        "id": int(num),
        "number": int(num),
        "letter": letter,
        "name": name,
        "transliteration": transliterations.get(int(num), ""),
        "meaning": meanings.get(int(num), ""),
        "description": description,
        "semantic_modules": modules,
        "example": example_match.group(1).strip() if example_match else "",
        "practice": practice_match.group(1).strip() if practice_match else "",
        "mysteries": "",
        "divination": "",
        "question": question_match.group(1).strip() if question_match else ""
    })

# Sort by number
bukvitsy.sort(key=lambda x: x["number"])

# Save to JSON
with open("d:/bookvisa/src/data/bukvitsy.json", "w", encoding="utf-8") as f:
    json.dump(bukvitsy, f, ensure_ascii=False, indent=2)

print(f"Parsed {len(bukvitsy)} bukvitsy")
for b in bukvitsy[:5]:
    print(f"  {b['number']}. {b['name']} ({b['letter']}) - {len(b['semantic_modules'])} modules")
