class Rect {

  constructor(x, y, width, height, color, strokeColor, strokeTickness) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.strokeColor = strokeColor || color;
    this.strokeTickness = strokeTickness || 1;
    this.shape = new createjs.Shape();
    stage.addChild(this.shape);
    this.tween = createjs.Tween.get(this.shape);
  }

  draw() {
    this.shape.graphics.clear();
    this.shape.graphics
      .beginFill(this.color)
      .setStrokeStyle(this.strokeTickness)
      .beginStroke(this.strokeColor)
      .drawRect(this.x, this.y, this.width, this.height);

    this.shape.x = this.x
    this.shape.y = this.y
    this.shape.regX = this.x + this.width / 2.0
    this.shape.regY = this.y + this.height / 2.0

    // stage.addChild(this.shape);
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
    createjs.Tween.get(this.shape)
      .to({ scaleX: 1.2, scaleY: 1.2 }, 50)
      .to({ scaleX: 1, scaleY: 1 }, 50)
    stage.update();
  }

  destroy() {
    let shape = this.shape;
    this.tween = createjs.Tween.get(this.shape, { override: true })
    this.tween.to({ scaleX: 1.5, scaleY: 1.5, alpha: 0 }, 100);
    this.tween.on('complete', function () {
      shape.graphics.clear();
      stage.removeChild(shape);
      stage.update();
    })
  }

  moveBy(by) {
    this.x += by.x ? by.x : 0;
    this.y += by.y ? by.y : 0;
    this.shape.x = this.x
    this.shape.y = this.y
  }

  move(to, seconds) {
    let _this = this;
    this.tween.to({ y: to.y }, seconds || 1000)
    this.tween.on('change', function(e) {
      _this.y = e.target.target.y
      _this.x = e.target.target.x
    })
  }

  changeColor(color) {
    this.color = color;
    this.draw()
  }
}

