let stage, canvas, cannon, rects = [], colors = []
let rectWidth = rectHeight = 50;
let API_URL = 'http://api.noopschallenge.com/hexbot';

async function start_app() {
  setupCanvas('target')
  stage = new createjs.Stage(canvas);

  getColors(5, function(respColors) {
    colors = respColors;
    start_game(stage, colors)
  })

  document.addEventListener('keydown', handleKeyDown)
}

function start_game(stage, colors) {
  cannon = createCannon(stage, colors[0]);
  createjs.Ticker.on('tick', function() {

    cannon.bullets.forEach(function(bullet) {
      rects.forEach(function(rect) {
        bullet.collidingWith(rect, function() {
          if(bullet.color === rect.color) {
            rect.destroy();
          } else {
            rect.vibrate();
          }
          rects
        })
      })
    });

    stage.update()
  })

  createRects(colors);
}

function createCannon(stage, color) {
  let x = canvas.width / 2 + 100;
  let y = canvas.height - 50;

  let cannon = new Cannon(x, y, color, 'gray')
  cannon.draw()

  return cannon;
}

function handleKeyDown (e) {
  console.log(e.keyCode)

  switch(e.keyCode) {
      // left
    case 37:
      // substract rect.width from the x of the previous rect
      cannon.move({ x: -10 })
      break;

      // up
    case 38:
    case 32:
      // substract rect.height from y of the previous rect
      cannon.shoot()
      idx = getRandom(0, colors.length)
      nextColor = colors[idx]
      cannon.changeColor(nextColor)
      break;

      // right
    case 39:
      // add rect.width to the x of the previous rect
      cannon.move({ x: 10 })
      break;

    default:
      return;
  }

}

function createRects(colors) {
  let rectsCount, x = 100, y = 10;
  let strokeColor = 'darkred';
  let rectWidth = 50;

  colors.forEach(function (color) {
    rectsCount = getRandom(1, 3);
    for(let i=0; i < rectsCount; i++) {
      x += rectWidth + getRandom(20, 200);
      let rect = new Rect(x, y, rectWidth, rectWidth, color, strokeColor);
      rects.push(rect);
      rect.draw();
      rect.move({ y: cannon.y + 20 }, 30000);
    }
  });
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

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let r = Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  if(r == min) {
    r = getRandom(min, max)
  }
  return r
}
