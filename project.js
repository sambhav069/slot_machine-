const prompt = require("prompt-sync")();

// GLOBAL VALUES 
const ROWS = 3;
const COL = 3;

// map , that contains number of symbols that our slot machine can have 
const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

// values means , if i get the lines of any of the symbol the bet is multiplied by that value 
const SYMBOL_VALUES = {
    "A": 8,
    "B": 6,
    "C": 4,
    "D": 2
};

const deposit = () =>{
// {put in while loop for again enter 
while(true){
    //takes string value
    const deposit_amount = prompt("enter the money you want to deposit: ");

    // to convert string to its floating point value 
    // "17.2" -> 17.2
    // if they write like "hello" -> NaN (not a number) , ask to try again 
    const number_deposit_amount = parseFloat(deposit_amount);

    // condition 
    // nan check function 
    if(isNaN(number_deposit_amount) || number_deposit_amount<= 0){
        console.log("invalid input ... try again");
    }
    else{
        // if deposit is valid 
        return number_deposit_amount;
    }
}
};

// input for number of lines on bet 
const no_of_lines = () =>{
    // put in while loop for again enter 
    while(true){
        //takes string value
        const lines = prompt("enter the lines , you want to bet on between (1-3): ");
    
        // to convert string to its floating point value 
        // "17.2" -> 17.2
        // if they write like "hello" -> NaN (not a number) , ask to try again 
        const number_lines= parseFloat(lines);
    
        // condition 
        // nan check function 
        if(isNaN(number_lines) || number_lines<= 0 || number_lines>3){
            console.log("invalid input lines ... try again");
        }
        else{
            // if deposit is valid 
            return number_lines;
        }
    }
};

// balance is a parameter so that the max bet that can be placed is based upon the current balance 
const get_bet = (balance,lines_given) => 
{
    while(true){
        // it takes the bet per line
        const bet_line = prompt("enter the bet that you want per line :");

        // conversion 
        const bet_amount = parseFloat(bet_line); 

        // now cal the total bet that is placed on the lines 
        const total_bet_placed_on_lines = bet_amount*lines_given;

        // condition
        if(total_bet_placed_on_lines > balance || total_bet_placed_on_lines <=0){
            console.log("sorry , you dont have enough balance to place bet on",lines_given,"with the current balance in your account ");
        }
        else{
            return bet_amount;
        }
    }
}

// now we need to spin the slot machine 
const spin = () => {
    // make an array 
    const total_symbols = [];

    // use for loop to push the element in array , means symbols and counts are fetched for symbol count map from above 
    for (const [Symbol,count] of Object.entries(SYMBOLS_COUNT))
    {   
        // based on count push the symbol into the array 
        for(let i =0 ; i<count ; i++){
            total_symbols.push(Symbol);
        }
    }

    // nested array , represents the slot machine where every array inside represents the column
    const slots = [ [], [], [] ];

    // nested for loop to access nested array to fill columns first 
    for (let i=0 ;i<COL;i++){

        // this copies the symbols available in the upper total slot into this new array, because if we selected 2 of them we need to choose another symbol, but for another slot we need to select from all the symbols from start with full number 
        const slots_reels = [...total_symbols]; // dots are imp for shallow copy 

        // in every slot after selecting we will remove the particular symbol from the array 
        for(let j = 0 ; j<ROWS ; j ++){

            // math.random will generate a random no between 0,1 and its multiplied by our slot reels , hence it can generate the max of our array index   
            const random_index = Math.floor(Math.random()*slots_reels.length);

            // here we will choose a random symbol via index , remove it from the array of slot_reels , put in the slot nested array 
            const selectedSymbol = slots_reels[random_index];

            slots[i].push(selectedSymbol);

            slots_reels.splice(random_index,1);

        }
    }
    return slots;
};

// now our slots are in column but to check winning , we need to check rows , for that we are transposing the coulumns of the slot_reels
const transpose = (slots)=>
{
    const rows = [];

    // we will collect all the element from diff col present in the row and push it in rows array
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);//push array in array makes it nested 

        for (let j = 0; j < COL; j++) {
            // accessing rows array and pushing symbol of col in row of slots 
            rows[i].push(slots[j][i]);
        }
    }
    
    return rows;
};

// print slot machine 
const printSlotMachine = (rows) =>
{
    for (const row of rows) {
        // making new row string for printing 
        let rowString = "";
        for (const [i, symbol] of row.entries()) { //accessing the row entries
            // concatinate the string with symbols 
            rowString += symbol;
            if (i != row.length - 1) {
                // now i dont want to add the pipe operator to the last symbol
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        if (symbols.every(symbol => symbol === symbols[0])) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};

const game = () => {
    let balance = deposit();
    while (true) {
        console.log("You have a balance of $" + balance);
        const numberOfLines = no_of_lines();
        const bet = get_bet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printSlotMachine(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings);
        if (balance <= 0) {
            console.log("You ran out of money!");
            break;
        }
        const playAgain = prompt("Do you want to play again (y/n)? ");
        if (playAgain.toLowerCase() !== "y") break;
    }
};

game();