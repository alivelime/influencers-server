import datetime

from gcloud import datastore
import xml.etree.ElementTree as ET

host = 'https://influs.link'
userId = 5752754626625536
userPath = host + '/users/' + str(userId)
urls = [
    host,
    host + '/vision',
    userPath,
]



cli = datastore.Client("asagakita-170822")
query = cli.query(kind='RecommendBranch')
query.add_filter('UserID', '=', 5752754626625536)

for b in list(query.fetch()) :
    url = userPath + '/recommend-branches/' + str(b.key.id)
    print(url)
    urls.append(url)

urlset = ET.Element('urlset')
urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
tree = ET.ElementTree(element=urlset)

for url in urls:
    url_element = ET.SubElement(urlset, 'url')
    loc = ET.SubElement(url_element, 'loc')
    loc.text = url
    lastmod = ET.SubElement(url_element, 'lastmod')
    lastmod.text = datetime.datetime.today().strftime("%Y-%m-%d")

tree.write('public/sitemap.xml', encoding='utf-8', xml_declaration=True)
