import pathlib
src=pathlib.Path('src')
js='\n'.join((src/f).read_text() for f in ['icons.js','gens.js','engine.js','ui.js'])
js=js.replace("if(typeof module!=='undefined') module.exports=","if(typeof module!=='undefined'&&typeof window==='undefined') module.exports=")
html=(src/'shell.html').read_text().replace('/*__JS__*/',js)
# keep the Home Screen app tags that tools/make_home_screen_apps.py put in the current index.html
import re
old=(pathlib.Path('..')/'index.html')
if old.exists():
    m=re.search(r'<!-- home-screen-app -->.*?<!-- /home-screen-app -->\n?',old.read_text(),re.S)
    if m: html=html.replace('</head>',m.group(0)+'</head>',1)

(pathlib.Path('..')/'index.html').write_text(html)
print(len(html))
