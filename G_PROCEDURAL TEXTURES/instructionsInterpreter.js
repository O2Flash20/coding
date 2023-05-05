function interpretInstructions(input) {
    input = extractWordsAndNumbers(input)
    console.log(input)

    changeBufferSizes(input[0])

    // currentMerge
    // currentMerge's Layers
    // currentMerge is a Layer too
    // currentMerges = [[merge1, additive, [layer1, merge2]], [merge2, additive, [layer2, layer3]]]
    let currentMerges = []
    let currentLayer
    for (let i = 1; i < input.length; i++) {
        if (input[i] == "Merge") {
            i++; const name = input[i]
            i++; const type = input[i]

            if (currentMerges.length > 0) {
                currentMerges[currentMerges.length - 1][2].push(name)
            }
            currentMerges.push([name, type, []])

            Layers[name] = createGraphics(BuffersSize, BuffersSize)

            i++ //skip over opening bracket
        }
        else if (input[i] == "}") {
            // a merge is ending. merge the things in it and put it onto the layer
            const thisMerge = currentMerges[currentMerges.length - 1]
            // debugger
            merge(thisMerge[1], Layers[thisMerge[0]], Layers[thisMerge[2][0]], Layers[thisMerge[2][1]])

            // currentMerges.splice(currentMerges.length - 1, 1)
        }
        else if (input[i] == "Layer") {
            i++

            // add to the latest merge
            if (currentMerges.length > 0) {
                currentMerges[currentMerges.length - 1][2].push(input[i])
            }

            currentLayer = input[i]
            Layers[currentLayer] = createGraphics(BuffersSize, BuffersSize)
        }
        else if (input[i] == "cells") {
            i++; const numPoints = input[i]
            i++; const exposure = input[i]
            i++; const seed = input[i]
            cells(Layers[currentLayer], numPoints, exposure, seed)
        }
        else if (input[i] == "blur") {
            i++; const amount = input[i]
            blur(Layers[currentLayer], amount)
        }
    }
}

function enter() {
    interpretInstructions(document.getElementById("input").value)
}

// thanks chatgpt buddy 🙂
function extractWordsAndNumbers(input) {
    // Replace new lines and tabs with spaces
    var normalizedInput = input.replace(/\n|\t/g, ' ')

    // Split the normalized input by spaces
    var wordsAndNumbers = normalizedInput.split(' ')

    // Filter out empty elements
    wordsAndNumbers = wordsAndNumbers.filter(function (element) {
        return element !== ''
    })

    return wordsAndNumbers
}
