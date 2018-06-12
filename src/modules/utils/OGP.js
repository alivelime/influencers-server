import { isURL } from 'modules/utils/Validation';

function getOGPData(url) {
	if (!isURL(url)) {
		return {title: '', image: '', description: ''};
	}

	// cannot get meta data from browser for CORS...
	
	// getAPI(`/api/recommends/${url}/ogp`);
	let title, image, description;
	title = '雇用、利子および貨幣の一般理論〈上〉 (岩波文庫) 文庫 – 2008/1/16 ';
	image = 'https://images-na.ssl-images-amazon.com/images/I/4119rQIrqML._SX351_BO1,204,203,200_.jpg';
	description = 'Amazonでケインズ, 間宮 陽介の雇用、利子および貨幣の一般理論〈上〉 (岩波文庫)。アマゾンならポイント還元本が多数。ケインズ, 間宮 陽介作品ほか、お急ぎ便対象商品は当日お届けも可能。また雇用、利子および貨幣の一般理論〈上〉 (岩波文庫)もアマゾン配送商品なら通常配送無料。';
	return {title: title, image: image, description: description };
}

export { getOGPData }
