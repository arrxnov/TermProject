#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Mar  5 15:27:19 2024

@author: logan

change to plan you want to use
https://ape.cedarville.edu/reply.php?action=getSessionPlan
https://ape.cedarville.edu/reply.php?action=getInitSessionTree
"""

import json

with open('html-courses.txt', 'r') as file:
    courses = file.read()
    
courses = courses.replace('&#39;', '\'')
courses = courses.replace('&amp;', '&')
courses = courses.replace('</td></tr><tr class="finderrow odd ui-draggable" title="', '@')
courses = courses.replace('</td></tr><tr class="finderrow even ui-draggable" title="', '@')
courses = courses.replace('<tr class="finderrow odd ui-draggable" title="', '@')
courses = courses.replace('</td></tr>', '@')
courses = courses.replace('"><td class="findername sorting_1">', '#')
courses = courses.replace('</td><td class="findertitle">', '#')
courses = courses.replace('</td><td>', '#')

courses = courses.split('@')[1:-1]
courses = list(map(lambda x: x.split('#'), courses))

with open("course.txt", "w") as f:
    #    (id, name, credits, description),
    for c in courses:
        output = (c[1], c[2], c[3], c[0])
        print('    ', output, ',', sep='', file=f)
        
with open("course-catalog.txt", "w") as f:
    for c in courses:
        output = (2021, c[1])
        print('    ', output, ',', sep='', file=f)

with open('loganmiller216.json', 'r') as f:
    plan_dict = json.load(f)
    
with open('planned-course.txt', 'w') as f:
    for c in plan_dict['courses']:
        output = (1, c['name'], c['year'], c['sem'])
        print('    ', output, ',', sep='', file=f)
        
with open('jgrady.json', 'r') as f:
    plan_dict = json.load(f)
    
with open('planned-course.txt', 'a') as f:
    for c in plan_dict['courses']:
        output = (2, c['name'], c['year'], c['sem'])
        print('    ', output, ',', sep='', file=f)
        
# with open('kaidendelsing.json', 'r') as f:
#     plan_dict = json.load(f)
    
# with open('planned-course.txt', 'a') as f:
#     for c in plan_dict['courses']:
#         output = (3, c['name'], c['year'], c['sem'])
#         print('    ', output, ',', sep='', file=f)
        
with open('loganmiller216-alt.json', 'r') as f:
    plan_dict = json.load(f)
    
with open('planned-course.txt', 'a') as f:
    for c in plan_dict['courses']:
        output = (4, c['name'], c['year'], c['sem'])
        print('    ', output, ',', sep='', file=f)
        
# Load data from requirements here (need 3: comp sci, cyber ops, math)
# Get a distinct reqs json for each major: just need core, electives, cognates, geneds
with open('cs-cy-reqs.json', 'r') as f:
    reqs_dict = json.load(f)
    
with open('reqs.txt', 'w') as f:
    for c in reqs_dict['data']['tree']:
        if "Computer Science Core" in c['name']: # if core
            for cc in c['children']:
                output = (1, cc['name'], 'core')
                print('    ', output, ',', sep='', file=f)
                
        # if core
        
        # if cognates
        
        # if geneds
        
        # repeat for each minus geneds
            
