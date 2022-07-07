import { setCoordinates,fillInputDots,fillColor,objectDisappear,objectAppear,setColor,unsetColor,calculateAnd,calculateFullAdder,calculateMux,calculateOr,calculateXor} from "./animation-utility.js";
'use strict';

window.appendInputA = appendInputA;
window.appendInputB = appendInputB;
window.appendInputCin = appendInputCin;
window.appendInputS1 = appendInputS1;
window.appendInputS2 = appendInputS2;
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
const instructionBox = document.getElementsByClassName("instructions-box")[0];

const svg = document.querySelector(".svg");
const svgns = "http://www.w3.org/2000/svg";

const EMPTY="";
// stroing the necessary div elements in const
const status = document.getElementById("play-or-pause");
const observ = document.getElementById("observations");
const speed = document.getElementById("speed");

// global varaibles declared here
const OBJECTS = [
    document.getElementById("inputa"),
    document.getElementById("inputb"),
    document.getElementById("cin"),
    document.getElementById("inputs1"),
    document.getElementById("inputs2"),
    document.getElementById("cout"),
    document.getElementById("outputf")
];
const TEXTINPUT = [
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text")
];
const TEXTOUTPUT = [
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text")
];
const DOTS = [
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
    for( const text of TEXTINPUT){
        text.textContent = 2;
    }
}


// function to mark the output coordinates
function outputCoordinates() {
    setCoordinates(675,174,TEXTOUTPUT[0]);
    svg.append(TEXTOUTPUT[0]);
    setCoordinates(675,355,TEXTOUTPUT[1]);
    svg.append(TEXTOUTPUT[1]);
}

// function to mark the input dots
function inputDots() {
    for(const dot of DOTS){
        fillInputDots(dot,20,550,15,"#FF0000");
        svg.append(dot);
    }
}

// function to disappear the input dots
function inputDotDisappear() {
    for(const dot of DOTS){
        objectDisappear(dot);
    }
}

