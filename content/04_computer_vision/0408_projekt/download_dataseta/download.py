import requests
import json
import numpy as np
from bs4 import BeautifulSoup

response = requests.get('https://www.instruktor-voznje.com.hr/prometni_znakovi')
soup = BeautifulSoup(response.text, 'html.parser')

image_containers = soup.find_all('div', class_='slika_u_postu')

images = []
id = 1

for div in image_containers:
    img = div.find_all('img')[0]
    image_url = f'https://www.instruktor-voznje.com.hr{img["src"]}'
    r = requests.get(image_url)
    with open(f'images/{id}.jpg', 'wb') as f:
        f.write(r.content)

    images.append({
        'id': id,
        'src': img['src'],
        'alt': img['alt'],
        'path': f'images/{id}.jpg'
    })
    id += 1


with open('images.json', 'w') as f:
    json.dump(images, f)

