
const windowSize = 10;
const outputLength = 8;
const output = new Array();
const outputArrays = new Array();
const lr = 0.1

var outputArray = new Array();

const textInput = document.getElementById("textInput");
const textInputDiv = document.getElementById("textInputDiv");
const modelCanvas=document.getElementById("modelCanvas");
const modelCtx=modelCanvas.getContext("2d");
const outputIndex = document.getElementById("binaryOutput");
const outputWord = document.getElementById("textOutput");


modelCanvas.height = window.innerHeight;
modelCanvas.width = 600;
var textModel = new Model([outputLength, 10, outputLength]);
var rewardModel = new Model([outputLength + 1, 5, outputLength]); 

textInput.addEventListener("keypress", function(event){
    if (event.key == "Enter"){
        event.preventDefault();
        document.getElementById("submitButton").click();
    }
});

animate();


function submit(input=document.getElementById("textInput")){
    // 1: Input into Dictionary
    const userInput = getInput(input);
    var wordDict;
    if(retrieve("Dictionary")){
        wordDict = retrieve("Dictionary");
    }
    wordDict = preprocess(userInput, wordDict);
    const oneHotArrays = WordDict.oneHot(userInput, wordDict);
    wordDict = save("Dictionary", wordDict);
    
    // 2: Modelling Text NN
    // With 1-Hot Arrays, create a model - In this example we use RNN
    textModel = new Model([oneHotArrays.length + outputLength, 10, outputLength]);
    for(let i=0; i<outputLength; i++){
        output.push(0);
    }
    var inputArray = [...oneHotArrays[0], ...output];
    
    for (let i=0; i<oneHotArrays.length; i++){
        outputArray = Model.propagate(inputArray, textModel);
        inputArray = [...oneHotArrays[i], ...outputArray];

        // 3: Displaying results in binary form 2^ 8
        // asks user for input - checking if it's correct
        let {index, text} = updateResult(outputArray, wordDict);
        outputIndex.innerText = index;
        outputWord.innerText = text;
        // upon user clicking yes or no (tick cross), weights should be adjusted accordingly
        // (+/- for every tick/cross accordance to contribution)
        outputArrays.push(text);



        // Pending Back Propagation, which should be included in each iteration
        // In conjunction with Reward NN
    }

    save("TextModel", textModel);
    console.log("Logging output words...");
    console.log(outputArrays);

    // 3: Modelling Reward NN

    // console.log("Logging Text Model:");
    // console.log(textModel);
    
    
}

function animate(time){
    modelCanvas.height = window.innerHeight;
    modelCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(modelCtx, textModel);
    requestAnimationFrame(animate);
}

function updateResult(result, wordDict){
    let sum = 0;
    for(let x=0; x < result.length; x++){
        sum += result[x] * (2**x);
    }
    let word = WordDict.x(sum % wordDict.uniqueCount, wordDict);
    
    return {
        index:sum % wordDict.uniqueCount,
        text:word
    }

}
