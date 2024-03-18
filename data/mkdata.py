import pandas as pd
import json
import uuid
import re

THING = "https://schema.org/Thing"
SUNYNS = "https://data.suny.edu/vocabs/oried/rdaf/suny/"
PREDICATES = {
    'resources': 'includes',
    'considerations': 'includes',
    'outputs': 'generates',
    'activities': 'resultsFrom',
    'outcomes': 'generates',
    'methods': 'includes',
    'participants': 'includes',
    'roles': 'includes',
    'extends': 'extends'
}
def get_obj(obj_id,name,category):
    obj = {}
    obj['key'] = obj_id
    obj['text'] = name
    obj['category'] = category
    return obj

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

uuids = {}
text_to_id = {}
def get_uuid(category,text):
    if category not in uuids:
        uuids[category] = 0
        text_to_id[category] = {}
    if text not in text_to_id[category]:
        uuids[category] = uuids[category] + 1
        text_to_id[category][text] = "https://data.suny.edu/entities/oried/rdaf/suny/" + category + '.' + str(uuids[category])
    return text_to_id[category][text]

links = []
entities = []
startNode = {
    'key': 'Start',
    'text': 'Stages',
    'category': 'stage'
}

rdaf_objs = {'stage': {}, 'topic': {}, 'subtopic': {} }
suny_objs = {}
st_defs = {}

st_df = pd.read_csv("rdafstagesandtopics.csv", encoding="utf-8",dtype="str")
mapping_df = pd.read_csv("sunymappings.csv",encoding="utf-8",dtype="str")
subtopics_df = pd.read_csv("subtopicdefinitions.csv", encoding="utf-8", dtype="str")

for index,row in st_df.iterrows():
    obj = { 'name': row['Name'], 'description': row['Definition'] }
    otype = row['Type'].lower()
    rdaf_objs[otype][row['ID']] = obj
    if otype == 'topic':
        sid = row['ID'].split('.')[0]
        links.append({'from':'Start', 'fromport':sid, 'to':row['ID']})

for index,row in subtopics_df.iterrows():
    sid = str(row['SUBTOPIC']).strip().split(' ')[0]
    st_defs[sid] = row['DEFINITION'].strip()

extensions = {}
def add_extension(source_id,target_id):
    if source_id not in extensions:
        extensions[source_id] = {}
    extensions[source_id][target_id] = 1

def get_extension(text):
    parts = text.split(':',1)
    extends = None
    if len(parts) == 2 and parts[0].strip().split(' ')[0] in rdaf_objs['subtopic']:
        extends = parts[0].strip().split(' ')[0]
        name = parts[1].strip()
    else:
        name = text
    return (extends,name)

def map_row(row,last_subtopic):
    subtopic_id = None
    if str(row['SUBTOPIC']) == 'nan' or re.match('^\s*$',str(row['SUBTOPIC'])):
        subtopic_id = last_subtopic
    else:
        (subtopic_id,subtopic_text) = row['SUBTOPIC'].strip().split(' ',1)
        if subtopic_id not in rdaf_objs['subtopic']:
            topic_id = '.'.join(subtopic_id.split('.')[0:2])
            sub_obj = { 'name': subtopic_text, 'topic': topic_id, 'considerationFor': [], 'extensions': [] }
            rdaf_objs['subtopic'][subtopic_id] = sub_obj
        last_subtopic = subtopic_id
    considerations = []
    if str(row['Consideration For (Inputs)']) != 'nan':
        considerations = row['Consideration For (Inputs)'].strip().split(',')
        rdaf_objs['subtopic'][subtopic_id]['considerationFor'] = considerations
    activity_id = None
    if str(row['Activity']) != 'nan':
        activity = row['Activity'].strip()
        activity_id = get_uuid('activity',activity)
        if activity_id not in suny_objs:
            suny_objs[activity_id] = { 'name':activity, 'type': 'activity', 'outputs': [], 'participants': [], 'roles': [], 'resources': [], 'methods': [], 'extends': subtopic_id  }
            add_extension(subtopic_id,activity_id)
    if str(row['Outcomes (see comment)']) != 'nan':
        outcome = row['Outcomes (see comment)'].strip()
        outcome_id = get_uuid('outcome',outcome)
        add_extension(subtopic_id,outcome_id)
        topic_id = '.'.join(subtopic_id.split('.')[0:2])
        suny_objs[outcome_id] = { 'name':outcome, 'type': 'outcome', 'activities': {}, 'extends': subtopic_id, 'topic': topic_id }
        if activity_id:
            suny_objs[outcome_id]['activities'][activity_id] = 1
    if str(row['Milestone Indicator (Outputs)']) != 'nan':
        output = row['Milestone Indicator (Outputs)'].strip()
        output_id = get_uuid('output',output)
        suny_objs[output_id] = { 'name':output, 'type': 'output' }
        if activity_id:
            suny_objs[activity_id]['outputs'].append(output_id)
    if str(row['Participants']) != 'nan':
        for participant in row['Participants'].strip().split(','):
            participant = participant.strip()
            participant_id = get_uuid('participant',participant)
            suny_objs[participant_id] = { 'name':participant, 'type': 'participant' }
            if activity_id:
                suny_objs[activity_id]['participants'].append(participant_id)
    if str(row['Participant Group']) != 'nan':
        for role in row['Participant Group'].strip().split(','):
            role = role.strip()
            role_id = get_uuid('role',role)
            suny_objs[role_id] = { 'name':role, 'type': 'role' }
            if activity_id:
                suny_objs[activity_id]['roles'].append(role_id)
    if str(row['Method']) != 'nan':
        for method in row['Method'].strip().split(','):
            method = method.strip()
            method_id = get_uuid('method',method)
            suny_objs[method_id] = { 'name':method, 'type': 'method' }
            if activity_id:
                suny_objs[activity_id]['methods'].append(method_id)
    if str(row['Guiding documents']) != 'nan':
        for res in row['Guiding documents'].strip().split(','):
            parts = res.split('|')
            text = parts[0].strip().replace('[','').replace('"','')
            url = parts[1].strip().replace(']','')
            suny_objs[url] = { 'name':text, 'type': 'resource' }
            if activity_id:
                suny_objs[activity_id]['resources'].append(url)




    return last_subtopic

