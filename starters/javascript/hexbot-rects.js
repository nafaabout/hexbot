let stage, canvas, cannon, rects = [], colors = [], offsetX = 100;
let rectWidth = rectHeight = 50;
let API_URL = 'http://api.noopschallenge.com/hexbot';

async function start_app() {
  setupCanvas('target')
  stage = new createjs.Stage(canvas);

  getColors(10, function(respColors) {
    colors = respColors;
    start_game(stage, colors)
  })

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
}

function start_game(stage, colors) {
  let rectsCount = chance.integer({ min: 10, max: 20 });
  cannon = createCannon(stage, colors[0]);
  createjs.Ticker.on('tick', function() {

    cannon.bullets.forEach(function(bullet) {
      rects.forEach(function(rect, idx) {
        bullet.collidingWith(rect, function() {
          if(bullet.color === rect.color) {
            rect.destroy();
            delete rects[idx];
          } else {
            rect.vibrate();
          }
          rects
        })
      })
    });

    stage.update()
  })

  function handleTimeout() {
    if(rectsCount--){
      let colorIdx = chance.integer({ min: 0, max: colors.length });
      let color = colors[colorIdx];
      createRect(color);
      setTimeout(handleTimeout, chance.integer({ min: 1, max: 10 }) * 1000)
    }
  }
  handleTimeout()
}

function createRect(color) {
  let strokeColor = 'darkred';
  let rectWidth = 50;
  let x, rect;

  x = chance.floating({ min: offsetX, max: canvas.width - offsetX });
  rect = new Rect(x, -10, rectWidth, rectWidth, color, strokeColor);
  rects.push(rect);
  rect.draw();
  rect.move({ y: cannon.y + 20 }, 30000);
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
      // left
    case 37:
      // substract rect.width from the x of the previous rect
      cannon.move({ x: -2 * speed })
      break;

      // up
    case 38:
    case 32:
      // substract rect.height from y of the previous rect
      cannon.shoot()
      idx = chance.integer({ min: 0, max: colors.length })
      nextColor = colors[idx]
      cannon.changeColor(nextColor)
      break;

      // right
    case 39:
      // add rect.width to the x of the previous rect
      cannon.move({ x: 2 * speed })
      break;

    default:
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

function colliding(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
}
