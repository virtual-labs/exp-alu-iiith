"use strict";
import {gates} from "./gate.js";
import {fullAdder} from "./fa.js";
import { checkConnectionsMux, testSimulationMux, mux } from "./mux.js";

// Helper functions
export function computeXor(a, b) {
    return a != b;
}
export function computeAnd(a, b) {
    return a && b;
}
export function computeOr(a, b) {
    return a || b;
}
export function computeXnor(a, b) {
    return a == b;
}
export function computeNand(a, b) {
    return !(a && b);
}
export function computeNor(a, b) {
    return !(a || b);
}

function computeFullAdder(a,b,cin){
    let sum = a+b+cin;
    if (sum === 0) {
        return [0,0];
    }
    else if (sum === 1) {
        return [1,0];
    }
    else if (sum === 2) {
        return [0,1];   
    }
    else if (sum === 3) {
        return [1,1];
    }
}

function computeMux(s1,s0,a,b,cin){
    if(s1===0 && s0===0){
        let arr = computeFullAdder(a,b,cin);
        return arr[0];
    }
    else if(s1===0 && s0===1){
        return computeAnd(a,b);
    }
    else if(s1===1 && s0===0){
        return computeOr(a,b);
    }
    else if(s1===1 && s1===1){
        if(computeXor(a,b)){
            return 1;
        }
        return 0;
    }
}

function computeAlu(inputString){
    let inputA = parseInt(inputString[0]);
    let inputB = parseInt(inputString[1]);
    let inputCin = parseInt(inputString[2]);
    let inputS0 = parseInt(inputString[3]);
    let inputS1 = parseInt(inputString[4]);
    let output = computeMux(inputS1,inputS0,inputA,inputB,inputCin);
    let cout = computeFullAdder(inputA,inputB,inputCin)[1];
    let outputString = output.toString() + cout.toString();
    return outputString;
}


export function validateAlu(inputA,inputB,inputCin,inputS1,inputS0,outputOut,outputCout) {
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

    if(!checkConnectionsMux())
    {
        document.getElementById("table-body").innerHTML = "";
        let head = "";
        head =
            '<tr><th colspan="5">Inputs</th><th colspan="2">Expected Values</th><th colspan="2">Observed Values</th></tr><tr><th>S1</th><th>S0</th><th>A</th><th>B</th><th>C</th><th>cout</th><th>Out</th><th>cout</th><th>Out</th></tr>';
        document.getElementById("table-head").innerHTML = head;
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
        testSimulationMux(fa_list,gates_list,mux_list);
        const out = gates_list[outputOut].output ? 1 : 0;
        const cout = gates_list[outputCout].output ? 1 : 0;
        let outputString = "";
        outputString += out;
        outputString += cout;
        let expectedString = computeAlu(binary);
        dataTable += `<tr><th>${binary[4]}</th><th>${binary[3]}</th><th>${binary[0]}</th><th>${binary[1]}</th><th>${binary[2]}</th><td> ${expectedString[1]} </td><td> ${expectedString[0]} </td><td> ${cout} </td><td> ${out} </td></tr>`;

        if ( expectedString !== outputString) {
            circuitIsCorrect = false;
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