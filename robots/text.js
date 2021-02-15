const algorithmia = require('algorithmia')
const sbd = require('sbd')
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const watsonApiKey = require('../credentials/watson-nlu.json').apikey
const watsonUrl = require('../credentials/watson-nlu.json').url

const nlu = new NaturalLanguageUnderstandingV1({
    authenticator: new IamAuthenticator({ apikey: watsonApiKey }),
    version: '2018-04-05',
    serviceUrl: watsonUrl
})

async function robot(content) {
    await fetchContentFromWikipedia(content)
    sanitializeContent(content)
    breakContentntoSentences(content)
    limitmaximumSentences(content)
    await fetchKeywordsOfAllSentences(content)

    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuthenticated = algorithmia.client(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const strSanitized = content.searchTerm.replace(/\s+/g, '')
        const wikipediaResponse = await wikipediaAlgorithm.pipe(strSanitized)
        const wikipediaContent = wikipediaResponse.get()
    
        content.sourceContentOriginal = wikipediaContent.content
    }

    function sanitializeContent(content) {
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDateInParentheses(withoutBlankLinesAndMarkdown)

        function removeBlankLinesAndMarkdown(text) {
            const allLines = text.split('\n')
        
            const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
                if (line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false
                }
                return true
            })
            
            return withoutBlankLinesAndMarkdown.join(' ')
        }
    
        function removeDateInParentheses(text) {
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
        }

        content.sourceContentSanitized = withoutDatesInParentheses
    }

    function breakContentntoSentences(content) {
        content.sentences = []

        const sentences = sbd.sentences(content.sourceContentSanitized)
    
        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }

    function limitmaximumSentences(content) {
        content.sentences = content.sentences.slice(0, content.maximumSentences)
    }

    async function fetchKeywordsOfAllSentences(content) {
        for (const sentence of content.sentences) {
            sentence.keyword = await fetchWatsonAndReturnKeywords(sentence.text)
        }
    }

    async function fetchWatsonAndReturnKeywords(sentence) {
        const response = await nlu.analyze(
            {
              text: sentence,
              features: {
                keywords: {}
              }
            })
    
        const keywords = response.result.keywords.map((keyword) => {
            return keyword.text
        })
    
        return keywords
    }
}

module.exports = robot