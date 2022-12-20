import requests
import shutil
# from bs4 import BeautifulSoup

# URL = "https://www.pokencyclopedia.info/en/index.php?id=sprites/overworlds/o-b_hgss_shiny"
# page = requests.get(URL)

# soup = BeautifulSoup(page.content, "html.parser")

# document = soup.popTag()
# html = list(document.children)[2]
# body = list(html.children)[3]
# table = list(body.children)[12]
# tbody = list(table.children)[1]
# td1 = list(tbody.children)[1]
# content = list(td1.children)[5]
# sprites_parent = list(content.children)[3]
# pokemon_tables = [x for x in list(sprites_parent)[3] if x != '\n'][:151]

# for table in pokemon_tables:
#     list(table.children)[3]


def to_3_digit(num: int) -> str:
    string = str(num)
    string = '0' * (3 - len(string)) + string
    return string

for x in range(14, 152):
    num = to_3_digit(x)

    # Up down left and right
    # First and second frame
    url = f'https://www.pokencyclopedia.info/sprites/overworlds/o_hgss_shiny/o_hs-S_{num}_1.png'
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        with open(f'sprites/{num}_down_1.png', 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)
    url = f'https://www.pokencyclopedia.info/sprites/overworlds/o_hgss_shiny/o_hs-S_{num}_2.png'
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        with open(f'sprites/{num}_down_2.png', 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)

    url = f'https://www.pokencyclopedia.info/sprites/overworlds/o-b_hgss_shiny/o-b_hs-S_{num}_1.png'
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        with open(f'sprites/{num}_up_1.png', 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)
    url = f'https://www.pokencyclopedia.info/sprites/overworlds/o-b_hgss_shiny/o-b_hs-S_{num}_2.png'
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        with open(f'sprites/{num}_up_2.png', 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)

    url = f'https://www.pokencyclopedia.info/sprites/overworlds/o-l_hgss_shiny/o-l_hs-S_{num}_1.png'
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        with open(f'sprites/{num}_left_1.png', 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)
    url = f'https://www.pokencyclopedia.info/sprites/overworlds/o-l_hgss_shiny/o-l_hs-S_{num}_2.png'
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        with open(f'sprites/{num}_left_2.png', 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)

    url = f'https://www.pokencyclopedia.info/sprites/overworlds/o-r_hgss_shiny/o-r_hs-S_{num}_1.png'
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        with open(f'sprites/{num}_right_1.png', 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)
    url = f'https://www.pokencyclopedia.info/sprites/overworlds/o-r_hgss_shiny/o-r_hs-S_{num}_2.png'
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        with open(f'sprites/{num}_right_2.png', 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)