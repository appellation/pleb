exports.roll = (count, sides) => {
    let sum = 0;
    for (let i = 0; i < count; i++) sum += exports.number(sides);
    return sum;
};

exports.number = max => {
    return Math.floor(Math.random() * max) + 1;
};

exports.element = array => {
    return array[Math.floor(Math.random() * array.length)];
};
