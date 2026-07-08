const API =
"https://script.google.com/macros/s/AKfycbxvNeTGTDlrwNBiKmzt9pzSRYvUw64H0fXC7rojGwOSvMEINZpMPLPlOJqxYgizkz9y/exec";

let scanner;
let lastScan = "";
const ALLOWED_CODES = [
"031","032","034","035",
"041","042","043","044",
"051","052","053","054",
"061","062","063","064",
"071","072","073","074",
"081","082","083","084",
"301","302","303","304",
"646","647",
"521","522","523","524","525","526","527",
"481","482","483","484",
"491","492","493","494",
"621","622","623","624"
];
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

    const result=validateLot(decodedText);

    if(!result.ok){

        statusBox().innerHTML=result.message;

        statusBox().style.color="red";

        if(navigator.vibrate){

            navigator.vibrate([200,100,200]);

        }

        setTimeout(()=>{

            lastScan="";

        },1500);

        return;

    }

    statusBox().innerHTML="Saving...";

    statusBox().style.color="#1565c0";

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
function validateLot(lot){

    if(lot.length!==16){

        return{
            ok:false,
            message:"❌ Lot must be exactly 16 digits"
        };

    }

    const code=lot.substring(5,8);

    if(!ALLOWED_CODES.includes(code)){

        return{
            ok:false,
            message:"❌ Invalid Product Code : "+code
        };

    }

    return{
        ok:true
    };

}
