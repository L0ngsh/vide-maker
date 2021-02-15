const robots = {
    text: require('./robots/text'),
    userInput: require('./robots/userInput')
}

async function start() {
    const content = {}

    robots.userInput(content)

    console.log(content)
}

start()