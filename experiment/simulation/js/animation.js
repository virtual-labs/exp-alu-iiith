import { setCoordinates,fillInputDots,fillColor,objectDisappear,objectAppear,setColor,unsetColor,calculateAnd,calculateFullAdder,calculateMux,calculateOr,calculateXor} from "./animation-utility.js";
'use strict';

window.appendInputA = appendInputA;
window.appendInputB = appendInputB;
window.appendInputCin = appendInputCin;
window.appendInputS1 = appendInputS1;
window.appendInputS0 = appendInputS0;
window.simulationStatus = simulationStatus;
window.restartCircuit = restartCircuit;
window.setSpeed=setSpeed;

// Dimensions of working areaS
const circuitBoard = document.getElementById("circuit-board");
const sidePanels = document.getElementsByClassName("v-datalist-container");
// Distance of working area from top
const circuitBoardTop = circuitBoard.offsetTop;
// Full height of window

const windowHeight = window.innerHeight;
const width = window.innerWidth;

const svg = document.querySelector(".svg");
const svgns = "http://www.w3.org/2000/svg";

const EMPTY="";
// stroing the necessary div elements in const
const status = document.getElementById("play-or-pause");
const observ = document.getElementById("observations");
const speed = document.getElementById("speed");

// global varaibles declared here
const objects = [
    document.getElementById("inputa"),
    document.getElementById("inputb"),
    document.getElementById("cin"),
    document.getElementById("inputs1"),
    document.getElementById("inputs2"),
    document.getElementById("cout"),
    document.getElementById("outputf")
];
const textInput = [
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text")
];
const textOutput = [
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text")
];
const dots = [
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle")
];
// First 4 dots emerge from input A0
// Next 4 dots emerge from input B0
// Next dot emerge from Cin
// Next 2 dots emerge from S1 and S2
// First 5 dots are then used to full adder and,nor and xor gate
// First dot is then used to final output



// decide help to decide the speed
let decide = false;
// circuitStarted is initialised to 0 which depicts that demo hasn't started whereas circuitStarted 1 depicts that the demo has started.
let circuitStarted = false;


// function to take care of width
function demoWidth() {
    if (width < 1024) {
        circuitBoard.style.height = "600px";
    } else {
        circuitBoard.style.height = `${windowHeight - circuitBoardTop - 20}px`;
    }
    sidePanels[0].style.height = circuitBoard.style.height;
}

// function to initialise the input text i.e. either 0/1 that gets displayed after user click on them
function textIOInit() {
    for( const text of textInput){
        text.textContent = 2;
    }
}


// function to mark the output coordinates
function outputCoordinates() {
    setCoordinates(675,174,textOutput[0]);
    svg.append(textOutput[0]);
    setCoordinates(675,355,textOutput[1]);
    svg.append(textOutput[1]);
}

// function to mark the input dots
function inputDots() {
    for(const dot of dots){
        fillInputDots(dot,20,550,15,"#FF0000");
        svg.append(dot);
    }
}

// function to disappear the input dots
function inputDotDisappear() {
    for(const dot of dots){
        objectDisappear(dot);
    }
}

// function to appear the input dots
function inputDotVisible() {
    for(const dot of dots){
        objectAppear(dot);
    }
}
// function to disappear the output text
function outputDisappear() {
    for(const text of textOutput){
        objectDisappear(text);
    }
}
// function to appear the output text
function outputVisible() {
    for(const text of textOutput){
        objectAppear(text);
    }
}
// function to diappear the input text
function inputTextDisappear() {
    for(const text of textInput){
        objectDisappear(text);
    }
}

function clearObservation() {
    observ.innerHTML = EMPTY;
}
function allDisappear() {
    inputDotDisappear();
    outputDisappear();
    inputTextDisappear();
    for(const object of objects){
        fillColor(object,"#008000");
    }
}

// returns true if the inputs can be changed; a finished simulation is rewound so that new inputs can be tried
function inputsEditable() {
    if (timeline.progress() === 1) {
        rewind();
    }
    if (timeline.progress() !== 0) {
        observ.innerHTML = "Inputs cannot be changed while the simulation is running. Please click on Reset to change them.";
        return false;
    }
    return true;
}

