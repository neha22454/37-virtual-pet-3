var dog,happyDog;
var database;
var foodS,foodStock;
var foodObj;
var garden,bedroom,washroom;

function preload(){

	dogImg=loadImage("images/dogImg.png")
  dogImg1=loadImage("images/dogImg1.png")
  BedRoomImg=loadImage("images/Bed Room.png")
  GardenImg=loadImage("images/Garden.png")
  WashRoomImg=loadImage("images/Wash Room.png")
}

function setup() {
 database=firebase.database()
	createCanvas(500,500);

  foodObj = new Food();

  foodStock = database.ref('Food')
  foodStock.on("value",readStock)

  dog=createSprite(400,200,150,150)
  dog.addImage(dogImg)
  dog.scale=0.15

  feed = createButton("Feed the dog")
  feed.position(700,95)
  feed.mousePressed(feedDog)
   
  addFood = createButton("Feed the dog")
  addFood.position(800,95)
  addFood.mousePressed(addFood)
   
  readState=database.ref('gameState')
  readState.on("value",function(data){
    gameState=data.val();
  })
  
}


function draw() {  
background(46,139,87)
textSize(15)

fill("green")
stroke("white")

  fooodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
   lastFed = data.val();
  })

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed:" + lastFeed%12 + "PM",350,30);
  }
  else if(lastFed == 0){
    text("Last Feed:12AM",350,30)
  }
  else{
    text("Last Feed:"+ lastFed+"AM",350,30)
  }


  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide()
    dog.remove();
  }else{
    feed.show()
    addFood.show()
    dog.addImage(sadDog)
  }



if(keyWentDown(UP_ARROW)){
  writeStock(foodS);
  dog.addImage(dogImg1)
}
currentTime=hour();
if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
} else if(currentTime==(lastFed+2)){
  update("Sleeping");
  foodObj.bedroom()
} else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
} else{
  update("Hungry")
  foodObj.display()
}
  drawSprites();
  

}


function readStock(data){
  foodS=data.val();
}


function writeStock(x){

  if(x<=0){
    x=0;
  } else{
    x=x-1;
  }

  

  database.ref('/').update({

  Food:x

  })

  
}


function fedDog(){
   dog.addImage(dogImg1)
   foodObj.updateFoodStock(foodObj.getFoodStock()-1)
   database.ref('/').update({
     Food:foodObj.getFoodStock(),
     FeedTime:hour()
   })

   
}


function addFoods(){
  foodS++
  database.ref('/').update({
  Food: foodS
  })
 


  
}


function update(state){
  database.ref('/').update({
    gameState:state
  })
}





