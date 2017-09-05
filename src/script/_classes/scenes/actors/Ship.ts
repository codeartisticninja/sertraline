"use strict";
import Actor   = require("../../lib/scenes/actors/Actor");
import Scene   = require("../../lib/scenes/Scene");
import SpaceScene = require("../SpaceScene");

/**
 * Ship class
 */

class Ship extends Actor {
  public scene:SpaceScene;

  constructor(scene:SpaceScene, obj:any) {
    super(scene, obj);
    this.shape = "circle";
    this.addAnimation("be",  [ 0, 1, 2, 3, 4, 5, 6, 7]);
    this.playAnimation("be");
    this.momentum = .99;
    this.order = 512;
    this.position.set(this.scene.size.x/2,-this.size.y/2);
    this.velocity.set(0,-4);
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
    this.scene.game.ctx.strokeStyle = "green";
    super.render();
  }

  shoot() {
    let scene = this.scene;
    if (scene.ammo.length > 0) {
      let joy = scene.spawn("Joy");
      let pill = scene.ammo.pop();
      pill.shoot(joy);
      if (scene.ammo.length) scene.ammo[scene.ammo.length-1].taken = scene.actorsByType["Ship"][0];
      scene.sfx.play("shoot");
    } else {
      scene.sfx.play("noammo");
    }
}


  /*
    _privates
  */

}
export = Ship;
