import * as gatejs from "./gate.js";
import * as fajs from "./fa.js";
import * as muxjs from "./mux.js";
import { wireColours } from "./layout.js";
import { deleteFA } from "./fa.js";
import { deleteElement } from "./gate.js";
import { deleteMux } from "./mux.js";
("use strict");

let num_wires = 0;

// Gets the coordinates of the mouse
document.getScroll = function () {
  if (window.scrollY !== undefined) {
    return [scrollX, scrollY];
  } else {
    let sx,
      sy,
      d = document,
      r = d.documentElement,
      b = d.body;
    sx = r.scrollLeft || b.scrollLeft || 0;
    sy = r.scrollTop || b.scrollTop || 0;
    return [sx, sy];
  }
};
const workingArea = document.getElementById("working-area");

// Creating a js Plumb Instance
export const jsPlumbInstance = jsPlumbBrowserUI.newInstance({
  container: workingArea,
  maxConnections: -1,
  endpoint: {
    type: "Dot",
    options: { radius: 5 },
  },
  dragOptions: {
    containment: "parentEnclosed",
    containmentPadding: 5,
  },
  connector: "Flowchart",
  paintStyle: { strokeWidth: 4, stroke: "#888888" },
  connectionsDetachable: false,
  containment: true,
});

// Add connection hover events for deletion
jsPlumbInstance.bind("connection", function (info) {
  const connection = info.connection;
  const connectorElement = connection.connector.canvas;

  if (connectorElement) {
    // Add hover class on mouse enter
    connectorElement.addEventListener("mouseenter", function () {
      connectorElement.classList.add("jtk-hover");
    });

    // Remove hover class on mouse leave
    connectorElement.addEventListener("mouseleave", function () {
      connectorElement.classList.remove("jtk-hover");
    });
  }
});

// Returns the component (gate, input/output bit, full adder or multiplexer) with the given id
function findComponent(id) {
  return gatejs.gates[id] || fajs.fullAdder[id] || muxjs.mux[id] || null;
}

// Returns the id of the label overlay of an endpoint (the pin name); it is empty for gates and input/output bits
function pinLabel(endpoint) {
  const keys = Object.keys(endpoint.overlays || {});
  return keys.length > 0 ? keys[0] : "";
}

// Tells which output of a component a wire starts from: "Sum" or "Carry" for a full adder, "output" for a multiplexer
function outputPos(component, endpoint) {
  if (component instanceof fajs.FullAdder) {
    return pinLabel(endpoint).includes("sum") ? "Sum" : "Carry";
  }
  if (component instanceof muxjs.Mux) {
    return "output";
  }
  return "";
}

// Returns the output endpoint and the input endpoint of a wire, whichever way it was drawn
function splitEndpoints(epA, epB) {
  return epA.uuid.startsWith("output") ? [epA, epB] : [epB, epA];
}

// Records a new wire in the circuit model. It works the same for every pair of components and for both directions
// in which a wire can be dragged (from an output point to an input point or the other way round).
function linkEndpoints(fromEndpoint, toEndpoint) {
  const [outEp, inEp] = splitEndpoints(fromEndpoint, toEndpoint);
  const driver = findComponent(outEp.elementId);
  const sink = findComponent(inEp.elementId);
  if (!driver || !sink) {
    return;
  }
  const pos = outputPos(driver, outEp);

  // the component that drives the wire
  if (driver instanceof fajs.FullAdder) {
    if (pos === "Sum") {
      driver.addSum(sink);
    } else {
      driver.addCout(sink);
    }
    driver.setConnected(true, pos);
  } else if (driver instanceof muxjs.Mux) {
    driver.addOutput(sink);
    driver.setConnected(true, pos);
  } else {
    driver.addOutput(sink);
    driver.setConnected(true);
  }

  // the component that receives the wire
  const pin = pinLabel(inEp);
  if (sink instanceof fajs.FullAdder) {
    if (pin.includes("a0")) {
      sink.setA0([driver, pos]);
    } else if (pin.includes("b0")) {
      sink.setB0([driver, pos]);
    } else if (pin.includes("cin")) {
      sink.setCin([driver, pos]);
    }
  } else if (sink instanceof muxjs.Mux) {
    const setters = {
      i0: "setI0",
      i1: "setI1",
      i2: "setI2",
      i3: "setI3",
      s0: "setS0",
      s1: "setS1",
    };
    if (setters[pin]) {
      sink[setters[pin]]([driver, pos]);
    }
  } else {
    sink.addInput(driver, pos);
  }
}

// Removes a single occurrence of item from list
function removeOne(list, item) {
  const index = list.indexOf(item);
  if (index !== -1) {
    list.splice(index, 1);
  }
}

