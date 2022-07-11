import { registerGate, jsPlumbInstance } from "./main.js";
import { setPosition } from "./layout.js";
import {
    computeAnd,
    computeOr,
    computeXor,
    computeXnor,
    computeNand,
    computeNor,
    validateAlu
} from "./validator.js";
import { clearResult, getOutputMux, mux } from "./mux.js";
import { fullAdder } from "./fa.js";
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
        let index = -1;
        let i = 0;
        for (let input in this.inputs) {
            if (this.inputs[input][0] === gate) {
                index = i;
                break;
            }
            i++;
        }

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
        switch (this.type) {
            case "AND":
                this.output = computeAnd(getOutputMux(this.inputs[0]), getOutputMux(this.inputs[1]));
                break;
            case "OR":
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

// function to submit the desired circuit and get the final success or failure message
export function submitCircuit() {
    clearResult();
    document.getElementById("table-body").innerHTML = "";
    if (window.currentTab === "task1") {
        validateAlu("Input-0", "Input-1", "Input-2","Input-3","Input-4", "Output-5", "Output-6");
    }
}
window.submitCircuit = submitCircuit;

// Delete the selected gate
export function deleteElement(gateid) {
    const gate = gates[gateid];
    jsPlumbInstance.removeAllEndpoints(document.getElementById(gate.id));
    jsPlumbInstance._removeElement(document.getElementById(gate.id));
    for (let elem in gates) {
        if (gates[elem].inputs.includes(gate)) {
            gates[elem].removeInput(gate);
        }
    }
    for(let key in mux){
        if(mux[key].i0[0] === gate) {
            mux[key].i0 = null;
        }
        if(mux[key].i1[0] === gate) {
            mux[key].i1 = null;
        }
        if(mux[key].i2[0] === gate) {
            mux[key].i2 = null;
        }
        if(mux[key].i3[0] === gate) {
            mux[key].i3 = null;
        }
        if(mux[key].s0[0] === gate) {
            mux[key].s0 = null;
        }
        if(mux[key].s1[0] === gate) {
            mux[key].s1 = null;
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
    }
    delete gates[gateid];
}
