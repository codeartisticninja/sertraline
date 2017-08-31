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
  }

  update() {
    var joy = this.scene.game.joypad;
    this.velocity.copyFrom(joy.dir).multiplyXY(8);
    super.update();
    this.scene.camera.copyFrom(this.position).subtractXY(this.scene.game.canvas.width/2, this.scene.game.canvas.height/2);
  }


  /*
    _privates
  */

}
export = Ship;
