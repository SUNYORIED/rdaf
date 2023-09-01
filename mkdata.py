import pandas as pd
import json
import uuid

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

triples_df = pd.read_csv("RecipePlanTriples.csv",encoding="utf-8",dtype="str")
considerations_df = pd.read_csv("RecipePlanConsiderations.csv",encoding="utf-8",dtype="str")
definitions_df = pd.read_csv("RecipePlan-definitions.csv",encoding="utf-8",dtype="str")

eids = {'stage': {}, 'topic': {}, 'activity': {}, 'outcome': {}, 'method': {}, 'exemplar': {}, 'participant_group': {}, 'consideration': {}, 'participant': {}, 'outcome-complete': {} }
links = {}
entities = []

startNode = {
    'key': 'Start',
    'text': 'Stages',
    'category': 'stage'
}

def get_uuid(category,value):
    myid = None
    if value:
        if value not in eids[category]:
            eids[category][value] = str(uuid.uuid4())
        myid = eids[category][value]
    return myid

def get_tooltip(term):
    tooltip = term
    defs = definitions_df.loc[definitions_df['Term'].str.lower() == str.lower(term)]
    if not defs.empty:
        tooltip = defs.iloc[0]['Definition']
    return tooltip

def get_obj(name,category):
    obj = {}
    obj['key'] = eids[category][name]
    obj['text'] = name
    obj['category'] = category
    return obj

for index,row in triples_df.iterrows():
    stage = row['Stage'].strip()
    topic = row['Topic'].strip()
    if str(row['Activity']) != 'nan':
        activity = row['Activity'].strip()
    else:
        activity = None
    if str(row['Milestone/Indicator']) != 'nan':
        outcome = row['Milestone/Indicator'].strip()
    else:
        outcome = None
    if str(row['Participants']) != 'nan':
        participants = row['Participants'].strip().split(',')
    else:
        participants = []
    if str(row['Participant Group']) != 'nan':
        participant_group = row['Participant Group']
    else:
        participant_group = None
    if str(row['Methods']) != 'nan':
        method = row['Methods'].strip()
    else:
        method = None
    if str(row['Exemplar@SUNY']) != 'nan':
        exemplars = row['Exemplar@SUNY'].strip().split(',')
    else:
        exemplars = []
    stage_id = get_uuid('stage',stage)
    topic_id = get_uuid('topic',topic)
    activity_id = get_uuid('activity',activity)
    if len(exemplars) > 0:
        outcome_id = get_uuid('outcome-complete', outcome)
    else:
        outcome_id = get_uuid('outcome', outcome)
    method_id = get_uuid('method',method)
    participant_group_id = get_uuid('participant_group',participant_group)
    p_ids = {}
    for p in participants:
        p_ids[p] = get_uuid('participant',p)
    e_ids = {}
    for e in exemplars:
        e_ids[e] = get_uuid('exemplar',e)
    links['|'.join([stage_id,'includes',topic_id])] = 1
    if outcome_id and activity_id:
        links['|'.join([outcome_id,'producedBy',activity_id])] = 1
    if outcome_id:
        links['|'.join([topic_id,'indicatedBy',outcome_id])] = 1
    if activity_id and len(p_ids) > 0:
        for p in p_ids:
            links['|'.join([activity_id,'mayInvolve',p_ids[p]])] = 1
    if activity_id and participant_group_id:
        links['|'.join([activity_id,'mayInvolveGroup',participant_group_id])] = 1
    if activity_id and method_id:
        links['|'.join([activity_id,'hasMethod',method_id])] = 1
    if activity_id and len(e_ids) > 0:
        for e in e_ids:
            links['|'.join([activity_id,'hasExemplar',e_ids[e]])] = 1

stages = []
for stage in eids['stage']:
    tooltip = get_tooltip(stage)
    stages.append({'port':str.lower(stage), 'text':stage, 'tooltip':tooltip})

