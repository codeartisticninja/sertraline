"use strict";
import Actor   = require("../../lib/scenes/actors/Actor");
import Scene   = require("../../lib/scenes/Scene");
import Tween   = require("../../lib/utils/Tween");
import Vector2 = require("../../lib/utils/Vector2");

/**
 * Pill class
 */

class Pill extends Actor {
  public taken:Actor;

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
    if (this.taken){
      this.velocity.copyFrom(this.taken.velocity);
      this._v.copyFrom(this.position).subtract(this.taken.position).magnitude -= this.taken.size.x;
      if (this._v.magnitude > this.scene.size.y/2) {
        this.velocity.magnitude = this.size.x/4;
      } else {
        this.velocity.magnitude = 1;
        this.snapToEdge(this.taken);
      }
    }
    if (this.right < 0) this.position.x += width + this.size.x;
    if (this.bottom < 0) this.position.y += height + this.size.y;
    if (this.left > width) this.position.x -= width + this.size.x;
    if (this.top > height) this.position.y -= height + this.size.y;
  }

  take(taker:Actor) {
    // new Tween(this.position, taker.position.addXY(0,0,<Vector2>{}), 512, true);
    new Tween(this.scale, { x:0.5, y:0.5 }, 512, true);
    this.taken = taker
  }
  
  shoot(shooter:Actor) {
    // new Tween(this.position, shooter.position.addXY(0,0,<Vector2>{}), 512, true);
    new Tween(this.scale, { x:0, y:0 }, 512, true);
    setTimeout(()=>{ this.scene.removeActor(this); }, 512);
    this.taken = shooter;
  }
  
  /*
    _privates
  */

  private _v=new Vector2();

}
export = Pill;
