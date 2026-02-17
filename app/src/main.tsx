import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("Main starting...");
try {
    const root = document.getElementById("root");
    console.log("Root element:", root);
    if (!root) throw new Error("Root element not found");

    createRoot(root).render(<App />);
    console.log("Render called");
} catch (e) {
    console.error("Error in main:", e);
}
