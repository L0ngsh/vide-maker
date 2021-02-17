const robots = {
    text: require('./robots/text'),
    userInput: require('./robots/userInput'),
    state: require('./robots/state'),
    image: require('./robots/image'),
}

async function start() {    
    
    robots.userInput();
    await robots.text();
    await robots.image();

    // const content = robots.state.load();
    // console.dir(content, { depth: null });
}

start();