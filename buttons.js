
function tickButton(){
    // upon user clicking yes / correct / tick,
    // backprop the model
    // console.log(textModel);
    textModel = Model.backprop(true, textModel, lr);
    // console.log(textModel);
    save("TextModel",textModel);    
    textInput.value += " " + outputWord.innerText;
    submit();
    return textModel;
}

function crossButton(){
    // upon user clicking yes / correct / tick,
    // backprop the model
    // console.log(textModel);
    textModel = Model.backprop(false, textModel, lr);
    // console.log(textModel);
    save("TextModel",textModel);
    submit();
    return textModel;
    // under reshuffle, weights should not change but inputs random
}
function inputToText(self){
    if (/[^a-zA-Z\d]/.test(self.innerText)){
        textInput.value += self.innerText;
    }else if (/[.!?]/.test(self.innerText)){
        let str = self.innerText.replace(self.innerText[0],self.innerText[0].toUpperCase());
        textInput.value += str + " ";
    }else{
        textInput.value += " " + self.innerText;
    }
}