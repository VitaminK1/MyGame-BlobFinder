let roomSize = 70;
let wallSize = 50;
let canvasSize = roomSize*5 + wallSize*8;
let floorSize = 10;
let windowLen = [];
let windowHint = [];
let blobCount = 8;
let blobsLeft = blobCount;
let blobType = [];
let blobTypeCount = 5;
let blobCurve = 18;
let blinkTime = 150;
let fR = 60;
let checkBlob = [];
let clickCount = 20;
let clicksLeft = clickCount;
let timenotChecked = true;
let minTime = 999;
let hintCount = 3;
let hintsLeft = hintCount;
let elapsedTime = 0;
let score = 0;
let displayedScore = 0;
let combo = -1;
let gameOver = false;
let startTime = 0;
let scoreTime = 0;
let scoreClick = 0;
let scoreHint = 0;

function setup() {

  elapsedTime = 0;
  minTime = 999;
  timenotChecked = true;
  blobsLeft = blobCount;
  clicksLeft = clickCount;
  hintsLeft = hintCount;
  score = 0;
  combo = -1;
  displayedScore = 0;
  gameOver = false;
  startTime = 0;
  scoreTime = 0;
  scoreClick = 0;
  scoreHint = 0;

  createCanvas(canvasSize,canvasSize);
  frameRate(fR);

  for (let k=0;k<25;k++) {
    windowLen[k] = roomSize; // window opened? (length)
    windowHint[k] = 255;
    blobType[k] = [];
    blobType[k][0] = 0; // blob Type
    blobType[k][1] = 0; // blob Height   
    blobType[k][2] = false;// blob found check
    checkBlob[k] = 0;
  }
  for (let k=0;k<blobCount;k++) { // blob 랜덤 배정
    blobType[k][0] = int(random(1,blobTypeCount+1));
    blobType[k][1] = int(random(4,7))*10;
    blobType[k][2] = true;
  }
  shuffle(blobType, true);
  frameRate(fR);

  for (let k=0;k<25;k++) { //인접칸에 몇놈 있는지 세기
    
    if (k%5 != 0 && blobType[k-1][0] >0) {
      checkBlob[k] += 1;
    }
    if (int(k/5) != 0 && blobType[k-5][0] >0) { 
      checkBlob[k] += 1;
    }
    if (int(k/5) != 4 && blobType[k+5][0] >0) {
      checkBlob[k] += 1;
    }
    if (k%5 != 4 && blobType[k+1][0] >0) {
      checkBlob[k] += 1;
    }
  }
}

