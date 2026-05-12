import { spawnDeviceManual } from "../deviceManager.js";

// =========================
// SHOW SPAWN MENU
// =========================
export function showSpawnMenu(x, y, scene) {
  const menu = document.getElementById("spawnMenu");
  if (!menu) return;

  // =========================
  // SAFE POSITION
  // =========================
  const padding = 10;
  const menuWidth = 160;
  const menuHeight = 140;

  let posX = x;
  let posY = y;

  if (posX + menuWidth > window.innerWidth) {
    posX = window.innerWidth - menuWidth - padding;
  }

  if (posY + menuHeight > window.innerHeight) {
    posY = window.innerHeight - menuHeight - padding;
  }

  if (posX < padding) posX = padding;
  if (posY < padding) posY = padding;

  menu.style.display = "block";
  menu.style.left = posX + "px";
  menu.style.top = posY + "px";

  // =========================
  // STOP PROPAGATION
  // =========================
  menu.onpointerdown = (e) => e.stopPropagation();
  menu.onclick = (e) => e.stopPropagation();

  // =========================
  // ROOM SYNC
  // =========================
  const activeRoom = scene.currentRoomIndex ?? 0;

  scene.activeRoomId = activeRoom;
  scene.currentRoomIndex = activeRoom;

  // =========================
  // BUTTONS
  // =========================
  const btnPC = document.getElementById("btnPC");
  const btnRouter = document.getElementById("btnRouter");
  const btnServer = document.getElementById("btnServer");

  if (!btnPC || !btnRouter || !btnServer) return;

  // reset handlers
  btnPC.onclick = null;
  btnRouter.onclick = null;
  btnServer.onclick = null;

  btnPC.onclick = (e) => {
    e.stopPropagation();

    scene.currentRoomIndex = activeRoom;
    scene.activeRoomId = activeRoom;

    spawnDeviceManual(scene, "pc");
    hideSpawnMenu();
  };

  btnRouter.onclick = (e) => {
    e.stopPropagation();

    scene.currentRoomIndex = activeRoom;
    scene.activeRoomId = activeRoom;

    spawnDeviceManual(scene, "router");
    hideSpawnMenu();
  };

  btnServer.onclick = (e) => {
    e.stopPropagation();

    scene.currentRoomIndex = activeRoom;
    scene.activeRoomId = activeRoom;

    spawnDeviceManual(scene, "server");
    hideSpawnMenu();
  };

  console.log("📦 Spawn menu opened | Room:", activeRoom);
}

// =========================
// HIDE SPAWN MENU
// =========================
export function hideSpawnMenu() {
  const menu = document.getElementById("spawnMenu");
  if (!menu) return;

  if (menu.style.display !== "block") return;

  menu.style.display = "none";
}