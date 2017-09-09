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
      this.order = this.taken.order + 1;
      if (this.taken.scale.x > .5) this.order = 0;
      this._v.copyFrom(this.position).subtract(this.taken.position);
      if (this._v.x > width/2) this.position.x = this.taken.position.x + width;
      if (this._v.y > height/2) this.position.y = this.taken.position.y + height;
      if (this._v.x < -width/2) this.position.x = this.taken.position.x - width;
      if (this._v.y < -height/2) this.position.y = this.taken.position.y - height;
    }
    if (this.right < 0) this.position.x += width + this.size.x * this.scale.x;
    if (this.bottom < 0) this.position.y += height + this.size.y * this.scale.y;
    if (this.left > width) this.position.x -= width + this.size.x * this.scale.x;
    if (this.top > height) this.position.y -= height + this.size.y * this.scale.y;
    if (this.taken){
      this._v.copyFrom(this.position).subtract(this.taken.position);
      if (this._v.magnitude < height/2) {
        this.snapToEdge(this.taken);
      }
    }
  }

  render() {
    this.scene.game.ctx.strokeStyle = "cyan";
    super.render();
  }

  take(taker:Actor) {
    // new Tween(this.position, taker.position.addXY(0,0,<Vector2>{}), 512, true);
    new Tween(this.scale, { x:0.5, y:0.5 }, 512, true);
    this.velocity.set(0);
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
