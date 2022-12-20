import numpy as np
import os
import cv2

folder = 'sprites'

def append_all_with_alpha(list1: list, list2: list) -> None:
    for x in list2:
        lst = list(x)
        lst.append(0 if x.sum() == 0 else 100)
        list1.append(np.array(lst))

def append_all(list1: list, list2: list) -> None:
    for x in list2:
        list1.append(x)

def to_3_digit(num: int) -> str:
    string = str(num)
    string = '0' * (3 - len(string)) + string
    return string

def empty_row() -> list:
    row = []
    for _ in range(32 * 4):
        row.append([])
    return row

# 32 * 32 pixels per row
final = []
row = empty_row()

for x in range(1, 159):
    
    # Double venusaur and pikachu because of gender differences
    # We don't use gender in our game anyways so this is just to sync it with the other sheet
    double = False
    if x in [3, 25]:
        double = True
    
    if x > 151:
        x = 1

    if len(row[0]) == 32 * 32:
        append_all(final, row)
        row = empty_row()

    # Load images
    for _ in range(2 if double else 1):
        # Up
        image = cv2.imread(os.path.join(folder, f'{to_3_digit(x)}_up_1.png'), cv2.IMREAD_UNCHANGED)
        for i, image_row in enumerate(image):
            append_all(row[i], image_row)

        image = cv2.imread(os.path.join(folder, f'{to_3_digit(x)}_up_2.png'), cv2.IMREAD_UNCHANGED)
        for i, image_row in enumerate(image):
            append_all(row[i], image_row)

        # Down
        image = cv2.imread(os.path.join(folder, f'{to_3_digit(x)}_down_1.png'), cv2.IMREAD_UNCHANGED)
        for i, image_row in enumerate(image):
            append_all(row[i + 32], image_row)

        image = cv2.imread(os.path.join(folder, f'{to_3_digit(x)}_down_2.png'), cv2.IMREAD_UNCHANGED)
        for i, image_row in enumerate(image):
            append_all(row[i + 32], image_row)

        # Left
        image = cv2.imread(os.path.join(folder, f'{to_3_digit(x)}_left_1.png'), cv2.IMREAD_UNCHANGED)
        for i, image_row in enumerate(image):
            append_all(row[i + 32 * 2], image_row)

        image = cv2.imread(os.path.join(folder, f'{to_3_digit(x)}_left_2.png'), cv2.IMREAD_UNCHANGED)
        for i, image_row in enumerate(image):
            append_all(row[i + 32 * 2], image_row)
        
        # Right
        image = cv2.imread(os.path.join(folder, f'{to_3_digit(x)}_right_1.png'), cv2.IMREAD_UNCHANGED)
        for i, image_row in enumerate(image):
            append_all(row[i + 32 * 3], image_row)

        image = cv2.imread(os.path.join(folder, f'{to_3_digit(x)}_right_2.png'), cv2.IMREAD_UNCHANGED)
        for i, image_row in enumerate(image):
            append_all(row[i + 32 * 3], image_row)
    
append_all(final, row)

cv2.imwrite('shiny-pokemon.png', np.array(final))