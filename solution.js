/*
Author: Erica Pereira
Date: October 20, 2021
Problem link: https://gist.github.com/alirussell/2d200d21f117f8d570667daa7acdbae5#https://gist.github.com/alirussell/2d200d21f117f8d570667daa7acdbae5
*/

//returns a boolean, whether the new x or y would be in bounds
function checkBounds(x, y, maxX, maxY, direction) {
    switch (direction) {
        case 'N':
            return y + 1 < maxY;
        case 'S':
            return y - 1 >= 0;
        case 'W':
            return x - 1 >= 0;
        case 'E':
            return x + 1 < maxX;
    }
}

// returns the index of the dirty patch to clean or -1 if not found
function checkIfCleaned(x, y, dirtyPatches) {
    var index = 0;
    //check that there are dirty patches
    if (dirtyPatches.length != 0) {
        //get first dirty patch
        var currentPatch = dirtyPatches[index];
        while (index < dirtyPatches.length) {
            //if x and y match currentPatch and it has not been cleaned, return the index
            if (currentPatch[0] == x && currentPatch[1] == y && currentPatch[2] == 0) {
                return index;
            }
            index++;
            currentPatch = dirtyPatches[index]
        }
    }
    return -1;
}


//runs the roomba and prints out last roomba position as well as number of dirty pacthes cleaned
function runHelper(instructions, position, roomDimension, dirtyPatches) {
    var cleanedSpots = 0;

    //check if initial position is dirty and can be cleaned
    var indexOfDirtyPatchCleaned = checkIfCleaned(position[0], position[1], dirtyPatches);
    // if returned index is valid, change the dirty patch to cleaned and increment var cleaned spots
    if (indexOfDirtyPatchCleaned >= 0) {
        dirtyPatches[indexOfDirtyPatchCleaned][2] = 1;
        cleanedSpots++;
    }


    //go through the instructions to clean
    for (let i = 0; i < instructions.length; i++) {
        //switch on instruction char
        switch (instructions.charAt(i)) {
            case 'N':
                //check if valid direction to go to, if so then move
                if (checkBounds(position[0], position[1], roomDimension[0], roomDimension[1], 'N')) {
                    position[1] = position[1] + 1;
                    var indexOfDirtyPatchCleaned = checkIfCleaned(position[0], position[1], dirtyPatches);
                    // if returned index is valid, change the dirty patch to cleaned and increment var cleaned spots
                    if (indexOfDirtyPatchCleaned >= 0) {
                        dirtyPatches[indexOfDirtyPatchCleaned][2] = 1;
                        cleanedSpots++;
                    }
                }
                break;
            case 'S':
                //check if valid direction to go to, if so then move
                if (checkBounds(position[0], position[1], roomDimension[0], roomDimension[1], 'S')) {
                    position[1] = position[1] - 1;
                    var indexOfDirtyPatchCleaned = checkIfCleaned(position[0], position[1], dirtyPatches);
                    // if returned index is valid, change the dirty patch to cleaned and increment var cleaned spots
                    if (indexOfDirtyPatchCleaned >= 0) {
                        dirtyPatches[indexOfDirtyPatchCleaned][2] = 1;
                        cleanedSpots++;
                    }
                }
                break;
            case 'W':
                //check if valid direction to go to, if so then move
                if (checkBounds(position[0], position[1], roomDimension[0], roomDimension[1], 'W')) {
                    position[0] = position[0] - 1;
                    var indexOfDirtyPatchCleaned = checkIfCleaned(position[0], position[1], dirtyPatches);
                    // if returned index is valid, change the dirty patch to cleaned and increment var cleaned spots
                    if (indexOfDirtyPatchCleaned >= 0) {
                        dirtyPatches[indexOfDirtyPatchCleaned][2] = 1;
                        cleanedSpots++;
                    }
                }
                break;
            case 'E':
                //check if valid direction to go to, if so then move
                if (checkBounds(position[0], position[1], roomDimension[0], roomDimension[1], 'E')) {
                    position[0] = position[0] + 1;
                    var indexOfDirtyPatchCleaned = checkIfCleaned(position[0], position[1], dirtyPatches);
                    // if returned index is valid, change the dirty patch to cleaned and increment var cleaned spots
                    if (indexOfDirtyPatchCleaned >= 0) {
                        dirtyPatches[indexOfDirtyPatchCleaned][2] = 1;
                        cleanedSpots++;
                    }
                }
                break;
            default:
                console.log('Non-valid char found in input file.');
                break;
        }
    }
    console.log(position[0], position[1])
    console.log(cleanedSpots);
}

