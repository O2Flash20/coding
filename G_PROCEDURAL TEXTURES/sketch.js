let BuffersSize = 300

let Shaders = {}
let Buffers = {}

let Layers = {}

const Effects = ["cells", "voronoi", "smoothNoise", "blur", "threshold", "invert", "merge", "noise"]

function preload() {
    for (const effect of Effects) {
        Shaders[effect] = loadShader("basic.vert", effect + ".frag")
        Buffers[effect] = createGraphics(BuffersSize, BuffersSize, WEBGL)
    }
}

function setup() {
    createCanvas(BuffersSize, BuffersSize)

    // needed for the shader stuff to work properly
    for (const effect of Effects) {
        Buffers[effect].shader(Shaders[effect])
    }
}

function draw() {
    background(51)
    noLoop()
}

function changeBufferSizes(size) {
    BuffersSize = size
    for (const buffer in Buffers) {
        Buffers[buffer].resizeCanvas(size, size)
    }
    resizeCanvas(size, size)
}

function renderAndSwitch(effect, Layer) {
    Buffers[effect].shader(Shaders[effect])
    Buffers[effect].rect()
    Layer.image(Buffers[effect].get(), 0, 0)
}

function cells(Layer, numberOfPoints, exposure, seed) {
    Shaders.cells.setUniform("uNumberOfPoints", numberOfPoints)
    Shaders.cells.setUniform("uExposure", exposure)
    Shaders.cells.setUniform("uSeed", seed)

    renderAndSwitch("cells", Layer)
}

function voronoi(Layer, numberOfPoints, seed) {
    Shaders.voronoi.setUniform("uNumberOfPoints", numberOfPoints)
    Shaders.voronoi.setUniform("uSeed", seed)

    renderAndSwitch("voronoi", Layer)
}

function smoothNoise(Layer, detail) {
    Shaders.smoothNoise.setUniform("uDetail", detail)

    renderAndSwitch("smoothNoise", Layer)
}

// amount: 0-1
function blur(Layer, amount) {
    Shaders.blur.setUniform("uLayer", Layer)
    Shaders.blur.setUniform("uAmount", amount)

    renderAndSwitch("blur", Layer)
}

function threshold(Layer, cutoff) {
    Shaders.threshold.setUniform("uLayer", Layer)
    Shaders.threshold.setUniform("uCutoff", cutoff)

    renderAndSwitch("threshold", Layer)
}

function invert(Layer) {
    Shaders.invert.setUniform("uLayer", Layer)

    renderAndSwitch("invert", Layer)
}

// bad idea to only have it merge 2 at a time on the gpu? I'll find out.
function merge(MergeType, MergeDestination, Layers) {
    const nameToNum = ["additive", "others 🙂"]
    Shaders.merge.setUniform("uType", nameToNum.indexOf(MergeType))

    // kick it off with the first two
    Shaders.merge.setUniform("uLayer1", Layers[0])
    Shaders.merge.setUniform("uLayer2", Layers[1])
    Buffers.merge.shader(Shaders.merge)
    Buffers.merge.rect()
    MergeDestination.image(Buffers.merge.get(), 0, 0)
    //

    for (let i = 2; i < Layers.length; i++) {
        debugger
        Shaders.merge.setUniform("uLayer1", MergeDestination)
        Shaders.merge.setUniform("uLayer2", Layers[i])

        Buffers.merge.shader(Shaders.merge)
        Buffers.merge.rect()
        MergeDestination.image(Buffers.merge.get(), 0, 0)
    }
}

/*
also need:
    color mapping on individual layers?
    have a way to set the final image (just the top merge?)

?better name for smoothNoise?

?change smoothNoise to octave voronoise that I make

!at really high resolutions, things seem to be put onto non-WEBGL canvases with their center at the bottom right corner

*seed for smooth noise
    figure out why the corners are always black (a seed thing?)

*contrast effect

*better seed noise from sebastian lague's video
*/