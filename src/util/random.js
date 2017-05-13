exports.roll = (count, sides) => {
    let sum = 0;
    for(let i = 0; i < count; i++) sum += Math.floor(Math.random() * sides) + 1;
    return sum;
};