last_subtopic = None
for index,row in mapping_df.iterrows():
    last_subtopic = map_row(row,last_subtopic)
for extension in extensions:
    rdaf_objs['subtopic'][extension]['extensions'] = extensions[extension]

graph = {}
stages = []
for stage in rdaf_objs['stage']:
    tooltip = rdaf_objs['stage'][stage]['description']
    name = rdaf_objs['stage'][stage]['name']
    stages.append({'port':stage, 'text':name, 'tooltip':tooltip})
    graph[stage] = {
      '@id': 'https://data.suny.edu/entities/oried/rdaf/nist/' + stage,
      '@type': THING,
      'name': name,
      'additionalType': 'RdAF Stage',
      'description':tooltip
    }


considerations = {}
for subtopic in rdaf_objs['subtopic']:
    name = rdaf_objs['subtopic'][subtopic]['name']
    obj = get_obj(subtopic,name,'consideration')
    obj['text'] = name
    definition = None
    if subtopic in st_defs:
        obj['category'] = 'consideration-wdef'
        obj['a'] = 'definition'
        obj['aText'] = 'Definition'
        obj['aToolTip'] = st_defs[subtopic]
        definition = st_defs[subtopic]
    entities.append(obj)
    if len(rdaf_objs['subtopic'][subtopic]['considerationFor']) > 0:
        for obj_id in rdaf_objs['subtopic'][subtopic]['considerationFor']:
            if obj_id in rdaf_objs['topic']:
                links.append({'from':obj_id, 'fromport':'considerations', 'to':subtopic})
            if obj_id not in considerations:
                considerations[obj_id] = {}
            considerations[obj_id][subtopic] = 1
    graph[subtopic] = {
      '@id': 'https://data.suny.edu/entities/oried/rdaf/nist/' + subtopic,
      '@type': THING,
      'name': name,
      'additionalType': 'RdAF Subtopic',
    }
    if definition:
        graph[subtopic]['description'] = definition


for topic in rdaf_objs['topic']:
    tooltip = rdaf_objs['topic'][topic]['description']
    name = rdaf_objs['topic'][topic]['name']
    obj = get_obj(topic,name,'topic')
    obj['a'] = 'outcomes'
    obj['aText'] = 'Outcomes'
    obj['aToolTip'] = tooltip
    if topic in considerations:
        obj['category'] = obj['category'] + '-considerations'
        obj['y'] = 'considerations'
        obj['yText'] = 'Considerations'
        obj['yToolTip'] = 'Considerations for ' + name
    entities.append(obj)

    graph[topic] = {
      '@id': 'https://data.suny.edu/entities/oried/rdaf/nist/' + topic,
      '@type': THING,
      'name': name,
      'additionalType': 'RdAF Topic',
      'description': tooltip
    }

