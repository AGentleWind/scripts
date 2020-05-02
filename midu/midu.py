"""
@author: pysta
@file: SurgeToJs.py
@createTime: 2020-05-01
"""

import zipfile
import json
import appex
import clipboard
import console


def get_request_data(path):

    with zipfile.ZipFile(path, 'r') as z:
        with z.open('model.json') as f:
            data = json.load(f)
        if 'request.dump' in z.namelist():
            with z.open('request.dump') as f:
                body = str(f.read(), encoding='utf-8')
                data['requestBody'] = body
    return data


path = appex.get_file_path()
data = get_request_data(path)

body = data.get('requestBody', '')
url = data['URL']
method = data['method'].lower()
headers = {k: v for k, v in [
    i.split(': ', 1) for i in data['requestHeader'].split('\r\n')[1:] if i]}

js = f'''
const url = {json.dumps(url)}
const body = {json.dumps(body)}
const headers = {json.dumps(headers, indent=4)}
const request = {{
    url: url,
    headers: headers,
    body: body
}}

'''

print(js)
clipboard.set(js)
console.hud_alert('Copyed!')
