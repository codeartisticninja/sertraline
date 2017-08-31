"use strict";
import Actor   = require("../../lib/scenes/actors/Actor");
import Scene   = require("../../lib/scenes/Scene");
import Vector2 = require("../../lib/utils/Vector2");

/**
 * Ship class
 */

class Ship extends Actor {

  constructor(scene:Scene, obj:any) {
    super(scene, obj);
    this.addAnimation("be",  [ 0, 1, 2, 3, 4, 5, 6, 7]);
    this.playAnimation("be");
    this.momentum = .99;
  }

  update() {
    var joy = this.scene.game.joypad;
    var width = this.scene.game.canvas.width;
    var height = this.scene.game.canvas.height;
    this.rotation += joy.dir.x * .25;
    this.velocity.addXY(-Math.sin(this.rotation)*joy.dir.y, Math.cos(this.rotation)*joy.dir.y);
    super.update();
    if (this.position.x < 0) this.position.x += width;
    if (this.position.y < 0) this.position.y += height;
    if (this.position.x > width) this.position.x -= width;
    if (this.position.y > height) this.position.y -= height;
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
