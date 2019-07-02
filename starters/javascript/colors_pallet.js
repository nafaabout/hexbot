class ColorsPallet {
  constructor(x, y, colors) {
    this.x = x;
    this.y = y;
    this.colors = colors;
    this.colorRects = [];
    this.selectedColor = colors[0];
    this.rectWidth = 30;
    this.rectsPerL = 2.0;
    this.lineN = Math.floor(colors.length / this.rectsPerL);
    this.curL = 0
  }

  handleKeyDown(e) {
    let colorIdx = this.colorIdx;

    switch (e.keyCode){
      case key_w:
        colorIdx -= this.rectsPerL
        break;
      case key_s:
        colorIdx += this.rectsPerL
        break;
      case key_d:
        colorIdx += 1
        break;
      case key_a:
        colorIdx -= 1
        break;
    }
    this.selectColor(colorIdx)
  }

  draw() {
    let _this = this;
    this.colors.forEach(function (color) {
      _this.addColorRect(color)
    });
    this.selectColor(0)
  }

  addColorRect(color) {
    this.curL = Math.floor(this.colorRects.length / this.rectsPerL)
    let x = this.x + (this.colorRects.length % this.rectsPerL) * (this.rectWidth + 5);
    let y = this.y + this.curL * (this.rectWidth + 5)
    let rect = new Rect(x, y, this.rectWidth, this.rectWidth, color)
    rect.draw();
    this.colorRects.push(rect)
  }

  selectColor(colorIdx) {
    if(colorIdx >= this.colorRects.length) return false;
    if(colorIdx < 0) return false;
    
    this.colorRects.forEach(function(rect, idx) {
      if(colorIdx === idx){
        rect.emphasize('red')
      } else {
        rect.deemphasize()
      }
    })
    this.colorIdx = colorIdx;
    this.selectedColor = this.colors[colorIdx];

    return true;
  }

  removeColorRect(rect) {
    let rectIdx = this.colorRect.find((r) => r.color === rect.color)
    this.colorRects.delete(rect)
  }

}