// colours the dots of every input as per the value of that input
function inputDotColours() {
    for(let i=0;i<4;i++){
        setter(textInput[0].textContent,dots[i]);
    }
    for(let i=4;i<8;i++){
        setter(textInput[1].textContent,dots[i]);
    }
    setter(textInput[2].textContent,dots[8]);
    setter(textInput[3].textContent,dots[9]);
    setter(textInput[4].textContent,dots[10]);
}

// toggles the value of an input bit between 0 and 1
function toggleInput(index,coordinateX,coordinateY) {
    if (!inputsEditable()) {
        return;
    }
    if (textInput[index].textContent !== "0") {
        changeto0(coordinateX,coordinateY,index,index);
    }
    else {
        changeto1(coordinateX,coordinateY,index,index);
    }
    inputDotColours();
}

// sets all the inputs to 0 so that the simulation can be started right away
function initInputs() {
    textIOInit();
    appendInputA();
    appendInputB();
    appendInputCin();
    appendInputS1();
    appendInputS0();
}

function appendInputA() {
    toggleInput(0,45,115);
}
function appendInputB() {
    toggleInput(1,95,115);
}
function appendInputCin() {
    toggleInput(2,245,115);
}
function appendInputS1() {
    toggleInput(3,515,125);
}
function appendInputS0() {
    toggleInput(4,545,125);
}

function changeto1(coordinateX,coordinateY,object,textObject) {
    textInput[textObject].textContent = 1;
    svg.appendChild(textInput[textObject]);
    setCoordinates(coordinateX,coordinateY,textInput[textObject]);
    fillColor(objects[object],"#29e");
    clearObservation();
    objectAppear(textInput[textObject]);
}

function changeto0(coordinateX,coordinateY,object,textObject) {
    textInput[textObject].textContent = 0;
    svg.appendChild(textInput[textObject]);
    setCoordinates(coordinateX,coordinateY,textInput[textObject]);
    fillColor(objects[object],"#eeeb22");
    clearObservation();
    objectAppear(textInput[textObject]);
}

function halfStage() {
    setter(calculateAnd(textInput[0].textContent,textInput[1].textContent),dots[1]);
    setter(calculateOr(textInput[0].textContent,textInput[1].textContent),dots[2]);
    setter(calculateXor(textInput[0].textContent,textInput[1].textContent),dots[3]);
    let arr = calculateFullAdder(textInput[0].textContent,textInput[1].textContent,textInput[2].textContent);
    setter(arr[0],dots[0]);
    setter(arr[1],dots[4]);
}

function partialDotDisappear() {
    for(let i=0;i<9;i++){
        objectDisappear(dots[i]);
    }
}

function partialDotAppear(){
    for(let i=0;i<5;i++){
        objectAppear(dots[i]);
    }
}

function fullStage(){
    for(let i=0;i<10;i++){
        if(i!==4){
            objectDisappear(dots[i]);
        }   
    }
    setter(calculateMux(textInput[0].textContent,textInput[1].textContent,textInput[2].textContent,textInput[3].textContent,textInput[4].textContent),dots[10])
}

function outputSetter(){
    inputDotDisappear();
    let arr = calculateFullAdder(textInput[0].textContent,textInput[1].textContent,textInput[2].textContent);
    textOutput[0].textContent = arr[1];
    textOutput[1].textContent = calculateMux(textInput[0].textContent,textInput[1].textContent,textInput[2].textContent,textInput[3].textContent,textInput[4].textContent);
    setter(textOutput[0].textContent,objects[5]);
    setter(textOutput[1].textContent,objects[6]);
}

// description of the operation selected by S1 S0
const OPERATIONS = [
    "addition, so F is the sum bit of A + B + Cin",
    "AND, so F = A . B",
    "OR, so F = A + B",
    "XOR, so F = A xor B"
];

function display() {
    decide = false;
    status.innerHTML = "Start";
    const a = parseInt(textInput[0].textContent);
    const b = parseInt(textInput[1].textContent);
    const cin = parseInt(textInput[2].textContent);
    const select = parseInt(textInput[3].textContent) * 2 + parseInt(textInput[4].textContent);
    observ.innerHTML = `Simulation has finished.<br>A = ${a}, B = ${b}, Cin = ${cin}, S1 S0 = ${textInput[3].textContent}${textInput[4].textContent}<br>The multiplexer selects ${OPERATIONS[select]}: F = ${textOutput[1].textContent}.<br>Cout = ${textOutput[0].textContent} (the carry of the full adder; it is meaningful only for addition).<br>Click on an input to change it and then click on Start to simulate again.`;
}

