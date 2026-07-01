import json
from pathlib import Path

path = Path('../data.json')
data = json.loads(path.read_text(encoding='utf-8'))
updated = 0

for region, info in data.items():
    for ev in info.get('events', []):
        base_text = ev.get('text', '').strip()
        if base_text:
            new_detail = f'{base_text} Đây là một mốc lịch sử quan trọng của khu vực {region}, ảnh hưởng đến đời sống, văn hóa và phát triển địa phương.'
        else:
            new_detail = 'Sự kiện ghi dấu một bước quan trọng trong lịch sử địa phương, ảnh hưởng sâu rộng đến nhận thức, văn hóa và phát triển sau này.'

        if ev.get('detail', '') != new_detail:
            ev['detail'] = new_detail
            updated += 1

path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')
print(f'updated {updated} event detail fields')
