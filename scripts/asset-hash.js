const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const cache = new Map();

hexo.extend.helper.register('asset_hash', function(assetPath) {
	const normalizedPath = assetPath.replace(/^\//, '');
	const filePath = path.join(this.config.source_dir, normalizedPath);

	if (!cache.has(filePath)) {
		const hash = crypto
			.createHash('sha256')
			.update(fs.readFileSync(filePath))
			.digest('hex')
			.slice(0, 8);

		cache.set(filePath, hash);
	}

	return cache.get(filePath);
});
