const readline = require('readline-sync')

function robot(content) {
    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()

    function askAndReturnSearchTerm() {
        return readline.question('Type of Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Chose option:')
        const selectedPrefixText = prefixes[selectedPrefixIndex]

        return selectedPrefixText
    }
}

module.exports = robot