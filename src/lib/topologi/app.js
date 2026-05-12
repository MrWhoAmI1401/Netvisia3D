import * as BABYLON from "@babylonjs/core";
import { createScene } from "./scene.js";
import {
  testAllConnections,
  deleteDevice,
  saveConfiguration
} from "./ui/deviceMenu.js";
import { updateTopologyHUD } from "./ui/topologyHUD.js";
import { addTable } from "./tableManager.js";

export function initTopologyApp(canvas) {
  if (!canvas) {
    console.error("❌ renderCanvas not found");
    return null;
  }

  const engine = new BABYLON.Engine(canvas, true);
  const scene = createScene(engine, canvas);

  // =========================
  // GLOBAL STATE
  // =========================
  scene.rooms = scene.roomList;
  scene.currentRoomIndex = 0;
  scene.isPlacing = false;
  scene.isMenuOpen = false;

  // =========================
  // CAMERA INFO UI
  // =========================
  function createCameraInfoUI() {
    let el = document.getElementById("cameraInfo");

    if (!el) {
      el = document.createElement("div");
      el.id = "cameraInfo";

      el.style.position = "absolute";
      el.style.bottom = "80px";
      el.style.right = "20px";
      el.style.color = "white";
      el.style.fontSize = "14px";
      el.style.textAlign = "right";
      el.style.opacity = "0.85";
      el.style.padding = "8px 12px";
      el.style.borderRadius = "8px";
      el.style.background = "rgba(0,0,0,0.3)";
      el.style.backdropFilter = "blur(6px)";
      el.style.fontFamily = "sans-serif";
      el.style.zIndex = "99999";

      const topologyRoot = document.querySelector(".topology-page");

      if (topologyRoot) {
        topologyRoot.appendChild(el);
      }
    }
  }

  // =========================
  // UPDATE CAMERA INFO
  // =========================
  function updateCameraInfo() {
    const el = document.getElementById("cameraInfo");
    if (!el) return;

    const room = scene.currentRoomIndex + 1;

    el.innerHTML = `
      Room ${room}<br/>
      Camera: Room ${room}
    `;
  }

  // =========================
  // SAFE GET ROOM
  // =========================
  function getRoom(index) {
    return scene.rooms?.[index] || null;
  }

  // =========================
  // CAMERA FOCUS
  // =========================
  function focusRoom(index) {
    const room = getRoom(index);

    if (!room) {
      console.warn("❌ ROOM NOT FOUND:", index);
      return;
    }

    scene.currentRoomIndex = index;

    const cam = scene.activeCamera;
    const pos = room.position;

    cam.setTarget(new BABYLON.Vector3(pos.x, 1, 0));

    updateCameraInfo();

    console.log("🎯 FOCUS ROOM:", index);
  }

  // =========================
  // ROOM INDICATOR
  // =========================
  function updateRoomIndicator() {
    const el = document.getElementById("roomIndicator");
    if (!el) return;

    el.innerText = "Room: " + (scene.currentRoomIndex + 1);
  }

  // =========================
  // ADD ROOM
  // =========================
  function addRoom() {
    if (!scene.createRoomInstance) {
      console.warn("❌ CREATE ROOM NOT READY");
      return;
    }

    const newRoom = scene.createRoomInstance();

    if (!newRoom) {
      console.warn("⏳ TEMPLATE NOT READY (BLOCKED)");
      return;
    }

    const index = scene.rooms.length - 1;

    focusRoom(index);
    updateRoomIndicator();

    console.log("➕ ROOM ADDED | INDEX:", index);
  }

  // =========================
  // UI INIT
  // =========================
  function initUI() {
    createCameraInfoUI();

    scene.onTemplateReady = () => {
      addRoom();
      updateCameraInfo();
      console.log("✅ TEMPLATE READY → FIRST ROOM CREATED");
    };

    const btnAddRoom = document.getElementById("btnAddRoom");
    if (btnAddRoom) {
      btnAddRoom.onclick = addRoom;
    }

    const btnTable = document.getElementById("btnAddTable");
    if (btnTable) {
      btnTable.onclick = () => {
        const room = getRoom(scene.currentRoomIndex);
        if (!room) return;

        addTable(scene);

        console.log("🪑 TABLE ADD | ROOM:", scene.currentRoomIndex);
      };
    }

    const btnPing = document.getElementById("btnPing");
    if (btnPing) {
      btnPing.onclick = testAllConnections;
    }

    const btnClear = document.getElementById("btnClearLog");
    if (btnClear) {
      btnClear.onclick = () => {
        const log = document.getElementById("logBox");
        if (log) {
          log.innerHTML = "";
        }
      };
    }

    const btnSave = document.getElementById("btnSave");
    if (btnSave) {
      btnSave.onclick = () => {
        saveConfiguration();
        updateTopologyHUD();
      };
    }

    const btnDelete = document.getElementById("btnDelete");
    if (btnDelete) {
      btnDelete.onclick = () => {
        deleteDevice(scene);
        updateTopologyHUD();
      };
    }

    const prev = document.getElementById("prevRoom");
    const next = document.getElementById("nextRoom");

    if (prev) {
      prev.onclick = () => {
        if (scene.currentRoomIndex > 0) {
          focusRoom(scene.currentRoomIndex - 1);
          updateRoomIndicator();
        }
      };
    }

    if (next) {
      next.onclick = () => {
        if (scene.currentRoomIndex < scene.rooms.length - 1) {
          focusRoom(scene.currentRoomIndex + 1);
          updateRoomIndicator();
        }
      };
    }

    setTimeout(() => {
      updateTopologyHUD();
    }, 500);

    console.log("🚀 UI INITIALIZED");
  }

  // =========================
  // RENDER LOOP
  // =========================
  engine.runRenderLoop(() => {
    scene.render();
  });

  const handleResize = () => {
    engine.resize();
  };

  window.addEventListener("resize", handleResize);

  initUI();

  // =========================
  // CLEANUP FOR REACT
  // =========================
  return {
    engine,
    scene,
    destroy() {
      window.removeEventListener("resize", handleResize);

      const cameraInfo = document.getElementById("cameraInfo");
      if (cameraInfo) {
        cameraInfo.remove();
      }

      scene.dispose();
      engine.dispose();

      console.log("🧹 TOPOLOGY CLEANED");
    }
  };
}