const algorithmia = require('algorithmia')
const sbd = require('sbd')

const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey

async function robot(content) {
    await fetchContentFromWikipedia(content)
    sanitializeContent(content)
    breakContentntoSentences(content)

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
}

module.exports = robot