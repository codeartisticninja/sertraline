"use strict";
import Actor      = require("../../lib/scenes/actors/Actor");
import SpaceScene = require("../SpaceScene");
import Tween      = require("../../lib/utils/Tween");

/**
 * Anx class
 */

class Anx extends Actor {
  public scene:SpaceScene;
  public taken:boolean;

  constructor(scene:SpaceScene, obj:any) {
    super(scene, obj);
    this.shape = "circle";
    this.addAnimation("be",  [ 0, 1, 2, 3, 4, 5, 6, 7]);
    this.playAnimation("be");
    this.position.set(-32, Math.random()*this.scene.size.y);
    this.angularVelocity = Math.random()*.08-.04;
    this.velocity.set(Math.random()*8-4, Math.random()*8-4);
    this.order = 1024;
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

  render() {
    this.scene.game.ctx.strokeStyle = "red";
    super.render();
  }

  take() {
    new Tween(this, { opacity:0 }, 512, true);
    new Tween(this.scale, { x:2, y:2 }, 512, true);
    setTimeout(()=>{ this.scene.removeActor(this); }, 512);
    this.taken = true;
    this.scene.sfx.play("explode");
  }
  
  /*
    _privates
  */

}
export = Anx;
