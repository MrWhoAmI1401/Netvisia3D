import { updateTopologyHUD } from "./ui/topologyHUD.js";

// legacy tetap ada (biar sistem lain ga rusak)
export const roomTables = {};

const MAX_TABLE = 8; // future use

// =========================
// PRESERVE TRANSFORM
// =========================
function attachFix(mesh, parent) {
  mesh.setParent(parent, true);
  mesh.computeWorldMatrix(true);
}

// =========================
// GET ACTIVE ROOM
// =========================
function getActiveRoom(scene) {
  const room = scene.roomList[scene.currentRoomIndex];

  if (!room) {
    console.warn("❌ ROOM INVALID:", scene.currentRoomIndex);
    return null;
  }

  return room;
}

// =========================
// INIT ROOM STATE
// =========================
function ensureRoomState(room) {
  if (!room._state) {
    room._state = {
      tables: [],
      slots: {}
    };
  }
}

// =========================
// CLEAN DATA
// =========================
function sanitize(room) {
  if (!room._state) return;

  room._state.tables = room._state.tables.filter(
    (table) => table && !table.isDisposed()
  );
}

// =========================
// SYNC LEGACY
// =========================
function syncLegacy(room) {
  const key = room.uniqueId;

  roomTables[key] = (room._state?.tables || []).slice();
}

// =========================
// ADD TABLE
// =========================
export function addTable(scene) {
  console.warn("🚫 ADD TABLE DISABLED (STABLE MODE)");

  const room = getActiveRoom(scene);

  if (room) {
    ensureRoomState(room);
    sanitize(room);
    syncLegacy(room);
  }

  if (typeof updateTopologyHUD === "function") {
    updateTopologyHUD();
  }

  return false;
}