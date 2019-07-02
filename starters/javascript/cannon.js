class Cannon {

  constructor(x, y, color, strokeColor) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.strokeColor = strokeColor;
    this.container = new createjs.Container();
    this.rect = new Rect(x, y, 20, 50, color, strokeColor);
    this.bullets = []
  }

  draw() {
    this.rect.draw()
  }

  shoot() {
    let bullet = new Bullet(this.x + 10, this.y - 5, this.color);
    this.bullets.push(bullet);
    bullet.draw()
    bullet.move({ y: 0 });
  }

  move(by) {
    this.x += by.x ? by.x : 0;
    this.y += by.y ? by.y : 0;
    this.rect.moveBy(by)
  }

  changeColor(color) {
    this.color = color;
    this.rect.changeColor(color);
  }

}

