let stage, canvas, cannon, rects = [], colors = [], colorsPallet, offsetX = 100, score = 0;
let rectWidth = rectHeight = 50;
let API_URL = 'http://api.noopschallenge.com/hexbot';
let key_w = 87, key_s = 83, key_a = 65, key_d = 68,
  key_up = 38, key_space = 32, key_left = 37, key_right = 39, key_down = 40;
let scoreTxt = "Score: 0";

async function start_app() {
  setupCanvas('target')
  stage = new createjs.Stage(canvas);

  getColors(10, function(respColors) {
    colors = respColors;
    start_game(stage, colors)
    createColorsPallet(colors);
  })

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
}

function start_game(stage, colors) {
  let rectsCount = chance.integer({ min: 10, max: 20 });
  cannon = createCannon(stage, colors[0]);
  let txt = new createjs.Text(scoreTxt, "18px Arial", "#000");

  txt.x = canvas.width - 110;
  txt.y = 10;
  stage.addChild(txt)

  createjs.Ticker.on('tick', handleTick);


  function handleTimeout() {
    if(rectsCount--){
      let colorIdx = chance.integer({ min: 0, max: colors.length - 1 });
      let color = colors[colorIdx];
      createRect(color);
      setTimeout(handleTimeout, chance.integer({ min: 1, max: 10 }) * 1000)
    }
  }
  handleTimeout()
}

function handleTick() {
  let bullet;
  let bullets = [];

  console.log('tick')
  while(bullet = cannon.bullets.shift()) {
    let stillAlive = true;

    rects.forEach(function(rect, idx) {
      bullet.collidingWith(rect, function() {
        stillAlive = false;
        if(bullet.color === rect.color) {
          rect.destroy();
          delete rects[idx];
          score += rect.score;
          txt.text = `Score: ${score}`
        } else {
          // console.log('hora')
          score -= Math.floor(rect.score / 2);
          score = score < 0 ? 0 : score;
          txt.text = `Score: ${score}`
          rect.vibrate();
        }
        bullet.destroy();
        rects
      })
    })

    if(stillAlive){ bullets.push(bullet) }
  };

  cannon.bullets = bullets;

  stage.update()
}
function createColorsPallet(colors) {
  colorsPallet = new ColorsPallet(canvas.width - 100, 50, colors)
  colorsPallet.draw();
  colorsPallet.selectColor(0)
}

function createRect(color) {
  let strokeColor = 'darkred';
  let rectWidth = 50;
  let x, rect;
  let rectScore = chance.integer({ min: 10, max: 30 });

  x = chance.floating({ min: offsetX, max: canvas.width - offsetX });
  rect = new Rect(x, -10, rectWidth, rectWidth, color, strokeColor, null, rectScore);
  rects.push(rect);
  rect.draw();
  rect.move({ y: cannon.y + 20 }, 30000, function() {
    if(rect.y >= cannon.y) {
      gameOver();
    }
  });
}

function gameOver() {
  createjs.Ticker.removeAllEventListeners('tick');
  createjs.Tween.removeAllTweens();
  stage.removeAllChildren();

  ['Game Over!!!', `Score: ${score}`].forEach(function(txt, idx) {
    let text = new createjs.Text(txt, '26px Arial', 'orange');
    text.x = canvas.width / 2;
    text.y = canvas.height / 2 + 50 * idx;
    stage.addChild(text);
  });
  stage.update();
}

function createCannon(stage, color) {
  let x = canvas.width / 2 + offsetX;
  let y = canvas.height - 50;

  let cannon = new Cannon(x, y, color, 'gray')
  cannon.draw()

  return cannon;
}

let speed = 1;
function handleKeyDown (e) {
  if(speed < 10)
    speed *= 2;
  switch(e.keyCode) {
    case key_left:
      cannon.move({ x: -2 * speed })
      break;

    case key_up:
    case key_space:
      cannon.shoot()
      break;

    case key_right:
      cannon.move({ x: 2 * speed })
      break;

    default:
      colorsPallet.handleKeyDown(e)
      cannon.changeColor(colorsPallet.selectedColor)
      return;
  }

}

function handleKeyUp(e) {
  speed = 1;
}

let lastTime = new Date() ;
function accelerate(speed) {
  return lastTime - new Date() % 10;
}

function setupCanvas(id) {
  canvas = document.getElementById(id);
  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight - 50;
  canvas.style.backgroundColor = '#f1f1f1'
}


async function getColors(count, onComplete) {
  let response;
  let url = new URL(API_URL)
  url.searchParams.set('count', count);
  if(!onComplete) {
    response = await fetch(url)
    response = await response.json()
    return response.colors
  } else {
    response = await fetch(url)
    response = await response.json()
    let colorsValues = []
    while(response.colors.length) {
      colorsValues.push(response.colors.pop().value);
    }
    onComplete(colorsValues)
  }
}