// Removes a deleted wire from the circuit model
function unlinkEndpoints(connection, epA, epB) {
  if (!epA || !epB || !epA.uuid || !epB.uuid) {
    return;
  }
  const [outEp, inEp] = splitEndpoints(epA, epB);
  if (!outEp.uuid.startsWith("output") || !inEp.uuid.startsWith("input")) {
    return;
  }
  const driver = findComponent(outEp.elementId);
  const sink = findComponent(inEp.elementId);
  if (!driver || !sink) {
    return;
  }
  const pos = outputPos(driver, outEp);
  // the driver stays connected only if it has another wire
  const lastWire = outEp.connections.filter((c) => c !== connection).length === 0;

  if (driver instanceof fajs.FullAdder) {
    removeOne(pos === "Sum" ? driver.outSum : driver.outCout, sink);
    if (lastWire) {
      driver.setConnected(false, pos);
    }
  } else {
    removeOne(driver.outputs, sink);
    if (lastWire) {
      driver.setConnected(false, pos);
    }
  }

  const pin = pinLabel(inEp);
  if (sink instanceof fajs.FullAdder) {
    if (pin.includes("a0")) {
      sink.setA0([]);
    } else if (pin.includes("b0")) {
      sink.setB0([]);
    } else if (pin.includes("cin")) {
      sink.setCin([]);
    }
  } else if (sink instanceof muxjs.Mux) {
    const setters = {
      i0: "setI0",
      i1: "setI1",
      i2: "setI2",
      i3: "setI3",
      s0: "setS0",
      s1: "setS1",
    };
    if (setters[pin]) {
      sink[setters[pin]]([]);
    }
  } else {
    const index = sink.inputs.findIndex((pair) => pair[0] === driver && pair[1] === pos);
    if (index !== -1) {
      sink.inputs.splice(index, 1);
    }
  }
}

// Keep the circuit model in sync when a wire is deleted
jsPlumbInstance.bind("connection:detach", function (info) {
  unlinkEndpoints(info.connection, info.sourceEndpoint, info.targetEndpoint);
});

// This is an event listener for establishing connections between all the components used in this experiment
export const connectMux = function () {
  jsPlumbInstance.bind("beforeDrop", function (data) {
    const fromEndpoint = data.connection.endpoints[0];
    const toEndpoint = data.dropEndpoint;

    const start_uuid = fromEndpoint.uuid.split(":")[0];
    const end_uuid = toEndpoint.uuid.split(":")[0];

    if (fromEndpoint.elementId === toEndpoint.elementId) {
      return false;
    }

    if (start_uuid === "input" && end_uuid === "input") {
      return false;
    } else if (start_uuid === "output" && end_uuid === "output") {
      return false;
    } else if (
      (end_uuid === "input" && toEndpoint.connections.length > 0) ||
      (start_uuid === "input" && fromEndpoint.connections.length > 1)
    ) {
      // If it already has a connection, do not establish a new connection
      return false;
    } else {
      jsPlumbInstance.connect({
        uuids: [fromEndpoint.uuid, toEndpoint.uuid],
        paintStyle: { stroke: wireColours[num_wires], strokeWidth: 4 },
      });
      num_wires++;
      num_wires = num_wires % wireColours.length;
      linkEndpoints(fromEndpoint, toEndpoint);
    }
  });
};

// Unbinds the event listeners
export const unbindEvent = () => {
  jsPlumbInstance.unbind("beforeDrop");
};

// Generates the endpoints for the respective gate with the help of JsPlumb
export function registerGate(id, gate) {
  const element = document.getElementById(id);
  const gateType = id.split("-")[0];

  if (
    gateType === "AND" ||
    gateType === "OR" ||
    gateType === "XOR" ||
    gateType === "XNOR" ||
    gateType === "NAND" ||
    gateType === "NOR"
  ) {
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, -9],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 10],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:1:" + id,
      })
    );
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
      })
    );
  } else if (gateType === "NOT") {
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
      })
    );
  } else if (gateType === "Input") {
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
      })
    );
  } else if (gateType === "Output") {
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
  } else if (gateType === "FullAdder") {
    // carry output
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "Cout", id: "cout", location: [3, 0.2] },
          },
        ],
      })
    );
    // sum output
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0.5, 1, 0, 1, 0, 7],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:1:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "Sum", id: "sum", location: [0.3, -1.7] },
          },
        ],
      })
    );
    // input A0
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0.5, 0, 0, -1, -25, -7],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "A0", id: "a0", location: [0.3, 1.7] },
          },
        ],
      })
    );
    // input B0
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0.5, 0, 0, -1, 25, -7],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:1:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "B0", id: "b0", location: [0.3, 1.7] },
          },
        ],
      })
    );
    // carry input
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:2:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "Cin", id: "cin", location: [-1, 0.2] },
          },
        ],
      })
    );
  } else if (gateType === "Mux") {
    // input s0
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0.5, 0, 0, -1, 25, -7],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:4:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "s0", id: "s0", location: [0.3, 1.7] },
          },
        ],
      })
    );
    // input s1
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0.5, 0, 0, -1, -15, -7],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:5:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "s1", id: "s1", location: [0.3, 1.7] },
          },
        ],
      })
    );
    // input i0
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, -40],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "i0", id: "i0", location: [2.2, 0.9] },
          },
        ],
      })
    );
    // input i1
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, -15],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:1:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "i1", id: "i1", location: [2.2, 0.9] },
          },
        ],
      })
    );
    // input i2
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 15],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:2:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "i2", id: "i2", location: [2.2, 0.9] },
          },
        ],
      })
    );
    // input i3
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 40],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:3:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "i3", id: "i3", location: [2.2, 0.9] },
          },
        ],
      })
    );
    // output
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 15],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "Output", id: "output", location: [-2.3, 0.2] },
          },
        ],
      })
    );
  }
}

