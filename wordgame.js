import fs from 'fs';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import path from 'path';

// Convert __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load word-list from the package
const wordListPath = path.join(__dirname, 'node_modules', 'word-list', 'words.txt');
const wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');

// Utility function to check if a word is valid
function isValidWord(word) {
    return wordArray.includes(word.toLowerCase());
}

const vowels = ['a', 'e', 'i', 'o', 'u'];
const consonants = 'bcdfghjklmnpqrstvwxyz'.split('');
let round = 1;
let userScore = 0;
let computerScore = 0;
const rounds = 5;

function generateLetters() {
    let letters = [];
    let numberOfVowels = Math.floor(Math.random() * 4) + 3; // 3-4 vowels

    // Prioritize vowels
    for (let i = 0; i < numberOfVowels; i++) {
        letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }

    // Add consonants
    for (let i = numberOfVowels; i < 7; i++) {
        letters.push(consonants[Math.floor(Math.random() * consonants.length)]);
    }

    return letters.sort(() => Math.random() - 0.5); // Shuffle the letters
}

async function playRound() {
    let letters = generateLetters();
    console.log(`Round ${round}: Available letters -> ${letters.join(', ')}`);

    // Get user word
    let { userWord } = await inquirer.prompt({
        type: 'input',
        name: 'userWord',
        message: 'Use the letters to form a word:',
        validate: function (input) {
            if (!input || input.length < 2) {
                return 'Please enter a valid word with at least 2 letters.';
            }
            if (!isValidWord(input)) {
                return 'Not a valid English word. Try again!';
            }
            return true;
        }
    });

    // Calculate user's score
    let userWordScore = userWord.length;
    console.log(`Your word: ${userWord} (Score: ${userWordScore})`);

    // Simulate computer's word
    let computerWord = generateComputerWord(letters);
    let computerWordScore = computerWord.length;
    console.log(`Computer's word: ${computerWord} (Score: ${computerWordScore})`);

    // Update scores
    userScore += userWordScore;
    computerScore += computerWordScore;

    console.log(`Current Scores => You: ${userScore}, Computer: ${computerScore}`);
    round++;
}

function generateComputerWord(letters) {
    // Simulate the computer forming a word from the available letters
    let randomWord = '';
    while (randomWord.length < 3 || !isValidWord(randomWord)) {
        randomWord = letters.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * letters.length)).join('');
    }
    return randomWord;
}

async function playGame() {
    while (round <= rounds) {
        await playRound();
    }

    console.log(`Final Scores => You: ${userScore}, Computer: ${computerScore}`);

    if (userScore > computerScore) {
        console.log('You win! 🎉');
    } else if (computerScore > userScore) {
        console.log('Computer wins! 🤖');
    } else {
        console.log("It's a tie! 🤝");
    }
}

// Start the game
playGame();
