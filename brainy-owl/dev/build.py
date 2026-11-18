import pathlib
src=pathlib.Path('src')
js='\n'.join((src/f).read_text() for f in ['icons.js','gens.js','engine.js','ui.js'])
js=js.replace("if(typeof module!=='undefined') module.exports=","if(typeof module!=='undefined'&&typeof window==='undefined') module.exports=")
html=(src/'shell.html').read_text().replace('/*__JS__*/',js)

(pathlib.Path('..')/'index.html').write_text(html)
print(len(html))
