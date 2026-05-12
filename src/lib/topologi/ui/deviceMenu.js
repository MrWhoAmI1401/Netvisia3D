import { devices } from "../deviceManager.js";
import { updateTopologyHUD } from "./topologyHUD.js";

let currentDevice = null;

// =========================
// HELPERS
// =========================
function getRoomNumber(device) {
  const roomId = Number(device?.metadata?.roomId);
  return Number.isFinite(roomId) ? roomId + 1 : 1;
}

function ensureMetadata(device) {
  if (!device) return;

  device.metadata = device.metadata || {};
  device.metadata.connections = device.metadata.connections || [];
  device.metadata.maxConnections = device.metadata.maxConnections || 1;
  device.metadata.label = device.metadata.label || "unknown";
  device.metadata.roomId = Number.isFinite(Number(device.metadata.roomId))
    ? Number(device.metadata.roomId)
    : 0;
}

// =========================
// SHOW MENU
// =========================
export function showDeviceMenu(x, y, mesh) {
  const menu = document.getElementById("deviceMenu");
  const inputIP = document.getElementById("ipInput");
  const inputName = document.getElementById("deviceNameInput");
  const select = document.getElementById("connectTo");
  const nameText = document.getElementById("deviceName");
  const btnSaveIP = document.getElementById("btnSaveIP");

  if (!menu || !inputIP || !inputName || !select || !nameText) {
    return;
  }

  currentDevice = mesh;
  ensureMetadata(currentDevice);

  menu.style.display = "block";
  menu.style.left = x + "px";
  menu.style.top = y + "px";

  const label = currentDevice.metadata.label;

  inputName.value = label;

  nameText.innerText = `${label}`;

  // =========================
  // AUTO SAVE NAME
  // =========================
  inputName.oninput = () => {
    const name = inputName.value.trim();

    if (!name) return;

    const isDuplicate = devices.some(
      (device) =>
        device !== currentDevice &&
        (device.metadata?.label || "").toLowerCase() === name.toLowerCase()
    );

    if (isDuplicate) {
      setStatus("❌ Nama sudah dipakai", "red");
      addLog("error", `Duplicate name (${name})`);
      return;
    }

    currentDevice.metadata.label = name;

    nameText.innerText = `Device: ${name} | Slot: ${
      currentDevice.metadata.currentSlot || "-"
    } | Room: ${getRoomNumber(currentDevice)}`;

    setStatus("✅ Nama tersimpan", "lime");
    addLog("success", `Rename → ${name}`);

    updateDropdown();
    updateTopologyHUD();
  };

  // =========================
  // LOAD IP
  // =========================
  inputIP.value = currentDevice.metadata.ip || "";

  // =========================
  // SAVE IP
  // =========================
  if (btnSaveIP) {
    btnSaveIP.onclick = () => {
      if (!currentDevice) return;

      const ip = inputIP.value.trim();

      if (!ip) {
        setStatus("❌ IP kosong", "red");
        addLog("error", "IP kosong");
        return;
      }

      const isValidIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);

      if (!isValidIP) {
        setStatus("❌ Format IP salah", "red");
        addLog("error", `Invalid IP (${ip})`);
        return;
      }

      const duplicate = devices.find(
        (device) =>
          device !== currentDevice &&
          device.metadata?.ip === ip
      );

      if (duplicate) {
        setStatus("❌ IP sudah dipakai", "red");
        addLog("error", `Duplicate IP (${ip})`);
        return;
      }

      currentDevice.metadata.ip = ip;
      currentDevice.metadata.isConfigured = true;

      setStatus("✅ IP tersimpan", "lime");
      addLog("success", `IP saved → ${ip}`);

      updateTopologyHUD();
    };
  }

  updateDropdown();
  setStatus("", "white");
}

// =========================
// DROPDOWN
// =========================
function updateDropdown() {
  const select = document.getElementById("connectTo");

  if (!select) return;

  select.innerHTML = "";

  const availableDevices = devices.filter(
    (device) => device !== currentDevice
  );

  if (availableDevices.length === 0) {
    const option = document.createElement("option");
    option.textContent = "Tidak ada device tersedia";
    option.disabled = true;
    select.appendChild(option);
    return;
  }

  availableDevices.forEach((device) => {
    ensureMetadata(device);

    const option = document.createElement("option");
    const used = device.metadata.connections.length;
    const max = device.metadata.maxConnections;
    const room = getRoomNumber(device);

    option.value = device.metadata.id;
    option.textContent =
      `${device.metadata.label} [Room ${room}] (${used}/${max})`;

    select.appendChild(option);
  });
}

// =========================
// DISCONNECT
// =========================
function disconnectDevice(device) {
  if (!device) return;

  const connections = device.metadata.connections || [];

  connections.forEach((targetId) => {
    const target = devices.find(
      (device) => device.metadata.id === targetId
    );

    if (target) {
      target.metadata.connections =
        target.metadata.connections.filter(
          (id) => id !== device.metadata.id
        );
    }
  });

  device.metadata.connections = [];
  device.metadata.connectedTo = null;

  addLog("warning", `🔌 Disconnected (${device.metadata.label})`);
}

