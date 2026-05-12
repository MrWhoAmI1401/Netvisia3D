import { useEffect } from "react";
import Layout from "@/components/Layout";
import "@/styles/topologi.css";

import "@babylonjs/core";
import "@babylonjs/loaders";

export default function SimulasiTopologi() {
  useEffect(() => {
    let appInstance: any = null;

    const initScene = async () => {
      const canvas = document.getElementById(
        "renderCanvas"
      ) as HTMLCanvasElement | null;

      if (!canvas) {
        console.error("❌ Canvas not found");
        return;
      }

      const { initTopologyApp } = await import(
        "@/lib/topologi/app.js"
      );

      appInstance = initTopologyApp(canvas);
    };

    initScene();

    return () => {
      if (appInstance?.destroy) {
        appInstance.destroy();
      }
    };
  }, []);

  return (
    <Layout>
      <div className="relative w-full h-screen bg-black overflow-hidden topology-page">
        {/* CANVAS */}
        <canvas id="renderCanvas"></canvas>

        {/* SPAWN MENU */}
        <div id="spawnMenu">
          <button id="btnPC">Add PC</button>
          <button id="btnRouter">Add Router</button>
          <button id="btnServer">Add Server</button>
        </div>

        {/* DEVICE MENU */}
        <div id="deviceMenu">
          <h4>Device Config</h4>
          <p id="deviceName">Device: -</p>

          <p>Device Name:</p>
          <input id="deviceNameInput" />

          <p>Connect To:</p>
          <select id="connectTo"></select>

          <p>IP Address:</p>
          <input
            id="ipInput"
            placeholder="192.168.1.X"
          />

          <button id="btnSaveIP">Save IP Address</button>
          <button id="btnSave">Save Configuration</button>
          <button id="btnDelete">Delete Device</button>

          <p id="statusText"></p>
        </div>

        {/* HUD */}
        <div id="hudContainer">
          {/* TOPOLOGY */}
          <div className="hud-box">
            <div id="roomIndicator">Room: 1</div>
            <div>🧠 Topology</div>

            <div id="topologyWrapper">
              <div id="topologyInner">
                <svg id="topologySVG"></svg>
              </div>
            </div>
          </div>

          {/* NETWORK LOG */}
          <div className="hud-box network-log-box">
            <div>📡 Network Log</div>

            <div id="logBox"></div>

            <div id="logActions">
              <button id="btnPing">Test</button>
              <button id="btnClearLog">Clear</button>
            </div>

            <button id="btnAddRoom">
              + Add Room
            </button>
          </div>
        </div>

        {/* CAMERA INFO */}
        <div id="cameraInfo">
          Room 1
          <br />
          Camera: Room 1
        </div>

        {/* ROOM NAV */}
        <div id="roomNav">
          <button id="prevRoom">◀</button>
          <button id="nextRoom">▶</button>
        </div>
      </div>
    </Layout>
  );
}