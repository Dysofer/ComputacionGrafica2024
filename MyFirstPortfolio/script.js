let menuVisible = false;
//Función que oculta o muestra el menu (barra de ubicación) esto solo ocurre cuando estás en celular o resoluciones muy pequeñas
function mostrarOcultarMenu(){
    if(menuVisible){
        document.getElementById("nav").classList ="";
        menuVisible = false;
    }else{
        document.getElementById("nav").classList ="responsive";
        menuVisible = true;
    }
}

function seleccionar(){
    //Cada vez que en celular/resolución pequeña demos click a una sección de la barra de ubicación esta se cerrará
    document.getElementById("nav").classList = "";
    menuVisible = false;
}
//Funcion que aplica las animaciones de las habilidades
function efectoHabilidades(){
    var habilidades = document.getElementById("habilidades");
    var distancia_habilidades = window.innerHeight - habilidades.getBoundingClientRect().top;
    if(distancia_habilidades >= 300){
        //La distancia y window.innerheight representan a la resolución máxima en las cuales correra la animación;
        //Por ejemplo digamos que estas en 1024x768 que es lo máximo permitido;
        //Si corres la página una resolución 800x600 las animaciones no se mostrarán;
        let habilidades = document.getElementsByClassName("progreso");
        habilidades[0].classList.add("javascript");
        habilidades[1].classList.add("htmlcss");
        habilidades[2].classList.add("comunicacion");
        habilidades[3].classList.add("trabajo");
        habilidades[4].classList.add("creatividad");
        habilidades[5].classList.add("dedicacion");

    }
}


//detecto el scrolling para aplicar la animacion de la barra de habilidades
window.onscroll = function(){
    efectoHabilidades();
} 

