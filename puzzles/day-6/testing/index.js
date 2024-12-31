import {degrees_to_radians, inputToPlayingField, readInput} from "./utils.js";

let input = readInput("./input.txt");
let playingField
function loadPlayingField() {
    playingField =  inputToPlayingField(input)
}
loadPlayingField()

function findGuard(field){
    for(let x = 0; x < field.length; ++x){

        for(let y = 0;y < field[0].length; ++y){

            if(playingField[x][y] == "^"){
                return {
                    x:x,
                    y:y
                }
            }

        }

    }
}

function getDirection(facing){

    return {
        x: -Math.round(Math.sin(degrees_to_radians(-facing))),
        y: -Math.round(Math.cos(degrees_to_radians(-facing)))
    }
}







function isInBounds(pos){

    return pos.x < 0 || pos.y < 0 || pos.x >= playingField.length || pos.y >= playingField[0].length;

}

function isObstacle(pos){
    return  playingField[pos.x][pos.y] == "#"
}




export function checkLoop() {
    let visited = new Map()

    let guard = findGuard(playingField)
    if(!guard){
        return false
    }
    guard.rotation = 0;
    while (true) {
        if (visited.has(JSON.stringify({
            x: guard.x,
            y: guard.y,
            rotation: guard.rotation
        }))) {
            return true;
            break
        }

        visited.set(JSON.stringify({
            x: guard.x,
            y: guard.y,
            rotation: guard.rotation
        }), true)


        let step = getDirection(guard.rotation)
        let newPos = {
            x: guard.x + step.x,
            y: guard.y + step.y
        }
        if (isInBounds(newPos)) {
            return false;
            break
        }
        if (isObstacle(newPos)) {
            guard.rotation += 90;
            guard.rotation %= 360;
        } else {
            guard.x = newPos.x
            guard.y = newPos.y


            //printPlayingField()


        }
    }
}

let counter = 0;
for(let x in playingField){
    for(let y in playingField[0]){

        let old = playingField[x][y]
            playingField[x][y] = "#"
            if(checkLoop()){
                counter++;
            }
            playingField[x][y] = old

        }



}

//checkLoop()
console.log("DONE: " + counter);


