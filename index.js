const robots = {
    text: require('./robots/text'),
    userInput: require('./robots/userInput'),
    state: require('./robots/state')
}

async function start() {    
    
    robots.userInput()
    await robots.text()

    const content = robots.state.load();
    console.dir(content, { depth: null })

}

start()