// takes the timeline back to the beginning while keeping the selected input values
function rewind() {
    timeline.seek(0);
    timeline.pause();
    inputDotDisappear();
    inputDotColours();
    outputDisappear();
    fillColor(objects[5],"#008000");
    fillColor(objects[6],"#008000");
    decide = false;
    status.innerHTML = "Start";
}

function setter(value, component) {
    if (value === "1") {
        unsetColor(component);
    }
    else if (value === "0") {
        setColor(component);
    }
}

function setSpeed(speed) {
    timeline.timeScale(parseInt(speed));
    if (circuitStarted) {
        observ.innerHTML = `${speed}x speed`;
    }
}

function restartCircuit() {
    if (circuitStarted) {
        circuitStarted = false;
    }
    timeline.seek(0);
    timeline.pause();
    allDisappear();
    initInputs();
    decide = false;
    status.innerHTML = "Start";
    observ.innerHTML = "Successfully restored";
    speed.selectedIndex = 0;
    timeline.timeScale(1);
}

function simulationStatus() {
    if (!decide) {
        startCircuit();
    }
    else if (decide) {
        stopCircuit();
    }
}
function stopCircuit() {
    if (timeline.time() !== 0 && timeline.progress() !== 1) {
        timeline.pause();

        observ.innerHTML = "Simulation has been Paused. Please click on the 'Start' button to Resume.";
        decide = false;
        status.innerHTML = "Start";
    }
}
function startCircuit() {
    if (timeline.progress() === 1) {
        rewind();
    }
    if (timeline.progress() !== 1) {
        if (!circuitStarted) {
            circuitStarted = true;
        }
        timeline.play();
        timeline.timeScale(parseInt(speed.value));
        observ.innerHTML = "Simulation has started.";
        decide = true;
        status.innerHTML = "Pause";
    }
}

// all the execution begin here
let timeline = gsap.timeline({ repeat: 0, repeatDelay: 0 });
gsap.registerPlugin(MotionPathPlugin);
demoWidth();
// calling all the functions that are going to initialise 
textIOInit();
outputCoordinates();
inputDots();
outputDisappear();

timeline.add(inputDotVisible, 0);
timeline.add(halfStage,10);
timeline.add(partialDotDisappear, 10);
timeline.add(partialDotAppear, 12);
timeline.add(fullStage,21);
timeline.add(outputSetter,26);
timeline.add(outputVisible,27);
timeline.eventCallback("onComplete", display);
timeline.to(dots[0], {
    motionPath: {
        path: "#path1",
        align: "#path1",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 10,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[1], {
    motionPath: {
        path: "#path2",
        align: "#path2",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 10,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[2], {
    motionPath: {
        path: "#path3",
        align: "#path3",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 10,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[3], {
    motionPath: {
        path: "#path4",
        align: "#path4",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 10,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[4], {
    motionPath: {
        path: "#path5",
        align: "#path5",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 10,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[5], {
    motionPath: {
        path: "#path6",
        align: "#path6",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 10,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[6], {
    motionPath: {
        path: "#path7",
        align: "#path7",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 10,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[7], {
    motionPath: {
        path: "#path8",
        align: "#path8",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 10,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[8], {
    motionPath: {
        path: "#path9",
        align: "#path9",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 10,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[9], {
    motionPath: {
        path: "#path16",
        align: "#path16",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 20,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[10], {
    motionPath: {
        path: "#path17",
        align: "#path17",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 20,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[0], {
    motionPath: {
        path: "#path11",
        align: "#path11",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 10,
    delay: 11,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[1], {
    motionPath: {
        path: "#path12",
        align: "#path12",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 10,
    delay: 11,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[2], {
    motionPath: {
        path: "#path13",
        align: "#path13",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 10,
    delay: 11,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[3], {
    motionPath: {
        path: "#path14",
        align: "#path14",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 10,
    delay:11,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[4], {
    motionPath: {
        path: "#path10",
        align: "#path10",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 15,
    delay:11,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(dots[10], {
    motionPath: {
        path: "#path15",
        align: "#path15",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 5,
    delay:21,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.pause();
inputDotDisappear();
initInputs();