function draw() {

  background(180,250,250);
  rectMode(CORNER);
  ellipseMode(CORNER);

  //building
  stroke(250,250,50);
  strokeWeight(5);
  fill(250,250,200);
  rect(wallSize,wallSize,canvasSize-2*wallSize,canvasSize); 
  
  //road
  stroke(150);
  strokeWeight(5);
  fill(200);
  rect(-wallSize,canvasSize-wallSize,canvasSize+2*wallSize,2*wallSize); 

  //each room
  for (let i=0;i<5;i++) {
    for (let j=0;j<5;j++) {
      
      let roomNum = i+5*j;
      let blobH = blobType[roomNum][1];
      let blobT = blobType[roomNum][0];
      let eyeSize = 10;
      let eyeHeight = roomSize - blobH*0.8;

      translate(2*wallSize+i*(roomSize+wallSize),2*wallSize+j*(roomSize+wallSize)); 

      //rooms
      stroke(255,200,50);
      strokeWeight(3);
      fill(250,250,200); 
      rect(0,0,roomSize,roomSize);

      //전등
      noStroke();
      fill(255,255,225);
      arc(roomSize*(0.25),roomSize*(-0.25),roomSize*0.5,roomSize*0.5,0,PI);
      
      //curtain걸이
      strokeWeight(3);
      stroke(255,200,50);
      fill(250,200,50);
      rect(-10,0,roomSize+20,5,0,0,0,0);

      if (blobT == 1) { //안경쓴 놈
        noStroke();
        fill(0);
        rect(roomSize*0.4,roomSize-blobH,roomSize*0.5,blobH,blobCurve,blobCurve,0,0); //몸
        
        if (frameCount % blinkTime < 10) {
          eyeSize = 1;
          eyeHeight = roomSize - blobH*0.8 + 9; //눈 깜박임
        }
        
        fill(255);
        ellipse(roomSize*0.63,eyeHeight,5,eyeSize); 
        ellipse(roomSize*0.5,eyeHeight,5,eyeSize); //눈

        noFill();
        strokeWeight(2);
        stroke(120);
        ellipse(roomSize*0.583,roomSize-blobH*0.8-3,15,15); //안경
        
      } else if (blobT == 2) { //모자 쓴 놈
        noStroke();
        fill(0);
        rect(roomSize*0.4,roomSize-blobH,roomSize*0.5,blobH,blobCurve,blobCurve,0,0); //몸
        
        fill(255);
        ellipse(roomSize*0.63,eyeHeight,5,10); 
        ellipse(roomSize*0.5,eyeHeight,5,10); //눈

        strokeWeight(1);
        stroke(200,150,0);
        fill(200,150,0);
        arc(roomSize*0.27,roomSize*0.95-blobH,50,50,radians(220),radians(350),CHORD); //모자
        
      } else if (blobT == 3) { //컵 들고 있는 놈
        
        noStroke();
        fill(0);
        rect(roomSize*0.4,roomSize-blobH,roomSize*0.5,blobH,blobCurve,blobCurve,0,0); //몸
        
        if (frameCount % blinkTime < 10) {
          eyeSize = 1;
          eyeHeight = roomSize - blobH*0.8 + 9; //눈 깜박임
        }
        
        fill(255);
        ellipse(roomSize*0.63,eyeHeight,5,eyeSize); 
        ellipse(roomSize*0.5,eyeHeight,5,eyeSize); //눈
        
        strokeWeight(1);
        stroke(255,140,90);
        fill(255,180,90);
        rect(roomSize*0.3,roomSize-blobH*0.5,15,15,0,0,5,5); //컵

      } else if (blobT == 4) { //옷 입은 놈

        noStroke();
        fill(0);
        rect(roomSize*0.4,roomSize-blobH,roomSize*0.5,blobH,blobCurve,blobCurve,0,0); //몸
        fill(200,150,250); 
        rect(roomSize*0.4,roomSize-blobH*0.5,roomSize*0.5,blobH*0.5); //옷

        noFill();
        strokeWeight(2.5);
        stroke(255);
        arc(roomSize*0.48,roomSize-blobH*0.7,8,10,radians(220),radians(320)); //웃는 눈
        arc(roomSize*0.65,roomSize-blobH*0.7,8,10,radians(220),radians(320));
     
      } else if (blobT == 5) { //웃으면서 손 흔드는 놈

        let handAngle = 180 + 10*sin(radians((frameCount/60*90)));
        noStroke();
        fill(0);
        translate(roomSize*0.6+blobH*0.2,roomSize-blobH*0.5);
        rotate(radians(handAngle));
        ellipse(blobH*0.5,0,blobH/5,blobH/5); //손
        rotate(radians(360-handAngle));
        translate(-roomSize*0.6-blobH*0.2,-roomSize+blobH*0.5);
        fill(0);
        rect(roomSize*0.4,roomSize-blobH,roomSize*0.5,blobH,blobCurve,blobCurve,0,0); //몸

        if (frameCount % blinkTime < 10) {
          eyeSize = 1;
          eyeHeight = roomSize - blobH*0.8 + 9; //눈 깜박임
        }
        
        noFill();
        strokeWeight(2.5);
        stroke(255);
        arc(roomSize*0.48,roomSize-blobH*0.7,8,10,radians(220),radians(320)); //웃는 눈
        arc(roomSize*0.65,roomSize-blobH*0.7,8,10,radians(220),radians(320));

      } else if (checkBlob[roomNum]>0) { //인접칸에 몇놈있는지 알려주기
        
        noStroke();
        fill(150,250,120);
        rect(roomSize*0.46,roomSize*0.4,roomSize*0.08,roomSize*0.4);
        fill(180,120,0);
        quad(roomSize*0.35,roomSize*0.75,roomSize*0.65,roomSize*0.75,roomSize*0.60,roomSize*0.9,roomSize*0.40,roomSize*0.9);

        if (checkBlob[roomNum] > 0){
          fill(255,220,70);
          circle(roomSize*0.5,roomSize*0.3,roomSize*0.15);
        }
        if (checkBlob[roomNum] > 1){
          fill(255,180,90);
          circle(roomSize*0.35,roomSize*0.25,roomSize*0.15);
        }
        if (checkBlob[roomNum] > 2){
          fill(255,120,0);
          circle(roomSize*0.45,roomSize*0.16,roomSize*0.15);
        }
        if (checkBlob[roomNum] >3) {
          fill(150,20,250);
          circle(roomSize*0.4351,roomSize*0.24,roomSize*0.151);
        }
      }

      //curtain
      if (
        (wallSize*2 + (wallSize+roomSize)*i) < mouseX && 
         mouseX < (wallSize*2+roomSize+(wallSize+roomSize)*i) && 
         (wallSize*2 + (wallSize+roomSize)*j) < mouseY && 
         mouseY < (wallSize*2+roomSize+(wallSize+roomSize)*j) && 
         windowLen[roomNum] > 10 &&
         gameOver == false) {
        strokeWeight(3);
        stroke(255);
      } else {
        noStroke();
      }
      fill(220,210,150,windowHint[roomNum]); 
      rect(-1.5,-2.5,windowLen[roomNum]+3,roomSize);

      //windowsfloor
      stroke(200);
      strokeWeight(5);
      fill(200); 
      translate(0,5);
      quad(-floorSize,roomSize-floorSize,roomSize+floorSize,roomSize-floorSize,roomSize,roomSize,0,roomSize);
      translate(0,-5);

      translate(-(2*wallSize+i*(roomSize+wallSize)),-(2*wallSize+j*(roomSize+wallSize)));
      
    }
  }
  
  //roof
  stroke(180);
  strokeWeight(5);
  fill(200);
  quad(wallSize,wallSize/2,canvasSize-wallSize,wallSize/2,canvasSize-wallSize/2,wallSize*1.5,wallSize/2,wallSize*1.5);

  //time and counts
  if (clicksLeft != clickCount | hintsLeft != hintCount) {
    elapsedTime += 1/60;
  }

  if (score != displayedScore) {
    displayedScore += 1;
  }
  noStroke();
  fill(255);
  textSize(21);
  textAlign(LEFT,BASELINE);
  text('Find '+blobsLeft+ ' Blob(s)! '+clicksLeft+' Click(s) Left.',canvasSize-wallSize*7,wallSize*1.15);
  
  noStroke();
  fill(255);
  textSize(20);
  text('Score : ' + nf(displayedScore,6), canvasSize - 3*wallSize, canvasSize - 0.3*wallSize);
  if (combo > 0) {
    text('<< '+combo+' Combo! (+'+(int(400/blobCount)*combo)+') >>', canvasSize/2-wallSize, canvasSize - 0.3*wallSize);
  }
  //gameOvercheck
  if (clicksLeft == 0 && blobsLeft > 0 ){
    noStroke();
    fill(255);
    textSize();
    text('You Lose!',wallSize*0.5,canvasSize-wallSize*0.3);
    gameOver = true;

    if (timenotChecked) {
      minTime = elapsedTime;
      timenotChecked = false;
    }
    text('  Time : ' + int(minTime) + '.' + int(minTime%1*10),wallSize,wallSize*1.15);
  } else if (blobsLeft == 0) {
    noStroke();
    fill(255);
    textSize(20);
    text('You Win!',wallSize*0.5,canvasSize-wallSize*0.3);
    gameOver = true;

    if (timenotChecked) {
      minTime = elapsedTime;
      timenotChecked = false;
    }
    text('  Time : ' + int(minTime) + '.' + int(minTime%1*10),wallSize,wallSize*1.15);
  } else {
    noStroke();
    fill(255);
    textSize(20);
    text('You can use ' + hintsLeft + ' hint(s).',wallSize*0.5,canvasSize-wallSize*0.3);
    text('  Time : ' + int(elapsedTime) + '.' + int(elapsedTime%1*10),wallSize,wallSize*1.15);
  }

  if (gameOver == true) {

    if (startTime < 5) {
      startTime += 1/60;
    }
    if (minTime < 100) {
      scoreTime = 1000-int(minTime*10);
    }
    if (clicksLeft > 0) {
      scoreClick = 100*clicksLeft;
    }
    if (hintsLeft > 0) {
      scoreHint = 50*hintsLeft;
    }
    strokeWeight(5);
    stroke(150,150,150,200);
    fill(200,200,200,240);
    rect(wallSize*2.5+roomSize,wallSize*2.5+roomSize,3*roomSize+3*wallSize,3*roomSize+3*wallSize);
    
    noStroke();
    fill(255);

    textAlign(CENTER,CENTER);
    if ( startTime > 0.5 && blobsLeft == 0) {
      textSize(50);
      text('You Win!',4*wallSize+2.5*roomSize,4*wallSize+1*roomSize);
      textSize(15);
      text('Found '+blobCount+' blobs within '+clickCount+' clicks',4*wallSize+2.5*roomSize,4.7*wallSize+1*roomSize);
      text();
    } else if (startTime > 0.5 && clicksLeft == 0 ) {
      textSize(50);
      text('You Lose..',4*wallSize+2.5*roomSize,4*wallSize+1*roomSize);
      textSize(15);
      text('Failed to Find '+blobCount+' blobs within '+clickCount+' clicks',4*wallSize+2.5*roomSize,4.7*wallSize+1*roomSize);    
      scoreTime = 0;
      scoreClick = 0;
      scoreHint = 0;
    }

    if ( scoreTime > 0 && startTime > 1.5) {
      textSize(20);
      text('Time Bonus : +'+scoreTime,4*wallSize+2.5*roomSize,4*wallSize+2*roomSize );
    } else if ( scoreTime <= 0 && startTime > 1.5) {
      textSize(20);
      text('Time Bonus : 0',4*wallSize+2.5*roomSize,4*wallSize+2*roomSize );
    }
    if ( scoreClick > 0 && startTime > 2) {
      textSize(20);
      text('Click Bonus : +'+scoreClick,4*wallSize+2.5*roomSize,4.5*wallSize+2*roomSize );
    } else if ( startTime > 2) {
      textSize(20);
      text('Click Bonus : 0',4*wallSize+2.5*roomSize,4.5*wallSize+2*roomSize);
    }
    if ( scoreHint > 0 && startTime > 2.5) {
      textSize(20);
      text('Hint Bonus : +'+scoreHint,4*wallSize+2.5*roomSize,5*wallSize+2*roomSize );
    } else if ( startTime > 2.5) {
      textSize(20);
      text('Hint Bonus : 0',4*wallSize+2.5*roomSize,5*wallSize+2*roomSize);
    }    
    if (startTime > 3.5){
      textSize(30);
      text('Total Score : '+(score+scoreTime+scoreClick+scoreHint),4*wallSize+2.5*roomSize,5.8*wallSize+2*roomSize );
    }
    
    if (startTime > 4.5) {
      textSize(20);
      text('Press any key to play again',4*wallSize+2.5*roomSize,5*wallSize+3.5*roomSize );
    }

  }
}