// function to appear the input dots
function inputDotVisible() {
    for(const dot of DOTS){
        objectAppear(dot);
    }
}
// function to disappear the output text
function outputDisappear() {
    for(const text of TEXTOUTPUT){
        objectDisappear(text);
    }
}
// function to appear the output text
function outputVisible() {
    for(const text of TEXTOUTPUT){
        objectAppear(text);
    }
}
// function to diappear the input text
function inputTextDisappear() {
    for(const text of TEXTINPUT){
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
    for(const object of OBJECTS){
        fillColor(object,"#008000");
    }
}

function appendInputA() {
    if (TEXTINPUT[0].textContent !== "0" && timeline.progress() === 0) {
        changeto0(45,115,0,0);
    }
    else if (TEXTINPUT[0].textContent !== "1" && timeline.progress() === 0) {
        changeto1(45,115,0,0);
    }
    for(let i=0;i<4;i++){
        setter(TEXTINPUT[0].textContent,DOTS[i]);
    }
}
function appendInputB() {
    if (TEXTINPUT[1].textContent !== "0" && timeline.progress() === 0) {
        changeto0(95,115,1,1);
    }
    else if (TEXTINPUT[1].textContent !== "1" && timeline.progress() === 0) {
        changeto1(95,115,1,1);
    }
    for(let i=4;i<8;i++){
        setter(TEXTINPUT[1].textContent,DOTS[i]);
    }
}
function appendInputCin() {
    if (TEXTINPUT[2].textContent !== "0" && timeline.progress() === 0) {
        changeto0(245,115,2,2);
    }
    else if (TEXTINPUT[2].textContent !== "1" && timeline.progress() === 0) {
        changeto1(245,115,2,2);
    }
    setter(TEXTINPUT[2].textContent,DOTS[8]);
}

function appendInputS1() {
    if (TEXTINPUT[3].textContent !== "0" && timeline.progress() === 0) {
        changeto0(515,125,3,3);
    }
    else if (TEXTINPUT[3].textContent !== "1" && timeline.progress() === 0) {
        changeto1(515,125,3,3);
    }
    setter(TEXTINPUT[3].textContent,DOTS[9]);
}

function appendInputS2() {
    if (TEXTINPUT[4].textContent !== "0" && timeline.progress() === 0) {
        changeto0(545,125,4,4);
    }
    else if (TEXTINPUT[4].textContent !== "1" && timeline.progress() === 0) {
        changeto1(545,125,4,4);
    }
    setter(TEXTINPUT[4].textContent,DOTS[10]);
}

function changeto1(coordinateX,coordinateY,object,textObject) {
    TEXTINPUT[textObject].textContent = 1;
    svg.appendChild(TEXTINPUT[textObject]);
    setCoordinates(coordinateX,coordinateY,TEXTINPUT[textObject]);
    fillColor(OBJECTS[object],"#29e");
    clearObservation();
    objectAppear(TEXTINPUT[textObject]);
}

function changeto0(coordinateX,coordinateY,object,textObject) {
    TEXTINPUT[textObject].textContent = 0;
    svg.appendChild(TEXTINPUT[textObject]);
    setCoordinates(coordinateX,coordinateY,TEXTINPUT[textObject]);
    fillColor(OBJECTS[object],"#eeeb22");
    clearObservation();
    objectAppear(TEXTINPUT[textObject]);
}

function halfStage() {
    setter(calculateAnd(TEXTINPUT[0].textContent,TEXTINPUT[1].textContent),DOTS[1]);
    setter(calculateOr(TEXTINPUT[0].textContent,TEXTINPUT[1].textContent),DOTS[2]);
    setter(calculateXor(TEXTINPUT[0].textContent,TEXTINPUT[1].textContent),DOTS[3]);
    let arr = calculateFullAdder(TEXTINPUT[0].textContent,TEXTINPUT[1].textContent,TEXTINPUT[2].textContent);
    setter(arr[0],DOTS[0]);
    setter(arr[1],DOTS[4]);
}

function partialDotDisappear() {
    for(let i=0;i<9;i++){
        objectDisappear(DOTS[i]);
    }
}

function partialDotAppear(){
    for(let i=0;i<5;i++){
        objectAppear(DOTS[i]);
    }
}

function fullStage(){
    for(let i=0;i<10;i++){
        if(i!==4){
            objectDisappear(DOTS[i]);
        }   
    }
    setter(calculateMux(TEXTINPUT[0].textContent,TEXTINPUT[1].textContent,TEXTINPUT[2].textContent,TEXTINPUT[3].textContent,TEXTINPUT[4].textContent),DOTS[10])
}

function outputSetter(){
    inputDotDisappear();
    let arr = calculateFullAdder(TEXTINPUT[0].textContent,TEXTINPUT[1].textContent,TEXTINPUT[2].textContent);
    TEXTOUTPUT[0].textContent = arr[1];
    TEXTOUTPUT[1].textContent = calculateMux(TEXTINPUT[0].textContent,TEXTINPUT[1].textContent,TEXTINPUT[2].textContent,TEXTINPUT[3].textContent,TEXTINPUT[4].textContent);
    setter(TEXTOUTPUT[0].textContent,OBJECTS[5]);
    setter(TEXTOUTPUT[1].textContent,OBJECTS[6]);
}

function display() {
    observ.innerHTML = "Simulation has finished. Press Restart to start again"
}

function reboot() {
    for(const text of TEXTINPUT){
        text.textContent = 2;
    }
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
    if (circuitStarted) {
        timeline.timeScale(parseInt(speed));
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
    reboot();
    clearObservation();
    decide = false;
    status.innerHTML = "Start";
    observ.innerHTML = "Successfully restored";
    speed.selectedIndex = 0;
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
        observ.innerHTML = "Simulation has been stopped.";
        decide = false;
        status.innerHTML = "Start";
        speed.selectedIndex = 0;
    }
    else if (timeline.progress() === 1) {
        observ.innerHTML = "Please Restart the simulation";
    }
}
function startCircuit() {
    for(const text of TEXTINPUT){
        if (text.textContent === "2") {
            observ.innerHTML = "Please set the input values";
            return;
        }
    }
    if (timeline.progress() !== 1) {
        if (!circuitStarted) {
            circuitStarted = true;
        }
        timeline.play();
        timeline.timeScale(1);
        observ.innerHTML = "Simulation has started.";
        decide = true;
        status.innerHTML = "Pause";
        speed.selectedIndex = 0;
    }
    else if (timeline.progress() === 1) {
        observ.innerHTML = "Please Restart the simulation";
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
timeline.eventCallback("onComplete", outputVisible);
timeline.eventCallback("onComplete", display);
timeline.to(DOTS[0], {
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
timeline.to(DOTS[1], {
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
timeline.to(DOTS[2], {
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
timeline.to(DOTS[3], {
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
timeline.to(DOTS[4], {
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
timeline.to(DOTS[5], {
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
timeline.to(DOTS[6], {
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
timeline.to(DOTS[7], {
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
timeline.to(DOTS[8], {
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
timeline.to(DOTS[9], {
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
timeline.to(DOTS[10], {
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
timeline.to(DOTS[0], {
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
timeline.to(DOTS[1], {
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
timeline.to(DOTS[2], {
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
timeline.to(DOTS[3], {
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
timeline.to(DOTS[4], {
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
timeline.to(DOTS[10], {
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
