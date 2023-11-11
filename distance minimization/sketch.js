const w = 600
const h = w

let distanceBuffer
let distanceShader

let averageBuffer

let points = [] //"shops"

let densityMap

function preload() {
    distanceBuffer = createGraphics(w, h, WEBGL)
    distanceShader = loadShader("basic.vert", "distance.frag")

    averageBuffer = createGraphics(1, 1)

    densityMap = loadImage("maps/test3.1.png")
}

let startButton
function setup() {
    pixelDensity(1)
    createCanvas(w, h)

    distanceBuffer.shader(distanceShader)

    startButton = createButton("Start")
    startButton.mousePressed(function () {
        points = generatePoints(3)
        generateDistanceField()
        console.log(sumDistances())
    })
    frameRate(1000)
}

let lastLowest = 1000000000
let lowestPos = [[0, 10]]
function draw() {
    background(51, 51, 51, 10)
    // points = generatePoints(1)
    points = [[mouseX, mouseY]]
    generateDistanceField()
    // for (let i = 0; i < points.length; i++) {
    //     ellipse(points[i][0], points[i][1], 10)
    // }
    const avg = averageDistanceField()
    if (avg < lastLowest) {
        lowestPos = points
        lastLowest = avg
        console.log(lastLowest)
    }
    ellipse(lowestPos[0][0], lowestPos[0][1], 10)
    ellipse(300, 300, 5)
}

// glsl can't take 2d arrays, and instead makes vectors itself with a 1d array
function makeArray1d(array) {
    let output = []
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            output.push(array[i][j])
        }
    }
    return output
}

function generatePoints(numPoints) {
    let output = []
    for (i = 0; i < numPoints; i++) {
        output.push([Math.floor(Math.random() * w), Math.floor(Math.random() * h)])
    }
    return output
}

function generateDistanceField() {
    distanceShader.setUniform("uResolution", [w, h])

    const pointsTogether = makeArray1d(points)
    distanceShader.setUniform("uPoints", pointsTogether)
    distanceShader.setUniform("uNumPoints", points.length)
    distanceShader.setUniform("uDensity", densityMap)

    distanceBuffer.shader(distanceShader)
    distanceBuffer.rect(0, 0, w, h)
}

function averageDistanceField() {
    averageBuffer.image(distanceBuffer.get(), 0, 0, 1, 1)
    averageBuffer.loadPixels()
    return (averageBuffer.pixels[0])
}

/*
TODO:
areas people can't walk through? (a separate image)
*/

/* Assumptions:
People can cross through 0-density areas
*/