import { getAPI } from 'modules/utils/Request';
import { isURL } from 'modules/utils/Validation';

async function getMetaData(url) {
	if (!isURL(url)) {
		return {url: '', title: '', image: '', description: ''};
	}

	// cannot get meta data from browser for CORS...
	return await getAPI(`/api/meta/${btoa(unescape(encodeURIComponent(url)))}`);
}

export { getMetaData }
