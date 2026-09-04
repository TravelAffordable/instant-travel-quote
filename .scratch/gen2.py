import glob, os, re, shutil
import pytesseract
from PIL import Image

NAMES = ["SolSands","Garden Court South Beach","Blue Waters","The Edward","Belaire","Elangeni","Suncoast","Parade Hotel","Silver Sands","Palace All-Suite","Durban Spa","Beachurst Apartment","Valley View","Metro Lodge","Impala","Apartment 4B","Tenbery503","BeachSide","UShaka Marina","Vitamin Sea","Shores 4C","Green 4A","Ocean Escape","WINDEMERE","1404","Serenity","GoldenMile","Yellow House","Chasing","57 Marlborough","Shaka shores","Sea View Escape","Ocean view @ 10","Tenbury 3","605 Tenbury","Coastal Crown","1102","Unit 706","Unit 707","UshakaViews","309 Marlborough","Mahalia","Beach Views at 10","Six Sleeper","806 Ocean"]

os.makedirs('frames', exist_ok=True)
if not glob.glob('/dev-server/.scratch/frames/full*.png'):
    os.system("ffmpeg -v error -i /mnt/user-uploads/screen-20260903-203836.mp4 -vf fps=1 -q:v 2 frames/full%03d.png")

def ocr(f):
    im=Image.open(f)
    d=pytesseract.image_to_data(im, output_type=pytesseract.Output.DICT)
    lines={}
    for i,txt in enumerate(d['text']):
        if not txt.strip(): continue
        k=(d['block_num'][i],d['par_num'][i],d['line_num'][i])
        lines.setdefault(k,[]).append((txt,d['top'][i],d['left'][i]))
    res=[]
    for k,ws in lines.items():
        s=' '.join(w[0] for w in ws); top=min(w[1] for w in ws); left=min(w[2] for w in ws)
        if left<260: continue
        for n in NAMES:
            if n.lower() in s.lower() and 200<=top<=1050:
                res.append((n,f,top))
    return res

def main():
    from multiprocessing import Pool
    found={}
    with Pool(8) as pool:
        for res in pool.imap_unordered(ocr, sorted(glob.glob('/dev-server/.scratch/frames/full*.png'))):
            for n,f,top in res:
                prev=found.get(n)
                if prev is None or abs(top-500)<abs(prev[1]-500):
                    found[n]=(f,top)
    return found

if __name__ == '__main__':
    found=main()
    out='/dev-server/src/assets/hotels/video'
    os.makedirs(out, exist_ok=True)
    def slug(n): return ''.join(c if c.isalnum() else '-' for c in n.lower()).strip('-')
    for n,(f,top) in found.items():
        im=Image.open(f); y0=max(0,top-12)
        im.crop((14,y0,252,min(im.height,y0+372))).resize((476,744)).save(f'{out}/durban-{slug(n)}.jpg', quality=88)
    print('cropped', len(found), 'missing', [n for n in NAMES if n not in found])
