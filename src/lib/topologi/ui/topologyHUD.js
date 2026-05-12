import { devices } from "../deviceManager.js";

let dragInitialized = false;
let lastTopologySignature = "";
let topologyScale = 1;

export function updateTopologyHUD() {
  const svg = document.getElementById("topologySVG");
  const wrapper = document.getElementById("topologyWrapper");
  const inner = document.getElementById("topologyInner");

  if (!svg || !wrapper || !inner) return;

  initTopologyControls(wrapper, inner);

  const width = 1400;
  const height = 1000;

  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = "";

  const centerX = width / 2;

  if (devices.length === 0) {
    const text = createText(width / 2, height / 2, "No Devices");
    text.setAttribute("fill", "#666");
    svg.appendChild(text);
    return;
  }

  // =========================
  // BUILD GRAPH
  // =========================
  const visited = new Set();
  const graphs = [];

  devices.forEach((device) => {
    if (visited.has(device.metadata.id)) return;

    const group = [];
    const queue = [device];

    while (queue.length > 0) {
      const current = queue.shift();

      if (visited.has(current.metadata.id)) continue;

      visited.add(current.metadata.id);
      group.push(current);

      const neighbors = (current.metadata.connections || [])
        .map((id) =>
          devices.find((item) => item.metadata.id === id)
        )
        .filter(Boolean);

      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor.metadata.id)) {
          queue.push(neighbor);
        }
      });
    }

    graphs.push(group);
  });

  // =========================
  // POSITIONING
  // =========================
  const positions = [];
  const graphSpacing = height / graphs.length;

  graphs.forEach((group, gIndex) => {
    const baseY = 120 + gIndex * graphSpacing;

    const root =
      group.find((device) => device.metadata.type === "router") ||
      group[0];

    const levelMap = new Map();
    const queue = [{ device: root, level: 0 }];

    levelMap.set(root.metadata.id, 0);

    while (queue.length > 0) {
      const { device, level } = queue.shift();

      (device.metadata.connections || []).forEach((id) => {
        const target = group.find(
          (item) => item.metadata.id === id
        );

        if (!target) return;

        if (!levelMap.has(target.metadata.id)) {
          levelMap.set(target.metadata.id, level + 1);
          queue.push({
            device: target,
            level: level + 1
          });
        }
      });
    }

    const levelGroups = {};

    group.forEach((device) => {
      const level = levelMap.get(device.metadata.id) ?? 0;

      if (!levelGroups[level]) {
        levelGroups[level] = [];
      }

      levelGroups[level].push(device);
    });

    const levelSpacing = 140;
    const nodeSpacing = 220;

    Object.keys(levelGroups).forEach((level) => {
      const nodes = levelGroups[level];
      const y = baseY + Number(level) * levelSpacing;

      nodes.forEach((device, index) => {
        const x =
          centerX +
          (index - (nodes.length - 1) / 2) * nodeSpacing;

        positions.push({ device, x, y });
      });
    });
  });

  // =========================
  // CONNECTIONS
  // =========================
  const drawn = new Set();

  positions.forEach(({ device, x, y }) => {
    const connections = device.metadata.connections || [];

    connections.forEach((targetId) => {
      const key = [device.metadata.id, targetId]
        .sort()
        .join("-");

      if (drawn.has(key)) return;

      const target = positions.find(
        (position) => position.device.metadata.id === targetId
      );

      if (!target) return;

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      line.setAttribute("x1", x);
      line.setAttribute("y1", y);
      line.setAttribute("x2", target.x);
      line.setAttribute("y2", target.y);
      line.setAttribute("stroke", "#00ff88");
      line.setAttribute("stroke-width", "2");

      svg.appendChild(line);
      drawn.add(key);
    });
  });

  // =========================
  // NODES
  // =========================
  positions.forEach(({ device, x, y }) => {
    const label = device.metadata.label || "unknown";
    const ip = device.metadata.ip || "no-ip";
    const room = device.metadata.roomId ?? 0;

    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", "16");

    let color = "#4fc3f7";

    if (device.metadata.type === "router") color = "#ffca28";
    if (device.metadata.type === "server") color = "#ef5350";

    circle.setAttribute("fill", color);
    svg.appendChild(circle);

    const nameText = createText(
      x,
      y + 30,
      `${label} (R${room + 1})`
    );

    nameText.setAttribute("fill", "#fff");
    nameText.setAttribute("font-size", "14");

    const ipText = createText(x, y + 50, ip);
    ipText.setAttribute("fill", "#888");
    ipText.setAttribute("font-size", "12");

    svg.appendChild(nameText);
    svg.appendChild(ipText);
  });

  // =========================
  // AUTO CENTER
  // =========================
  const topologySignature = JSON.stringify(
    devices.map((device) => ({
      id: device.metadata.id,
      c: device.metadata.connections?.length || 0
    }))
  );

  if (
    topologySignature !== lastTopologySignature &&
    positions.length > 0
  ) {
    lastTopologySignature = topologySignature;

    const rootNode =
      positions.find(
        (position) => position.device.metadata.type === "router"
      ) || positions[0];

    requestAnimationFrame(() => {
      wrapper.scrollLeft =
        rootNode.x * topologyScale - wrapper.clientWidth / 2;

      wrapper.scrollTop =
        rootNode.y * topologyScale - wrapper.clientHeight / 2;
    });
  }
}

function initTopologyControls(wrapper, inner) {
  if (dragInitialized) return;
  dragInitialized = true;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startScrollLeft = 0;
  let startScrollTop = 0;

  wrapper.addEventListener("wheel", (e) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;

    topologyScale += delta;
    topologyScale = Math.max(0.6, Math.min(2.5, topologyScale));

    inner.style.transform = `scale(${topologyScale})`;
    inner.style.transformOrigin = "top left";
  });

  wrapper.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;

    isDragging = true;
    wrapper.style.cursor = "grabbing";

    startX = e.clientX;
    startY = e.clientY;
    startScrollLeft = wrapper.scrollLeft;
    startScrollTop = wrapper.scrollTop;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    wrapper.style.cursor = "grab";
  });

  wrapper.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    e.preventDefault();

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    wrapper.scrollLeft = startScrollLeft - dx;
    wrapper.scrollTop = startScrollTop - dy;
  });
}

function createText(x, y, text) {
  const el = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );

  el.setAttribute("x", x);
  el.setAttribute("y", y);
  el.setAttribute("text-anchor", "middle");
  el.textContent = text;

  return el;
}