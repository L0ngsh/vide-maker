const { google } = require('googleapis');
const imageDownloader = require('image-downloader');
const state = require('./state');
const googleCreds = require('../credentials/gogleSearch.json');

const customSearch = google.customsearch('v1');

async function robot() {
    const content = state.load();

    await fetchImagesToAllSentences(content);
    await downloadAllImages(content);
    await convertAllImages(content);
    await createAllSentencesImages(content);
    await createYouTubeThumbnail();

    state.save(content);

    async function fetchImagesToAllSentences(content) {
        for (const sentence of content.sentences) {
            const query = `${content.searchTerm} ${sentence.keywords[0]}`;

            const response = await fetchImagesFromQuery(query);
        
            sentence.images = response;
            sentence.querySearch = query;
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
                    console.log(`> [${sentenceIndex}][${imageIndex}] Baixou imagem com sucesso: ${imageUrl}`);
                    break;
                } catch(error) {
                    console.log(`> [${sentenceIndex}][${imageIndex}] Falha ao baixar (${imageUrl}): ${error}`);
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