import { registerGate, jsPlumbInstance } from "./main.js";
import { setPosition } from "./main.js";
import {
  computeAnd,
  computeOr,
  computeXor,
  computeXnor,
  computeNand,
  computeNor,
  validateAlu,
} from "./validator.js";
import { getOutputMux, mux } from "./mux.js";
import { fullAdder } from "./fa.js";
("use strict");
export let gates = {}; // Dictionary of gates with their IDs as keys
window.numComponents = 0;
export function clearGates() {
  for (let gateId in gates) {
    delete gates[gateId];
  }

  gates = {};
}

export class Gate {
  constructor(type) {
    this.type = type;
    this.id = type + "-" + window.numComponents++; // Unique ID
    this.positionX = 0;
    this.positionY = 0;
    this.isConnected = false;
    this.inputPoints = [];
    this.outputPoints = [];
    this.inputs = []; // List of input gates

    this.outputs = [];
    this.output = null; // Output value
    this.isInput = false;
    this.isOutput = false;
    this.name = null;
  }
  // Sets the id of the gate
  setId(id) {
    this.id = id;
  }
  // Adds input to the gate
  addInput(gate, pos) {
    this.inputs.push([gate, pos]);
  }

  addOutput(gate) {
    this.outputs.push(gate);
  }

  // Removes input from the gate
  removeInput(gate) {
    for (let i = this.inputs.length - 1; i >= 0; i--) {
      if (this.inputs[i][0] === gate) {
        this.inputs.splice(i, 1);
      }
    }
  }

  removeOutput(gate) {
    // Find and remove all occurrences of gate
    for (let i = this.outputs.length - 1; i >= 0; i--) {
      if (this.outputs[i] === gate) {
        this.outputs.splice(i, 1);
      }
    }
  }
  updatePosition(id) {
    this.positionY =
      window.scrollY + document.getElementById(id).getBoundingClientRect().top; // Y

    this.positionX =
      window.scrollX + document.getElementById(id).getBoundingClientRect().left; // X
  }
  setName(name) {
    this.name = name;
  }
  // generate component for the gate
  generateComponent() {
    let component = "";

    switch (this.type) {
      case "Input":
        component = `<div class="high" id= ${this.id} ><a ondblclick="setInput(event)">1</a><p> ${this.name}  </p></div>`;
        this.output = true;
        this.isInput = true;
        break;
      case "Output":
        component = `<div class="output" id= ${this.id}><a></a><p>  ${this.name}  </p></div>`;
        this.isOutput = true;
        break;
      default:
        component = `<div class="drag-drop logic-gate ${this.type.toLowerCase()}" id= ${
          this.id
        }></div>`;
    }
    return component;
  }

  // Adds element to the circuit board, adds event listeners and generates its endpoints.
  registerComponent(workingArea, x = 0, y = 0) {
    // get width of working area
    const width = document.getElementById(workingArea).offsetWidth;
    const height = document.getElementById(workingArea).offsetHeight;
    let scale = 900;
    let yScale = 800;
    x = (x / scale) * width;
    y = (y / yScale) * height;

    const el = document.getElementById(this.id);
    if (!el) {
      console.error(`Element with id ${this.id} not found in DOM`);
      return;
    }
    el.style.left = x + "px";
    el.style.top = y + "px";

    if (this.type !== "Input" && this.type !== "Output") {
      el.addEventListener(
        "contextmenu",
        function (ev) {
          ev.preventDefault();
          const origin = {
            left: ev.pageX - document.getScroll()[0],
            top: ev.pageY - document.getScroll()[1],
          };
          setPosition(origin);
          window.selectedComponent = this.id;
          window.componentType = "gate";
          return false;
        },
        false
      );
    }
    gates[this.id] = this;
    registerGate(this.id, this);

    this.updatePosition(this.id);
  }

  // adds input endpoints points to the list of input points
  addInputPoints(input) {
    this.inputPoints.push(input);
  }

  // adds output endpoints points to the list of output points
  addOutputPoints(output) {
    this.outputPoints.push(output);
  }

