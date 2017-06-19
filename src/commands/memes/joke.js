const request = require('axios');

exports.exec = async (command) => {
  try {
    const response = await request('https://icanhazdadjoke.com/', {
      headers: {
        Accept: 'application/json'
      }
    });

    return command.response.send(response.data.joke);
  } catch (error) {
    return command.response.error('No dad-jokes right now 😭');
  }
};
