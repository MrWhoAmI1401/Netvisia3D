export function loadModel(scene, path, fileName, options = {}) {

  const { asTemplate = false } = options;

  BABYLON.SceneLoader.ImportMesh(
    "",
    path,
    fileName,
    scene,
    function (meshes) {

      // =========================
      // 🔥 TEMPLATE MODE (KEEP)
      // =========================
      if (asTemplate) {
        const root = new BABYLON.TransformNode(fileName + "_TEMPLATE", scene);

        meshes.forEach(mesh => {
          if (!mesh.getVerticesData) return;

          mesh.setParent(root, true); // 🔥 preserve transform
          mesh.setEnabled(false);
          mesh.isVisible = false;
        });

        root.setEnabled(false);

        scene.assetTemplates = scene.assetTemplates || {};
        scene.assetTemplates[fileName] = root;

        console.log("📦 TEMPLATE READY:", fileName);
        return;
      }

      // =========================
      // 🔥 NORMAL MODE
      // =========================
      meshes.forEach(mesh => {

        if (!mesh.getVerticesData) return;

        const name = mesh.name.toLowerCase();

        // 🔥 penting biar konsisten semua mesh bisa di-hover
        mesh.isPickable = true;

        console.log("🔍 Mesh:", name, "| from:", fileName);

        // =========================
        // 🟡 SPAWN TABLE (TRIGGER ONLY)
        // =========================
        if (fileName === "table_spawn.glb") {

          mesh.metadata = {
            type: "spawn"
          };

          // 🔥 optional: biar enak di-highlight (jadi satu kesatuan)
          mesh.getChildMeshes().forEach(child => {
            child.isPickable = true;
          });

          console.log("🟡 SPAWN TABLE READY");
        }

        // =========================
        // 🔴 SERVER TABLE (STATIC SLOT)
        // =========================
        if (fileName === "table_server.glb") {

          // 🔥 ROTASI 90° (FIX BUG LO)
          mesh.rotation.y = Math.PI / 2;

          mesh.metadata = {
            type: "slot",
            slot: "server_static"
          };

          // 🔥 kasih sedikit offset slot biar snap enak
          const slot = BABYLON.MeshBuilder.CreateBox(
            "slot_server_static",
            { size: 0.6 },
            scene
          );

          slot.parent = mesh;
          slot.position.y = 0.7;
          slot.isVisible = false;

          slot.metadata = {
            type: "slot",
            slot: "server_static"
          };

          console.log("🔴 SERVER SLOT READY");
        }

        // =========================
        // 🪑 DYNAMIC TABLE (LEGACY SUPPORT)
        // =========================
        if (fileName === "table.glb") {

          mesh.metadata = {
            type: "table",
            isDynamic: true
          };

          // ⚠️ IMPORTANT:
          // slot creation DIHAPUS dari sini
          // karena sekarang slot di-handle oleh tableManager
          // biar ga double slot & bug numpuk

          console.log("🪑 DYNAMIC TABLE READY (NO AUTO SLOT)");
        }

        // =========================
        // 🔥 DEFAULT OBJECT
        // =========================
        if (!mesh.metadata?.type) {
          mesh.isPickable = true;
        }

      });

      console.log("✅ Loaded:", fileName);
    }
  );
}