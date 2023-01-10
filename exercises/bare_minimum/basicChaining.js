/*
 * Write a function WITH NO CALLBACKS that,
 * (1) reads a GitHub username from a `readFilePath`
 *     (the username will be the first line of the file)
 * (2) then, sends a request to the GitHub API for the user's profile
 * (3) then, writes the JSON response of the API to `writeFilePath`
 *
 * HINT: We exported some similar promise-returning functions in previous exercises
 */

var fs = require('fs');
var Promise = require('bluebird');
var request = require('needle');

Promise.promisifyAll(fs);

var fetchProfileAndWriteToFile = function (readFilePath, writeFilePath) {

  return new Promise((resolve, reject) => {
    fs.readFileAsync(readFilePath, 'utf8')

      .then((file) => {
        var url = 'https://api.github.com/users/' + file.split('\n')[0];
        var options = {
          headers: { 'User-Agent': 'request' }
        };

        return request('get', url, options);

      })
      .then((profile) => {
        console.log('profile: ', profile);
        return fs.writeFileAsync(writeFilePath, JSON.stringify(profile.body));
      })
      .then((writeBody) => {
        console.log('written profile body: ', writeBody);
        resolve(writeBody);
      })

  });
};

// Export these functions so we can test them
module.exports = {
  fetchProfileAndWriteToFile: fetchProfileAndWriteToFile
};