// =========================
// SAVE CONFIG
// =========================
export function saveConfiguration() {
  if (!currentDevice) return;

  const select = document.getElementById("connectTo");
  if (!select) return;

  const targetId = select.value;
  const name = currentDevice.metadata.label;

  if (!currentDevice.metadata.ip) {
    setStatus(`❌ Simpan IP dulu (${name})`, "red");
    addLog("error", `IP belum diisi (${name})`);
    return;
  }

  const targetDevice = devices.find(
    (device) => device.metadata.id === targetId
  );

  if (!targetDevice) {
    setStatus("❌ Target tidak valid", "red");
    return;
  }

  if (targetDevice === currentDevice) {
    setStatus("❌ Tidak bisa connect ke diri sendiri", "red");
    return;
  }

  if (!targetDevice.metadata.ip) {
    setStatus("❌ Target belum punya IP", "red");
    return;
  }

  if (targetDevice.metadata.ip === currentDevice.metadata.ip) {
    setStatus("❌ IP sama tidak boleh connect", "red");
    return;
  }

  if (currentDevice.metadata.connections.length > 0) {
    disconnectDevice(currentDevice);
  }

  if (
    targetDevice.metadata.connections.length >=
    targetDevice.metadata.maxConnections
  ) {
    setStatus(`❌ Port penuh (${targetDevice.metadata.label})`, "red");
    return;
  }

  if (
    currentDevice.metadata.connections.includes(
      targetDevice.metadata.id
    )
  ) {
    setStatus("⚠ Sudah terhubung", "orange");
    return;
  }

  currentDevice.metadata.connections.push(targetDevice.metadata.id);
  targetDevice.metadata.connections.push(currentDevice.metadata.id);
  currentDevice.metadata.connectedTo = targetDevice.metadata.id;

  setStatus("✅ Connected", "lime");
  addLog("success", `${name} → ${targetDevice.metadata.label}`);

  updateDropdown();
  updateTopologyHUD();
}

// =========================
// TEST NETWORK
// =========================
export function testAllConnections() {
  if (devices.length < 2) {
    addLog("warning", "Device kurang");
    return;
  }

  addLog("warning", "=== TEST START ===");

  devices.forEach((source) => {
    devices.forEach((target) => {
      if (source === target) return;

      if (!source.metadata.ip || !target.metadata.ip) {
        addLog("warning", "IP belum lengkap");
        return;
      }

      const success = simulatePing(source, target);

      if (success) {
        addLog(
          "success",
          `${source.metadata.label} → ${target.metadata.label}`
        );
      } else {
        addLog("error", `Fail: ${source.metadata.label}`);
      }
    });
  });

  addLog("warning", "=== TEST END ===");
}

// =========================
// BFS
// =========================
function simulatePing(source, target) {
  const visited = new Set();
  const queue = [source];

  while (queue.length > 0) {
    const current = queue.shift();

    if (current === target) return true;

    visited.add(current);

    const neighbors = current.metadata.connections
      .map((id) => devices.find((device) => device.metadata.id === id))
      .filter(Boolean);

    neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    });
  }

  return false;
}

// =========================
// DELETE
// =========================
export function deleteDevice(scene) {
  if (!currentDevice) return;

  const name = currentDevice.metadata.label;

  devices.forEach((device) => {
    device.metadata.connections =
      (device.metadata.connections || []).filter(
        (id) => id !== currentDevice.metadata.id
      );
  });

  if (scene?.roomSlotUsage) {
    Object.keys(scene.roomSlotUsage).forEach((roomId) => {
      Object.keys(scene.roomSlotUsage[roomId]).forEach((slotKey) => {
        if (scene.roomSlotUsage[roomId][slotKey] === currentDevice) {
          scene.roomSlotUsage[roomId][slotKey] = null;
        }
      });
    });
  }

  const index = devices.indexOf(currentDevice);

  if (index !== -1) {
    devices.splice(index, 1);
  }

  currentDevice.dispose();

  addLog("warning", `Deleted (${name})`);

  currentDevice = null;

  updateTopologyHUD();
  hideDeviceMenu();
}

// =========================
// STATUS
// =========================
function setStatus(text, color) {
  const el = document.getElementById("statusText");
  if (!el) return;

  el.innerText = text;
  el.style.color = color;
}

// =========================
// LOG
// =========================
function addLog(type, message) {
  const logBox = document.getElementById("logBox");

  if (!logBox) return;

  const line = document.createElement("div");
  line.className = `log-${type}`;
  line.textContent = message;

  logBox.appendChild(line);
  logBox.scrollTop = logBox.scrollHeight;
}

// =========================
// HIDE MENU
// =========================
export function hideDeviceMenu() {
  const menu = document.getElementById("deviceMenu");
  if (menu) {
    menu.style.display = "none";
  }
}