import { contextBridge } from "electron";

// Expose protected methods that allow the renderer process to use
// Node.js features without giving it full access
contextBridge.exposeInMainWorld("electron", {
  // You can add secure IPC communication methods here if needed
});
