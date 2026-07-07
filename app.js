const API =
"https://script.google.com/macros/s/AKfycbw7tghQa0V5dExb0R9_piVP5aMH_GvUpGrM-UHGxXHzMX0dwdbomRW-7ACT0bK6W7Ii/exec";

let scanner;
let lastScan = "";

const statusBox = () => document.getElementById("status");

function beep() {
    const audio = new Audio(
        "https://actions.google.com/sounds/v1/cartoon/pop.ogg"
    );
    audio.play();
}

async function saveLot(code){

    statusBox().innerHTML="Saving...";

    try{

        await fetch(API,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                lot:code,
                device:navigator.userAgent
            })
        });

        statusBox().innerHTML="✅ Saved<br>"+code;

        if(navigator.vibrate){
            navigator.vibrate(150);
        }

        beep();

    }
    catch(e){

        statusBox().innerHTML="❌ Save Failed";

    }

}

function onScanSuccess(decodedText){

    if(decodedText===lastScan)
        return;

    lastScan=decodedText;

    saveLot(decodedText);

    setTimeout(()=>{
        lastScan="";
    },1500);

}

async function startScanner(){

    scanner=new Html5Qrcode("reader");

    await scanner.start(

        {
            facingMode:"environment"
        },

        {
            fps:10,
            qrbox:250
        },

        onScanSuccess

    );

}

async function stopScanner(){

    if(scanner){

        await scanner.stop();

        statusBox().innerHTML="Scanner stopped";

    }

}

window.onload=function(){

document.getElementById("startBtn")
.addEventListener("click",startScanner);

document.getElementById("stopBtn")
.addEventListener("click",stopScanner);

};