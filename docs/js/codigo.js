//Objeto temas, con todas las constantes a usar. 
//Los colores los coge de los temas y no se usan. Se usaban al principio cuando 
//
const temas = {
    claro: {
        fondo: "#f4f4f4",
        texto: "#222",
        cabeceras: "#222",
        icono: "bi bi-brightness-high-fill",
        textoBoton: "Cambiar a modo claro",
        archivoCSS: "tema-claro.css"
    },
    oscuro: {
        fondo: "#363b40",
        texto: "#b8bfc6",
        cabeceras: "#dedede",
        icono: "bi bi-moon-fill",
        textoBoton: "Cambiar a modo oscuro",
        archivoCSS: "tema-oscuro.css"
    }
};

// Objeto que contiene las rutas relativas de los archivos CSS
const rutasCSS = {
    'index': 'css/',  
    'troncal': '../../css/', 
    'pildoras': '../../css/' // Es la misma ruta, pero por si en un futuro cambia 
};

// Comprobar cookie al cargar la página y establecer el tema
window.onload = function() {
    const temaActual = getCookie("tema");

    if (temaActual === "claro") {
        setTemaClaro();
    } else {
        setTemaOscuro(); // Por defecto, tema oscuro
    }
};


// Función para establecer el tema claro
function setTemaClaro() {
    console.log("Aplicamos tema claro");
    cargarCSS(obtenerRutaCSS() + temas.claro.archivoCSS);
    
    // El botón ahora es para poner el otro tema
    document.querySelector('#iconoTema').className = temas.oscuro.icono; // Ponemos el icono contrario
    document.querySelector('#tema').setAttribute("title", temas.oscuro.textoBoton);

    // Guardamos el estado en la cookie con caducidad de 7 días
    setCookie("tema", "claro", 30);
}

// Función para establecer el tema oscuro
function setTemaOscuro() {
    console.log("Aplicamos tema oscuro");
    cargarCSS(obtenerRutaCSS() + temas.oscuro.archivoCSS);
    
    // El botón ahora es para poner el otro tema
    document.querySelector('#iconoTema').className = temas.claro.icono; 
    document.querySelector('#tema').setAttribute("title", temas.claro.textoBoton);

    // Guardamos el estado en la cookie, que expira en 30 días
    setCookie("tema", "oscuro", 30);
}

// Función para conmutar entre temas
function cambiarTema() {
    const temaActual = getCookie("tema");

    if (temaActual === "oscuro") {
        setTemaClaro();
    } else {
        setTemaOscuro();
    }
}

// Función para obtener el valor de una cookie
function getCookie(nombre) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${nombre}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Función para establecer la cookie con caducidad
function setCookie(nombre, valor, dias) {
    const fecha = new Date();
    fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000)); // Milisegundos en un día
    const expiracion = "expires=" + fecha.toUTCString();
    document.cookie = `${nombre}=${valor}; ${expiracion}; path=/`;
}

/**
 * Recibe un nombre de un archivo css (con la ruta incluida) y lo añade a la etiqueta head, debajo de un link que tenga la id=css-base.
 * La etiqueta link añadida tendrá la id css-tema. Si ya se encuentra en el head una etiqueta con la id=css-tema se borrará primero.
 * @param {*} archivoCSS El nombre del archivo css (con su ruta) que se va a añadir al html
 */
function cargarCSS(archivoCSS) {
    console.log("   - Aplicamos el archivo " + archivoCSS);

    // Buscar el link base
    const linkBase = document.getElementById("css-base");
    
    // Verificar si el link del tema ya existe
    const linkTemaExistente = document.getElementById("css-tema");
    if (linkTemaExistente) {
        // Si existe, lo eliminamos
        linkTemaExistente.parentNode.removeChild(linkTemaExistente);
    }

    // Crear un nuevo elemento <link> para el CSS del tema
    const nuevoLink = document.createElement("link");
    nuevoLink.rel = "stylesheet";
    nuevoLink.href = archivoCSS;
    nuevoLink.id = "css-tema"; // Asignar el id para identificar el CSS del tema

    // Insertar el nuevo <link> debajo del link base
    if (linkBase) {
        linkBase.parentNode.insertBefore(nuevoLink, linkBase.nextSibling);
    } else {
        // Si no se encuentra el link base, añadir al final del <head>
        document.head.appendChild(nuevoLink);
    }

}

/**
 * Función para determinar la ruta adecuada del archivo CSS.
 * En base a la ruta de la página, retornamos la url de la carpeta donde se encontrará el archivo css.
 * 
 * Por ejemplo, si en la ruta se encuentra la palabra "troncal", la ruta debería ser '../../css/'. 
 * 
 *  */ 
function obtenerRutaCSS() {
    // Obtenemos la ruta adecuada dependiendo de la ruta del archivo
    const pathname = window.location.pathname;

    let rutaCSS;

    switch (true) {
        case pathname.includes('index'):
            rutaCSS = rutasCSS.index;
            break;
        case pathname.includes('troncal'):
            rutaCSS = rutasCSS.troncal
            break;
        case pathname.includes('pildoras'):
            rutaCSS = rutasCSS.pildoras;
            break;
        default:
            console.error('Ruta no reconocida. Usando ruta por defecto.');
            rutaCSS = rutasCSS.index; // Ruta por defecto
    }

    return rutaCSS;
}