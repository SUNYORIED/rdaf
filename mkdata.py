import pandas as pd
import json

def increment_alphabet(char):
    if char.isalpha() and len(char) == 1:
        ascii_code = ord(char)
        if char.islower():
            new_ascii_code = (ascii_code - ord('a') + 1) % 26 + ord('a')
        else:
            new_ascii_code = (ascii_code - ord('A') + 1) % 26 + ord('A')
        return chr(new_ascii_code)
    else:
        return char

entities_df = pd.read_csv("entities.csv", encoding="utf-8",dtype="str")
links_df = pd.read_csv("links.csv",encoding="utf-8",dtype="str")

entities = []
links = []

startNode = {
    'key': 'Start',
    'text': 'Stages',
    'category': 'stage'
}
stages = []
for index,row in entities_df.iterrows():
    if row['Category'] == 'stage':
        stages.append({'port':str.lower(row['Name']), 'text':row['Name'], 'tooltip':row['Description']})
    else:
        obj = {}
        obj['key'] = row['ID']
        obj['text'] = row['Name']
        obj['category'] = row['Category']
        if row['Category'] == 'topic':
            obj['a'] = 'outcomes'
            obj['aText'] = 'Outcomes'
            obj['aToolTip'] = 'Outcomes of ' + row['Name']
            obj['b'] = 'considerations'
            obj['bText'] = 'Considerations'
            obj['bToolTip'] = 'Considerations for ' + row['Name']
        elif row['Category'] == 'outcome':
            obj['a'] = 'activities'
            obj['aText'] = 'Produced By'
            obj['aToolTip'] = 'Activities that produce ' + row['Name']
        elif row['Category'] == 'activity':
            obj['a'] = 'participants'
            obj['aText'] = 'Participants'
            obj['aToolTip'] = 'Participants in ' + row['Name']
            obj['b'] = 'methods'
            obj['bText'] = 'Methods'
            obj['bToolTip'] = 'Methods for ' + row['Name']
            obj['c'] = 'exemplars'
            obj['cText'] = 'Exemplars'
            obj['cToolTip'] = 'Exemplars of ' + row['Name']
        entities.append(obj)

port = 'a'
for stage in stages:
    startNode[port] = stage['port']
    startNode[port + 'Text'] = stage['text']
    startNode[port + 'ToolTip'] = stage['tooltip']
    port = increment_alphabet(port)
entities.insert(0,startNode)


for index,row in links_df.iterrows():
    link = {}
    link['from'] = row['Subject']
    link['to'] = row['Object']
    if row['Predicate'] == 'includes':
        link['fromport'] = 'envision' # TODO fix
    elif row['Predicate'] == 'producedBy':
        link['fromport'] = 'activities'
    elif row['Predicate'] == 'indicatedBy':
        link['fromport'] = 'outcomes'
    elif row['Predicate'] == 'mayConsider':
        link['fromport'] = 'considerations'
    elif row['Predicate'] == 'mayInvolve':
        link['fromport'] = 'participants'
    elif row['Predicate'] == 'hasMethod':
        link['fromport'] = 'methods'
    elif row['Predicate'] == 'hasExemplar':
        link['fromport'] = 'exemplars'
    links.append(link)


with open("entities.json", "w") as json_file:
    json.dump(entities, json_file, indent=4)

with open("links.json","w") as json_file:
    json.dump(links, json_file, indent=4)