for topic in eids['topic']:
    tooltip = get_tooltip(topic)
    obj = get_obj(topic,'topic')
    obj['a'] = 'outcomes'
    obj['aText'] = 'Outcomes'
    obj['aToolTip'] = tooltip
    obj['b'] = 'considerations'
    obj['bText'] = 'Considerations'
    obj['bToolTip'] = 'Considerations for ' + topic
    entities.append(obj)

for outcome in eids['outcome']:
    obj = get_obj(outcome,'outcome')
    obj['a'] = 'activities'
    obj['aText'] = 'Produced By'
    obj['aToolTip'] = 'Activities that produce ' + outcome
    entities.append(obj)

for outcome in eids['outcome-complete']:
    obj = get_obj(outcome,'outcome-complete')
    obj['a'] = 'activities'
    obj['aText'] = 'Produced By'
    obj['aToolTip'] = 'Activities that produce ' + outcome
    entities.append(obj)


for activity in eids['activity']:
    obj = get_obj(activity,'activity')
    obj['a'] = 'participants'
    obj['aText'] = 'Participants'
    obj['aToolTip'] = 'Participants in ' + activity
    obj['b'] = 'methods'
    obj['bText'] = 'Methods'
    obj['bToolTip'] = 'Methods for ' + activity
    obj['c'] = 'exemplars'
    obj['cText'] = 'Exemplars'
    obj['cToolTip'] = 'Exemplars of ' + activity
    obj['d'] = 'pgroups'
    obj['dText'] = 'Roles'
    obj['dToolTip'] = 'Roles involved in ' + activity
    entities.append(obj)

for p in eids['participant']:
    obj = get_obj(p,'participant')
    entities.append(obj)

for p in eids['participant_group']:
    obj = get_obj(p,'participant_group')
    entities.append(obj)

for m in eids['method']:
    obj = get_obj(m,'method')
    entities.append(obj)

for e in eids['exemplar']:
    obj = get_obj(e,'exemplar')
    parts = e.split('|')
    if len(parts) > 1:
        obj['text'] = parts[0]
        obj['category'] = 'exemplar-linked'
        obj['a'] = parts[1]
        obj['aText'] = 'View'
        obj['aToolTip'] = parts[1]
    entities.append(obj)

for index, row in considerations_df.iterrows():
    c = row['Consideration'].strip()
    c_id = get_uuid('consideration',c)
    obj = get_obj(c,'consideration')
    entities.append(obj)
    t_id = get_uuid('topic',row['Topic'].strip())
    if t_id:
      links['|'.join([t_id,'mayConsider',c_id])] = 1
    else:
        print("Missing Topic for Consideration",row)

port = 'a'
for stage in stages:
    startNode[port] = stage['port']
    startNode[port + 'Text'] = stage['text']
    startNode[port + 'ToolTip'] = stage['tooltip']
    port = increment_alphabet(port)
entities.insert(0,startNode)

lnodes = []
for l in links:
    parts = l.split('|')
    link = {}
    link['from'] = parts[0]
    predicate = parts[1]
    link['to'] = parts[2]
    if predicate == 'includes':
        link['from'] = 'Start'
        for s in eids['stage']:
            if eids['stage'][s] == parts[0]:
                link['fromport'] = str.lower(s)
    elif predicate == 'producedBy':
        link['fromport'] = 'activities'
    elif predicate == 'indicatedBy':
        link['fromport'] = 'outcomes'
    elif predicate == 'mayConsider':
        link['fromport'] = 'considerations'
    elif predicate == 'mayInvolve':
        link['fromport'] = 'participants'
    elif predicate == 'mayInvolveGroup':
        link['fromport'] = 'pgroups'
    elif predicate == 'hasMethod':
        link['fromport'] = 'methods'
    elif predicate == 'hasExemplar':
        link['fromport'] = 'exemplars'
    lnodes.append(link)


with open("entities.json", "w") as json_file:
    json.dump(entities, json_file, indent=4)

with open("links.json","w") as json_file:
    json.dump(lnodes, json_file, indent=4)
