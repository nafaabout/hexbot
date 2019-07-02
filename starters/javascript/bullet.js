class Bullet {

  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.color = color;
    this.shape = new createjs.Shape();
    this.tween = createjs.Tween.get(this.shape)
  }

  move(to) {
    let _this = this;
    this.tween.to(to, 1000);
    this.tween.on('change', function(e) {
      _this.y = e.target.target.y;
      _this.x = e.target.target.x;
    })

    this.tween.on('complete', function(e) {
      stage.removeChild(_this.shape);
    });
  }

  destroy(callback) {
    let shape = this.shape
    this.tween = createjs.Tween.get(this.shape, { override: true })
    this.tween.to({ alpha: 0}, 50)
    this.tween.on('complete', function () {
      shape.graphics.clear();
      stage.removeChild(shape);
    })
  }

  collidingWith(rect, handleCollide) {
    let colliding = this.x >= rect.x &&
      this.x <= rect.x + rect.width &&
      this.y >= rect.y &&
      this.y <= rect.y + rect.height

    if(colliding) {
      handleCollide(rect);
    }
  }

  draw() {
    this.shape.graphics.beginFill(this.color).drawCircle(this.x, this.y, this.radius)

    this.shape.x = this.x
    this.shape.y = this.y
    this.shape.regX = this.x + this.radius
    this.shape.regY = this.y + this.radius

    stage.addChild(this.shape)
  }
}

