import { registerGate, jsPlumbInstance } from "./main.js";
import { setPosition } from "./layout.js";
import { gates } from "./gate.js";
import { fullAdder } from "./fa.js";

"use strict";
// Dictionary of all full adders in the circuit with their IDs as keys
export let mux = {};

export function clearMuxs() {
    for (let muxID in mux) {
        delete mux[muxID];
    }
    mux = {};
}

// {output-id: [gate,pos]}


export class Mux {
    constructor() {
        this.id = "Mux-" + window.numComponents++;
        this.i0 = []; // Takes 2 items in a list : Gate, Output endpoint of gate
        this.i1 = [];
        this.i2 = [];
        this.i3 = [];
        this.s0 = [];
        this.s1 = [];
        this.output = null;

        this.outputs=[]; // list of gates to which output of mux is connected

        this.inputPoints = [];
        this.outputPoints = [];
        this.outputIsConnected = false;
        this.component = `<div class="drag-drop mux" id= ${this.id} style="width:100px;height:100px;"></div>`;
    }

    // Adds element to the circuit board, adds event listeners and generates its endpoints.
    registerComponent(workingArea, x = 0, y = 0) {
        const parent = document.getElementById(workingArea);
        parent.insertAdjacentHTML("beforeend", this.component);
        const el = document.getElementById(this.id);

        el.style.left = x + "px";
        el.style.top = y + "px";

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
                window.componentType = "mux";
                return false;
            },
            false
        );

        mux[this.id] = this;
        registerGate(this.id, this);
    }

    // Sets values of the inputs and outputs of the full adder
    setI0(I0) {
        this.i0 = I0;
    }

    setI1(I1) {
        this.i1 = I1;
    }
    setI2(I2) {
        this.i2 = I2;
    }
    setI3(I3) {
        this.i3 = I3;
    }
    setS0(S0) {
        this.s0 = S0;
    }
    setS1(S1) {
        this.s1 = S1;
    }

    setOutput(output) {
        this.output = output;
    }

    addOutput(gate){
        this.outputs.push(gate);
    }

    // adds input endpoints points to the list of input points
    addInputPoints(input) {
        this.inputPoints.push(input);
    }

    // Adds the output endpoints to the list of output points
    addOutputPoints(output) {
        this.outputPoints.push(output);
    }

    removeOutput(gate)
    {
        // Find and remove all occurrences of gate
        for (let i = this.outputs.length - 1; i >= 0; i--) {
        if (this.outputs[i] === gate) {
        this.outputs.splice(i, 1);
            }
        }
    }

    // Generates the output of the full adder
    generateOutput() {
        // we know that for a full adder
        // sum = A xor B xor Cin
        // carry = AB or Cin(A xor B)

        const S0 = getOutputMux(this.s0);
        const S1 = getOutputMux(this.s1);
        if (!S0 && !S1) {
            this.output = getOutputMux(this.i0);
        }
        else if (S0 && !S1) {
            this.output = getOutputMux(this.i1);
        }
        else if (!S0 && S1) {
            this.output = getOutputMux(this.i2);
        }
        else if (S0 && S1) {
            this.output = getOutputMux(this.i3);
        }
    }

    // Sets the output enpoint of the full adder as connected
    setConnected(val, pos) {
        if (pos === "output") {
            this.outputIsConnected = val;
        }
    }
}

// Add a full adder to the circuit board
export function addMux() {
    let mux = new Mux();
    mux.registerComponent("working-area");
}

window.addMux = addMux;

export function printErrors(message,objectId) {
    const result = document.getElementById('result');
    result.innerHTML += message;
    result.className = "failure-message";
    if(objectId !== null)
    {
        objectId.classList.add("highlight")
        setTimeout(function () {objectId.classList.remove("highlight")}, 5000);
    }
}
// Used to extract output from a given gate, if pos isnt empty the gate is a full adder with the position specified
export function getOutputMux(input) {
    const gate = input[0];
    const pos = input[1];
    if (pos === "Carry") {
        return gate.cout;
    } else if (pos === "Sum") {
        return gate.sum;
    }
    else if (pos === "output") {
        return gate.output;
    }
    // But if the gate is not an FA, but an input bit, then return the value of the input
    else {
        return gate.output;
    }
}

