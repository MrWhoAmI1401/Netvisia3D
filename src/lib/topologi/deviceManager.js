import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import { updateTopologyHUD } from "./ui/topologyHUD.js";

export const devices = [];

const deviceCounter = {
  pc: 0,
  router: 0,
  server: 0
};

const devicePortLimit = {
  pc: 1,
  router: 4,
  server: 8
};

const deviceConfig = {
  pc: {
    scale: 1,
    spawnOffset: { x: 0, y: 2.5, z: 0 },
    slotOffset: { x: 0, y: 2.5, z: 0 }
  },
  router: {
    scale: 1,
    spawnOffset: { x: 0, y: 2.18, z: 0 },
    slotOffset: { x: 0, y: 2.09, z: 0 }
  },
  server: {
    scale: 1,
    spawnOffset: { x: 0, y: 1.9, z: 0 },
    slotOffset: { x: 0, y: 1.8, z: 0 }
  }
};

function getDeviceConfig(type) {
  return deviceConfig[type] || deviceConfig.pc;
}

// =========================
// ATTACH
// =========================
function attachDeviceToRoom(scene, device, roomId) {
  const room = scene.roomList[roomId];
  if (!room) return;

  const world = device.getAbsolutePosition().clone();

  device.setParent(room);

  device.position = BABYLON.Vector3.TransformCoordinates(
    world,
    BABYLON.Matrix.Invert(room.getWorldMatrix())
  );

  device.computeWorldMatrix(true);
}

// =========================
// METADATA SAFE
// =========================
function ensureMetadata(device) {
  device.metadata = device.metadata || {};
  device.metadata.connections = device.metadata.connections || [];
}

// =========================
// SLOT POSITION
// =========================
export function applySlotPosition(device, slotMesh, roomId = 0, scene) {
  if (device.metadata?.roomId !== roomId) {
    console.warn("❌ DEVICE PINDAH ROOM DIBATALKAN");
    return;
  }

  const room = scene.roomList[roomId];
  if (!room) return;

  const bounds = slotMesh.getHierarchyBoundingVectors();
  const center = bounds.min.add(bounds.max).scale(0.5);

  const local = BABYLON.Vector3.TransformCoordinates(
    center,
    BABYLON.Matrix.Invert(room.getWorldMatrix())
  );

  const offset = device.metadata?.slotOffset || {
    x: 0,
    y: 0,
    z: 0
  };

  const BASE_HEIGHT = 0.5;
  const height = device.metadata?.heightOffset ?? 0.05;

  device.setParent(room);

  device.position = new BABYLON.Vector3(
    local.x + offset.x,
    BASE_HEIGHT + height + offset.y,
    local.z + offset.z
  );

  device.rotation = BABYLON.Vector3.Zero();

  device.computeWorldMatrix(true);

  updateTopologyHUD();
}

// =========================
// RELEASE SLOT
// =========================
export function releaseDeviceFromSlot(scene, device) {
  if (!device || !scene?.roomSlotUsage) return;

  for (let r in scene.roomSlotUsage) {
    for (let s in scene.roomSlotUsage[r]) {
      if (scene.roomSlotUsage[r][s] === device) {
        scene.roomSlotUsage[r][s] = null;
      }
    }
  }

  device.metadata.currentSlot = null;
}

// =========================
// ASSIGN SLOT
// =========================
export function assignDeviceToSlot(scene, device, slotName, roomId = 0) {
  if (device.metadata?.roomId !== roomId) {
    console.warn("❌ DEVICE BEDA ROOM - DROP DITOLAK");
    return false;
  }

  if (!scene.roomSlotUsage) return false;

  if (!scene.roomSlotUsage[roomId]) {
    scene.roomSlotUsage[roomId] = {};
  }

  const roomSlots = scene.roomSlotUsage[roomId];

  if (!(slotName in roomSlots)) {
    roomSlots[slotName] = null;
  }

  const current = roomSlots[slotName];

  if (current && current !== device) {
    console.warn("❌ SLOT TERISI");
    return false;
  }

  releaseDeviceFromSlot(scene, device);

  roomSlots[slotName] = device;

  device.metadata.currentSlot = slotName;

  let tableMesh = null;

  scene.meshes.forEach((mesh) => {
    if (mesh.name === slotName) {
      tableMesh = mesh;
    }
  });

  if (tableMesh) {
    applySlotPosition(device, tableMesh, roomId, scene);
  }

  updateTopologyHUD();
  return true;
}

