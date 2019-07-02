class Rect {

  constructor(x, y, width, height, color, strokeColor, strokeTickness, score) {
    this.score = score;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.strokeColor = strokeColor || color;
    this.strokeTickness = strokeTickness || 1;
    this.container = new createjs.Container();
    this.shape = new createjs.Shape();
    this.container.addChild(this.shape);
    if(score) {
      this.text = new createjs.Text(this.score.toString(), '12px Arial', 'white');
      this.container.addChild(this.text);
    }
    stage.addChild(this.container);
    this.tween = createjs.Tween.get(this.container);
  }

  draw() {
    this.shape.graphics.clear();
    this.shape.graphics
      .beginFill(this.color)
      .setStrokeStyle(this.strokeTickness)
      .beginStroke(this.strokeColor)
      .drawRect(this.x, this.y, this.width, this.height);

    if(this.text) {
      this.text.x = this.x + 20
      this.text.y = this.y + 20
    }

    this.container.x = this.x
    this.container.y = this.y
    this.container.regX = this.x + this.width / 2.0
    this.container.regY = this.y + this.height / 2.0
  }

  emphasize(color, strokeTickness) {
    this.shape.graphics.clear();
    this.strokeColor = color;
    this.strokeTickness = strokeTickness || 2
    this.draw();
  }

  deemphasize(color) {
    this.shape.graphics.clear();
    this.strokeColor = this.color;
    this.draw();
  }

  vibrate() {
    createjs.Tween.get(this.container)
      .to({ scaleX: 1.2, scaleY: 1.2 }, 50)
      .to({ scaleX: 1, scaleY: 1 }, 50)
    stage.update();
  }

  destroy() {
    let _container = this.container;
    this.tween = createjs.Tween.get(this.container, { override: true })
    this.tween.to({ scaleX: 1.5, scaleY: 1.5, alpha: 0 }, 100);
    this.tween.on('complete', function () {
      stage.removeChild(_container);
      stage.update();
    })
  }

  moveBy(by) {
    this.x += by.x ? by.x : 0;
    this.y += by.y ? by.y : 0;
    this.container.x = this.x
    this.container.y = this.y
  }

  move(to, seconds) {
    let _this = this, _container;
    let _halfHeight = this.height * 0.3
    let _halfWith = this.width * 0.3

    this.tween.to({ y: to.y }, seconds || 1000)
    this.tween.on('change', function(e) {
      _container = e.target.target
      _this.y = _container.y - _halfHeight;
      _this.x = _container.x - _halfWith;
    })
  }

  changeColor(color) {
    this.color = color;
    this.draw()
  }
}