function runRoomba(textFile) {
    var fs = require('fs');
    try {
        // read contents of the file
        const data = fs.readFileSync(textFile, 'UTF-8');

        // split the contents by new line
        const lines = data.split(/\r?\n/);

        //gets first line which will hold room dimmension
        const roomDimension = lines[0].split(' ').map(Number);
        //get second line which will hold starting position
        let position = lines[1].split(' ').map(Number);

        //current index is now the 3rd line
        var currentIndex = 2;
        var instructions = '';

        if (lines.length > 2) { // MAY NOT BE needed if we know the min number of lines is 3
            //get line at index 2 and check if it has alphabetical chars
            var currentLine = lines[currentIndex];
            var hasLetters = /^[a-zA-Z]+$/.test(currentLine);

            //if it does not have alph. chars, go through the remainder lines until you hit lines 
            //   with alph. chars
            while (!hasLetters && currentIndex + 1 < lines.length) {
                currentIndex++;
                currentLine = lines[currentIndex];
                hasLetters = /^[a-zA-Z]+$/.test(currentLine);
            }
            //slice the file lines by using 2 and the last index to not include - that doesnt have numbers
            var dirtyPatches = lines.slice(2, currentIndex);
            //append a 0 which will be used as a flag when spot is cleaned
            dirtyPatches = dirtyPatches.map(patch => patch + ' 0');
            //convert dirty patches into array of numbers
            dirtyPatches = dirtyPatches.map(patch => patch.split(' ').map(Number));

            //get the remainding lines that will be the lines with instructions
            while (currentIndex < lines.length) {
                instructions += lines[currentIndex];
                currentIndex++;
            }

            runHelper(instructions, position, roomDimension, dirtyPatches);

        }

    } catch (err) {
        console.log('Error trying to open file.');
        console.error(err);
    }
}

runRoomba("input.txt");

//cleans room with only one cell (it's a 1 x 1)
//runRoomba("one-by-one-room.txt");
//goes through instructions with no dirty patches to clean
//runRoomba("no-dirty-patches.txt");
//cleans room with the initial/start position being a dirty patch
//runRoomba("first-position-to-clean.txt");


/** NOTES **
 * no need to handle empty file, it will always have at least 3 lines (confirmed w York)
 * handle no patches of dirt
 * handle when the initial position is dirty
 * handle multiple lines of instructions
 * handle non valid instructions
 * handle out of bounds directions
 * handle only counting dirty pactch cleaned once
 * handle room that is 1x1
 * option 1: go through instructions, have one pair of coord. be the one that moves
 *           check if a valid move (not out of bounds)
 *           check if dirty patch exists at those coordinates
 *           need to add a flag on dirty patches to make sure they are not counted twice
 *           have a counter for spots cleaned
 * option 2: create a 2d array with room dimmensions
 *           have to mess around with coordinate positions as top left index would be [0][0]
 *           after room is created, add a flag/boolean to the cells in the room that are dirty patches
 *           go through instrcuctions, check the bounds of new position
 *           check if there is patch to clean by accessing element directyly, if so then change the flag
 *           have a counter for spots cleaned
 *
 * Option 2 has more work in the begining but then it is easier to access dirty patches, unlike option 1
 * where a loop is needed to go through all dirty patches. Option 1 however will be easier to test as I can visualize
 * the room and its current location. The 2d array in option 2 would need an equation to make sure the indexes are matched up
 * and accessed correctly. Would be harder to test.
 *
 */
