"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shuffle = shuffle;
exports.getWords = getWords;
exports.newUser = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fs = require("fs");

function shuffle(array) {
  var currentIndex = array.length,
      temporaryValue,
      randomIndex; // While there remain elements to shuffle...

  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1; // And swap it with the current element.

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getWords() {
  var text = fs.readFileSync(__dirname + '/WORDS.txt', "utf-8");
  var words = text.split("\n");
  var shuffledArray = shuffle(words);
  return shuffledArray.splice(0, 25);
}

var newUser = function newUser(userID) {
  var isHost = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return _defineProperty({}, userID, {
    team: null,
    role: null,
    host: isHost
  });
};

exports.newUser = newUser;