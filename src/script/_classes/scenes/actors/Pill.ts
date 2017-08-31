"use strict";
import Actor   = require("../../lib/scenes/actors/Actor");
import Scene   = require("../../lib/scenes/Scene");
import Tween   = require("../../lib/utils/Tween");

/**
 * Pill class
 */

class Pill extends Actor {
  public taken:boolean;

  constructor(scene:Scene, obj:any) {
    super(scene, obj);
    this.shape = "circle";
    this.addAnimation("be",  [ 0, 1, 2, 3, 4, 5, 6, 7]);
    this.playAnimation("be");
    this.position.set(Math.random()*this.scene.size.x, -32);
    this.angularVelocity = Math.random()*.08-.04;
    this.velocity.set(Math.random()*8-4, Math.random()*8-4);
  }

  update() {
    var width = this.scene.game.canvas.width;
    var height = this.scene.game.canvas.height;
    super.update();
    if (this.right < 0) this.position.x += width + this.size.x;
    if (this.bottom < 0) this.position.y += height + this.size.y;
    if (this.left > width) this.position.x -= width + this.size.x;
    if (this.top > height) this.position.y -= height + this.size.y;
  }

  take() {
    new Tween(this.position, this.scene.actorsByType["Ship"][0].position.addXY(0,0,{}), 512, true);
    new Tween(this.scale, { x:0, y:0 }, 512, true);
    setTimeout(()=>{ this.scene.removeActor(this); }, 512);
    this.taken = true;
  }
  
  /*
    _privates
  */

}
export = Pill;