// Recursive function that evaluates the output of the full adder
export function getResultMux(fa) {
    // check if fa type is Gate object
    if (fa.constructor.name === "Mux") {
        if (fa.output !== null) {
            return;
        }
        if (getOutputMux(fa.i0) === null) {
            getResultMux(fa.i0[0]);
        }
        if (getOutputMux(fa.i1) === null) {
            getResultMux(fa.i1[0]);
        }
        if (getOutputMux(fa.i2) === null) {
            getResultMux(fa.i2[0]);
        }
        if (getOutputMux(fa.i3) === null) {
            getResultMux(fa.i3[0]);
        }
        if (getOutputMux(fa.s0) === null) {
            getResultMux(fa.s0[0]);
        }
        if (getOutputMux(fa.s1) === null) {
            getResultMux(fa.s1[0]);
        }
        fa.generateOutput();
    }
    else if (fa.constructor.name === "FullAdder") {
        if (fa.cout !== null && fa.sum !== null) {
            return;
        }

        if (getOutputMux(fa.a0) === null) {
            getResultMux(fa.a0[0]);
        }
        if (getOutputMux(fa.b0) === null) {
            getResultMux(fa.b0[0]);
        }
        if (getOutputMux(fa.cin) === null) {
            getResultMux(fa.cin[0]);
        }

        fa.generateOutput();
    }
    else {
        if (fa.output !== null) {
            return;
        }
        for (let i = 0; i < fa.inputs.length; i++) {
            
            if (getOutputMux(fa.inputs[i]) == null) {
                getResultMux(fa.inputs[i][0]);
            }
        }
        fa.generateOutput();
    }
    
    return;
}

// Checks if the connections are correct
export function checkConnectionsMux() {
    for (let faID in fullAdder) {
        const gate = fullAdder[faID];
        const id = document.getElementById(gate.id);

        if (gate.coutIsConnected === false || gate.outCout.length === 0) {
            printErrors("Highlighted component not connected properly\n",id);
            return false;
        }
        if (gate.sumIsConnected === false || gate.outSum.length === 0) {

            printErrors("Highlighted component not connected properly\n",id);
            return false;
        }

        // Check if all the inputs are connected
        if (gate.a0 === null || gate.a0.length === 0) {
            printErrors("Highlighted component not connected properly\n",id);
            return false;
        }
        if (gate.b0 === null || gate.b0.length === 0) {
            printErrors("Highlighted component not connected properly\n",id);
            return false;
        }
        if (gate.cin === null || gate.cin.length === 0) {
            printErrors("Highlighted component not connected properly\n",id);
            return false;
        }
    }
    for (let gateId in gates) {
        const gate = gates[gateId];
        const id = document.getElementById(gate.id);
        if (gate.inputPoints.length !== gate.inputs.length) {
            printErrors("Highlighted component not connected properly\n",id);
            return false;

        } else if ((gate.isConnected === false || (gate.outputs.length===0)) && gate.isOutput === false) {

            printErrors("Highlighted component not connected properly\n",id);
            return false;
        }
    }
    for (let muxId in mux) {
        const muxComponent = mux[muxId];
        const id = document.getElementById(muxComponent.id);

        if (muxComponent.outputIsConnected === false || muxComponent.outputs.length===0) {

            printErrors("Highlighted component not connected properly\n",id);
            return false;
        }
        if (muxComponent.i0 === null || muxComponent.i0.length === 0) {
            printErrors("Highlighted component not connected properly\n",id);
            return false;
        }
        if (muxComponent.i1 === null || muxComponent.i1.length === 0) {
            printErrors("Highlighted component not connected properly\n",id);
            return false;
        }
        if (muxComponent.i2 === null || muxComponent.i2.length === 0) {
            printErrors("Highlighted component not connected properly\n",id);
            return false;
        }
        if (muxComponent.i3 === null || muxComponent.i3.length === 0) {
            printErrors("Highlighted component not connected properly\n",id);
            return false;
        }
        if (muxComponent.s0 === null || muxComponent.s0.length === 0) {
            printErrors("Highlighted component not connected properly\n",id);
            return false;
        }
        if (muxComponent.s1 === null || muxComponent.s1.length === 0) {
            printErrors("Highlighted component not connected properly\n",id);
            return false;
        }
    }
    return true;
}

