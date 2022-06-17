// import { gates, testSimulation } from "./gate.js";
// import { fullAdder, testSimulationFA } from "./fa.js";

"use strict";

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

// Tests the circuit for all values and checks if it is a half adder
// export function halfAdder(inputA, inputB, carryOut, sumOut) {
//     // This function takes 4 ids of the respective Gates
//     let gates_list = gates;

//     const input0 = gates_list[inputA];
//     const input1 = gates_list[inputB];
//     let circuitIsCorrect = true;

//     let dataTable = "";

//     for (let i = 0; i < 4; i++) {
//         //convert i to binary
//         let binary = i.toString(2).padStart(2, "0");
//         binary = binary.split("").reverse().join("");

//         input1.setOutput(binary[0] === "1");
//         input0.setOutput(binary[1] === "1");
//         const calculatedSum = computeXor(input0.output, input1.output) ? 1 : 0;
//         const calculatedCarry = computeAnd(input0.output, input1.output) ? 1 : 0;

//         // simulate the circuit
//         testSimulation(gates_list);
//         const sum = gates_list[sumOut].output ? 1 : 0;
//         const carry = gates_list[carryOut].output ? 1 : 0;

//         dataTable += `<tr><th>${binary[1]}</th><th>${binary[0]} </th><td> ${calculatedSum} </td><td> ${calculatedCarry} </td><td> ${sum} </td><td> ${carry} </td></tr>`;

//         if (sum != calculatedSum || carry != calculatedCarry) {
//             circuitIsCorrect = false;
//         }
//     }

//     const table_elem = document.getElementById("table-body");
//     table_elem.insertAdjacentHTML("beforeend", dataTable);

//     const result = document.getElementById("result");

//     if (circuitIsCorrect) {
//         result.innerHTML = "<span>&#10003;</span> Success";
//         result.className = "success-message";
//     } else {
//         result.innerHTML = "<span>&#10007;</span> Fail";
//         result.className = "failure-message";
//     }
// }

// // Tests the circuit for all values and checks if it is a full adder
// export function fullAdderTest(inputA, inputB, carryInput, carryOut, sumOut) {
//     let gates_list = gates;
//     const input0 = gates_list[inputA];
//     const input1 = gates_list[inputB];
//     const carryIn = gates_list[carryInput];
//     let circuitIsCorrect = true;
//     let dataTable = "";

//     for (let i = 0; i < 8; i++) {
//         // covert i to binary
//         let binary = i.toString(2).padStart(3, "0");
//         binary = binary.split("").reverse().join("");

//         input0.setOutput(binary[2] === "1");
//         input1.setOutput(binary[1] === "1");
//         carryIn.setOutput(binary[0] === "1");

//         const aXorb = computeXor(input0.output, input1.output);

//         // calculated sum is ((a xor b) xor carry_in)
//         const calculatedSum = computeXor(aXorb, carryIn.output);

//         // calculated carry is a.b + (a xor b).carry_in
//         const calculatedCarry = computeOr(
//             computeAnd(input0.output, input1.output),
//             computeAnd(aXorb, carryIn.output)
//         ) ? 1 : 0;

//         // simulate the circuit
//         testSimulation(gates_list);
//         const sum = gates_list[sumOut].output ? 1 : 0;
//         const carry = gates_list[carryOut].output ? 1 : 0;

//         dataTable += `<tr><th>${binary[2]}</th><th>${binary[1]}</th><th>${binary[0]} </th><td> ${calculatedSum} </td><td> ${calculatedCarry} </td><td> ${sum} </td><td> ${carry}</td></tr>`;


//         if (sum != calculatedSum || carry != calculatedCarry) {
//             circuitIsCorrect = false;
//         }
//     }

//     const table_elem = document.getElementById("table-body");
//     table_elem.insertAdjacentHTML("beforeend", dataTable);

//     const result = document.getElementById("result");

//     if (circuitIsCorrect) {
//         result.innerHTML = "<span>&#10003;</span> Success";
//         result.className = "success-message";
//     } else {
//         result.innerHTML = "<span>&#10007;</span> Fail";
//         result.className = "failure-message";
//     }
// }

