const fs = require('fs');
const ethers = require('ethers');

// Read the file
const data = fs.readFileSync('token_disbursement.txt', 'utf-8');

// Split the file into lines
const lines = data.split('\n');

// Initialize an empty array for the amounts
let amounts = [];

// Iterate over each line
for (let line of lines) {
    // Skip empty lines
    if (line.trim() === '') continue;

    // Split the line into address and amount
    const [, amount] = line.split('\t');

    // Convert the amount to wei and add it to the array
    amounts.push(ethers.utils.parseUnits(amount.trim(), 18));
}

// Print the amounts to the console
console.log(amounts);
