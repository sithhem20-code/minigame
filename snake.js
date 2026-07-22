const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");

const difficulty = document.getElementById("difficulty");

const message = document.getElementById("message");



const gridSize = 20;
const tileCount = canvas.width / gridSize;



let snake;
let food;

let direction;
let nextDirection;

let gameLoop;

let speed;

let score = 0;

let highScore =
localStorage.getItem("snakeHighScore") || 0;


let running = false;
let paused = false;



highScoreText.textContent = highScore;

let startX = 0;
let startY = 0;

canvas.addEventListener("touchstart", function(e){
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", function(e){

    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let dx = endX - startX;
    let dy = endY - startY;

    if(Math.abs(dx) > Math.abs(dy)){

        if(dx > 30 && direction.x !== -1){
            nextDirection = {x:1,y:0};
        }
        else if(dx < -30 && direction.x !== 1){
            nextDirection = {x:-1,y:0};
        }

    }else{

        if(dy > 30 && direction.y !== -1){
            nextDirection = {x:0,y:1};
        }
        else if(dy < -30 && direction.y !== 1){
            nextDirection = {x:0,y:-1};
        }

    }

});

// Start / Restart Game

function startGame(){

    snake = [

        {
            x:10,
            y:10
        }

    ];


    direction={
        x:1,
        y:0
    };


    nextDirection=direction;


    score=0;

    scoreText.textContent=score;


    createFood();


    running=true;

    paused=false;


    pauseBtn.textContent="⏸ Pause";


    message.textContent="";


    setDifficulty();


    clearInterval(gameLoop);


    gameLoop=setInterval(update,speed);


    draw();

}



// Difficulty

function setDifficulty(){


    if(difficulty.value==="easy"){

        speed=150;

    }


    else if(difficulty.value==="medium"){

        speed=100;

    }


    else{

        speed=60;

    }

}



// Create Apple

function createFood(){


    food={

        x:Math.floor(Math.random()*tileCount),

        y:Math.floor(Math.random()*tileCount)

    };


    // prevent food spawning on snake

    snake.forEach(part=>{

        if(

            part.x===food.x &&

            part.y===food.y

        ){

            createFood();

        }

    });

}



// Game Update

function update(){


    if(!running || paused)
        return;



    direction=nextDirection;



    let head={

        x:snake[0].x + direction.x,

        y:snake[0].y + direction.y

    };



    // Wall collision

    if(

        head.x<0 ||

        head.y<0 ||

        head.x>=tileCount ||

        head.y>=tileCount

    ){

        gameOver();

        return;

    }



    // Snake collision

    for(let part of snake){

        if(

            head.x===part.x &&

            head.y===part.y

        ){

            gameOver();

            return;

        }

    }



    snake.unshift(head);



    // Eat food

    if(

        head.x===food.x &&

        head.y===food.y

    ){


        score++;


        scoreText.textContent=score;


        createFood();



        // Increase speed

        if(speed>40){

            speed-=3;

            clearInterval(gameLoop);

            gameLoop=setInterval(update,speed);

        }


    }

    else{

        snake.pop();

    }



    draw();

}




// Drawing

function draw(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    // Draw grid

    ctx.strokeStyle="#1f2937";


    for(let i=0;i<tileCount;i++){

        ctx.beginPath();

        ctx.moveTo(i*gridSize,0);

        ctx.lineTo(i*gridSize,canvas.height);

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(0,i*gridSize);

        ctx.lineTo(canvas.width,i*gridSize);

        ctx.stroke();

    }




    // Draw snake

    snake.forEach((part,index)=>{


        if(index===0){

            ctx.fillStyle="#16a34a";

        }

        else{

            ctx.fillStyle="#22c55e";

        }


        ctx.fillRect(

            part.x*gridSize,

            part.y*gridSize,

            gridSize-2,

            gridSize-2

        );


    });




    // Draw apple

    ctx.fillStyle="red";


    ctx.beginPath();


    ctx.arc(

        food.x*gridSize+10,

        food.y*gridSize+10,

        8,

        0,

        Math.PI*2

    );


    ctx.fill();

}



// Keyboard Controls

document.addEventListener(
"keydown",
function(e){


    if(e.key==="ArrowUp" && direction.y!==1){

        nextDirection={
            x:0,
            y:-1
        };

    }


    else if(e.key==="ArrowDown" && direction.y!==-1){

        nextDirection={
            x:0,
            y:1
        };

    }


    else if(e.key==="ArrowLeft" && direction.x!==1){

        nextDirection={
            x:-1,
            y:0
        };

    }


    else if(e.key==="ArrowRight" && direction.x!==-1){

        nextDirection={
            x:1,
            y:0
        };

    }


});




// Pause Button

pauseBtn.onclick=function(){


    if(!running)
        return;



    paused=!paused;



    if(paused){

        pauseBtn.textContent="▶ Resume";

        message.textContent="Game Paused";

    }

    else{

        pauseBtn.textContent="⏸ Pause";

        message.textContent="";

    }

};




// Difficulty change

difficulty.onchange=function(){

    setDifficulty();


    if(running){

        clearInterval(gameLoop);

        gameLoop=setInterval(update,speed);

    }

};




// Game Over

function gameOver(){


    running=false;


    clearInterval(gameLoop);


    message.textContent=
    "💀 Game Over! Score: "+score;



    if(score>highScore){


        highScore=score;


        localStorage.setItem(
            "snakeHighScore",
            highScore
        );


        highScoreText.textContent=
        highScore;


        message.textContent+=" 🏆 New Record!";

    }

}
// Keyboard Controls (Arrow Keys + WASD)

document.addEventListener("keydown", function(e){

    let key = e.key.toLowerCase();


    // W or Arrow Up
    if(
        (key === "w" || key === "arrowup") 
        && direction.y !== 1
    ){

        nextDirection = {
            x:0,
            y:-1
        };

    }


    // S or Arrow Down
    else if(
        (key === "s" || key === "arrowdown")
        && direction.y !== -1
    ){

        nextDirection = {
            x:0,
            y:1
        };

    }


    // A or Arrow Left
    else if(
        (key === "a" || key === "arrowleft")
        && direction.x !== 1
    ){

        nextDirection = {
            x:-1,
            y:0
        };

    }


    // D or Arrow Right
    else if(
        (key === "d" || key === "arrowright")
        && direction.x !== -1
    ){

        nextDirection = {
            x:1,
            y:0
        };

    }


});


// Restart

restartBtn.onclick=function(){

    startGame();

};



// Home Button

homeBtn.onclick=function(){

    window.location.href = "index.html";

};

// Start

startGame();