// // Tests the circuit for all values and checks if it is a Ripple carry adder
// export function rippleAdderTest(
//     A0,
//     B0,
//     A1,
//     B1,
//     A2,
//     B2,
//     A3,
//     B3,
//     Cin,
//     outputCout,
//     outputS0,
//     outputS1,
//     outputS2,
//     outputS3
// ) {
//     let gates_list = gates;
//     let fA = fullAdder;
//     const inputA0 = gates_list[A0];
//     const inputB0 = gates_list[B0];
//     const inputA1 = gates_list[A1];
//     const inputB1 = gates_list[B1];
//     const inputA2 = gates_list[A2];
//     const inputB2 = gates_list[B2];
//     const inputA3 = gates_list[A3];
//     const inputB3 = gates_list[B3];
//     const carryIn = gates_list[Cin];
//     let circuitIsCorrect = true;

//     for (
//         let i = 0;
//         i < 512;
//         i++ // 512 = 2^9 basically calculates all the possible combinations for 9 inputs
//     ) {
//         // covert i to binary
//         let binary = i.toString(2).padStart(9, "0");
//         binary = binary.split("").reverse().join("");


//         inputA0.setOutput(binary[8] === "1");
//         inputB0.setOutput(binary[7] === "1");
//         inputA1.setOutput(binary[6] === "1");
//         inputB1.setOutput(binary[5] === "1");
//         inputA2.setOutput(binary[4] === "1");
//         inputB2.setOutput(binary[3] === "1");
//         inputA3.setOutput(binary[2] === "1");
//         inputB3.setOutput(binary[1] === "1");
//         carryIn.setOutput(binary[0] === "1");

//         // FOR FIRST ADDER
//         const aXorb = computeXor(inputA0.output, inputB0.output);
//         // calculated sum is ((a xor b) xor carry_in)
//         const sumS0 = computeXor(aXorb, carryIn.output);
//         // calculated carry is a.b + (a xor b).c
//         const carryC1 = computeOr(
//             computeAnd(inputA0.output, inputB0.output),
//             computeAnd(aXorb, carryIn.output)
//         );

//         // FOR SECOND ADDER
//         const aXorb2 = computeXor(inputA1.output, inputB1.output);
//         // calculated sum is ((a xor b) xor carry_in)
//         const sumS1 = computeXor(aXorb2, carryC1);
//         // calculated carry is a.b + (a xor b).c
//         const carryC2 = computeOr(
//             computeAnd(inputA1.output, inputB1.output),
//             computeAnd(aXorb2, carryC1)
//         );

//         // FOR THIRD ADDER
//         const aXorb3 = computeXor(inputA2.output, inputB2.output);
//         // calculated sum is ((a xor b) xor carry_in)
//         const sumS2 = computeXor(aXorb3, carryC2);
//         // calculated carry is a.b + (a xor b).c
//         const carryC3 = computeOr(
//             computeAnd(inputA2.output, inputB2.output),
//             computeAnd(aXorb3, carryC2)
//         );

//         // FOR FOURTH ADDER
//         const aXorb4 = computeXor(inputA3.output, inputB3.output);
//         // calculated sum is ((a xor b) xor carry_in)
//         const sumS3 = computeXor(aXorb4, carryC3);
//         // calculated carry is a.b + (a xor b).c
//         const carryCout = computeOr(
//             computeAnd(inputA3.output, inputB3.output),
//             computeAnd(aXorb4, carryC3)
//         );

//         // simulate the circuit
//         testSimulationFA(fA, gates_list);
//         const sumSout0 = gates_list[outputS0].output;
//         const sumSout1 = gates_list[outputS1].output;
//         const sumSout2 = gates_list[outputS2].output;
//         const sumSout3 = gates_list[outputS3].output;
//         const carryOut = gates_list[outputCout].output;

//         if (
//             sumS0 != sumSout0 ||
//             sumS1 != sumSout1 ||
//             sumS2 != sumSout2 ||
//             sumS3 != sumSout3 ||
//             carryCout != carryOut
//         ) {
//             circuitIsCorrect = false;
//             break;
//         }
//     }

//     const result = document.getElementById("result");

//     if (circuitIsCorrect) {
//         result.innerHTML = "<span>&#10003;</span> Success";
//         result.className = "success-message";
//     } else {
//         result.innerHTML = "<span>&#10007;</span> Fail";
//         result.className = "failure-message";
//     }
// }
