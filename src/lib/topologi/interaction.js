import * as BABYLON from "@babylonjs/core";
import { showSpawnMenu, hideSpawnMenu } from "./ui/menu.js";
import { showDeviceMenu, hideDeviceMenu } from "./ui/deviceMenu.js";
import { assignDeviceToSlot } from "./deviceManager.js";

export function setupInteraction(scene) {
  const hl = new BABYLON.HighlightLayer("hl", scene);

  let currentMesh = null;

  const state = {
    placementMode: false,
    selectedDevice: null
  };

  scene.isPlacing = false;

  const deviceNames = ["pc_root", "router_root", "server_root"];

  let lastClickTime = 0;
  const DOUBLE_CLICK_DELAY = 300;

  scene.roomSlotUsage = scene.roomSlotUsage || {};

  // =========================
  // ROOT RESOLVER
  // =========================
  function resolveRoot(mesh, type) {
    let p = mesh;

    while (p) {
      if (p.metadata?.type === type) return p;

      if (p.name?.toLowerCase().includes(type)) return p;

      p = p.parent;
    }

    return null;
  }

  // =========================
  // HIGHLIGHT ROOT
  // =========================
  function highlightRoot(mesh, color) {
    if (!mesh) return;

    const meshes = mesh.getChildMeshes(false);

    if (meshes.length === 0 && mesh.getVerticesData) {
      hl.addMesh(mesh, color);
      return;
    }

    meshes.forEach((m) => {
      if (m.isVisible && m.material) {
        hl.addMesh(m, color);
      }
    });
  }

  // =========================
  // ROOM HELPERS
  // =========================
  function getRoomRoot(mesh) {
    let p = mesh;

    while (p) {
      if (p.metadata?.roomId !== undefined) return p;
      if (scene.roomList.includes(p)) return p;
      p = p.parent;
    }

    return null;
  }

  function getRoomId(mesh) {
    const room = getRoomRoot(mesh);

    if (!room) {
      return scene.currentRoomIndex || 0;
    }

    return room.metadata?.roomId ?? scene.roomList.indexOf(room);
  }

  // =========================
  // DEVICE ROOT
  // =========================
  function getDeviceRoot(mesh) {
    let root = mesh;

    while (root.parent) {
      if (deviceNames.includes(root.name)) break;
      root = root.parent;
    }

    return root;
  }

  function ensureRoomSlot(roomId) {
    if (!scene.roomSlotUsage[roomId]) {
      scene.roomSlotUsage[roomId] = {};
    }

    return scene.roomSlotUsage[roomId];
  }

  // =========================
  // SNAP TO TABLE
  // =========================
  function snapToTable(device, table) {
    const roomId = getRoomId(table);

    if (device.metadata?.roomId !== roomId) return;

    const room = scene.roomList[roomId];
    if (!room) return;

    const bounds = table.getHierarchyBoundingVectors();
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

    const height = device.metadata?.heightOffset || 0.05;
    const BASE_HEIGHT = 0.5;

    device.setParent(room);

    device.position = new BABYLON.Vector3(
      local.x + offset.x,
      BASE_HEIGHT + height + offset.y,
      local.z + offset.z
    );

    device.rotation = BABYLON.Vector3.Zero();
    device.computeWorldMatrix(true);
  }

  // =========================
  // HIGHLIGHT TABLES
  // =========================
  function highlightTables(roomId) {
    hl.removeAllMeshes();

    const room = scene.roomList[roomId];
    if (!room) return;

    room.getChildTransformNodes().forEach((node) => {
      if (node.metadata?.type === "table") {
        highlightRoot(node, BABYLON.Color3.Green());
      }
    });
  }

  // =========================
  // EXIT PLACEMENT
  // =========================
  function exitPlacement() {
    state.placementMode = false;
    state.selectedDevice = null;
    scene.isPlacing = false;
    hl.removeAllMeshes();
  }

  // =========================
  // POINTER EVENTS
  // =========================
  scene.onPointerObservable.add((pointerInfo) => {
    const pick = scene.pick(scene.pointerX, scene.pointerY);

    let target = null;
    let type = null;

    if (pick.hit && pick.pickedMesh) {
      const mesh = pick.pickedMesh;
      const device = getDeviceRoot(mesh);

      if (deviceNames.includes(device.name) && device.metadata) {
        target = device;
        type = "device";
      } else {
        const spawn = resolveRoot(mesh, "spawn");
        const table = resolveRoot(mesh, "table");

        if (spawn) {
          target = spawn;
          type = "spawn";
        } else if (table) {
          target = table;
          type = "table";
        }
      }
    }

    // =========================
    // HOVER
    // =========================
    if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
      if (scene.isPlacing) return;

      if (target !== currentMesh) {
        hl.removeAllMeshes();
        currentMesh = target;

        if (currentMesh) {
          const roomId = getRoomId(currentMesh);

          if (roomId !== scene.currentRoomIndex) return;

          if (type === "device") {
            highlightRoot(currentMesh, BABYLON.Color3.White());
          } else if (type === "spawn") {
            highlightRoot(currentMesh, new BABYLON.Color3(1, 0.8, 0.2));
          }
        }
      }
    }

    // =========================
    // CLICK
    // =========================
    if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
      const now = Date.now();

      const roomId = scene.currentRoomIndex;
      const roomSlots = ensureRoomSlot(roomId);

      if (type === "spawn") {
        scene.activeRoomId = roomId;

        showSpawnMenu(
          pointerInfo.event.clientX,
          pointerInfo.event.clientY,
          scene
        );

        return;
      }

      if (
        type === "device" &&
        now - lastClickTime < DOUBLE_CLICK_DELAY
      ) {
        showDeviceMenu(
          pointerInfo.event.clientX,
          pointerInfo.event.clientY,
          target
        );

        lastClickTime = 0;
        return;
      }

      lastClickTime = now;

      if (type === "device") {
        if (target.metadata?.roomId !== roomId) return;

        state.placementMode = true;
        state.selectedDevice = target;
        scene.isPlacing = true;

        highlightTables(roomId);

        hideSpawnMenu();
        hideDeviceMenu();

        return;
      }

      if (state.placementMode && type === "table") {
        const key = target.name;

        if (!(key in roomSlots)) {
          roomSlots[key] = null;
        }

        if (
          roomSlots[key] &&
          roomSlots[key] !== state.selectedDevice
        ) {
          exitPlacement();
          return;
        }

        assignDeviceToSlot(
          scene,
          state.selectedDevice,
          key,
          roomId
        );

        snapToTable(state.selectedDevice, target);

        setTimeout(() => {
          exitPlacement();
        }, 50);

        return;
      }

      if (state.placementMode && !target) {
        exitPlacement();
      }

      hideSpawnMenu();
      hideDeviceMenu();
    }
  });

  // =========================
  // KEYBOARD
  // =========================
  const handleKeydown = (e) => {
    if (e.key === "Escape") {
      exitPlacement();
    }
  };

  window.addEventListener("keydown", handleKeydown);

  // cleanup hook
  scene._interactionCleanup = () => {
    window.removeEventListener("keydown", handleKeydown);
    hl.dispose();
  };
}