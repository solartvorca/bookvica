#!/usr/bin/env python3
import re
import json
import os

# Correct names and letters according to the standard
standard = {
    1: {"letter": "А", "name": "Азъ"},
    2: {"letter": "Б", "name": "Боги"},
    3: {"letter": "В", "name": "Веди"},
    4: {"letter": "Г", "name": "Глаголи"},
    5: {"letter": "Д", "name": "Добро"},
    6: {"letter": "Є", "name": "Єсть"},
    7: {"letter": "E", "name": "Єсмь"},
    8: {"letter": "Ж", "name": "Живот"},
    9: {"letter": "Ѕ", "name": "Sъло"},
    10: {"letter": "Ꙁ", "name": "Ꙁємля"},
    11: {"letter": "И", "name": "Ижє"},
    12: {"letter": "І", "name": "iжєи"},
    13: {"letter": "Ї", "name": "ïнить"},
    14: {"letter": "Ꙉ", "name": "Гєрвь"},
    15: {"letter": "К", "name": "Како"},
    16: {"letter": "Л", "name": "Людïє"},
    17: {"letter": "М", "name": "Мыслитѣ"},
    18: {"letter": "Н", "name": "Нашь"},
    19: {"letter": "О", "name": "ОнЪ"},
    20: {"letter": "П", "name": "Покои"},
    21: {"letter": "Р", "name": "Рѣци"},
    22: {"letter": "С", "name": "Слово"},
    23: {"letter": "Т", "name": "Твѣрдо"},
    24: {"letter": "У", "name": "Укъ"},
    25: {"letter": "Ꙋ", "name": "Оукъ"},
    26: {"letter": "Ф", "name": "Фѣрть"},
    27: {"letter": "Х", "name": "Хѣръ"},
    28: {"letter": "Ѿ", "name": "Отъ"},
    29: {"letter": "Ц", "name": "Ци"},
    30: {"letter": "Ч", "name": "Yєрвль"},
    31: {"letter": "Ш", "name": "Ша"},
    32: {"letter": "Щ", "name": "Шта"},
    33: {"letter": "Ъ", "name": "Єръ"},
    34: {"letter": "Ꙑ", "name": "Єры"},
    35: {"letter": "Ь", "name": "Єрь"},
    36: {"letter": "Ѣ", "name": "Ять"},
    37: {"letter": "Ю", "name": "Юнъ"},
    38: {"letter": "Ꙗ", "name": "Арь"},
    39: {"letter": "Ѥ", "name": "Эдо"},
    40: {"letter": "Ѡ", "name": "Омъ"},
    41: {"letter": "Ѧ", "name": "Єнъ"},
    42: {"letter": "Ѫ", "name": "Очь"},
    43: {"letter": "Ѩ", "name": "Ëта"},
    44: {"letter": "Ѭ", "name": "Ота"},
    45: {"letter": "Ѯ", "name": "Кси"},
    46: {"letter": "Ѱ", "name": "Пси"},
    47: {"letter": "Ѳ", "name": "Фита"},
    48: {"letter": "Ѵ", "name": "Ижица"},
    49: {"letter": "Ӕ", "name": "Ижа"}
}

# Read the detailed file
with open("999Буквица Азъ.txt", "r", encoding="cp1251") as f:
    content = f.read()

# Split by number pattern
entries = re.split(r'\n(?=\d+\. Буквица)', content)

bukvitsy = []

for entry in entries:
    entry = entry.strip()
    if not entry:
        continue
    
    # Extract number from title
    num_match = re.match(r'^(\d+)\.', entry)
    if not num_match:
        continue
    
    num = int(num_match.group(1))
    
    # Get correct name and letter from standard
    if num in standard:
        correct_name = standard[num]["name"]
        correct_letter = standard[num]["letter"]
    else:
        continue
    
    # Extract description (text after title until semantic modules)
    title_end = re.search(r'\n', entry)
    if title_end:
        desc_start = title_end.end()
        # Find semantic modules start
        modules_start = re.search(r'Основные\s+(?:грани|ключи)\s+(?:образа|смысла):', entry)
        if modules_start:
            description = entry[desc_start:modules_start.start()].strip()
        else:
            description = entry[desc_start:].strip()
    else:
        description = ""
    
    # Extract semantic modules
    modules = []
    modules_match = re.search(r'Основные\s+(?:грани|ключи)\s+(?:образа|смысла):(.*?)(?=Пример|$)', entry, re.DOTALL)
    if modules_match:
        modules_text = modules_match.group(1)
        module_list = re.findall(r'\*\s+([^:]+):\s*(.+?)(?=\*|$)', modules_text, re.DOTALL)
        for module_name, module_desc in module_list:
            modules.append({
                "name": module_name.strip(),
                "description": module_desc.strip()
            })
    
    # Extract example
    example = ""
    example_match = re.search(r'Пример.*?:(.*?)(?=Тайны|$)', entry, re.DOTALL)
    if example_match:
        example = example_match.group(1).strip()
    
    # Extract mysteries
    mysteries = ""
    mystery_match = re.search(r'Тайны.*?:(.*?)(?=Гадальное|$)', entry, re.DOTALL)
    if mystery_match:
        mysteries = mystery_match.group(1).strip()
    
    # Extract divination
    divination = ""
    divination_match = re.search(r'Гадальное.*?:(.*?)$', entry, re.DOTALL)
    if divination_match:
        divination = divination_match.group(1).strip()
    
    bukvitsy.append({
        "id": num,
        "number": num,
        "letter": correct_letter,
        "name": correct_name,
        "description": description,
        "semantic_modules": modules,
        "example": example,
        "mysteries": mysteries,
        "divination": divination
    })

# Sort by number
bukvitsy.sort(key=lambda x: x["number"])

# Save to JSON
with open("src/data/bukvitsy_detailed.json", "w", encoding="utf-8") as f:
    json.dump(bukvitsy, f, ensure_ascii=False, indent=2)

print(f"Parsed {len(bukvitsy)} detailed bukvitsy")
for b in bukvitsy[:3]:
    print(f"  {b['number']}. {b['name']} ({b['letter']}) - {len(b['description'])} chars, {len(b['semantic_modules'])} modules")