// =========================
// CREATE ROOT
// =========================
function createDeviceRoot(scene, meshes, type, config) {
  const root = new BABYLON.TransformNode(type + "_root", scene);

  meshes.forEach((mesh) => {
    if (!mesh.getVerticesData) return;

    mesh.setParent(root, true);
    mesh.isPickable = true;
  });

  root.scaling = new BABYLON.Vector3(
    config.scale,
    config.scale,
    config.scale
  );

  const bounds = root.getHierarchyBoundingVectors();
  const center = bounds.min.add(bounds.max).scale(0.5);

  root.getChildMeshes().forEach((mesh) => {
    mesh.position.subtractInPlace(center);
  });

  root.computeWorldMatrix(true);

  return root;
}

// =========================
// SPAWN POSITION
// =========================
function applySpawnPosition(root, config, scene) {
  const roomId = scene.activeRoomId ?? scene.currentRoomIndex ?? 0;

  const room = scene.roomList[roomId];
  if (!room) return;

  let spawnNode = null;

  room.getChildTransformNodes().forEach((node) => {
    if (node.metadata?.type === "spawn") {
      spawnNode = node;
    }
  });

  const BASE_HEIGHT = 0.5;

  if (!spawnNode) {
    root.position = new BABYLON.Vector3(0, BASE_HEIGHT, 0);
    attachDeviceToRoom(scene, root, roomId);
  } else {
    const bounds = spawnNode.getHierarchyBoundingVectors();
    const center = bounds.min.add(bounds.max).scale(0.5);

    const local = BABYLON.Vector3.TransformCoordinates(
      center,
      BABYLON.Matrix.Invert(room.getWorldMatrix())
    );

    root.setParent(room);

    root.position = new BABYLON.Vector3(
      local.x + config.spawnOffset.x,
      BASE_HEIGHT + config.spawnOffset.y,
      local.z + config.spawnOffset.z
    );
  }

  root.rotation = BABYLON.Vector3.Zero();

  root.metadata.roomId = roomId;
  root.metadata.roomKey = roomId;

  root.computeWorldMatrix(true);
}

// =========================
// CREATE METADATA
// =========================
function createMetadata(type, config) {
  deviceCounter[type]++;

  const number = String(deviceCounter[type]).padStart(2, "0");

  return {
    id: Date.now() + "_" + Math.random(),
    type,
    label: `${type}_${number}`,
    ip: "",
    connections: [],
    maxConnections: devicePortLimit[type] || 1,
    currentSlot: null,
    slotOffset: config.slotOffset,
    heightOffset: 0.05,
    roomId: 0,
    roomKey: 0
  };
}

// =========================
// SPAWN DEVICE
// =========================
export function spawnDeviceManual(scene, type) {
  let fileName = "";

  if (type === "router") fileName = "router.glb";
  if (type === "pc") fileName = "pc.glb";
  if (type === "server") fileName = "server.glb";

  const config = getDeviceConfig(type);

  const lockedRoom = scene.activeRoomId ?? scene.currentRoomIndex ?? 0;

  BABYLON.SceneLoader.ImportMesh(
    "",
    "/models/",
    fileName,
    scene,
    function (meshes) {
      const root = createDeviceRoot(scene, meshes, type, config);

      root.metadata = createMetadata(type, config);

      ensureMetadata(root);

      scene.activeRoomId = lockedRoom;

      applySpawnPosition(root, config, scene);

      devices.push(root);

      console.log(
        "🔥 SPAWN:",
        root.metadata.label,
        "| ROOM:",
        root.metadata.roomKey
      );

      updateTopologyHUD();
    }
  );
}

// =========================
// HELPERS
// =========================
export function getDeviceById(id) {
  return devices.find((device) => device.metadata.id === id);
}

export function isPortFull(device) {
  return (
    device.metadata.connections.length >=
    device.metadata.maxConnections
  );
}

export function getAvailablePort(device) {
  return (
    device.metadata.maxConnections -
    device.metadata.connections.length
  );
}

// =========================
// CLEAR
// =========================
export function clearAllDevices(scene) {
  devices.forEach((device) => device.dispose());
  devices.length = 0;
  updateTopologyHUD();
}