// Simulates the circuit
export function simulateMux() {
    clearResult();
    if (!checkConnectionsMux()) {
        return;
    }

    // reset output in gate
    for (let faID in fullAdder) {
        fullAdder[faID].cout = null;
        fullAdder[faID].sum = null;
    }
    for (let muxID in mux) {
        mux[muxID].setOutput(null);
    }
    
    for (let gateId in gates) {
        const gate = gates[gateId];
        if (!gate.isInput) {
            gates[gateId].output = null;
        }
    }

    for (let gateId in gates) {
        if (gates[gateId].isOutput) {
            getResultMux(gates[gateId]);
        }
    }

    for (let gateId in gates) {
        const gate = gates[gateId];
        if (gate.isOutput) {
            let input = gate.inputs[0];
            let element = document.getElementById(gate.id)
            if (getOutputMux(input)) {
                element.className = "high";
                element.childNodes[0].innerHTML = "1";
            }
            else if (getOutputMux(input) === false) {
                element.className = "low";
                element.childNodes[0].innerHTML = "0";
            }
        }
    }


    // Displays message confirming Simulation completion
    let message = "Simulation has finished";
    const result = document.getElementById('result');
    result.innerHTML += message;
    result.className = "success-message";
    setTimeout(clearResult, 2000);

}

// Simulates the circuit for given fulladders and gates; Used for testing the circuit for all values
export function testSimulationMux(fA, gates, muxes) {
    // reset output in gate

    for (let faID in fA) {
        fullAdder[faID].cout = null;
        fullAdder[faID].sum = null;
    }
    for (let muxID in muxes) {
        muxes[muxID].setOutput(null);
    }
    
    for (let gateId in gates) {
        const gate = gates[gateId];
        if (!gate.isInput) {
            gates[gateId].output = null;
        }
    }

    for (let gateId in gates) {
        if (gates[gateId].isOutput) {
            getResultMux(gates[gateId]);
        }
    }

}

export function clearResult() {
    const result = document.getElementById("result");
    result.innerHTML = "";
    result.className = "";
    document.getElementById("table-body").innerHTML = "";

    document.getElementById("table-head").innerHTML="";

}

// Delete Mux
export function deleteMux(id) {
    const muxComponent = mux[id];
    jsPlumbInstance.removeAllEndpoints(document.getElementById(muxComponent.id));
    jsPlumbInstance._removeElement(document.getElementById(muxComponent.id));

    for(let key in mux) {
        if(mux[key].id === id) {
            continue;
        }
        if(mux[key].i0[0] === muxComponent) {
            mux[key].i0 = null;
        }
        if(mux[key].i1[0] === muxComponent) {
            mux[key].i1 = null;
        }
        if(mux[key].i2[0] === muxComponent) {
            mux[key].i2 = null;
        }
        if(mux[key].i3[0] === muxComponent) {
            mux[key].i3 = null;
        }
        if(mux[key].s0[0] === muxComponent) {
            mux[key].s0 = null;
        }
        if(mux[key].s1[0] === muxComponent) {
            mux[key].s1 = null;
        }

        if(mux[key].outputs.includes(muxComponent)){
            mux[key].removeOutput(muxComponent);
        }

    }

    for (let key in fullAdder) {
        if (fullAdder[key].a0[0] === muxComponent) {
            fullAdder[key].a0 = null;
        }
        if (fullAdder[key].b0[0] === muxComponent) {
            fullAdder[key].b0 = null;
        }
        if (fullAdder[key].cin[0] === muxComponent) {
            fullAdder[key].cin = null;
       }

       if(fullAdder[key].outCout.includes(muxComponent)){
        fullAdder[key].removeoutCout(muxComponent);
       }
       if(fullAdder[key].outSum.includes(muxComponent)){
        fullAdder[key].removeoutSum(muxComponent);
   }

    }

    for (let elem in gates) {
        let found = 0;
        for (let index in gates[elem].inputs) {
            if (gates[elem].inputs[index][0].id === muxComponent.id) {
                found = 1;
                break;
            }
        }
        if (found === 1) {
            gates[elem].removeInput(muxComponent);
        }


        if(gates[elem].outputs.includes(muxComponent)) {
            gates[elem].removeOutput(muxComponent);
            if(gates[elem].isInput && gates[elem].outputs.length ==0)
            gates[elem].setConnected(false);
          }

    }
    delete mux[id];
}
