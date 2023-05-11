const wsUri = "wss://echo-ws-service.herokuapp.com/";
const output = document.getElementById("output");
let websocket;
let geo=false;

function writeToScreen(message) {
    let pre = document.createElement("div");
    pre.style.wordWrap = "break-word";
    pre.classList.add('item');
    pre.innerHTML = message;
    output.appendChild(pre);
}

websocket = new WebSocket(wsUri);
websocket.onopen = function(evt) {
    writeToScreen("Соединение установлено");
};
websocket.onclose = function(evt) {
    writeToScreen("Соединение закрыто, обновите страницу");
};
websocket.onmessage = function(evt) {
    if(!geo){
        output.innerHTML +='<div class="resp">' + evt.data+'</div>';
    }
};
websocket.onerror = function(evt) {
    writeToScreen(
        '<span style="color: red;">Ошибка:</span> ' + evt.data
    );
};


document.querySelector('#btnclick')
    .addEventListener('click', event => {
        if (event.target.className === 'send') {
            //клик по кнопке "Отправить"
            const message = msg.value;
            if (!message) return;
            output.innerHTML +='<div class="sent">' + message + '</div>';
            websocket.send(message);
            geo=false;
            msg.value = "";
        }
        if (event.target.className === 'btn') {
            //клик по кнопке отправить геолокацию
            if (!navigator.geolocation) {
                writeToScreen('Браузер не поддерживает определение местоположения');
            } else {
                navigator.geolocation.getCurrentPosition(success, error);
                geo=true;
            }
        }
});



const btn = document.querySelector('.btn');
// Функция, выводящая текст об ошибке геолокации
const error = () => {
    writeToScreen('Информация о местоположении недоступна');
}
// Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    //Если все успешно - выводим ссылку на геолокацию
    websocket.send(`Широта: ${latitude} °, Долгота: ${longitude} °`);
    output.innerHTML +=`<div class="sent"><a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}" id = "mapLink" target="_blank">Геолокация</a></div>`;
}
