const robots = {
    text: require('./robots/text'),
    userInput: require('./robots/userInput'),
    state: require('./robots/state'),
    image: require('./robots/image'),
    video: require('./robots/video'),
    youtube: require('./robots/youtube')
}

async function start() {       
    robots.userInput();
    await robots.text();
    await robots.image();
    await robots.video();
    await robots.youtube();
}

start();