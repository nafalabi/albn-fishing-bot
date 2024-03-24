const IgnoredFishes = [
    // rough logs
    {
        '5': 60,
        '13': 12,
    }
]

const checkIsIgnored = (parameters) => {
    for (const fish of IgnoredFishes) {
        if (fish['13'] === parameters['13'] && fish['5'] === parameters['5']) {
            return true;
        }
    }
}

module.exports = {
    checkIsIgnored,
}