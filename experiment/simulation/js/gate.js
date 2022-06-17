import { registerGate, jsPlumbInstance } from "./main.js";
import { setPosition } from "./layout.js";
import {
    computeAnd,
    computeOr,
    computeXor,
    computeXnor,
    computeNand,
    computeNor
} from "./validator.js";
import { getOutputMux } from "./mux.js";
'use strict';
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

    // Removes input from the gate
    removeInput(gate) {
        let index = this.inputs.indexOf(gate);
        if (index > -1) {
            this.inputs.splice(index, 1);
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
                component = `<div class="drag-drop logic-gate ${this.type.toLowerCase()}" id= ${this.id
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
        el.style.left = x + "px";
        el.style.top = y + "px";

        if (this.type != "Input" && this.type != "Output") {

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
        switch (this.type) {
            case "AND":
                this.output = computeAnd(getOutputMux(this.inputs[0]), getOutputMux(this.inputs[1]));
                break;
            case "OR":
                console.log(getOutputMux(this.inputs[0]));
                console.log(getOutputMux(this.inputs[1]));
                this.output = computeOr(getOutputMux(this.inputs[0]), getOutputMux(this.inputs[1]));
                break;
            case "NOT":
                this.output = !getOutputMux(this.inputs[0]);
                break;
            case "NAND":
                this.output = computeNand(getOutputMux(this.inputs[0]), getOutputMux(this.inputs[1]));
                break;
            case "NOR":
                this.output = computeNor(getOutputMux(this.inputs[0]), getOutputMux(this.inputs[1]));
                break;
            case "XOR":
                this.output = computeXor(getOutputMux(this.inputs[0]), getOutputMux(this.inputs[1]));
                break;
            case "XNOR":
                this.output = computeXnor(getOutputMux(this.inputs[0]), getOutputMux(this.inputs[1]));
                break;
            case "Output":
                this.output = getOutputMux(this.inputs[0]);
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
    const type = event.target.innerHTML.toUpperCase();
    const gate = new Gate(type);
    const component = gate.generateComponent();
    const parent = document.getElementById("working-area");
    parent.insertAdjacentHTML("beforeend", component);
    gate.registerComponent("working-area");
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


// // Simulate the circuit for given gates; Used for testing the circuit for all possible inputss
// export function testSimulation(gates) {
//     if (!checkConnections()) {
//         return;
//     }

//     // reset output in gate
//     for (let gateId in gates) {
//         if (!gates[gateId].isInput) {
//             gates[gateId].output = null;
//         }
//     }

//     for (let gateId in gates) {
//         const gate = gates[gateId];
//         if (gate.isOutput) {
//             getResult(gate);
//         }
//     }
// }

// function to submit the desired circuit and get the final success or failure message
export function submitCircuit() {
    document.getElementById("table-body").innerHTML = "";
    // if (window.currentTab === "task1") {
    //     halfAdder("Input-0", "Input-1", "Output-3", "Output-2");
    // } else if (window.currentTab === "task2") {
    //     fullAdderTest("Input-0", "Input-1", "Input-2", "Output-4", "Output-3");
    // } else if (window.currentTab === "task3") {
    //     rippleAdderTest(
    //         "Input-0",
    //         "Input-1",
    //         "Input-3",
    //         "Input-4",
    //         "Input-6",
    //         "Input-7",
    //         "Input-9",
    //         "Input-10",
    //         "Input-13",
    //         "Output-12",
    //         "Output-2",
    //         "Output-5",
    //         "Output-8",
    //         "Output-11"
    //     );
    // }
}
window.submitCircuit = submitCircuit;

// Delete the selected gate
export function deleteElement(gateid) {
    let gate = gates[gateid];
    jsPlumbInstance.removeAllEndpoints(document.getElementById(gate.id));
    jsPlumbInstance._removeElement(document.getElementById(gate.id));
    for (let elem in gates) {
        if (gates[elem].inputs.includes(gate)) {
            gates[elem].removeInput(gate);
        }
    }
    delete gates[gateid];
}
