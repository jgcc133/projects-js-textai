

function getInput(input){
    return input.value;
}

function preprocess(text, wordDict = new WordDict()){
    // returns a dictionary of {index: {word: value, count: x}}
    words = split(text);
    locations = WordDict.dump(text, wordDict);
    return wordDict;
}

function split(text){
    words = [];
    words = text.split(' ');
    for (let i=0; i<words.length; i++){
        words[i] = words[i].replaceAll(',', '');
    }
    return words;
}

function save(name, item){
    localStorage.setItem(name,JSON.stringify(item));
    return item;
}

function discard(name="Dictionary"){
    localStorage.removeItem(name);
}

function retrieve(name){
    if(localStorage.getItem(name)){
        return JSON.parse(localStorage.getItem(name));
    };
}

function lerp(A,B,t){
    return A+(B-A)*t;
}

function getIntersection(A,B,C,D){
    const tTop=(D.x-C.x)*(A.y-C.y) - (D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x) - (C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x) - (D.x-C.x)*(B.y-A.y);
    if (bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if (t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }
    return null;
}

function polysIntersect(poly1, poly2){
    for(let i=0; i<poly1.length; i++){
        for(let j=0; j<poly2.length; j++){
            const touch = getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            )
            if (touch){
                return true;
            }
        }
    }
    return false;
}

function getRGBA(value){
    const alpha=Math.abs(value);
    const R=value<0?0:255;
    const G=R;
    const B=value>0?0:255;
    return "rgba("+R+","+G+","+B+","+alpha+")";
}

function getRandomColor(){
    const hue=290+Math.random()*260;
    return "hsl("+hue+", 100%, 60%)";
}