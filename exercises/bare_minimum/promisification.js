/**
 * Create the promise returning `Async` suffixed versions of the functions below,
 * Promisify them if you can, otherwise roll your own promise returning function
 */

var fs = require('fs');
var request = require('needle');
var crypto = require('crypto');
var Promise = require('bluebird');

// (1) Asyncronous HTTP request
var getGitHubProfile = function (user, callback) {
  var url = 'https://api.github.com/users/' + user;
  var options = {
    headers: { 'User-Agent': 'request' },
  };

  request.get(url, options, function (err, res, body) {
    if (err) {
      callback(err, null);
    } else if (body.message) {
      callback(
        new Error('Failed to get GitHub profile: ' + body.message),
        null
      );
    } else {
      callback(null, body);
    }
  });
};
// TODO

var getGitHubProfileAsync = (user) => {
  return new Promise((resolve, reject) => {
    getGitHubProfile(user, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  });
};

// (2) Asyncronous token generation
var generateRandomToken = function (callback) {
  crypto.randomBytes(20, function (err, buffer) {
    if (err) { return callback(err, null); }
    callback(null, buffer.toString('hex'));
  });
};

var generateRandomTokenAsync = () => {
  return new Promise((resolve, reject) => {
    generateRandomToken((err, buffer) => {
      if (err) { reject(err) }
      else { resolve(buffer) }
    })
  });
}


// (3) Asyncronous file manipulation
var readFileAndMakeItFunny = function (filePath, callback) {
  fs.readFile(filePath, 'utf8', function (err, file) {
    if (err) { return callback(err); }

    var funnyFile = file.split('\n')
      .map(function (line) {
        return line + ' lol';
      })
      .join('\n');

    callback(funnyFile);
  });
};

var readFileAndMakeItFunnyAsync = (filePath) => {
  //console.log('promise Path: ',  filePath);
  return new Promise((resolve, reject) => {
    readFileAndMakeItFunny(filePath, (file) => {

      if (file instanceof Error) { reject(file) }
      else {resolve(file)}
    })
  });
};

// Export these functions so we can test them and reuse them in later exercises
module.exports = {
  getGitHubProfileAsync: getGitHubProfileAsync,
  generateRandomTokenAsync: generateRandomTokenAsync,
  readFileAndMakeItFunnyAsync: readFileAndMakeItFunnyAsync
};
