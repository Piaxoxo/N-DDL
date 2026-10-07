"""Packt die Website in eine einzige HTML-Datei (preview.html) – zum Verschicken/Ansehen ohne Server."""
import base64, json, os
here = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(here, p), encoding="utf-8").read()
html = rd("index.html")
assets = {}
for f in sorted(os.listdir(os.path.join(here, "assets/img"))):
    if f.endswith(".jpg"):
        uri = "data:image/jpeg;base64," + base64.b64encode(open(os.path.join(here, "assets/img", f), "rb").read()).decode()
        assets["assets/img/" + f] = uri
        assets["assets/img/full/" + f] = uri  # Vorschau: Lightbox nutzt die kleinere Version
for f in sorted(os.listdir(os.path.join(here, "assets/audio"))):
    if f.endswith(".mp3"):
        assets["assets/audio/" + f] = "data:audio/mpeg;base64," + base64.b64encode(open(os.path.join(here, "assets/audio", f), "rb").read()).decode()
html = html.replace('<link rel="stylesheet" href="styles.css">', "<style>\n" + rd("styles.css") + "\n</style>")
html = html.replace('<script src="assets/font-niddl.js"></script>', "<script>window.NIDDL_ASSETS=" + json.dumps(assets) + ";</script>\n<script>\n" + rd("assets/font-niddl.js") + "\n</script>")
for js in ["vendor/three.min.js", "vendor/three-post.js", "data.js", "i18n.js", "soundtrack.js", "app.js"]:
    html = html.replace('<script src="%s"></script>' % js, "<script>\n" + rd(js) + "\n</script>")
for f in ["tanzen-lila", "buehne-blau", "ballkleid", "lachen-blau"]:
    html = html.replace('src="assets/img/full/%s.jpg"' % f, 'src="' + assets["assets/img/%s.jpg" % f] + '"')
html = html.replace('content="assets/img/pinker-anzug.jpg"', 'content=""')
open(os.path.join(here, "preview.html"), "w", encoding="utf-8").write(html)
print("preview.html", os.path.getsize(os.path.join(here, "preview.html")) // 1024, "KB")
