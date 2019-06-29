let stage, canvas, rects = [], colors = [], tailRect, prevKey, gettingColors;
let rectWidth = rectHeight = 50;
let API_URL = 'http://api.noopschallenge.com/hexbot';

async function start_app() {
  canvas = document.getElementById('target')
  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight - 50;
  stage = new createjs.Stage(canvas);

  getColors(50, function (respColors) {
    colors = respColors

    let rect = {
      color: colors.pop().value,
      x: getRandom(100, canvas.width - 100),
      y: getRandom(100, canvas.height - 100),
      width: rectWidth,
      height: rectHeight
    }

    createRect(rect);
    document.addEventListener('keydown', handleKeyDown)

  })
  createjs.Ticker.on('tick', () => stage.update());
}

async function handleKeyDown (e) {
  if(colors.length < 10 && !gettingColors) {
    gettingColors = true
    getColors(50, function (respColors) {
      colors = colors.concat(respColors);
      gettingColors = false
    });
  } else if(!colors.length && gettingColors) {
    return
  }

  let newRect = {
    x: tailRect.x,
    y: tailRect.y,
    width: rectWidth,
    height: rectHeight,
    color: colors.pop().value
  }

  // left
  if(e.keyCode === 37) {
    // substract rect.width from the x of the previous rect
    newRect.x -= newRect.width + 2
  }

  // up
  if(e.keyCode === 38) {
    // substract rect.height from y of the previous rect
    newRect.y -= newRect.height + 2
  }

  // right
  if(e.keyCode === 39) {
    // add rect.width to the x of the previous rect
    newRect.x += newRect.width + 2
  }

  // down
  if(e.keyCode === 40) {
    // draw rect to the right
    // add rect.height to the y of the previous rect
    newRect.y += newRect.height + 2
  }

  prevKey = e.keyCode
  createRect(newRect)
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
    onComplete(response.colors)
  }
}


function createRect(rect) {
  let shape = new createjs.Shape();
  shape.graphics.beginFill(rect.color)
  // .beginStroke('white')
    .drawRect(rect.x, rect.y, rect.width, rect.height);

  // shape.shadow = new createjs.Shadow(rect.color, 2, 2, 10);

  rects.push(rect);
  tailRect = rect
  stage.addChild(shape);
  shape.addEventListener('click', function() {
    tailRect = rect;
  })
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