  // Generates the output of the gate
  generateOutput() {
    // Ensure inputs array exists and has the required elements
    if (!this.inputs) {
      this.inputs = [];
    }

    switch (this.type) {
      case "AND":
        if (this.inputs.length >= 2) {
          this.output = computeAnd(
            getOutputMux(this.inputs[0]),
            getOutputMux(this.inputs[1])
          );
        }
        break;
      case "OR":
        if (this.inputs.length >= 2) {
          this.output = computeOr(
            getOutputMux(this.inputs[0]),
            getOutputMux(this.inputs[1])
          );
        }
        break;
      case "NOT":
        if (this.inputs.length >= 1) {
          this.output = !getOutputMux(this.inputs[0]);
        }
        break;
      case "NAND":
        if (this.inputs.length >= 2) {
          this.output = computeNand(
            getOutputMux(this.inputs[0]),
            getOutputMux(this.inputs[1])
          );
        }
        break;
      case "NOR":
        if (this.inputs.length >= 2) {
          this.output = computeNor(
            getOutputMux(this.inputs[0]),
            getOutputMux(this.inputs[1])
          );
        }
        break;
      case "XOR":
        if (this.inputs.length >= 2) {
          this.output = computeXor(
            getOutputMux(this.inputs[0]),
            getOutputMux(this.inputs[1])
          );
        }
        break;
      case "XNOR":
        if (this.inputs.length >= 2) {
          this.output = computeXnor(
            getOutputMux(this.inputs[0]),
            getOutputMux(this.inputs[1])
          );
        }
        break;
      case "Output":
        if (this.inputs.length >= 1) {
          this.output = getOutputMux(this.inputs[0]);
        }
        break;
    }
  }

  setOutput(val) {
    this.output = val;
  }
  setConnected(val) {
    this.isConnected = val;
  }
}

// Adds gate to the circuit board
function addGate(event) {
  const type = event.target.innerHTML.toUpperCase().trim();
  const gate = new Gate(type);
  const component = gate.generateComponent();
  const parent = document.getElementById("working-area");
  parent.insertAdjacentHTML("beforeend", component);

  // Use requestAnimationFrame to ensure DOM is updated before registering
  requestAnimationFrame(() => {
    gate.registerComponent("working-area");
  });
}

window.addGate = addGate;
// Set the Input values of the input bits on double click
function setInput(event) {
  let parentElement = event.target.parentElement;
  let element = event.target;
  let type = parentElement.className.split(" ")[0];
  let gate = gates[parentElement.id];
  if (type === "high") {
    // change class high to low
    parentElement.classList.replace("high", "low");
    element.innerHTML = "0";
    gate.setOutput(false);
  } else if (type === "low") {
    parentElement.classList.replace("low", "high");
    element.innerHTML = "1";
    gate.setOutput(true);
  }
}

window.setInput = setInput;

// function to submit the desired circuit and get the final success or failure message
export function submitCircuit() {
  clearResult();
  document.getElementById("table-body").innerHTML = "";

  if (window.currentTab === "task1") {
    validateAlu(
      "Input-0",
      "Input-1",
      "Input-2",
      "Input-3",
      "Input-4",
      "Output-5",
      "Output-6"
    );
  }

  // Refresh the input bit values to default 1 and output bit values to default empty black circles after submitting
  for (let gateId in gates) {
    const gate = gates[gateId];
    if (gate.isInput) {
      gate.setOutput(true);
      let element = document.getElementById(gate.id);
      element.className = "high";
      element.childNodes[0].innerHTML = "1";
    }
    if (gate.isOutput) {
      gate.setOutput(null);
      let element = document.getElementById(gate.id);
      element.className = "output";
      element.childNodes[0].innerHTML = "";
    }
  }
}
window.submitCircuit = submitCircuit;

