var trex ,trex_running;
var ground;
var groundImg;
var cloudImg;
var score = 0
var gameState = "start"
var obstaclesGroup;
var cloudsGroups;
var gameOver, gameOverImg;
var restart, restartImg;
var trex_start;
var trex_collide;
var jumpSound,checkpointSound,dieSound;
var highscore = 0


function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImg = loadImage("ground2.png");
  // 1.- Precargar la imagen de la nube
  cloudImg = loadImage("cloud.png");
  trex_start = loadAnimation("trex1.png");
  trex_collide = loadAnimation("trex_collided.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkpointSound = loadSound("checkpoint.mp3")

  obstacle1Img = loadImage("obstacle1.png");
  obstacle2Img = loadImage("obstacle2.png");
  obstacle3Img = loadImage("obstacle3.png");
  obstacle4Img = loadImage("obstacle4.png");
  obstacle5Img = loadImage("obstacle5.png");
  obstacle6Img = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
}

function setup(){
  createCanvas(windowWidth,windowHeight)

  ground = createSprite(200, height-20, 400,20);
  ground.addImage(groundImg);
  ground.velocityX = -(4+3*score/100);
  ground.x = ground.width/2;

  //crear sprite de Trex
  trex = createSprite(50, height-20, 20, 40);
  trex.debug= true;
//  trex.setCollider("Circle", 0, 0,40)
  trex.addAnimation("start", trex_start);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collide", trex_collide);

  trex.scale = 0.5;

  invisibleGround = createSprite(200, height-10, 400, 10);
  invisibleGround.visible = false;
  

  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.5;
  gameOver.visible = false
  

  restart = createSprite(width/2,height/2+40);
  restart.addImage(restartImg);
  restart.scale=0.5;

  restart.visible = false

  obstaclesGroup = new Group();
  cloudsGroups = new Group();


}

function draw(){
  background(180);

  if(gameState==="start"){
    ground.velocityX = 0;
    push();
    textSize(35);
    fill("white");
   text("Presiona Space para comenzar", width/2-230,height/2)
   pop();
   if (keyDown("space")||touches.lenght>0){
    gameState = "play";
    trex.changeAnimation("running");
    touches= []
   }    
  }

  if(gameState==="play") {

    ground.velocityX = -4;

    text("Puntuacion: "+ Math.round(score), width-100,50);
    text("HIGH: "+ Math.round(highscore), width-200,50);
    score = score+0.1;



    if((keyDown("space")||touches.lenght>0) && trex.y>height-50){
      trex.velocityY = -10;
      jumpSound.play()
      touches= []
    }

    if (Math.round(score)%100==0 && Math.round(score)>0){
      checkpointSound.play()
    }

      trex.velocityY = trex.velocityY +0.5;

      if(ground.x<0){
        ground.x = ground.width/2;
      } 

      if (trex.isTouching(obstaclesGroup)){
        gameState = "end";
        trex.changeAnimation("collide");
        dieSound.play();
        trex.velocityY=-10;
      }




    spawnClouds();
    spawnObstacles();       
  }

  if(gameState==="end"){

    if(score>highscore){
      highscore = score;
    }

    gameOver.visible = true;
    restart.visible = true;

    text("HIGH: "+ Math.round(highscore), width-100,50);

    text("Puntuacion: "+ Math.round(score), width-200,50);
    ground.velocityX = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroups.setVelocityXEach(0);

    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroups.setLifetimeEach(-1)

    trex.velocityY=0

    if(mousePressedOver(restart)||touches.lenght>0){
      reset();
      touches= []
    }

    
  }  

  // || Operador or con una condición que se cumpla es suficiente
  // && Operador and forzosamente se tienen que cumplir las dos condiciones 


  trex.collide(invisibleGround);  
  drawSprites();
}

function reset(){
  score=0
  gameState = "start";
  obstaclesGroup.destroyEach();
  cloudsGroups.destroyEach();
  gameOver.visible = false
  restart.visible = false
  trex.changeAnimation("start")
}


function spawnClouds(){
  if(frameCount%60 ==0){
    var cloud = createSprite(width+100,50, 40,20);
    cloud.y = Math.round(random(5, height-50));
    cloud.velocityX = -(4+3*score/100);
    cloud.addImage(cloudImg);
  
    trex.depth = cloud.depth +1;
  
    cloud.lifetime = 1000;

    cloudsGroups.add(cloud);

  
    }
}


function spawnObstacles(){
  
  //Crear un sprite a cada 60 cuadros
  if(frameCount%60===0){
    var obstacle = createSprite(width+100, height-40, 20,40);
    //Sprite se mueva hacia la izquierda
    obstacle.velocityX = -(4+3*score/100)

    var dado = Math.round(random(1,6));

    switch (dado){
      case 1: obstacle.addImage(obstacle1Img); break;
      case 2: obstacle.addImage(obstacle2Img); break;
      case 3: obstacle.addImage(obstacle3Img); break;
      case 4: obstacle.addImage(obstacle4Img); break;
      case 5: obstacle.addImage(obstacle5Img); break;
      case 6: obstacle.addImage(obstacle6Img); break;
    }

    obstacle.scale = 0.5;
    obstacle.lifetime = 1000;
    obstaclesGroup.add(obstacle);

  }

}