export function initALU() {
  const ids = [
    "Input-0",
    "Input-1",
    "Input-2",
    "Input-3",
    "Input-4",
    "Output-5",
    "Output-6",
  ]; // [A,B,carry -input,Sum,carry-output]
  const types = [
    "Input",
    "Input",
    "Input",
    "Input",
    "Input",
    "Output",
    "Output",
  ];
  const names = ["A", "B", "cin", "S1", "S0", "Output", "cout"];
  const positions = [
    { x: 40, y: 150 },
    { x: 40, y: 375 },
    { x: 40, y: 600 },
    { x: 500, y: 100 },
    { x: 600, y: 100 },
    { x: 820, y: 262.5 },
    { x: 820, y: 50 },
  ];
  for (let i = 0; i < ids.length; i++) {
    let gate = new gatejs.Gate(types[i]);
    gate.setId(ids[i]);
    gate.setName(names[i]);
    const component = gate.generateComponent();
    const parent = document.getElementById("working-area");
    parent.insertAdjacentHTML("beforeend", component);
    gate.registerComponent("working-area", positions[i].x, positions[i].y);
  }
}

// Refresh the circuit board by removing all gates and components
export function refreshWorkingArea() {
  jsPlumbInstance.reset();
  window.numComponents = 0;

  gatejs.clearGates();
  fajs.clearFAs();
}

refresh.addEventListener("click", function (event) {
  jsPlumbInstance.reset();
  window.numComponents = 0;
  gatejs.clearGates();
  fajs.clearFAs();
  console.log(currentTab);
  if (window.currentTab == "task1") initALU();
});
const menu = document.querySelector(".menu");
const menuOption = document.querySelector(".menu-option");
let menuVisible = false;

console.log(menu);
console.log(menuOption);
console.log(menuVisible);

const toggleMenu = (command) => {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = command === "show";
};
console.log("toggle", toggleMenu);

export const setPosition = ({ top, left }) => {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  toggleMenu("show");
};
console.log("setPosition", setPosition);

window.addEventListener("click", () => {
  console.log("menu is ", menuVisible);
  if (menuVisible) toggleMenu("hide");
  window.selectedComponent = null;
  window.componentType = null;
});
document.addEventListener("contextmenu", function (event) {
  // Only show custom context menu for specific elements
  const target = event.target;
  const isComponent =
    target.closest(".drag-drop") ||
    target.closest(".logic-gate") ||
    target.closest(".high") ||
    target.closest(".low") ||
    target.closest(".output") ||
    target.closest(".fulladder") ||
    target.closest(".mux");
  const isConnection = target.closest(".jtk-connector");
  const isWorkingArea =
    target.closest("#working-area") && !isComponent && !isConnection;

  // Only prevent default context menu for our interactive elements
  if (isComponent || isConnection || isWorkingArea) {
    event.preventDefault(); // Prevent the default context menu from appearing
    menu.style.display = "block";
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;

    // Store the target element and check if it's a connection
    window.contextMenuTarget = event.target;
    window.isConnectionContext =
      event.target.closest(".jtk-connector") !== null;

    toggleMenu("show");
  }
  // If it's not one of our elements, let the browser handle the context menu normally
});