// Delete the selected gate
export function deleteElement(gateid) {
  const gate = gates[gateid];
  jsPlumbInstance.removeAllEndpoints(document.getElementById(gate.id));
  jsPlumbInstance._removeElement(document.getElementById(gate.id));
  for (let elem in gates) {
    gates[elem].removeInput(gate);
    if (gates[elem].outputs.includes(gate)) {
      gates[elem].removeOutput(gate);
    }
  }
  for (let key in mux) {
    if (mux[key].i0[0] === gate) {
      mux[key].i0 = null;
    }
    if (mux[key].i1[0] === gate) {
      mux[key].i1 = null;
    }
    if (mux[key].i2[0] === gate) {
      mux[key].i2 = null;
    }
    if (mux[key].i3[0] === gate) {
      mux[key].i3 = null;
    }
    if (mux[key].s0[0] === gate) {
      mux[key].s0 = null;
    }
    if (mux[key].s1[0] === gate) {
      mux[key].s1 = null;
    }

    if (mux[key].outputs.includes(gate)) {
      mux[key].removeOutput(gate);
    }
  }
  for (let key in fullAdder) {
    if (fullAdder[key].a0[0] === gate) {
      fullAdder[key].a0 = null;
    }
    if (fullAdder[key].b0[0] === gate) {
      fullAdder[key].b0 = null;
    }
    if (fullAdder[key].cin[0] === gate) {
      fullAdder[key].cin = null;
    }
    if (fullAdder[key].outCout.includes(gate)) {
      fullAdder[key].removeoutCout(gate);
    }
    if (fullAdder[key].outSum.includes(gate)) {
      fullAdder[key].removeoutSum(gate);
    }
  }
  delete gates[gateid];
}

export function clearResult() {
  // clear result
  const result = document.getElementById("result");
  result.innerHTML = "";

  // clear table-body
  const table_elem = document.getElementById("table-body");
  table_elem.innerHTML = "";

  // clear table-head
  const table_elem_head = document.getElementById("table-head");
  table_elem_head.innerHTML = "";
}

export function printErrors(message, objectId) {
  const result = document.getElementById("result");
  result.innerHTML += message;
  result.className = "failure-message";
  if (objectId !== null) {
    objectId.classList.add("highlight");
    setTimeout(function () {
      objectId.classList.remove("highlight");
    }, 5000);
  }
}

// Check if the connections are correct
export function checkConnections() {
  for (let gateId in gates) {
    const gate = gates[gateId];
    const id = document.getElementById(gate.id);
    if (gate.inputPoints.length != gate.inputs.length) {
      printErrors("Highlighted component not connected properly\n", id);
      return false;
    } else if (
      (gate.isConnected === false || gate.outputs.length === 0) &&
      gate.isOutput === false
    ) {
      printErrors("Highlighted component not connected properly\n", id);
      return false;
    }
  }
  return true;
}

// Recursive function to generate the output of the circuit
export function getResult(gate) {
  if (!gate || gate.output != null) {
    return;
  }

  // Ensure inputs array exists
  if (!gate.inputs) {
    gate.inputs = [];
  }

  for (let i = 0; i < gate.inputs.length; i++) {
    if (gate.inputs[i] && gate.inputs[i].output == null) {
      getResult(gate.inputs[i]);
    }
  }

  // Ensure generateOutput method exists
  if (typeof gate.generateOutput === "function") {
    gate.generateOutput();
  }
  return;
}

// Simulate the circuit
export function simulate() {
  clearResult();
  if (!checkConnections()) {
    return;
  }

  // reset output in gate
  for (let gateId in gates) {
    if (!gates[gateId].isInput) {
      gates[gateId].output = null;
    }
  }

  for (let gateId in gates) {
    const gate = gates[gateId];
    if (gate && gate.isOutput) {
      getResult(gate);
      let element = document.getElementById(gate.id);
      if (element) {
        if (gate.output) {
          element.className = "high";
          element.childNodes[0].innerHTML = "1";
        } else {
          element.className = "low";
          element.childNodes[0].innerHTML = "0";
        }
      }
    }
  }

  // Displays message confirming Simulation completion
  let message = "Simulation has finished";
  const result = document.getElementById("result");
  result.innerHTML += message;
  result.className = "success-message";
  setTimeout(clearResult, 2000);
}

window.simulate = simulate;

// Simulate the circuit for given gates; Used for testing the circuit for all possible inputs
export function testSimulation(gates) {
  if (!checkConnections()) {
    document.getElementById("table-body").innerHTML = "";
    return false;
  }

  // reset output in gate
  for (let gateId in gates) {
    if (!gates[gateId].isInput) {
      gates[gateId].output = null;
    }
  }

  for (let gateId in gates) {
    const gate = gates[gateId];
    if (gate.isOutput) {
      getResult(gate);
    }
  }
  return true;
}
