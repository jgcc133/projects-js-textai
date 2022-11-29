/* WordDict structure:
WordDict: {
    wordCount: SVGAnimatedInteger,
    words: {
        word1String: {
            i: integer index in the dictionary,
            count: integer,
            word: string
        },
        word2String:{
            i: integer index in the dictionary,
            count: integer,
            word: string
        }
    }
} */

class WordDict {
    constructor(){
        this.wordCount = 0;
        this.uniqueCount = 0;
        this.words = {};
    }
    static x(idx, dict){
        return Object.values(dict.words)[idx].word;
        
    }
    static w(word, dict){
        return dict.words[word].word;
    }
    static dump(text, dict){
        let wordArray = this.#split(text);
        for (let i = 0; i< wordArray.length; i++){
            if (dict.wordCount == 0){
                dict.words[wordArray[i]] = new Word(wordArray[i], dict.uniqueCount);
                dict.wordCount += 1;
                dict.uniqueCount += 1;
            }else if(dict.words[wordArray[i]]){
                // Add count to word
                dict.words[wordArray[i]].count += 1;
                dict.wordCount += 1;
            }else{
                // Add word to dict; add wordCount
                dict.words[wordArray[i]] = new Word(wordArray[i], dict.uniqueCount);                
                dict.uniqueCount += 1;
                dict.wordCount += 1;
            }

        }
        return dict;
    }
    static #split(text){
        let words = [];
        words = text.split(' ');
        for (let i=0; i<words.length; i++){
            words[i] = words[i].replaceAll(',', '');
        }
        return words;
    }
    static #pad(array, length){
        if (array.length < length){
            let zeros = length - array.length;
            let newArray = [];
            for (let i=0; i < zeros; i++){
                newArray.push(0)
            }
            newArray.push(array);
            return newArray;
        }
    }
    static #zeros(length){
        let out = [];
        for(let i=0; i<length; i++){
            out.push(0);
        }
        return out;
    }

    static oneHot(text, dict){
        // creates a text 1-hot vector, then pads it based on dict.wordCount
        let wordArray = this.#split(text);
        let oneHotArrays = [];
        
        for (let i=0; i<wordArray.length; i++){
            let oneHotArray = this.#zeros(dict.uniqueCount);
            oneHotArray[dict.words[wordArray[i]].i] = 1;
            oneHotArrays.push(oneHotArray);
        }
        return oneHotArrays;
    }

}

class Word{
    constructor(word, index){
        this.count = 1;
        this.word = word;
        this.i = index;
    }
}