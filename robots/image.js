const { google } = require('googleapis');
const state = require('./state');
const googleCreds = require('../credentials/gogleSearch.json');

const customSearch = google.customsearch('v1');

async function robot() {
    const content = state.load();
    await fetchImagesToAllSentences(content);

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

}

module.exports = robot;