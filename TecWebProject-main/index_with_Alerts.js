function hideLogInUser(){
    hideLogIn();
    showUsername();
}

function hideLogInGuest(){
    hideLogIn();
    showGuest();
}

function hideLogIn(){

    document.getElementById("loginDiv").style.visibility = "hidden";

    document.getElementById("settingsDiv").style.visibility = "visible";

    document.getElementById("bottom_container").style.visibility = "visible";
}

function showUsername() { 
    var username = document.createTextNode(document.getElementById("u_name").value);
    document.getElementById("user").appendChild(username);
}

function showGuest(){
    guest = document.createTextNode("guest");
    document.getElementById("user").appendChild(guest);
}

//Question: Is there a more efficient way to just hide the board or the config depending on where are we in the game?

function showInstructions(){

    document.getElementById('scores').style.visibility = "hidden";
    document.getElementById('instructions').style.visibility = "visible";

}
/*Change Instruction showed*/
function changeInstruction(flag) {
    if(flag == 1) {
        document.getElementById('start').style.visibility = "visible";
        document.getElementById('capture').style.visibility = "hidden";
        document.getElementById('end').style.visibility = "hidden";
    }
    else if (flag == 2) {
        document.getElementById('start').style.visibility = "hidden";
        document.getElementById('capture').style.visibility = "visible";
        document.getElementById('end').style.visibility = "hidden";
    }
    else {
        document.getElementById('start').style.visibility = "hidden";
        document.getElementById('capture').style.visibility = "hidden";
        document.getElementById('end').style.visibility = "visible";
    }

}   

function hideInstructions(){
    document.getElementById('instructions').style.visibility = "hidden";
    document.getElementById('start').style.visibility = "hidden";   
    document.getElementById('capture').style.visibility = "hidden";   
    document.getElementById('end').style.visibility = "hidden"; 
}

function showScores(){
    document.getElementById('instructions').style.visibility = "hidden";
    document.getElementById('scores').style.visibility = "visible";
}

function hideScores(){
    document.getElementById('scores').style.visibility = "hidden";
}


var n_cav;
var n_seed;
var difficulty;
var turn = 1;
var p1;
var p2;
const user = document.getElementById('u_name');
const pwd = document.getElementById('p_name');


/* Also Generates the board */
function hideConfigAndSubmit() {
    
    const radios = document.getElementsByName('n_cav');

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            n_cav = radios[i].value
            break;
        }
    }

    var pc_play = document.getElementsByName('pc_play');

    if(pc_play[0].checked) {
        var n = document.getElementById('select_dif');
        difficulty = n.value;
    }

    n_seed = document.getElementById('n_seed').value;

    document.getElementById('settingsDiv').style.visibility = "hidden";
    document.getElementById('difficulty').style.visibility = "hidden";
    document.getElementById('select_dif').style.visibility = "hidden";
    document.getElementById('board').style.visibility = "visible";

    var board = document.getElementById('board');
    var storage_1 = document.createElement('div');

    storage_1.id = "storage_1";
    storage_1.className = "storage";

    board.appendChild(storage_1);
    
    var game_area = document.createElement('div');
    game_area.id = "game_area";
    board.appendChild(game_area);

    for (var a = 0; a<n_cav; a++) {
        game_area.appendChild(createCollumn(a));
    }

    var storage_2 = document.createElement('div');

    storage_2.id = "storage_2";
    storage_2.className = "storage";

    board.appendChild(storage_2);

    p1 = new Player(user,n_cav,n_seed);
    p2 = new Player("PC",n_cav,n_seed);
}

/* Creates each column with 1 cavity for each player */
function createCollumn(index) {
    var column = document.createElement('div');
    var cavity_1 = document.createElement('div');
    var cavity_2 = document.createElement('div');
    cavity_1.id = "cavity"+index+"p1";
    cavity_2.id = "cavity"+index+"p2";

    cavity_1.className = "cavity";
    cavity_2.className = "cavity";

    column.className = "column";
    column.style.width = (100/n_cav)+'%';

    column.appendChild(cavity_1);
    column.appendChild(cavity_2);

    
    cavity_1.onclick = ((fun,pos,p) => {
        return () => fun(pos,p);
    })(this.play.bind(this),index,1);

    cavity_2.onclick = ((fun,pos,p) => {
        return () => fun(pos,p);
    })(this.play.bind(this),index,2);

    return column;
}

