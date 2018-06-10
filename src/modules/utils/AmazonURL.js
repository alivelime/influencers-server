
// for test URL.
const amazonURLs = [
  // 普通に検索(牛乳)
	'https://www.amazon.co.jp/%E3%82%BF%E3%82%AB%E3%83%8A%E3%82%B7-%E5%86%B7%E8%94%B5-%E4%BD%8E%E6%B8%A9%E6%AE%BA%E8%8F%8C%E7%89%9B%E4%B9%B3-1000ml/dp/B01LX02NWM/ref=sr_1_3?s=food-beverage&ie=UTF8&qid=1528615816&sr=1-3&ppw=fresh&keywords=%E7%89%9B%E4%B9%B3',
	// DaiGoのリンク
	'https://www.amazon.co.jp/gp/product/4794221789?ie=UTF8&camp=1207&creative=8411&creativeASIN=4794221789&linkCode=shr&tag=psy0c6-22&qid=1528450284&sr=8-1&keywords=%E3%83%9E%E3%82%A4%E3%83%B3%E3%83%89%E3%82%BB%E3%83%83%E3%83%88',
	// アマゾンアソシエイトで生成したリンク
	'https://www.amazon.co.jp/gp/product/B00IOESPP6/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B00IOESPP6&linkCode=as2&tag=cal92re-22&linkId=2c00dc3e28185f5769bb687ca7461474',
  // プライムビデオ
	'https://www.amazon.co.jp/gp/product/B01002GDNU/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B01002GDNU&linkCode=as2&tag=cal92re-22&linkId=2c7f82f405969b411f6db4b52252e04d',
	// Amazoletで生成したリンク
	'https://www.amazon.co.jp/exec/obidos/ASIN/4794221789/cal92re-22/ref=nosim/',
	// シンプルなURL
	'https://www.amazon.co.jp/dp/4794221789',
];

// /半角英数10桁[/?] であればアマゾンのリンクだよね?
const pattern = /^https:\/\/www\.amazon\.co\.jp\/.*\/([0-9a-zA-Z]{10})([/?][\s\S]*)?$/;
function isAmazonJP(url) {
	return (pattern.test(url));
}

function makeAmazonJPSimple(url) {
	return url.replace(pattern, 'https://www.amazon.co.jp/dp/$1');
}

function makeAmazonJPAffili(url) {
	return url;
}


export { isAmazonJP, makeAmazonJPSimple, makeAmazonJPAffili , amazonURLs}
