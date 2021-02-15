const robots = {
    text: require('./robots/text'),
    userInput: require('./robots/userInput')
}

async function start() {
    const content = {
        maximumSentences: 7
    }

    robots.userInput(content)
    await robots.text(content)

    console.log(JSON.stringify(content, null, 4))
}

start()