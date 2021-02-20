const { google } = require('googleapis');
const imageDownloader = require('image-downloader');
const state = require('./state');
const googleCreds = require('../credentials/googleSearch.json');

const customSearch = google.customsearch('v1');

async function robot() {
    console.log(`> [Image Robot] Starting...`);
    const content = state.load();

    await fetchImagesToAllSentences(content);
    await downloadAllImages(content);

    state.save(content);
    console.log(`> [Image Robot] Closed.`);

    async function fetchImagesToAllSentences(content) {
        for (let sentence = 0; sentence < content.sentences.length; sentence++) {
            const query = `${content.searchTerm}${(sentence > 0)?' '+content.sentences[sentence].keywords[0]:''}`;

            console.log(`> [Image Robot] Querying Google Images with: "${query}"`);
            const response = await fetchImagesFromQuery(query);
        
            content.sentences[sentence].images = response;
            content.sentences[sentence].querySearch = query;
        }
    }

    async function fetchImagesFromQuery(query) {
        const response = await customSearch.cse.list({
            auth: googleCreds.apiKey,
            cx: googleCreds.searchEngineId,
            q: query,
            searchType: 'image',
            num: 2, 
        });
    
        const links = response.data.items.map((item) => {
            return item.link;
        });

        return links;
    }

    async function downloadAllImages(content) {
        content.downloadedImages = [];

        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex ++) {
            const images = content.sentences[sentenceIndex].images;

            for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
                const imageUrl = images[imageIndex];
            
                try {
                    if (content.downloadedImages.includes(imageUrl)) {
                        throw new Error('Image already downloaded');
                    }

                    await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`);
                    content.downloadedImages.push(imageUrl);
                    console.log(`> [Image Robot] [${sentenceIndex}][${imageIndex}] Image Successfully downlaoded: ${imageUrl}`);
                    break;
                } catch(error) {
                    console.log(`> [Image Robot] [${sentenceIndex}][${imageIndex}] Error (${imageUrl}): ${error}`);
                }
            }
        }
    }

    async function downloadAndSave(url, filename) {
        return imageDownloader.image({
            url,
            dest: `./content/${filename}`
        });
    }

}

module.exports = robot;