"use strict";
import Actor   = require("../../lib/scenes/actors/Actor");
import Scene   = require("../../lib/scenes/Scene");

/**
 * Spawner class
 */

class Spawner extends Actor {
  public obj:any;

  constructor(scene:Scene, obj:any) {
    super(scene, obj);
    this.obj = obj;
    this.visible = false;
  }

  spawn() {
    var obj = JSON.parse(JSON.stringify(this.obj));
    obj.type = this.name
    obj.name = null;
    return this.scene.addActor(new this.scene.actorTypes[this.name](this.scene, obj));
  }

  /*
    _privates
  */

}
export = Spawner;
