"""Packt die Website in eine einzige HTML-Datei (preview.html) – zum Verschicken/Ansehen ohne Server."""
import base64, os, re
here = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(here, p), encoding="utf-8").read()
html = rd("index.html")
def img_uri(m):
    p = m.group(0)
    return "data:image/jpeg;base64," + base64.b64encode(open(os.path.join(here, p), "rb").read()).decode()
html = html.replace('<link rel="stylesheet" href="styles.css">', "<style>\n" + rd("styles.css") + "\n</style>")
for js in ["assets/font-niddl.js", "data.js", "app.js"]:
    code = re.sub(r"assets/img/[\w-]+\.jpg", img_uri, rd(js))
    html = html.replace('<script src="%s"></script>' % js, "<script>\n" + code + "\n</script>")
html = re.sub(r'content="assets/img/[\w-]+\.jpg"', 'content=""', html)
open(os.path.join(here, "preview.html"), "w", encoding="utf-8").write(html)
print("preview.html", os.path.getsize(os.path.join(here, "preview.html")) // 1024, "KB")
