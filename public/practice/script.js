console.log("hello welcome to shabble");
function $(a){
    return document.getElementsByClassName(a)
}

function takeclueinput(){
    
}



let clue_data = [
    [0,-1,-1],
    [0,-1,-1],
    [0,-1,-1],
    [0,-1,-1],
    [0,-1,-1],
    [0,-1,-1],
    [0,-1,-1]
]
let clueboxes = document.getElementsByClassName('cluebox')
Array.from(clueboxes).forEach(element => {

    element.addEventListener('mouseover',()=>{
        element.style.background = "rgb(0, 103, 159)";

    })
    element.addEventListener('mouseout',()=>{
        element.style.background = "rgb(4, 165, 251)";
    })
});

for(let i=0;i<7;i++){
    clueboxes[i].addEventListener('click',()=>{
        if(clue_data[i][0]===0){
            console.log("It is zero now");
            takeclueinput()
        }
        else{
            console.log("It is one now");
        }
    })
}