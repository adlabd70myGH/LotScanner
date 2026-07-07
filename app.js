const API =
"https://script.google.com/macros/s/AKfycbw7tghQa0V5dExb0R9_piVP5aMH_GvUpGrM-UHGxXHzMX0dwdbomRW-7ACT0bK6W7Ii/exec";

let lastCode = "";

function saveLot(code){

    fetch(API,{
        method:"POST",
        body:JSON.stringify({
            lot:code,
            device:"Samsung Galaxy A07"
        })
    })
    .then(r=>r.json())
    .then(data=>{
        document.getElementById("status").innerHTML=
        "✅ Saved<br>"+code;

        if(navigator.vibrate){
            navigator.vibrate(200);
        }
    });

}

function onScanSuccess(decodedText){

    if(decodedText===lastCode)
        return;

    lastCode=decodedText;

    document.getElementById("status").innerHTML=
    "Saving...";

    saveLot(decodedText);

    setTimeout(()=>{
        lastCode="";
    },1500);

}

window.onload=function(){

    const scanner=new Html5Qrcode("reader");

    scanner.start(
        { facingMode:"environment" },
        {
            fps:10,
            qrbox:250
        },
        onScanSuccess
    );

};