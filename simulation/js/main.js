import * as gatejs from "./gate.js";
import * as fajs from "./fa.js";
import * as muxjs from "./mux.js";
import { wireColours } from "./layout.js";

"use strict";

let num_wires = 0;

// Gets the coordinates of the mouse
document.getScroll = function () {
  if (window.pageYOffset !== undefined) {
    return [pageXOffset, pageYOffset];
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
    options: { radius: 6 },
  },
  dragOptions: {
    containment: "parentEnclosed",
    containmentPadding: 5,
  },
  connector: "Flowchart",
  paintStyle: { strokeWidth: 4, stroke: "#888888" },
  connectionsDetachable: false,
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
    } else {
      jsPlumbInstance.connect({ uuids: [fromEndpoint.uuid, toEndpoint.uuid], paintStyle: { stroke: wireColours[num_wires], strokeWidth: 4 } });
      num_wires++;
      num_wires = num_wires % wireColours.length;
      const start_type = fromEndpoint.elementId.split("-")[0];
      let end_type = toEndpoint.elementId.split("-")[0];
      if (start_type === "Mux" && end_type === "Mux") {
        if (start_uuid === "output") {
          const input = muxjs.mux[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("output")) {
            pos = "output";
          }
          input.setConnected(true, pos);
          if (Object.keys(toEndpoint.overlays)[0].includes("i0")) {
            muxjs.mux[toEndpoint.elementId].setI0([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("i1")) {
            muxjs.mux[toEndpoint.elementId].setI1([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("i2")) {
            muxjs.mux[toEndpoint.elementId].setI2([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("i3")) {
            muxjs.mux[toEndpoint.elementId].setI3([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("s0")) {
            muxjs.mux[toEndpoint.elementId].setS0([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("s1")) {
            muxjs.mux[toEndpoint.elementId].setS1([input, pos]);
          }
          
        } else if (end_uuid === "output") {
          const input = muxjs.mux[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("output")) {
            pos = "output";
          }
          
          input.setConnected(true, pos);
          if (Object.keys(fromEndpoint.overlays)[0].includes("i0")) {
            muxjs.mux[fromEndpoint.elementId].setI0([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("i1")) {
            muxjs.mux[fromEndpoint.elementId].setI1([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("i2")) {
            muxjs.mux[fromEndpoint.elementId].setI2([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("i3")) {
            muxjs.mux[fromEndpoint.elementId].setI3([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("s0")) {
            muxjs.mux[fromEndpoint.elementId].setS0([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("s1")) {
            muxjs.mux[fromEndpoint.elementId].setS1([input, pos]);
          }
        }
      }
      else if (start_type === "Mux" && end_type === "Input") {
        if (end_uuid === "output") {
          const input = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("i0")) {
            muxjs.mux[fromEndpoint.elementId].setI0([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("i1")) {
            muxjs.mux[fromEndpoint.elementId].setI1([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("i2")) {
            muxjs.mux[fromEndpoint.elementId].setI2([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("i3")) {
            muxjs.mux[fromEndpoint.elementId].setI3([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("s0")) {
            muxjs.mux[fromEndpoint.elementId].setS0([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("s1")) {
            muxjs.mux[fromEndpoint.elementId].setS1([input, pos]);
          }
        }
      }
      else if (start_type === "Input" && end_type === "Mux") {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("i0")) {
            muxjs.mux[toEndpoint.elementId].setI0([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("i1")) {
            muxjs.mux[toEndpoint.elementId].setI1([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("i2")) {
            muxjs.mux[toEndpoint.elementId].setI2([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("i3")) {
            muxjs.mux[toEndpoint.elementId].setI3([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("s0")) {
            muxjs.mux[toEndpoint.elementId].setS0([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("s1")) {
            muxjs.mux[toEndpoint.elementId].setS1([input, pos]);
          }
        }
      }
      else if (start_type === "Mux" && end_type === "Output") {
        if (start_uuid === "output") {
          const input = muxjs.mux[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          let pos = ""
          if (Object.keys(fromEndpoint.overlays)[0].includes("output")) {
            pos = "output";
          }
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
      }
      else if (start_type === "Output" && end_type === "Mux") {
        if (start_uuid === "input") {
          const input = muxjs.mux[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          let pos = ""
          if (Object.keys(toEndpoint.overlays)[0].includes("output")) {
            pos = "output";
          }
          
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
      }
      else if (start_type === "Input" && end_type === "Output") {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
        }
      }
      else if (start_type === "Output" && end_type === "Input") {
        if (start_uuid === "input") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
        }
      }
      else if (start_type === "Mux" && toEndpoint.elementId in gatejs.gates) {
        // connection is started from the outputs of r-s flipflop
        if (start_uuid === "output") {
          // connection will end at the input of the gate
          const input = muxjs.mux[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          let pos = ""
          if (Object.keys(fromEndpoint.overlays)[0].includes("output")) {
            pos = "output";
          }
          
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
        // connection is started from the inputs of r-s flipflop
        else if (start_uuid === "input") {
          // connection will end at the output of the gate
          const input = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("i0")) {
            muxjs.mux[fromEndpoint.elementId].setI0([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("i1")) {
            muxjs.mux[fromEndpoint.elementId].setI1([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("i2")) {
            muxjs.mux[fromEndpoint.elementId].setI2([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("i3")) {
            muxjs.mux[fromEndpoint.elementId].setI3([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("s0")) {
            muxjs.mux[fromEndpoint.elementId].setS0([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("s1")) {
            muxjs.mux[fromEndpoint.elementId].setS1([input, pos]);
          }
          

        }
      }
      else if (end_type === "Mux" && fromEndpoint.elementId in gatejs.gates) {
        // connection is started from the outputs of gate
        if (start_uuid === "output") {
          // connection will end at the input of r-s flipflop
          const input = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("i0")) {
            muxjs.mux[toEndpoint.elementId].setI0([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("i1")) {
            muxjs.mux[toEndpoint.elementId].setI1([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("i2")) {
            muxjs.mux[toEndpoint.elementId].setI2([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("i3")) {
            muxjs.mux[toEndpoint.elementId].setI3([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("s0")) {
            muxjs.mux[toEndpoint.elementId].setS0([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("s1")) {
            muxjs.mux[toEndpoint.elementId].setS1([input, pos]);
          }


        }
        // connection is started from the inputs of gate
        else if (start_uuid === "input") {
          // connection will end at the output of the r-s flip flop

          const input = muxjs.mux[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          let pos = ""
          if (Object.keys(toEndpoint.overlays)[0].includes("output")) {
            pos = "output";
          }
          
          input.setConnected(true, pos);
          output.addInput(input, pos);

        }
      }
      else if (start_type === "Input" && toEndpoint.elementId in gatejs.gates) {

        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
        }
      }
      else if (fromEndpoint.elementId in gatejs.gates && end_type === "Input") {
        if (start_uuid === "input") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");

        }
      }
      else if (start_type === "Output" && toEndpoint.elementId in gatejs.gates) {
        if (start_uuid === "input") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
        }
      }
      else if (fromEndpoint.elementId in gatejs.gates && end_type === "Output") {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
        }
      }

      else if (fromEndpoint.elementId in gatejs.gates && toEndpoint.elementId in gatejs.gates) {

        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
        } else if (end_uuid === "output") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
        }
      }
      else if (start_type === "FullAdder" && end_type === "FullAdder") {
        if (start_uuid === "output") {
          const input = fajs.fullAdder[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("sum")) {
            pos = "Sum";
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("cout")) {
            pos = "Carry";
          }
          input.setConnected(true, pos);
          if (Object.keys(toEndpoint.overlays)[0].includes("a")) {
            fajs.fullAdder[toEndpoint.elementId].setA0([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("b")) {
            fajs.fullAdder[toEndpoint.elementId].setB0([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("cin")) {
            fajs.fullAdder[toEndpoint.elementId].setCin([input, pos]);
          }
        } else if (end_uuid === "output") {
          const input = fajs.fullAdder[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("sum")) {
            pos = "Sum";
          } else if (Object.keys(toEndpoint.overlays)[0].includes("cout")) {
            pos = "Carry";
          }
          input.setConnected(true, pos);
          if (Object.keys(fromEndpoint.overlays)[0].includes("a")) {
            fajs.fullAdder[fromEndpoint.elementId].setA0([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("b")) {
            fajs.fullAdder[fromEndpoint.elementId].setB0([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("cin")) {
            fajs.fullAdder[fromEndpoint.elementId].setCin([input, pos]);
          }
        }
      } else if (start_type === "FullAdder" && end_type === "Input") {
        if (end_uuid === "output") {
          const input = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("a")) {
            fajs.fullAdder[fromEndpoint.elementId].setA0([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("b")) {
            fajs.fullAdder[fromEndpoint.elementId].setB0([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("cin")) {
            fajs.fullAdder[fromEndpoint.elementId].setCin([input, pos]);
          }
        }
      } else if (start_type === "Input" && end_type === "FullAdder") {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("a")) {
            fajs.fullAdder[toEndpoint.elementId].setA0([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("b")) {
            fajs.fullAdder[toEndpoint.elementId].setB0([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("cin")) {
            fajs.fullAdder[toEndpoint.elementId].setCin([input, pos]);
          }
        }
      } else if (start_type === "FullAdder" && end_type === "Output") {
        if (start_uuid === "output") {
          const input = fajs.fullAdder[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("sum")) {
            pos = "Sum";
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("cout")) {
            pos = "Carry";
          }
          input.setConnected(true, pos);
          output.addInput(input,pos);
          
        }
      } else if (start_type === "Output" && end_type === "FullAdder") {
        if (start_uuid === "input") {
          const input = fajs.fullAdder[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("sum")) {
            pos = "Sum";
          } else if (Object.keys(toEndpoint.overlays)[0].includes("cout")) {
            pos = "Carry";
          }
          input.setConnected(true, pos);
          output.addInput(input,pos);
          
        }
      }
      else if (start_type === "FullAdder" && toEndpoint.elementId in gatejs.gates) {
        // connection is started from the outputs of r-s flipflop
        if (start_uuid === "output") {
          // connection will end at the input of the gate
          const input = fajs.fullAdder[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          let pos = ""
          if (Object.keys(fromEndpoint.overlays)[0].includes("sum")) {
            pos = "Sum";
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("cout")) {
            pos = "Carry";
          }
          
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
        // connection is started from the inputs of r-s flipflop
        else if (start_uuid === "input") {
          // connection will end at the output of the gate
          const input = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("a0")) {
            fajs.fullAdder[fromEndpoint.elementId].setA0([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("b0")) {
            fajs.fullAdder[fromEndpoint.elementId].setB0([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("cin")) {
            fajs.fullAdder[fromEndpoint.elementId].setCin([input, pos]);
          }
        }
      }
      else if (end_type === "FullAdder" && fromEndpoint.elementId in gatejs.gates) {
        // connection is started from the outputs of gate
        if (start_uuid === "output") {
          // connection will end at the input of fulldder flipflop
          const input = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("a0")) {
            fajs.fullAdder[toEndpoint.elementId].setA0([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("b0")) {
            fajs.fullAdder[toEndpoint.elementId].setB0([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("cin")) {
            fajs.fullAdder[toEndpoint.elementId].setCin([input, pos]);
          }
        }
        // connection is started from the inputs of gate
        else if (start_uuid === "input") {
          // connection will end at the output of the fulladder

          const input = fajs.fullAdder[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          let pos = ""
          if (Object.keys(toEndpoint.overlays)[0].includes("cout")) {
            pos = "Carry";
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("sum")) {
            pos = "Sum";
          }
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
      }
      else if (start_type === "Mux" && toEndpoint.elementId in fajs.fullAdder) {
        // connection is started from the outputs of mux
        if (start_uuid === "output") {
          // connection will end at the input of the fulladder
          const input = muxjs.mux[fromEndpoint.elementId];
          let pos = ""
          if (Object.keys(fromEndpoint.overlays)[0].includes("output")) {
            pos = "output";
          }
          input.setConnected(true, pos);
          if(Object.keys(toEndpoint.overlays)[0].includes("a0")) {
            fajs.fullAdder[toEndpoint.elementId].setA0([input, pos]);
          }
          else if(Object.keys(toEndpoint.overlays)[0].includes("b0")) {
            fajs.fullAdder[toEndpoint.elementId].setB0([input, pos]);
          }
          else if(Object.keys(toEndpoint.overlays)[0].includes("cin")) {
            fajs.fullAdder[toEndpoint.elementId].setCin([input, pos]);
          }
        }
        // connection is started from the inputs of mux
        else if (start_uuid === "input") {
          // connection will end at the output of the fulladder
          const input = fajs.fullAdder[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("sum")) {
            pos = "Sum";
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("cout")) {
            pos = "Carry";
          }
          input.setConnected(true, pos);
          if (Object.keys(fromEndpoint.overlays)[0].includes("i0")) {
            muxjs.mux[fromEndpoint.elementId].setI0([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("i1")) {
            muxjs.mux[fromEndpoint.elementId].setI1([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("i2")) {
            muxjs.mux[fromEndpoint.elementId].setI2([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("i3")) {
            muxjs.mux[fromEndpoint.elementId].setI3([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("s0")) {
            muxjs.mux[fromEndpoint.elementId].setS0([input, pos]);
          }
          else if (Object.keys(fromEndpoint.overlays)[0].includes("s1")) {
            muxjs.mux[fromEndpoint.elementId].setS1([input, pos]);
          }
        }
      }
      else if (end_type === "Mux" && fromEndpoint.elementId in fajs.fullAdder) {
        // connection is started from the outputs of fullAdder
        if (start_uuid === "output") {
          // connection will end at the input of the mux
          const input = fajs.fullAdder[fromEndpoint.elementId];
          let pos = "";
          if(Object.keys(fromEndpoint.overlays)[0].includes("cout")) {
            pos = "Carry";
          }
          else if(Object.keys(fromEndpoint.overlays)[0].includes("sum")) {
            pos = "Sum";
          }
          input.setConnected(true, pos);
          if (Object.keys(toEndpoint.overlays)[0].includes("i0")) {
            muxjs.mux[toEndpoint.elementId].setI0([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("i1")) {
            muxjs.mux[toEndpoint.elementId].setI1([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("i2")) {
            muxjs.mux[toEndpoint.elementId].setI2([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("i3")) {
            muxjs.mux[toEndpoint.elementId].setI3([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("s0")) {
            muxjs.mux[toEndpoint.elementId].setS0([input, pos]);
          }
          else if (Object.keys(toEndpoint.overlays)[0].includes("s1")) {
            muxjs.mux[toEndpoint.elementId].setS1([input, pos]);
          }
        }
        // connection is started from the inputs of fullAdder
        else if (start_uuid === "input") {
          // connection will end at the output of the mux
          const input = muxjs.mux[toEndpoint.elementId];
          const output = fajs.fullAdder[fromEndpoint.elementId];
          let pos = ""
          if (Object.keys(toEndpoint.overlays)[0].includes("output")) {
            pos = "output";
          }
          input.setConnected(true, pos);
          if(Object.keys(fromEndpoint.overlays)[0].includes("a0")) {
            output.setA0([input, pos]);
          }
          else if(Object.keys(fromEndpoint.overlays)[0].includes("b0")) {
            output.setB0([input, pos]);
          }
          else if(Object.keys(fromEndpoint.overlays)[0].includes("cin")) {
            output.setCin([input, pos]);
          }
        }
      }
    }
  });

}

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
  }
  else if (gateType === "Mux") {
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
  const ids = ["Input-0", "Input-1", "Input-2","Input-3","Input-4", "Output-5", "Output-6"]; // [A,B,carry -input,Sum,carry-output]
  const types = ["Input", "Input", "Input","Input","Input", "Output", "Output"];
  const names = ["A", "B", "cin","S1","S0", "Output", "cout"];
  const positions = [
    { x: 40, y: 150 },
    { x: 40, y: 375 },
    { x: 350, y: 100 },
    { x: 500, y: 100},
    { x: 600, y: 100},
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

// Initialise Task 1 experiment when the page loads
window.currentTab = "task1";
connectMux();
refreshWorkingArea();
initALU();
