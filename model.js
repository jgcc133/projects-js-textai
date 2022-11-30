class Model{
    constructor(architecture = [1,1,1]){
        this.layers = new Array();
        this.architecture = architecture;
        for (let i=0; i < architecture.length-1; i++){
            this.layers.push(new Layer(architecture[i], architecture[i+1]));
        }
        this.lCount = this.layers.length;
    }

    static propagate(inputs, model, verbose=false){
        let outputs=Layer.propagate(inputs, model.layers[0]);
        if (verbose){
            console.log(`Logging inputs of NN`);
            console.log(inputs);
            console.log(`Logging Layer 0 of NN`);
            console.log(outputs);
            console.log(`Logging the Weights of Layer 0`);
            console.log(model.layers[0].w);
        }
        for (let i=1; i<model.layers.length; i++){
            outputs = Layer.propagate(outputs, model.layers[i]);
            if (verbose){
                console.log(`Logging Layer ${i} of NN`);
                console.log(outputs);
                console.log(`Logging the Weights of Layer ${i}`);
                console.log(model.layers[i-1].w);
            }
        }
        if (verbose){
            console.log(`Logging the Weights of the Last Layer`);
            console.log(model.layers.at(-1).w);
        }
        // determine if output neurons fire
        outputs = outputs.map(x=> x>0.5? 1:0);
        return outputs;
    }
    static backprop(correct=true, model, lr, verbose=false){
        // first step is change last layer based on output array config
        model.layers[model.layers.length - 1]=Layer.backprop(correct, model.layers.at(-1),lr);

        for (let i=model.layers.length-2; i>=0; i--){
            model.layers[i]=Layer.backprop(correct, model.layers[i],lr);
        }
        return model;
    }

}

class Layer{
    constructor(nIn, nOut){
        this.in = new Array(nIn);
        this.out = new Array(nOut);
        this.b = new Array(nOut);
        this.w = new Array();

        for(let i=0; i<nIn; i++){
            this.w.push(new Array(nOut));
        }
        Layer.#randomize(this);
    }
    
    static propagate(inputs, layer){
        for (let i=0; i<layer.in.length; i++){
            layer.in[i] = inputs[i]
        }
        for (let i=0; i<layer.out.length; i++){
            let sum=0;
            for (let j=0; j<layer.in.length; j++){
                sum+=layer.in[j]*layer.w[j][i];
            }
            sum += layer.b[i];
            layer.out[i] = sum;            
        }
        // activation function
        layer.out = this.#sigmoid(layer.out);
        layer.out = layer.out.map(x => x>0.5? 1 : 0);
        return layer.out;
    }

    static backprop(correct=true, layer, lr, mode="sigmoid"){
        // specific to each output of each neuron
        // correct=true: amplify
        // If neuron 1 output is +ve, set the +ve weights stronger (more +ve) and -ve weights weaker (more +ve)
        // if neuron 2 output is -ve, set the -ve weights stronger (more -ve) and +ve weights weaker (more -ve)
        // correct=true: damp
        // if n1 output is +ve, set the +ve weights weaker (more -ve) and -ve weights stronger (more -ve)
        // if n2 output is -ve, set the +ve weights stronger (more +ve) and -ve weights weaker (more +ve)
        // switch statement outside to compute conditions only once
        let upper = 1;
        let lower = 0;

        switch (mode){
            case "sigmoid":
                upper = 1;
                lower = 0;
                break;
            case "tanh":
                upper = 1;
                lower = -1;
            default:

        }

        const middle = (upper + lower) / 2;

        // condition 1: correct?
        // condition 2: layer.out[i] > or < middle?
        // condition 3: layre.w[i][j] > or < middle? (contributory?)
        let tempW = new Array();
        let tempWCol = new Array();
        if(correct){
            for(let i=0; i<layer.in.length; i++){
                if(layer.out[i] > middle){
                    for(let j=0; j<layer.out.length; j++){                        
                        tempWCol.push((layer.w[i][j] > middle) ? layer.w[i][j] + lr : layer.w[i][j] - lr);
                    }
                }else{
                    for(let j=0; j<layer.out.length; j++){
                        tempWCol.push((layer.w[i][j] > middle) ? layer.w[i][j] - lr : layer.w[i][j] + lr);
                    }
                }
                tempW.push(tempWCol);
                tempWCol = new Array();
            }
            layer.w = tempW;
            tempW = new Array();
        }else{
            for(let i=0; i<layer.in.length; i++){
                if(layer.out[i] > middle){
                    for(let j=0; j<layer.out.length; j++){
                        tempWCol.push((layer.w[i][j] > middle) ? layer.w[i][j] - lr : layer.w[i][j] + lr);
                    }
                }else{
                    for(let j=0; j<layer.out.length; j++){
                        tempWCol.push((layer.w[i][j] > middle) ? layer.w[i][j] + lr : layer.w[i][j] - lr);
                    }
                }                
                tempW.push(tempWCol);
                tempWCol = new Array();
            }
            layer.w = tempW;
            tempW = new Array();
        }
        return layer;
    }

    static #randomize(layer){
        for (let i=0; i<layer.in.length; i++){
            for (let j=0; j<layer.out.length;j++){
                layer.w[i][j]=Math.random()*2-1;
            }
        }
        for (let i=0; i<layer.b.length; i++){
            layer.b[i]=Math.random()*2-1;
        }
    }



    static #sigmoid(array){
        // 1 / (1 + e ^ -x)
        let output=[];
        for(let i=0; i<array.length; i++){
            let x = 1/(1 + Math.E ** -array[i]);
            output.push(x);
        }
        return output;
        }
}