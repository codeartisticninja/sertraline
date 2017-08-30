"use strict";
import Actor = require("./Actor");
import Scene = require("../Scene");

/**
 * Scenery class
 * 
 * @date 17-jul-2017
 */

class Scenery extends Actor {
  public img = new Image();

  constructor(scene:Scene, obj:any) {
    super(scene, obj);
    this.setAnchor(0);
    this.img.src = scene.mapUrl.substr(0, scene.mapUrl.lastIndexOf("/")+1) + obj.image;

    if (!this.img.complete) {
      this.scene.game.loading++;
      this.img.addEventListener("load", () => {
        this.scene.game.loaded++;
      });
    }

  }

  render () {
    if (!this.img.width) return;
    let g = this.scene.game.ctx;
    g.drawImage(this.img, 0, 0);
  }

  /*
    _privates
  */
}
export = Scenery;
