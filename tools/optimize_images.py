# -*- coding: utf-8 -*-
"""Redimensionne et convertit en WebP les images générées (Gemini / ChatGPT).
Usage : python3 tools/optimize_images.py <dossier contenant assets/img/...>
Les PNG d'origine ne sont pas gardés dans le dépôt (trop lourds)."""
import sys, os, glob
from PIL import Image
# taille maximale (plus grand côté) selon le dossier : l'image n'est jamais affichée plus grande
MAX = {'brand/logo':192,'brand/banner':1000,'coach':256,'players':256,'categories':160,
       'fx/ball':128,'fx/trophy':360,'fx':640,'scenes':820,'minigame':720,'bg':1280,'rules':256}
def limit(key):
    for k in (key, key.split('/')[0]):
        if k in MAX: return MAX[k]
    return 800
src=sys.argv[1]; root=os.path.join(os.path.dirname(__file__),'..','assets','img')
tot=0
for f in sorted(glob.glob(os.path.join(src,'**','*.png'),recursive=True)):
    rel=f.replace('\\','/').split('assets/img/')[-1][:-4]
    im=Image.open(f).convert('RGBA'); m=limit(rel)
    if rel.startswith('minigame/defender'):  # rogne les marges transparentes (mains au bord de l'image)
        im=im.crop(im.getchannel('A').point(lambda v:255 if v>40 else 0).getbbox())
    if max(im.size)>m: im.thumbnail((m,m),Image.LANCZOS)
    opaque=im.getchannel('A').getextrema()[0]==255
    out=os.path.join(root,rel+'.webp'); os.makedirs(os.path.dirname(out),exist_ok=True)
    (im.convert('RGB') if opaque else im).save(out,'WEBP',quality=82,method=6)
    tot+=os.path.getsize(out); print('%-24s %4dx%-4d %5d Ko'%(rel,im.width,im.height,os.path.getsize(out)//1024))
print('Total : %d Ko'%(tot//1024))
