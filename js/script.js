document.addEventListener('DOMContentLoaded', function () {
    let casillasPintadas = [];
    //General
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let pintar = document.getElementById('pintar');
    let ctxPintar = pintar.getContext('2d');
    let anchoCasilla, altoCasilla, ancho, alto, pixelTamanio;
    //herramientas
    let modoPintar = true;
    let modoBorrado = false;
    //inputs
    let numAncho = document.getElementById('txtAncho');
    let numAlto = document.getElementById('txtAlto');
    let btnModificar = document.getElementById('btnModificar');
    let btnLimpiar = document.getElementById('btnLimpiar');
    let btnModoBorrado = document.getElementById('btnModoBorrado') 
    let btnModoPintar = document.getElementById('btnModoPintar') 
    btnModificar.addEventListener('click', function modificarLienzo() {

        actualizarLienzo();
    });

    document.addEventListener('wheel', function (event) {
        if (event.deltaY < 0) {
            pixelTamanio = Math.min(pixelTamanio + 1, 50); //tamaño maximo de celda
        } else {
            pixelTamanio = Math.max(pixelTamanio - 1, 5); //tamaño minimo de celda
        }
        tamanioLienzo();
    });
    btnLimpiar.addEventListener('click', function () {
        casillasPintadas = [];
        tamanioLienzo();
    });
    function actualizarLienzo() {
        ancho = parseInt(numAncho.value);
        alto = parseInt(numAlto.value);
        if (ancho > 64) {
            ancho = 64;
        }
        if (alto > 64) {
            alto = 64;
        }
        if (ancho >= 30 || alto >= 30) {
            pixelTamanio = 10;
        } else {
            pixelTamanio = 20;
        }
        tamanioLienzo();
    }
    function tamanioLienzo() {
        pintar.width = pixelTamanio * ancho;
        pintar.height = pixelTamanio * alto;

        canvas.width = pixelTamanio * ancho;
        canvas.height = pixelTamanio * alto;

        anchoCasilla = pintar.width / ancho;
        altoCasilla = pintar.height / alto;

        dibujarLienzo();
        redibujarCasillasPintadas();
    }
    function dibujarLienzo() {
        for (let y = 0; y < alto; y++) {
            for (let x = 0; x < ancho; x++) {
                if ((x + y) % 2 === 0) {
                    ctx.fillStyle = "gray";
                } else {
                    ctx.fillStyle = "white";
                }
                ctx.fillRect(x * anchoCasilla, y * altoCasilla, anchoCasilla, altoCasilla);
            }
        }
        for (let y = 0; y < alto; y++) {
            for (let x = 0; x < ancho; x++) {
                ctxPintar.fillStyle = "transparent";
                ctxPintar.fillRect(x * anchoCasilla, y * altoCasilla, anchoCasilla, altoCasilla);
            }
        }
    }

    function redibujarCasillasPintadas() {
        for (let casilla of casillasPintadas) {
            ctxPintar.fillStyle = casilla.color;
            ctxPintar.fillRect(casilla.x * anchoCasilla, casilla.y * altoCasilla, anchoCasilla, altoCasilla);
        }
    }
    //pincel herramientas y si hace click
        
    btnModoBorrado.addEventListener('click', function(){
        modoPintar = false;
        modoBorrado = true;
        console.log(modoPintar)
        console.log(modoBorrado)
    });
    btnModoPintar.addEventListener('click', function(){
        modoPintar = true;
        modoBorrado = false;
        console.log(modoPintar)
        console.log(modoBorrado)
    });
    pintar.addEventListener('click', function (event) {
        let color = document.getElementById('seleccionarColor').value;
        let posicion = pintar.getBoundingClientRect();
        let xClick = event.clientX - posicion.left;
        let yClick = event.clientY - posicion.top;

        let x = Math.floor(xClick / anchoCasilla);
        let y = Math.floor(yClick / altoCasilla);
        if(modoPintar == true){
            ctxPintar.fillStyle = color;
            ctxPintar.fillRect(x * anchoCasilla, y * altoCasilla, anchoCasilla , altoCasilla);
    
            //guardamos la ubicacion y el color de la casilla
            casillasPintadas.push({ x: x, y: y, color: color });
            console.log(casillasPintadas);
        }
        if(modoBorrado == true){
            ctxPintar.clearRect(x * anchoCasilla, y * altoCasilla, anchoCasilla, altoCasilla);

            //eliminamos la casilla pintada verifcando en el array si hay uno igual
            casillasPintadas = casillasPintadas.filter(casilla => !(casilla.x === x && casilla.y === y));
        }
        
    });

    //boton de descargar
    btnDescargar.addEventListener('click', function () {
        //creamos un nuevo lienzo de manera temporal
        let canvasTemporal = document.createElement('canvas');
        canvasTemporal.width = ancho;
        canvasTemporal.height = alto;
        let ctxTemporal = canvasTemporal.getContext('2d');

        for (let y = 0; y < alto; y++) {
            for (let x = 0; x < ancho; x++) {
                ctxTemporal.fillStyle = "transparent";
                ctxTemporal.fillRect(x, y, 1, 1); //cada casilla tendra el tamaño de un pixel
            }
        }

        //dibujamos las casillas pintadas en el lienzo temporal
        for (let casilla of casillasPintadas) {
            ctxTemporal.fillStyle = casilla.color;
            ctxTemporal.fillRect(casilla.x, casilla.y, 1, 1);
        }

        let enlace = document.createElement('a');
        enlace.href = canvasTemporal.toDataURL(); 
        enlace.download = 'mi_dibujo_pixelado.png';
        enlace.click(); 
    });
});
