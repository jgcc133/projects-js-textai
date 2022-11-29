
function tickButton(){
    // upon user clicking yes / correct / tick,
    // backprop the model
    // console.log(textModel);
    textModel = Model.backprop(true, textModel, lr);
    // console.log(textModel);
    save("TextModel",textModel);
    return textModel;
}

function crossButton(){
    // upon user clicking yes / correct / tick,
    // backprop the model
    // console.log(textModel);
    textModel = Model.backprop(false, textModel, lr);
    // console.log(textModel);
    save("TextModel",textModel);
    return textModel;
}