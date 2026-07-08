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

function saveLot(code){

    statusBox().innerHTML = "Saving...";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = API;
    form.target = "hidden_iframe";

    const lot = document.createElement("input");
    lot.type = "hidden";
    lot.name = "lot";
    lot.value = code;

    const device = document.createElement("input");
    device.type = "hidden";
    device.name = "device";
    device.value = navigator.userAgent;

    form.appendChild(lot);
    form.appendChild(device);

    document.body.appendChild(form);

    form.submit();

    document.body.removeChild(form);

    statusBox().innerHTML = "✅ Saved<br>" + code;

    if(navigator.vibrate){
        navigator.vibrate(150);
    }

    beep();
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
