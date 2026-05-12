import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import { setupInteraction } from "./interaction.js";

export function createScene(engine, canvas) {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    "cam",
    -Math.PI / 2,
    Math.PI / 2.5,
    12,
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // =========================
  // FIX SCROLL CONFLICT
  // =========================
  camera.attachControl(canvas, false);

  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
    { passive: false }
  );

  new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0),
    scene
  );

  scene.roomList = [];
  scene.onTemplateReady = null;

  let roomTemplate = null;
  const ROOM_SPACING = 25;

  // =========================
  // LOAD TEMPLATE
  // =========================
  function loadTemplate() {
    const files = [
      "floor.glb",
      "wall_back.glb",
      "wall_left.glb",
      "table_spawn.glb",
      "table_server.glb",
      "table_1.glb",
      "table_2.glb",
      "table_3.glb",
      "table_4.glb",
      "table_5.glb",
      "table_6.glb",
      "table_7.glb",
      "table_8.glb"
    ];

    const root = new BABYLON.TransformNode("ROOM_TEMPLATE", scene);

    let loaded = 0;

    files.forEach((file) => {
      BABYLON.SceneLoader.ImportMesh(
        "",
        "/models/",
        file,
        scene,
        (meshes) => {
          const container = new BABYLON.TransformNode(
            file + "_root",
            scene
          );

          container.parent = root;

          // TYPE TAG
          if (file === "table_spawn.glb") {
            container.metadata = { type: "spawn" };
          } else if (file.includes("table_")) {
            container.metadata = { type: "table" };
          }

          meshes.forEach((mesh) => {
            if (!mesh.getVerticesData) return;

            mesh.setParent(container);
            mesh.isPickable = true;

            mesh.metadata = mesh.metadata || {};

            if (container.metadata?.type) {
              mesh.metadata.type = container.metadata.type;
            }
          });

          loaded++;

          if (loaded === files.length) {
            roomTemplate = root;
            root.setEnabled(false);

            console.log("🔥 TEMPLATE READY");

            if (scene.onTemplateReady) {
              scene.onTemplateReady();
            }
          }
        }
      );
    });
  }

  // =========================
  // CREATE ROOM
  // =========================
  scene.createRoomInstance = function () {
    if (!roomTemplate) {
      return null;
    }

    const index = scene.roomList.length;

    const clone = roomTemplate.clone("room_" + index);

    clone.setEnabled(true);
    clone.position.x = index * ROOM_SPACING;

    clone.metadata = {
      roomId: index
    };

    // propagate ke transform nodes
    clone.getChildTransformNodes().forEach((node) => {
      if (
        node.metadata?.type === "spawn" ||
        node.metadata?.type === "table"
      ) {
        node.metadata.roomId = index;
      }
    });

    // propagate ke meshes
    clone.getChildMeshes().forEach((mesh) => {
      mesh.metadata = mesh.metadata || {};

      if (!mesh.metadata.type && mesh.parent?.metadata?.type) {
        mesh.metadata.type = mesh.parent.metadata.type;
      }

      if (mesh.parent?.metadata?.roomId !== undefined) {
        mesh.metadata.roomId = mesh.parent.metadata.roomId;
      }
    });

    scene.roomList.push(clone);

    console.log("🏢 ROOM CREATED:", index);

    return clone;
  };

  // =========================
  // INIT
  // =========================
  loadTemplate();
  setupInteraction(scene);

  return scene;
}