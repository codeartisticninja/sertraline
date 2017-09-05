"use strict";
import Actor   = require("../../lib/scenes/actors/Actor");
import Scene   = require("../../lib/scenes/Scene");

/**
 * Joy class
 */

class Joy extends Actor {
  constructor(scene:Scene, obj:any) {
    super(scene, obj);
    this.shape = "circle";
    this.addAnimation("be",  [ 0, 1, 2, 3, 4, 5, 6, 7]);
    this.playAnimation("be");
    this.position.copyFrom(this.scene.actorsByType["Ship"][0].position);
    this.rotation = this.scene.actorsByType["Ship"][0].rotation;
    this.velocity.set(Math.sin(this.rotation)*16, -Math.cos(this.rotation)*16);
    this.order = 4096;
  }

  update() {
    var width = this.scene.game.canvas.width;
    var height = this.scene.game.canvas.height;
    this.opacity -= .02;
    super.update();
    if (this.right < 0) this.position.x += width + this.size.x;
    if (this.bottom < 0) this.position.y += height + this.size.y;
    if (this.left > width) this.position.x -= width + this.size.x;
    if (this.top > height) this.position.y -= height + this.size.y;
    if (this.opacity <= 0.1) {
      this.scene.removeActor(this);
    }
  }

  render() {
    this.scene.game.ctx.strokeStyle = "white";
    super.render();
  }


  /*
    _privates
  */

}
export = Joy;
