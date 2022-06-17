import { registerGate, jsPlumbInstance } from "./main.js";
import { setPosition } from "./layout.js";
import { gates } from "./gate.js";
import { fullAdder } from "./fa.js";
import {
    computeAnd,
    computeOr,
    computeXor
} from "./validator.js";

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
export const finalOutputs = {
    "Output-5": [],
    "Output-8": [],
    "Output-11": [],
    "Output-12": [],
};

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

    // adds input endpoints points to the list of input points
    addInputPoints(input) {
        this.inputPoints.push(input);
    }

    // Adds the output endpoints to the list of output points
    addOutputPoints(output) {
        this.outputPoints.push(output);
    }

    // Generates the output of the full adder
    generateOutput() {
        // we know that for a full adder
        // sum = A xor B xor Cin
        // carry = AB or Cin(A xor B)

        const S0 = getOutputMux(this.s0);
        const S1 = getOutputMux(this.s1);
        console.log(S0);
        console.log(S1);
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
        console.log(getOutputMux(fa.i0), getOutputMux(fa.i1), getOutputMux(fa.i2), getOutputMux(fa.i3));
        console.log(getOutputMux(fa.s0), getOutputMux(fa.s1));
        if (fa.output != null) {
            return;
        }
        if (getOutputMux(fa.i0) == null) {
            getResultMux(fa.i0[0]);
        }
        if (getOutputMux(fa.i1) == null) {
            getResultMux(fa.i1[0]);
        }
        if (getOutputMux(fa.i2) == null) {
            getResultMux(fa.i2[0]);
        }
        if (getOutputMux(fa.i3) == null) {
            getResultMux(fa.i3[0]);
        }
        if (getOutputMux(fa.s0) == null) {
            getResultMux(fa.s0[0]);
        }
        if (getOutputMux(fa.s1) == null) {
            getResultMux(fa.s1[0]);
        }
        fa.generateOutput();
    }
    else if (fa.constructor.name === "FullAdder") {
        if (fa.cout != null && fa.sum != null) {
            return;
        }

        if (getOutputMux(fa.a0) == null) {
            getResultMux(fa.a0[0]);
        }
        if (getOutputMux(fa.b0) == null) {
            getResultMux(fa.b0[0]);
        }
        if (getOutputMux(fa.cin) == null) {
            getResultMux(fa.cin[0]);
        }

        fa.generateOutput();
    }
    else {
        if (fa.output != null) {
            return;
        }
        console.log(fa.inputs.length);
        for (let i = 0; i < fa.inputs.length; i++) {
            console.log(fa.inputs[i]);
            if (getOutputMux(fa.inputs[i]) == null) {
                getResultMux(fa.inputs[i][0]);
            }
        }
        fa.generateOutput();
    }
    console.log(fa);
    return;
}

// Checks if the connections are correct
export function checkConnectionsMux() {
    let correctConnection = true;
    for (let faID in fullAdder) {
        const gate = fullAdder[faID];
        if (gate.coutIsConnected === false) {
            correctConnection = false;
            break;
        }
        if (gate.sumIsConnected === false) {
            correctConnection = false;
            break;
        }

        // Check if all the inputs are connected
        if (gate.a0 == null || gate.a0.length === 0) {
            correctConnection = false;
            break;
        }
        if (gate.b0 == null || gate.b0.length === 0) {
            correctConnection = false;
            break;
        }
        if (gate.cin == null || gate.cin.length === 0) {
            correctConnection = false;
            break;
        }
    }
    for (let gateId in gates) {
        const gate = gates[gateId];
        if (gate.isInput) {
            if (gate.isConnected === false) {
                correctConnection = false;
                break;
            }
        }
        if (gate.isOutput) {
            if (gate.inputs.length === 0) {
                correctConnection = false;
                break;
            }
        }
    }
    for (let muxId in mux) {
        const muxi = mux[muxId];
        if (muxi.outputIsConnected === false) {
            correctConnection = false;
            break;
        }
        if (muxi.i0[0] == null || muxi.i0[0].length === 0) {
            correctConnection = false;
            break;
        }
        if (muxi.i1[0] == null || muxi.i1[0].length === 0) {
            correctConnection = false;
            break;
        }
        if (muxi.i2[0] == null || muxi.i2[0].length === 0) {
            correctConnection = false;
            break;
        }
        if (muxi.i3[0] == null || muxi.i3[0].length === 0) {
            correctConnection = false;
            break;
        }
        if (muxi.s0[0] == null || muxi.s0[0].length === 0) {
            correctConnection = false;
            break;
        }
        if (muxi.s1[0] == null || muxi.s1[0].length === 0) {
            correctConnection = false;
            break;
        }
    }
    if (correctConnection) {
        return true;
    } else {
        alert("Connections are not correct");
        return false;
    }
}

// Simulates the circuit
export function simulateMux() {
    console.log("here");
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
        // mux[muxID].output = null;
        console.log(mux[muxID]);
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

    // for(let faID in fullAdder) {
    //     console.log(fullAdder[faID]);
    // }
    //   for(let muxID in mux) {
    //     console.log(mux[muxID]);
    // }
    //   for(let gateId in gates) {
    //     console.log(gates[gateId]);
    // }

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
}

// Simulates the circuit for given fulladders and gates; Used for testing the circuit for all values
// export function testSimulationFA(fA, gates) {
//     if (!checkConnectionsFA()) {
//         return;
//     }

//     // reset output in gate
//     for (let faID in fA) {
//         fA[faID].cout = null;
//         fA[faID].sum = null;
//     }
//     for (let gateId in gates) {
//         const gate = gates[gateId];
//         if (gate.isOutput) {
//             gates[gateId].output = null;
//         }
//     }

//     for (let gateId in gates) {
//         if (gates[gateId].isOutput) {
//             getResultFA(gates[gateId].inputs[0]);
//         }
//     }

//     for (let key in finalOutputs) {
//         gates[key].output = getOutputFA(finalOutputs[key][0], finalOutputs[key][1]);
//     }
// }

// Delete Full Adder
// export function deleteMux(id) {
//     const fa = fullAdder[id];
//     jsPlumbInstance.removeAllEndpoints(document.getElementById(fa.id));
//     jsPlumbInstance._removeElement(document.getElementById(fa.id));

//     for (let key in fullAdder) {
//         if (fullAdder[key].id === id) {
//             delete fullAdder[key];
//             continue;
//         }
//         if (fullAdder[key].a0[0] === fa) {
//             fullAdder[key].a0 = null;
//         }
//         if (fullAdder[key].b0[0] === fa) {
//             fullAdder[key].b0 = null;
//         }
//         if (fullAdder[key].cin[0] === fa) {
//             fullAdder[key].cin = null;
//         }
//     }

//     for (let key in finalOutputs) {
//         if (finalOutputs[key][0] === fa) {
//             delete finalOutputs[key];
//         }

//         gates[key].inputs = [];
//     }
// }