/*Recreate the new board each time there's a play*/
class Player {

    constructor (uname,n_cav,n_seed) {
        this.uname = uname;
        this.n_cav = n_cav;
        this.n_seeds = n_seed;
        this.cav_array = [];
        this.storage = 0;
        this.victory = 0;
        for(var i = 0; i<n_cav; i++) {
            this.cav_array.push(n_seed);
        }
    }
}

const turnName = ["Jogador 1","Jogador 2"]
var started = 0;

/* Just starts the game */
function startGame(){
    if(started == 1){
        alert("O jogo já começou");
        return;
    }
    started = 1;
    p1.storage = 0;
    p2.storage = 0;

    document.getElementById('state').style.visibility = "visible";
    
    fillSpots();
}

function play(index,p) {
    if(started != 1){
        alert("Carregue em Começar o Jogo");
        return;
    }
    //P1 Plays
    if(p == 1 && turn == 1) {
        //Number of seeds Available to spread
        let temp = p1.cav_array[index];
        if(temp == 0){
            //No seeds, choose another cav
            alert("Escolher outra cavidade, essa está vazia");
            return;
        }
        else {
            //Empty chosen
            p1.cav_array[index] = 0;
            while(temp != 0) {
                index--;
                temp--;
                //Feed P1 cav - Counter ClockWise
                for(let i = index; i>=0; i--) {
                    p1.cav_array[i]++;
                    //Ended on P1 cav - P2 plays
                    if(temp == 0) {
                        turn = 2;
                        alert("p1: "+p1.cav_array+"Storage: "+p1.storage);
                        alert("p2: "+p2.cav_array+"Storage: "+p2.storage);
                        //fillSpots();
                        return;
                    }
                    temp--;
                }
                //Storage P1
                if(index == -1) {
                    p1.storage++;
                    //Storage for last piece - P1 plays again
                    if(temp == 0){
                        turn = 1;
                        alert("p1: "+p1.cav_array+"Storage: "+p1.storage);
                        alert("p2: "+p2.cav_array+"Storage: "+p2.storage);
                        //fillSpots();
                        return;
                    }
                    //Feed P2 cav
                    else {
                        for(let i = 0; i<p2.cav_array.length || temp != 0; i++) {
                            p2.cav_array[i]++;
                            temp--;
                            //Ended on P2 board - P2 turn
                            if(temp == 0) {
                                turn = 2;
                                alert("p1: "+p1.cav_array+"Storage: "+p1.storage);
                                alert("p2: "+p2.cav_array+"Storage: "+p2.storage);
                                //fillSpots();
                                return;
                            }
                        }                     
                    }
                }
                //Did not finished temp
                index = p1.cav_array.length;  
            }
            turn = 2;
            alert("p1: "+p1.cav_array+"Storage: "+p1.storage);
            alert("p2: "+p2.cav_array+"Storage: "+p2.storage);
            //fillSpots();
            return;
        }
    }
    //Not P1 turn
    else if(p == 1 && turn == 2){
        alert("Não é a sua vez de jogar");
        return;
    }
    //P2 Plays
    if(p == 2 && turn == 2) {
        alert("p1: "+p1.cav_array+"Storage: "+p1.storage);
        alert("p2: "+p2.cav_array+"Storage: "+p2.storage);
        //Number of seeds Available to spread
        let temp = p1.cav_array[index];
        if(temp == 0){
            //Chose empty cav
            alert("Escolher outra cavidade, essa está vazia");
            return;
        }
        else {
            alert("p1: "+p1.cav_array+"Storage: "+p1.storage);
            alert("p2: "+p2.cav_array+"Storage: "+p2.storage);
            p2.cav_array[index] = 0;
            while(temp != 0) {
                index++;
                temp--;
                //Feed P2 cav - Counter Clock Wise
                for(let i = index; i<p2.cav_array.length; i++) {
                    p2.cav_array[i]++;
                    //Ended on P2 cav - P1 plays
                    if(temp == 0) {
                        turn = 1;
                        alert("p1: "+p1.cav_array+"Storage: "+p1.storage);
                        alert("p2: "+p2.cav_array+"Storage: "+p2.storage);
                        //fillSpots();
                        return;
                    }
                    temp--;
                }
                //Storage P2
                if(index == p2.cav_array.length+1) {
                    p2.storage++;
                    //Storage for last piece - P2 plays again
                    if(temp == 0){
                        turn = 2;
                        alert("p1: "+p1.cav_array+"Storage: "+p1.storage);
                        alert("p2: "+p2.cav_array+"Storage: "+p2.storage);
                        //fillSpots();
                        return;
                    }
                    //Feed P1 cav - Counter ClockWise
                    else {
                        for(let i = 0; i<p1.cav_array.length || temp != 0; i++) {
                            p1.cav_array[i]++;
                            temp--;
                            //Ended on P1 board - P1 turn
                            if(temp == 0) {
                                turn = 1;
                                alert("p1: "+p1.cav_array+"Storage: "+p1.storage);
                                alert("p2: "+p2.cav_array+"Storage: "+p2.storage);
                                //fillSpots();
                                return;
                            }
                        }                     
                    }
                }
                //Did not finished temp
                index = 0;  
            }
            turn = 1;
            alert("p1: "+p1.cav_array+"Storage: "+p1.storage);
            alert("p2: "+p2.cav_array+"Storage: "+p2.storage);
            //fillSpots();
            return;
        }
    }
    else if(p == 2 && turn == 1) {
        alert("Não é a sua vez de jogar");
        return;
    }
    alert("p1: "+p1.cav_array+"Storage: "+p1.storage);
    alert("p2: "+p2.cav_array+"Storage: "+p1.storage);
    //fillSpots();
}

