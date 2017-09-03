"use strict";
import Actor   = require("../../lib/scenes/actors/Actor");
import Scene   = require("../../lib/scenes/Scene");

/**
 * Ship class
 */

class Ship extends Actor {

  constructor(scene:Scene, obj:any) {
    super(scene, obj);
    this.shape = "circle";
    this.addAnimation("be",  [ 0, 1, 2, 3, 4, 5, 6, 7]);
    this.playAnimation("be");
    this.momentum = .99;
  }

  update() {
    var joy = this.scene.game.joypad;
    var width = this.scene.game.canvas.width;
    var height = this.scene.game.canvas.height;
    this.rotation += joy.dir.x * .25;
    if (joy.dir.y < 0) {
      this.velocity.addXY(-Math.sin(this.rotation)*joy.dir.y, Math.cos(this.rotation)*joy.dir.y);
    } else {
      this.velocity.magnitude -= joy.dir.y;
    }
    super.update();
    if (this.right < 0) this.position.x += width + this.size.x;
    if (this.bottom < 0) this.position.y += height + this.size.y;
    if (this.left > width) this.position.x -= width + this.size.x;
    if (this.top > height) this.position.y -= height + this.size.y;
    this.scene.camera.copyFrom(this.position).subtractXY(width/2, height/2);
  }

  render() {
    this.scene.game.ctx.strokeStyle = "cyan";
    super.render();
  }


  /*
    _privates
  */

}
export = Ship;