function mousePressed() { //창문 클릭 감지
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if ((wallSize*(2+i)+roomSize*i < mouseX) && (mouseX < wallSize*(2+i)+roomSize*(i+1))){
          if ((wallSize*(2+j)+roomSize*j < mouseY) && (mouseY < wallSize*(2+j)+roomSize*(j+1)) && clicksLeft>0 &&blobsLeft>0){
            if (mouseButton == LEFT && windowLen[i+5*j] > 20) {
              windowLen[i+5*j] = 5;
              windowHint[i+5*j] = 255;
              clicksLeft -= 1;
              if (blobType[i+5*j][2] == true) {
                blobsLeft -= 1;
                combo += 1;
                score += int(400/blobCount)+int(400/blobCount)*combo;
                blobType[i+5*j][2] = false; 
              } else {
                combo = -1;
              }
            }
            else if (mouseButton == RIGHT && hintsLeft > 0 && windowLen[i+5*j] > 20 && windowHint[i+5*j] > 200){
              windowHint[i+5*j] = 120;
              hintsLeft -= 1;
            }
          }
        }
      }
    }

}

function keyPressed() { //키 조작(다시시작)

  if (key == 'w' && blobCount < 25 && clickCount > blobCount) {
    blobCount += 1;
  }
  if (key == 's' && blobCount > 1 && clickCount >= blobCount) {
    blobCount -= 1;
  }
  if (key == 'd' && clickCount < 25 && clickCount >= blobCount) {
    clickCount += 1;
  }
  if (key == 'a' && clickCount > 1 && clickCount > blobCount) {
    clickCount -= 1;
  }
  setup();
}