for obj_id in suny_objs:
    otype = suny_objs[obj_id]['type']
    oname = suny_objs[obj_id]['name']
    isExtension = None
    if 'extends' in suny_objs[obj_id] and suny_objs[obj_id]['extends']:
        isExtension = suny_objs[obj_id]['extends'] 
    obj = get_obj(obj_id,oname,otype)
    if otype == 'outcome':
        obj['a'] = 'activities'
        obj['aText'] = 'Activities'
        obj['aToolTip'] = 'Activities that result in ' + oname
        for activity in suny_objs[obj_id]['activities']:
            links.append({'from': obj_id, 'fromport':'activities','to':activity})
        topic = suny_objs[obj_id]['topic']
        links.append({'from':topic,'fromport':'outcomes','to':obj_id})
    elif otype == 'activity':
        obj['a'] = 'participants'
        obj['aText'] = 'Participants'
        obj['aToolTip'] = 'Participants in ' + oname
        obj['b'] = 'methods'
        obj['bText'] = 'Methods'
        obj['bToolTip'] = 'Methods for ' + oname
        obj['c'] = 'outputs'
        obj['cText'] = 'Outputs'
        obj['cToolTip'] = 'Outputs of ' + oname
        obj['d'] = 'roles'
        obj['dText'] = 'Roles'
        obj['dToolTip'] = 'Roles involved in ' + oname
        obj['e'] = 'resources'
        obj['eText'] = 'Resources'
        obj['eToolTip'] = 'Resources used by ' + oname
        for output in set(suny_objs[obj_id]['outputs']):
            links.append({'from': obj_id, 'fromport':'outputs','to':output})
        for method in set(suny_objs[obj_id]['methods']):
            links.append({'from': obj_id, 'fromport':'methods','to':method})
        for participant in set(suny_objs[obj_id]['participants']):
            links.append({'from': obj_id, 'fromport':'participants','to':participant})
        for role in set(suny_objs[obj_id]['roles']):
            links.append({'from': obj_id, 'fromport':'roles','to':role})
        for resource in set(suny_objs[obj_id]['resources']):
            links.append({'from': obj_id, 'fromport':'resources','to':resource})

    if isExtension:
        if isExtension in considerations:
            obj['category'] = obj['category'] + '-' + "extension-considerations"
            for cid in set(considerations[isExtension]):
                links.append({'from':obj_id, 'fromport':'considerations', 'to':cid})
            obj['y'] = 'considerations'
            obj['yText'] = 'Considerations'
            obj['yToolTip'] = 'Considerations for ' + oname
        else:
            obj['category'] = obj['category'] + '-' + "extension"
        obj['z'] = 'extends'
        obj['zText'] = 'RDaF Subtopic'
        obj['zToolTip'] = isExtension + ' ' + rdaf_objs['subtopic'][isExtension]['name']
        if isExtension in st_defs:
            obj['zToolTip'] = obj['zToolTip'] + " : " + st_defs[isExtension]
        links.append({'from':obj_id, 'fromport':'extends', 'to':suny_objs[obj_id]['extends']})
    entities.append(obj)
    graph[obj_id] = {
        '@id': obj_id,
        '@type': SUNYNS + otype.capitalize(),
        'name': oname
    }

port = 'a'
for stage in stages:
    startNode[port] = stage['port']
    startNode[port + 'Text'] = stage['text']
    startNode[port + 'ToolTip'] = stage['tooltip']
    port = increment_alphabet(port)
entities.insert(0,startNode)

for link in links: 
    if link['fromport'] in rdaf_objs['stage']:
        subj = graph[link['fromport']]
        pred = 'sunyrdaf:includes'
    else:
        subj = graph[link['from']]
        pred = 'sunyrdaf:' + PREDICATES[link['fromport']]
    obj = graph[link['to']]['@id']
    if pred not in subj:
        subj[pred] = []
    subj[pred].append(obj)


with open("entities.json", "w") as json_file:
    json.dump(entities, json_file, indent=4)

with open("links.json","w") as json_file:
    json.dump(links, json_file, indent=4)

with open("graph.jsonld","w") as json_file:
    json.dump({
        "@context": {
        "name": "https://schema.org/name",
        "additionalType": "https://schema.org/additionalType",
        "description": "https://schema.org/description",
        "sunyrdaf": SUNYNS,
        "sunyrdaf:includes": {
            "@type": "@id"
          },
        "sunyrdaf:extends": {
            "@type": "@id"
          },
        "sunyrdaf:generates": {
            "@type": "@id"
          },
        "sunyrdaf:resultsFrom": {
            "@type": "@id"
          }
        },
        '@graph':list(graph.values())
        }, json_file, indent=4)
