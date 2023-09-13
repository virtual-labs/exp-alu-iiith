"use strict";
import { gates } from "./gate.js";
import { fullAdder } from "./fa.js";
import { checkConnectionsMux, testSimulationMux, mux } from "./mux.js";

// Helper functions
export function computeXor(a, b) {
    return a !== b;
}
export function computeAnd(a, b) {
    return a && b;
}
export function computeOr(a, b) {
    return a || b;
}
export function computeXnor(a, b) {
    return a === b;
}
export function computeNand(a, b) {
    return !(a && b);
}
export function computeNor(a, b) {
    return !(a || b);
}

function computeFullAdder(a, b, cin) {
    let sum = a + b + cin;
    switch (sum) {
        case 0:
            return [0, 0];
        case 1:
            return [1, 0];
        case 2:
            return [0, 1];
        default:
            return [1, 1];
    }
}

function computeMux(s1, s0, a, b, cin) {
    let combinedString = s1.toString()+s0.toString();
    switch (combinedString) {
        case "00":
            return computeFullAdder(a, b, cin)[0];
        case "01":
            return computeAnd(a, b);
        case "10":
            return computeOr(a, b);
        default:
            if(computeXor(a, b)) {
                return 1;
            }
            return 0;
    }
}

function computeAlu(inputString) {
    let inputA = parseInt(inputString[0]);
    let inputB = parseInt(inputString[1]);
    let inputCin = parseInt(inputString[2]);
    let inputS0 = parseInt(inputString[3]);
    let inputS1 = parseInt(inputString[4]);
    let output = computeMux(inputS1, inputS0, inputA, inputB, inputCin);
    let cout = computeFullAdder(inputA, inputB, inputCin)[1];
    let outputString = output.toString() + cout.toString();
    return outputString;
}


export function validateAlu(inputA, inputB, inputCin, inputS1, inputS0, outputOut, outputCout) {
    let gates_list = gates;
    let fa_list = fullAdder;
    let mux_list = mux;

    const A = gates_list[inputA];
    const B = gates_list[inputB];
    const cin = gates_list[inputCin];
    const S0 = gates_list[inputS0];
    const S1 = gates_list[inputS1];

    let circuitIsCorrect = true;

    let dataTable = "";

    document.getElementById("result").innerHTML = "";

    let head = 
    '<tr><th colspan="2">Inputs</th><th colspan="2">Expected Values</th><th colspan="2">Observed Values</th></tr><tr><th>S1S0</th><th>ABC</th><th>cout</th><th>Out</th><th>cout</th><th>Out</th></tr>';
    document.getElementById("table-head").innerHTML = head;

    if (!checkConnectionsMux()) {
        document.getElementById("table-body").innerHTML = "";
        document.getElementById("table-head").innerHTML = "";

        return;
    }

    for (let i = 0; i < 32; i++) {
        //convert i to binary
        let binary = i.toString(2).padStart(5, "0");
        binary = binary.split("").reverse().join("");
        A.setOutput(binary[0] === "1");
        B.setOutput(binary[1] === "1");
        cin.setOutput(binary[2] === "1");
        S0.setOutput(binary[3] === "1");
        S1.setOutput(binary[4] === "1");

        // simulate the circuit
        testSimulationMux(fa_list, gates_list, mux_list);
        const out = gates_list[outputOut].output ? 1 : 0;
        const cout = gates_list[outputCout].output ? 1 : 0;
        let outputString = "";
        outputString += out;
        outputString += cout;
        let expectedString = computeAlu(binary);
        if (expectedString !== outputString) {
            circuitIsCorrect = false;
            dataTable += `<tr class="bold-table"><td>${binary[4]}${binary[3]}</td><td>${binary[0]}${binary[1]}${binary[2]}</td><td> ${expectedString[1]} </td><td> ${expectedString[0]} </td><td class="failure-table"> ${cout} </td><td class="failure-table"> ${out} </td></tr>`;
        }
        else {
            dataTable += `<tr class="bold-table"><td>${binary[4]}${binary[3]}</td><td>${binary[0]}${binary[1]}${binary[2]}</td><td> ${expectedString[1]} </td><td> ${expectedString[0]} </td><td class="success-table"> ${cout} </td><td class="success-table"> ${out} </td></tr>`;
        }
    }

    const table_elem = document.getElementById("table-body");
    table_elem.insertAdjacentHTML("beforeend", dataTable);

    const result = document.getElementById("result");

    if (circuitIsCorrect) {
        result.innerHTML = "<span>&#10003;</span> Success";
        result.className = "success-message";
    } else {
        result.innerHTML = "<span>&#10007;</span> Fail";
        result.className = "failure-message";
    }
}