// Menu option click handler (moved outside to avoid multiple listeners)
menuOption.addEventListener("click", (e) => {
  if (e.target.innerHTML === "Delete") {
    if (window.componentType === "gate") {
      console.log("op1");
      deleteElement(window.selectedComponent);
    } else if (window.componentType === "fullAdder") {
      deleteFA(window.selectedComponent);
    } else if (window.componentType === "mux") {
      deleteMux(window.selectedComponent);
    } else {
      console.log("op2 - deleting wire connections");
      console.log(
        "Available JSPlumb methods:",
        Object.getOwnPropertyNames(jsPlumbInstance)
      );

      let connectionDeleted = false;

      // Try to delete connection that was right-clicked
      if (window.isConnectionContext && window.contextMenuTarget) {
        //console.log("Context menu target:", window.contextMenuTarget);
        const connectorElement =
          window.contextMenuTarget.closest(".jtk-connector");
        //console.log("Connector element found:", connectorElement);
        if (connectorElement) {
          console.log(
            "Connector element properties:",
            Object.keys(connectorElement)
          );
          //console.log("JSPlumb data:", connectorElement._jsPlumb);

          // Try to find the connection by its DOM element
          // JSPlumb stores connection info in the DOM element
          try {
            // Method 1: Try JSPlumb's select and check entries
            if (jsPlumbInstance.select) {
              // Get all connections and find the one with this canvas
              const allConnections = jsPlumbInstance.select();
              //console.log("All connections:", allConnections);

              // Use the entries array to find matching connection
              if (allConnections.entries && allConnections.entries.length > 0) {
                for (let i = 0; i < allConnections.entries.length; i++) {
                  const connection = allConnections.entries[i];
                  if (
                    connection.connector &&
                    connection.connector.canvas === connectorElement
                  ) {
                    console.log("Found matching connection, deleting...");
                    jsPlumbInstance.deleteConnection(connection);
                    connectionDeleted = true;
                    console.log(
                      "Deleting specific connection via JSPlumb deleteConnection"
                    );
                    break;
                  }
                }
              }
            }

            // Method 2: Use the connections property directly
            if (!connectionDeleted && jsPlumbInstance.connections) {
              for (let i = 0; i < jsPlumbInstance.connections.length; i++) {
                const connection = jsPlumbInstance.connections[i];
                if (
                  connection.connector &&
                  connection.connector.canvas === connectorElement
                ) {
                  console.log(
                    "Found matching connection via connections array, deleting..."
                  );
                  jsPlumbInstance.deleteConnection(connection);
                  connectionDeleted = true;
                  console.log(
                    "Deleting specific connection via connections array"
                  );
                  break;
                }
              }
            }

            // Method 3: Remove the DOM element directly (fallback)
            if (!connectionDeleted && connectorElement.parentNode) {
              connectorElement.parentNode.removeChild(connectorElement);
              connectionDeleted = true;
              console.log(
                "Deleting specific connection via DOM removal (fallback)"
              );
            }
          } catch (error) {
            console.log("Error deleting specific connection:", error);
          }
        }
      }

      // Fallback: delete hovered connections
      if (!connectionDeleted) {
        const elementsToDelete = document.querySelectorAll(
          ".jtk-connector.jtk-hover"
        );
        console.log("Elements found for deletion:", elementsToDelete);

        if (elementsToDelete.length > 0) {
          elementsToDelete.forEach(function (connectorElement) {
            try {
              // Method 1: Try JSPlumb's select and check entries
              if (jsPlumbInstance.select && !connectionDeleted) {
                const allConnections = jsPlumbInstance.select();
                if (
                  allConnections.entries &&
                  allConnections.entries.length > 0
                ) {
                  for (let i = 0; i < allConnections.entries.length; i++) {
                    const connection = allConnections.entries[i];
                    if (
                      connection.connector &&
                      connection.connector.canvas === connectorElement
                    ) {
                      jsPlumbInstance.deleteConnection(connection);
                      connectionDeleted = true;
                      console.log(
                        "Deleting hovered connection via JSPlumb deleteConnection"
                      );
                      break;
                    }
                  }
                }
              }

              // Method 2: Use the connections property directly
              if (!connectionDeleted && jsPlumbInstance.connections) {
                for (let i = 0; i < jsPlumbInstance.connections.length; i++) {
                  const connection = jsPlumbInstance.connections[i];
                  if (
                    connection.connector &&
                    connection.connector.canvas === connectorElement
                  ) {
                    jsPlumbInstance.deleteConnection(connection);
                    connectionDeleted = true;
                    console.log(
                      "Deleting hovered connection via connections array"
                    );
                    break;
                  }
                }
              }

              // Method 3: Fallback to DOM removal
              if (!connectionDeleted && connectorElement.parentNode) {
                connectorElement.parentNode.removeChild(connectorElement);
                console.log(
                  "Deleting hovered connection via DOM removal (fallback)"
                );
                connectionDeleted = true;
              }
            } catch (error) {
              console.log("Error deleting hovered connection:", error);
            }
          });
        }
      }

      if (!connectionDeleted) {
        console.log("No connections found to delete");
      }
    }
  }
  // Reset context variables
  window.contextMenuTarget = null;
  window.isConnectionContext = false;
  // window.selectedComponent = null;
  // window.componentType = null;
  toggleMenu("hide"); // Hide menu after selection
});

// Initialise Task 1 experiment when the page loads
window.currentTab = "task1";
window.simulate = muxjs.simulateMux;
connectMux();
refreshWorkingArea();
initALU();
