import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Character mapping data based on characters.js
const characters = [
    { id: 'luffy', name: 'Monkey D. Luffy' },
    { id: 'zoro', name: 'Roronoa Zoro' },
    { id: 'nami', name: 'Nami' },
    { id: 'usopp', name: 'Usopp' },
    { id: 'sanji', name: 'Vinsmoke Sanji' },
    { id: 'chopper', name: 'Tony Tony Chopper' },
    { id: 'robin', name: 'Nico Robin' },
    { id: 'franky', name: 'Franky' },
    { id: 'brook', name: 'Brook' },
    { id: 'jinbe', name: 'Jinbe' },
    { id: 'dragon', name: 'Monkey D. Dragon' },
    { id: 'sabo', name: 'Sabo' },
    { id: 'ivankov', name: 'Emporio Ivankov' },
    { id: 'akainu', name: 'Sakazuki' },
    { id: 'kizaru', name: 'Borsalino' },
    { id: 'garp', name: 'Monkey D. Garp' },
    { id: 'fujitora', name: 'Issho' },
    { id: 'smoker', name: 'Smoker' }
];

const IMAGES_DIR = path.join(__dirname, '../public/images');

if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
};

const fetchCharacterImage = async (char) => {
    try {
        console.log(`Searching for ${char.name}...`);
        // Jikan API search
        const searchUrl = `https://api.jikan.moe/v4/characters?q=${encodeURIComponent(char.name)}&limit=1`;

        const response = await new Promise((resolve, reject) => {
            https.get(searchUrl, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
                res.on('error', reject);
            });
        });

        if (response.data && response.data.length > 0) {
            const imageUrl = response.data[0].images.jpg.image_url;
            console.log(`Found image for ${char.name}: ${imageUrl}`);
            await downloadImage(imageUrl, path.join(IMAGES_DIR, `${char.id}.jpg`));
            console.log(`Downloaded ${char.id}.jpg`);
        } else {
            console.log(`No data found for ${char.name}`);
        }
    } catch (error) {
        console.error(`Error fetching ${char.name}:`, error.message);
    }
};

const main = async () => {
    for (const char of characters) {
        await fetchCharacterImage(char);
        // Rate limiting for Jikan API (3 requests per second is safe, let's wait 1s to be polite)
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('Done!');
};

main();
