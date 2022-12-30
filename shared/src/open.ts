import * as fs from 'fs';
import fetch from 'node-fetch';
import open from 'open';
import * as path from 'path';

const maxRetries = 25;
let retry = 0;
const openUrl = async () => {
	retry++;
	if (retry >= maxRetries) {
		console.error(
			'Unable to open the web browser to your desired URL. Please make sure the server and client apps are running correctly.'
		);
		return;
	}

	let url: string = '';
	try {
		const filePath = path.join(__dirname, 'config.json');
		if (!fs.existsSync(filePath)) {
			setTimeout(openUrl, 500);
			return;
		}

		const json = fs.readFileSync(filePath).toString('utf-8');
		url = JSON.parse(json).clientUrl;
	} catch (err) {
		setTimeout(openUrl, 500);
		return;
	}

	try {
		const res = await fetch(url, {
			timeout: 500,
		});

		if (res.status !== 200) {
			setTimeout(openUrl, 500);
		} else {
			open(`${url}/dm/welcome`);
		}
	} catch (err) {
		setTimeout(openUrl, 500);
	}
};

(async () => {
	await openUrl();
})();
