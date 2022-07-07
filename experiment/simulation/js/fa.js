import { registerGate, jsPlumbInstance } from "./main.js";
import { setPosition } from "./layout.js";
import { gates } from "./gate.js";
import {
  computeAnd,
  computeOr,
  computeXor
} from "./validator.js";
import {mux} from "./mux.js";
"use strict";
// Dictionary of all full adders in the circuit with their IDs as keys
export let fullAdder = {};

export function clearFAs() {
  for (let faID in fullAdder) {
    delete fullAdder[faID];
  }
  fullAdder = {};
}


export class FullAdder {
  constructor() {
    this.id = "FullAdder-" + window.numComponents++;
    this.a0 = []; // Takes 2 items in a list : Gate, Output endpoint of gate
    this.b0 = [];
    this.cin = [];
    this.sum = null;
    this.cout = null;
    this.inputPoints = [];
    this.outputPoints = [];
    this.coutIsConnected = false;
    this.sumIsConnected = false;
    this.component = `<div class="drag-drop fulladder" id= ${this.id} style="width:100px;height:100px;"></div>`;
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
        window.componentType = "fullAdder";
        return false;
      },
      false
    );

    fullAdder[this.id] = this;
    registerGate(this.id, this);
  }

  // Sets values of the inputs and outputs of the full adder
  setA0(A0) {
    this.a0 = A0;
  }

  setB0(B0) {
    this.b0 = B0;
  }

  setCin(cin) {
    this.cin = cin;
  }

  setSum(Sum) {
    this.sum = Sum;
  }

  setCout(cout) {
    this.cout = cout;
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

    const aXorb = computeXor(
      getOutputFA(this.a0[0], this.a0[1]),
      getOutputFA(this.b0[0], this.b0[1])
    );
    this.cout = computeOr(
      computeAnd(
        getOutputFA(this.a0[0], this.a0[1]),
        getOutputFA(this.b0[0], this.b0[1])
      ),
      computeAnd(getOutputFA(this.cin[0], this.cin[1]), aXorb)
    );
    this.sum = computeXor(getOutputFA(this.cin[0], this.cin[1]), aXorb);
  }

  // Sets the output enpoint of the full adder as connected
  setConnected(val, pos) {
    if (pos === "Carry") {
      this.coutIsConnected = val;
    } else if (pos === "Sum") {
      this.sumIsConnected = val;
    }
  }
}

// Add a full adder to the circuit board
export function addFA() {
  let fA = new FullAdder();
  fA.registerComponent("working-area");
}

window.addFA = addFA;

// Used to extract output from a given gate, if pos isnt empty the gate is a full adder with the position specified
export function getOutputFA(gate, pos) {
  if (pos === "Carry") {
    return gate.cout;
  } else if (pos === "Sum") {
    return gate.sum;
  }
  // But if the gate is not an FA, but an input bit, then return the value of the input
  else {
    return gate.output;
  }
}



// Delete Full Adder
export function deleteFA(id) {
  const fa = fullAdder[id];
  jsPlumbInstance.removeAllEndpoints(document.getElementById(fa.id));
  jsPlumbInstance._removeElement(document.getElementById(fa.id));

  for (let key in fullAdder) {
    if (fullAdder[key].id === id) {
      continue;
    }
    if (fullAdder[key].a0[0] === fa) {
      fullAdder[key].a0 = null;
    }
    if (fullAdder[key].b0[0] === fa) {
      fullAdder[key].b0 = null;
    }
    if (fullAdder[key].cin[0] === fa) {
      fullAdder[key].cin = null;
    }
  }
  for(let key in mux){
    if(mux[key].i0[0] === fa) {
        mux[key].i0 = null;
    }
    if(mux[key].i1[0] === fa) {
        mux[key].i1 = null;
    }
    if(mux[key].i2[0] === fa) {
        mux[key].i2 = null;
    }
    if(mux[key].i3[0] === fa) {
        mux[key].i3 = null;
    }
    if(mux[key].s0[0] === fa) {
        mux[key].s0 = null;
    }
    if(mux[key].s1[0] === fa) {
        mux[key].s1 = null;
    }
  }
  for (let elem in gates) {
    let found = 0;
    for (let index in gates[elem].inputs) {
        if (gates[elem].inputs[index][0].id === fa.id) {
            found = 1;
            break;
        }
    }
    if (found === 1) {
        gates[elem].removeInput(fa);
    }
  }
  delete fullAdder[key]; 
}
