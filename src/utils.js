const sleep = async (time) => {
    return new Promise((res) => {
        setTimeout(() => res(), time)
    })
}

function throttle(func, timeFrame) {
    var lastTime = 0;
    return function (...args) {
        var now = new Date();
        if (now - lastTime >= timeFrame) {
            func(...args);
            lastTime = now;
        }
    };
  }

module.exports = {
    sleep,
    throttle,
}