import { deleteFA } from "./fa.js";
import { deleteElement } from "./gate.js";
import {
  connectMux,
  unbindEvent,
  initALU,
  refreshWorkingArea,
} from "./main.js";
import { simulateMux,deleteMux } from "./mux.js";
"use strict";
// Wires Colours
export const wireColours = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#bf6be3",
  "#ff00ff",
  "#00ffff",
  "#ff8000",
  "#00ff80",
  "#80ff00",
  "#ff0080",
  "#8080ff",
  "#c0c0c0",
];

// Contextmenu
const menu = document.querySelector(".menu");
const menuOption = document.querySelector(".menu-option");
let menuVisible = false;
window.simulateMux = simulateMux;
const toggleMenu = (command) => {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = !menuVisible;
};

export const setPosition = ({ top, left }) => {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  toggleMenu("show");
};

window.addEventListener("click", (e) => {
  if (menuVisible) toggleMenu("hide");
  window.selectedComponent = null;
  window.componentType = null;
});

menuOption.addEventListener("click", (e) => {
  if (e.target.innerHTML === "Delete") {
    if (window.componentType === "gate") {
      deleteElement(window.selectedComponent);
    } else if (window.componentType === "fullAdder") {
      deleteFA(window.selectedComponent);
    } else if (window.componentType === "mux") {
      deleteMux(window.selectedComponent);
    }
  }
  window.selectedComponent = null;
  window.componentType = null;
});

// Tabs

function changeTabs(e) {
  const task = e.target.parentNode.id;
  if (window.currentTab === task) {
    return;
  }

  if (window.currentTab !== null) {
    document.getElementById(window.currentTab).classList.remove("is-active");
  }
  window.currentTab = task;
  document.getElementById(task).classList.add("is-active");

  if (task === "task1") {
    unbindEvent();
    connectMux();
    refreshWorkingArea();
    initALU();
    window.simulateMux = simulateMux;
  }
  
  updateInstructions();
  updateToolbar();
  clearObservations();
  resize();
}

window.changeTabs = changeTabs;

function updateInstructions() {
  if (window.currentTab === "task1") {
    document.getElementById("task-title").innerHTML = "Full Adder";
    document.getElementById("task-description").innerHTML = "Implement a 1-bit full adder using logic gates.";
  } 
}

// Toolbar

function updateToolbar() {
  let elem = "";
  if (window.currentTab === "task1") {
    elem =
      '<div class="component-button and" onclick="addGate(event)">AND</div><div class="component-button or" onclick="addGate(event)">OR</div><div class="component-button not" onclick="addGate(event)">NOT</div><div class="component-button nand" onclick="addGate(event)">NAND</div><div class="component-button nor" onclick="addGate(event)">NOR</div><div class="component-button xor" onclick="addGate(event)">XOR</div><div class="component-button xnor" onclick="addGate(event)">XNOR</div><div class="component-button fulladder" onclick="addFA(event)"></div><div class="component-button mux" onclick="addMux(event)"></div>';
  } 

  document.getElementById("toolbar").innerHTML = elem;
}

// Clear observations
function clearObservations() {
  document.getElementById("table-body").innerHTML = "";
  let head = "";

  if (window.currentTab === "task1") {
    head =
      '<tr><th colspan="5">Inputs</th><th colspan="2">Expected Values</th><th colspan="2">Observed Values</th></tr><tr><th>S1</th><th>S0</th><th>A</th><th>B</th><th>C</th><th>cout</th><th>Out</th><th>cout</th><th>Out</th></tr>';
  } 

  document.getElementById("table-head").innerHTML = head;
  document.getElementById("result").innerHTML = "";
}

// Instruction box
const instructionBox = document.getElementsByClassName("instructions-box")[0];
instructionBox.addEventListener("click", (e) => {
  instructionBox.classList.toggle("expand");
});


// Making webpage responsive

// Dimensions of working area
const circuitBoard = document.getElementById("circuit-board");
// Distance of working area from top
const circuitBoardTop = circuitBoard.offsetTop;
// Full height of window
const windowHeight = window.innerHeight;
const width = window.innerWidth;
if (width < 1024) {
  circuitBoard.style.height = "600px";
} else {
  circuitBoard.style.height = windowHeight - circuitBoardTop - 20 + "px";
}

function resize() {
  const circuitBoard = document.getElementById("circuit-board");
  const sidePanels = document.getElementsByClassName("v-datalist-container");

  if (width >= 1024) {
    for (let i = 0; i < sidePanels.length; i++) {
      sidePanels[i].style.height = circuitBoard.style.height;
    }
  }
}

resize();