#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Mar  5 15:27:19 2024

@author: logan
"""

import json

with open('all-courses.txt', 'r') as file:
    courses_in_html = file.read()
    
courses = courses_in_html.split('<tr class="finderrow odd ui-draggable" title=')[1:]

for c in courses:
    c.re

# load JSON
# with open('records.json', 'r') as file:
#     json_dict = json.load(file)


# Location of ape plans:
    # https://ape.cedarville.edu/reply.php?action=getPlan&plan=<id>
    # find <id> by inspecting plan manager ui