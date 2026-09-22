#!/usr/bin/env python3
import re

file_path = "web/src/data/catalog.ts"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace why_it_works strings with lowercase versions
# This regex finds why_it_works followed by a multi-line string
def lowercase_description(match):
    prefix = match.group(1)  # why_it_works: or similar
    quote = match.group(2)    # opening quote
    text = match.group(3)     # the actual text
    suffix = match.group(4)   # closing quote and comma

    # Convert text to lowercase
    lowercased = text.lower()
    return f'{prefix}{quote}{lowercased}{quote}{suffix}'

# Match why_it_works: "..." or "..." patterns
pattern = r'(why_it_works:\s*)(["\'])(.*?)\2(,)'
content = re.sub(pattern, lowercase_description, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ All product descriptions converted to lowercase!")
