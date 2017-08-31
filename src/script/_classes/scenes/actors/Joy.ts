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
  }

  update() {
    this.opacity -= .02;
    if (this.opacity <= 0.1) {
      this.scene.removeActor(this);
    }
    super.update();
  }


  /*
    _privates
  */

}
export = Joy;
