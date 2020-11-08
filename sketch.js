//variables for images and characters
var forest,
    idleR,
    idleL,
    runRight,
    runLeft,
    jumpR,
    jumpL,
    fallR,
    fallL,
    player,
    gImg,
    aMode = "idle",
    dir = "right",
    gMode = "yes",
    coinImg,
    coin,
    coins=0,
    enemyImg;

//loading images and animations
function preload() {
    forest = loadImage("images/background.jpg");
    gImg = loadImage("images/ground.png");

    idleR = loadAnimation("images/idle1.png",
                        "images/idle2.png",
                        "images/idle3.png",
                        "images/idle2.png",);

    idleL = loadAnimation("images/idle1_2.png",
                        "images/idle2_2.png",
                        "images/idle3_2.png",
                        "images/idle2_2.png",);

    runRight = loadAnimation("images/run1.png",
                        "images/run2.png",
                        "images/run3.png",
                        "images/run4.png",
                        "images/run5.png",
                        "images/run6.png",
                        "images/run7.png",
                        "images/run8.png",
                        "images/run9.png",
                        "images/run10.png");

    runLeft = loadAnimation("images/run1_2.png",
                        "images/run2_2.png",
                        "images/run3_2.png",
                        "images/run4_2.png",
                        "images/run5_2.png",
                        "images/run6_2.png",
                        "images/run7_2.png",
                        "images/run8_2.png",
                        "images/run9_2.png",
                        "images/run10_2.png");

    coinImg = loadImage("images/coin.png");

    enemyImg = loadImage("images/enemy.png");

    gameState = "play";

}

//seting canvas and characters and objects
function setup() {
    createCanvas(displayWidth, displayHeight);

    //background
    background1 = createSprite(displayWidth/2,displayHeight/2);
    background1.addImage(forest);
    background1.scale = 4;

    //player settings
    player = createSprite(displayWidth/2,displayHeight-300,40,80);
    player.addAnimation("runningR",runRight);
    player.addAnimation("runningL",runLeft);
    player.addAnimation("stillR",idleR);
    player.addAnimation("stillL",idleL);
    player.scale = 0.45;

    //grounds
    ground = createSprite(displayWidth/2-300,displayHeight-40,displayWidth,80);
    ground.addImage(gImg);
    ground.scale = 1.8;

    ground2 = createSprite(displayWidth-170,displayHeight-40,displayWidth,80);
    ground2.addImage(gImg);
    ground2.scale = 1.8;

    CoinGroup = createGroup();
    EnemyGroup = createGroup();
}

//drawing the sprites
function draw() {

if(gameState === "play") {
    //background
    background("white");

    //statements for animations
    if(aMode === "right") {
        player.changeAnimation("runningR",runRight);
    }else if(aMode === "left") {
        player.changeAnimation("runningL",runLeft);
    }else if(aMode === "idle") {
        if(dir === "right") {
            player.changeAnimation("stillR",idleR);
        }else if(dir === "left") {
            player.changeAnimation("stillL",idleL);
        }
    }

    //statements for side movement
    aMode = "idle"

    if(keyDown("RIGHT_ARROW") || touches.length>0) {
        player.velocityX = 9;
        aMode = "right";
        dir = "right";
        touches = [];
    }
    
    if(keyDown("LEFT_ARROW")) {
        player.velocityX = -9;
        aMode = "left";
        dir = "left";
    }

    //friction
    player.velocityX = player.velocityX*0.7;

    //gravity and collision
    if(player.isTouching(ground) || 
        player.isTouching(ground2)) {

        player.velocityY = 0;
        gMode = "yes";

    }else {
        player.velocityY = player.velocityY+0.8;
        gMode = "no";

    }

    //collision
    player.collide(ground);
    player.collide(ground2);

    //jump
    if(keyDown("UP_ARROW") && gMode === "yes") {
        player.velocityY = -20;
    }

    //coins
    if(frameCount%100 === 0) {
        var coin = createSprite(random(10,displayWidth-10),10);
        coin.addImage(coinImg);
        coin.scale = 0.4;
        coin.velocityY = coin.velocityY+5;
        coin.lifetime = 200;
        CoinGroup.add(coin);
    }

    //enemies
    if(frameCount%80 === 0) {
        var enemy = createSprite(random(10,displayWidth-10),10,20,20);
        enemy.addImage(enemyImg);
        enemy.scale = 0.2;
        enemy.velocityY = enemy.velocityY+5;
        enemy.lifetime = 400;
        EnemyGroup.add(enemy);
    }

    //coin collide
    CoinGroup.collide(ground);
    CoinGroup.collide(ground2);

    //enemy collide
    EnemyGroup.collide(ground);
    EnemyGroup.collide(ground2);

    //scrolling ground
    ground.velocityX = player.velocityX*-1;
    ground2.velocityX = player.velocityX*-1;
    CoinGroup.setVelocityXEach(player.velocityX*-1);
    EnemyGroup.setVelocityXEach(player.velocityX*-1);

    //scrolling background
    background1.velocityX = player.velocityX/8*-1;
    
    //reset
    player.x = displayWidth/2;

    //ground collider
    ground.setCollider("rectangle",0,10,480,35);
    ground2.setCollider("rectangle",0,10,480,35);

    //collecting coins
    if(CoinGroup.isTouching(player)) {
        for(var i=0; i<CoinGroup.length; i++) {
            CoinGroup.get(i).destroy();
            coins++;
        }
    }

    //getting hurt
    if(EnemyGroup.isTouching(player)) {
        for(var i=0; i<EnemyGroup.length; i++) {
            EnemyGroup.get(i).destroy();
            coins = coins-1;
        }
    }

    if(coins===10) {
        gameState = "win";
    }

    if(coins<0) {
        gameState = "lose";
    }

}else if(gameState === "win") {
    EnemyGroup.destroyEach();
    player.velocityY = 0;
    player.velocityX = 0;
    ground.velocityX = 0;
    ground2.velocityX = 0;
    background1.velocityX = 0;
    CoinGroup.setVelocityX = 0;
}else if(gameState === "lose") {
    EnemyGroup.destroyEach();
    player.velocityY = 0;
    player.velocityX = 0;
    ground.velocityX = 0;
    ground2.velocityX = 0;
    background1.velocityX = 0;
    CoinGroup.setVelocityX = 0;
}

    //checking errors
    console.log(gMode);

    //draw sprites
    drawSprites();

if(gameState === "play") {
    //collecting coins
    fill("white");
    textSize(30);
    text("coins : "+coins + "                   collect 10 coins to win",20,30);
}else if(gameState === "win") {
    fill("white");
    textSize(50);
    text("YOU HAVE WON",displayWidth/2,displayHeight/2);
}else if(gameState === "lose") {
    fill("white");
    textSize(50);
    text("YOU LOST",displayWidth/2,displayHeight/2);
}

}