function check_cav() {
    let w_1,w_2 = 0;
    for(let i = 0; i<p1.cav_array.length; i++) {
        if(p1.cav_array[i] != 0) w_1 = 1;
    }
    for(let i = 0; i<p2.cav_array.length; i++) {
        if(p2.cav_array[i] != 0) w_2 = 1;
    }
    if(w_1 == 0 || w_2 == 0) return 0;
    else return 1;
}

function finish_game() {
    if(p1.storage>p2.storage){
        alert("Terminou ganhou p1");
        p1.victory++;
    }
    else{
        alert("Terminou ganhou p2");
        p2.victory++;
    }

    p1.storage = 0;
    p2.storage = 0;

    started = 0;

    alert("Carregue em Começar jogo, para jogar mais uma vez");

}

//Creates Game based on p1 and p2 array
function fillSpots () {
    if(check_cav() == 0){ 
        finish_game();
    }
    var node = document.getElementsByClassName('cavity');
    for(var i = 0; i<node.length; i++) {
        node[i].innerHTML = "";
    }
    
    //alert("all clean");

    var cavity = document.getElementsByClassName('cavity');
    let cav_p1 = 0;
    let cav_p2 = 0;
    for(var i = 0; i<cavity.length; i++) {
        if(i%2 == 0) {
            //alert(i);
            for(var j = 0; j<p1.cav_array[cav_p1]; j++) {
                //alert("creating: "+p1.cav_array[cav_p1]);
                var seed = document.createElement('div');
                cavity[i].appendChild(seed);
                seed.className = "seed";
                seed.style.width = (90/p1.cav_array[cav_p1])+'%';
                seed.style.height = (90/p1.cav_array[cav_p1])+'%';
            }
            cav_p1++;
        }
        else {
            for(var j = 0; j<p2.cav_array[cav_p2]; j++) {
                var seed = document.createElement('div');
                cavity[i].appendChild(seed);
                seed.className = "seed";
                seed.style.width = (90/p2.cav_array[cav_p2])+'%';
                seed.style.height = (90/p2.cav_array[cav_p2])+'%';
            }
            cav_p2++;
        }
    }
}



