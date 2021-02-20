const readline = require('readline-sync');
const fs = require('fs');
const path = require('path');

const state = require('./state');

function robot() {
    const content = {
        maximumSentences: 7
    }
    
    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();
    content.videoData = selectVideoTemplate();

    state.save(content);

    function askAndReturnSearchTerm() {
        return readline.question('Type of Wikipedia search term: ');
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of'];
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Chose option:');
        
        if (selectedPrefixIndex === -1) {
            console.log('> Bye...');
            process.exit(0);
        }

        const selectedPrefixText = prefixes[selectedPrefixIndex];

        return selectedPrefixText;
    }

    function selectVideoTemplate() {
        const templateList = fs.readdirSync(path.resolve(__dirname, '../template/scripts'));
        const selectTemplate = readline.keyInSelect(templateList, 'Chose video template:');
        
        if (selectTemplate === -1) {
            console.log('> Bye...');
            process.exit(0);
        }
        
        const selectedTemplate = templateList[selectTemplate];
        const musicLink = fs.readFileSync(`./template/${selectTemplate + 1}/music.link`, 'utf-8');

        const data = {
            template: selectedTemplate,
            musicLink
        }
        return data;
    }
}

module.exports = robot