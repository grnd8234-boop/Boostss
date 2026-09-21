
const fs = require('fs');
const path = require('path');

function loadTokens(filePath = './tokens.txt') {
    try {
        const absolutePath = path.resolve(filePath);
        if (!fs.existsSync(absolutePath)) {
            fs.writeFileSync(absolutePath, '', 'utf8');
            return [];
        }

        const data = fs.readFileSync(absolutePath, 'utf8');
        return data
            .split(/\r?\n/)
            .map(t => t.trim())
            .filter(t => t.length > 20);
    } catch (err) {
        return [];
    }
}

module.exports = loadTokens;
