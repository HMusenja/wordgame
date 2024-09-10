import fs from 'fs';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import path from 'path';
import chalk from 'chalk'; // Import chalk for colorizing the output

// Convert __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load word-list from the package
const wordListPath = path.join(__dirname, 'node_modules', 'word-list', 'words.txt');
const wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n'); // Load the words into an array

// Utility function to check if a word is valid
function isValidWord(word) {
    return wordArray.includes(word.toLowerCase()); // Check if the word exists in the word list
}

const vowels = ['a', 'e', 'i', 'o', 'u'];
const consonants = 'bcdfghjklmnpqrstvwxyz'.split('');
let round = 1;
let userScore = 0;
let computerScore = 0;
const rounds = 5;

// Function to generate a set of random letters
function generateLetters() {
    let letters = [];
    let numberOfVowels = Math.floor(Math.random() * 4) + 3; // Generate 3-4 vowels

    // Add vowels
    for (let i = 0; i < numberOfVowels; i++) {
        letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }

    // Add consonants
    for (let i = numberOfVowels; i < 7; i++) {
        letters.push(consonants[Math.floor(Math.random() * consonants.length)]);
    }

    // Shuffle the letters randomly and return
    return letters.sort(() => Math.random() - 0.5);
}

// Function to play one round of the game
async function playRound() {
    let letters = generateLetters(); // Generate a new set of letters for this round
    console.log(chalk.blue.bold(`\nRound ${round}: Available letters -> ${letters.join(', ')}`));

    // Get the user's word
    let { userWord } = await inquirer.prompt({
        type: 'input',
        name: 'userWord',
        message: 'Use the letters to form a word:',
        validate: function (input) {
            if (!input || input.length < 2) {
                return 'Please enter a valid word with at least 2 letters.';
            }
            return true;
        }
    });

    // Check if the user's word is valid
    let userWordScore = 0;
    if (isValidWord(userWord)) {
        userWordScore = userWord.length;
        console.log(chalk.green.bold(`Your word: ${userWord} (Score: ${userWordScore})`));
    } else {
        console.log(chalk.red.bold(`${userWord} is not a valid English word. You score 0 points.`));
    }

    // Update user's score only if the word is valid
    userScore += userWordScore;

    // Now it's the computer's turn
    let computerWord = generateComputerWord(letters);
    let computerWordScore = computerWord.length;
    console.log(chalk.cyan.bold(`Computer's word: ${computerWord} (Score: ${computerWordScore})`));

    // Update computer's score
    computerScore += computerWordScore;

    console.log(chalk.yellow.bold(`Current Scores => You: ${userScore}, Computer: ${computerScore}`));
    round++;
}

// Function for the computer to generate a valid word
function generateComputerWord(letters) {
    // Simulate the computer forming a word from the available letters
    let randomWord = '';
    while (randomWord.length < 3 || !isValidWord(randomWord)) {
        // Try to form a word by randomly rearranging the letters
        randomWord = letters.sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * letters.length)) // Pick a random length of letters
            .join('');
    }
    return randomWord;
}

// Main game loop
async function playGame() {
    while (round <= rounds) {
        await playRound(); // Play one round of the game
    }

    // Display the final score after all rounds are complete
    console.log(chalk.yellow.bold(`\nFinal Scores => You: ${userScore}, Computer: ${computerScore}`));

    // Determine the winner
    if (userScore > computerScore) {
        console.log(chalk.green.bold('You win! 🎉'));
    } else if (computerScore > userScore) {
        console.log(chalk.red.bold('Computer wins! 🤖'));
    } else {
        console.log(chalk.blue.bold("It's a tie! 🤝"));
    }
}

// Start the game
playGame();

