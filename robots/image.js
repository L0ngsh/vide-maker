const { google } = require('googleapis');
const imageDownloader = require('image-downloader');
const gm = require('gm').subClass({imageMagick: true});
const state = require('./state');
const googleCreds = require('../credentials/gogleSearch.json');
const { sentences } = require('sbd');

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

    async function convertAllImages(content) {
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            await convertImage(sentenceIndex);
        }
    }

    async function convertImage(sentenceIndex) {
        return new Promise((resolve, reject) => {
            const inputFile = `./content/${sentenceIndex}-original.png[0]`;
            const outputFile = `./content/${sentenceIndex}-converted.png`;
            const size = { width: 1920, height: 1080 };

            gm()
                .in(inputFile)
                .out('(')
                    .out('-clone')
                    .out('0')
                    .out('-background', 'white')
                    .out('-blur', '0x9')
                    .out('-resize', `${size.width}x${size.height}^`)
                .out(')')
                .out('(')
                    .out('-clone')
                    .out('0')
                    .out('-background', 'alpha')
                    .out('-resize', `${size.width}x${size.height}`)
                .out(')')
                .out('-delete', '0')
                .out('-gravity', 'center')
                .out('-compose', 'over')
                .out('-composite')
                .out('-extent', `${size.width}x${size.height}`)
                .write(outputFile, (error) => {
                    if (error) {
                        return reject(error);
                    }
                
                    console.log(`> Image converted: ${inputFile}`);
                    resolve();
                });
        });
    }

    async function createAllSentencesImages(content) {
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            await createSentenceImage(sentenceIndex, content.sentences[sentenceIndex].text);
        }
    }

    async function createSentenceImage(sentenceIndex, text) {
        
        return new Promise((resolve, reject) => {
            const outputFile = `./content/${sentenceIndex}-text.png`;

            const templateSettings = {
                0: {
                    size: '1920x400',
                    gravity: 'center'
                },
                1: {
                    size: '1920x1080',
                    gravity: 'center'
                },
                2: {
                    size: '800x1080',
                    gravity: 'west'
                },
                3: {
                    size: '1920x400',
                    gravity: 'center'
                },
                4: {
                    size: '1920x1080',
                    gravity: 'center'
                },
                5: {
                    size: '800x1080',
                    gravity: 'west'
                },
                6: {
                    size: '1920x400',
                    gravity: 'center'
                }
            }

            gm()
            .out('-size', templateSettings[sentenceIndex].size)
                .out('-gravity', templateSettings[sentenceIndex].gravity)
                .out('-background', 'transparent')
                .out('-fill', 'white')
                .out('-kerning', '1')
                .out('-pointsize', '60')
                .out(`caption:${text}`)
                .write(outputFile, (error) => {
                    if (error) {
                        return reject(error)
                    }
            
                    console.log(`> [video-robot] Sentence created: ${outputFile}`);
                    resolve();
                })
        });
    }

    async function createYouTubeThumbnail() {
        return new Promise((resolve, reject) => {
            gm()
                .in('./content/0-converted.png')
                .write('./content/thumbnail.jpg', (error) => {
                    if (error) {
                        return reject(error);
                    }

                    console.log(`> Creating Youtube thumbnail`);
                    resolve();
                });
        });
    }

}

module.exports = robot;