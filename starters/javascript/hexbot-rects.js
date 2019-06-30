let stage, canvas, cannon, enemies = [], colors = [], usedColors = [];
let rectWidth = rectHeight = 50;
let API_URL = 'http://api.noopschallenge.com/hexbot';

class Cannon {

  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.rect = new Rect(x, y, 20, 50, color)
    this.bullets = []
  }

  draw() {
    this.rect.draw()
  }

  shoot() {
    let bullet = new Bullet(this.x + 25, this.y, this.color);
    this.bullets.push(bullet);
    bullet.draw()
  }

  move(by) {
    this.x += by.x ? by.x : 0;
    this.rect.move(by)
  }

  changeColor(color) {
    this.color = color;
    this.rect.changeColor(color);
  }

}

class Rect {

  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.shape = new createjs.Shape();
  }

  draw() {
    this.shape.graphics.beginFill(this.color)
      .drawRect(this.x, this.y, this.width, this.height);

    this.shape.x = this.x
    this.shape.y = this.y
    this.shape.regX = this.x + this.width / 2.0
    this.shape.regY = this.y + this.height / 2.0

    stage.addChild(this.shape);
  }

  clear () {
    this.shape.graphics.clear();
  }

  move(by) {
    this.x += by.x ? by.x : 0;
    this.y += by.y ? by.y : 0;
    this.shape.x = this.x
    this.shape.y = this.y
  }

  changeColor(color) {
    this.color = color;
    this.clear();
    this.draw()
  }
}

class Bullet {

  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.color = color;
    this.shape = new createjs.Shape();
  }

  move(by) {
    this.x += by.x ? by.x : 0;
    this.y += by.y ? by.y : 0;
    this.shape.x = this.x;
    this.shape.y = this.y;
  }

  draw() {
    this.shape.graphics.clear();
    this.shape.graphics.beginFill(this.color).drawCircle(this.x, this.y, this.radius)

    this.shape.x = this.x
    this.shape.y = this.y
    this.shape.regX = this.x + this.radius
    this.shape.regY = this.y + this.radius

    stage.addChild(this.shape)
  }
}

async function start_app() {
  setupCanvas('target')
  stage = new createjs.Stage(canvas);

  getColors(50, function(respColors) {
    colors = respColors;
    start_game(stage, colors)
  })

  // let x = getRandom(100, canvas.width - 100);
  // let y = getRandom(100, canvas.height - 100);
  //
  // rect = new Rect(x, y, rectWidth, rectHeight, colors.pop().value)
  //
  // rect.shape.alpha = 0
  // createjs.Tween.get(rect.shape).to({ alpha: 1 }, 500);
  //
  // rect.draw(stage);
  //
  document.addEventListener('keydown', handleKeyDown)

}

function start_game(stage, colors) {
  while(usedColors.length < 5) {
    usedColors.push(colors.pop());
  }

  cannon = createCannon(stage, usedColors[0]);
  createjs.Ticker.on('tick', function() {
    if(cannon) {
      cannon.bullets.forEach(function (bullet) {
        bullet.move({ y: -5 })
      })
    }
    stage.update()
  })

  // usedColors.forEach(createEnemies)
}

function createCannon(stage, color) {
  let x = canvas.width / 2 + 100;
  let y = canvas.height - 50;

  let cannon = new Cannon(x, y, color)
  cannon.draw(stage)

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
      idx = getRandom(0, usedColors.length)
      nextColor = usedColors[idx]
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

function createEnemies(color) {
  let enemiesCount = getRandom(1, 5)

  for(let i=0; i < enemiesCount; i++) {
    let x = getRandom(100, canvas.width - 100)
    let y = 0
    enemies.push(new Rect(x, y, 50, 50, color));
  }
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

function handleCollision(newRect, callback) {
  for(let i = 0; i < rects.length; i++) {
    let rect = rects[i];
    if(colliding(rect, newRect)) {
      callback(rect);
    }
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
