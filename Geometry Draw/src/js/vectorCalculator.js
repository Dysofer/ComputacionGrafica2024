function vector() {
    // Obtener los valores de los inputs

    // var = Para contexto global
    // let = Solo en una parte del código en específico //  Te permite declarar variables limitando su alcance (scope) al bloque, declaración, o expresión donde se está usando.
    // const = Crea una constante cuyo alcance puede ser global o local para el bloque en el que se declara.

   let ax = document.getElementById("puntoAX").value;
    let ay = document.getElementById("puntoAY").value;
    let az = document.getElementById("puntoAZ").value;

    let bx = document.getElementById("puntoBX").value;
    let by = document.getElementById("puntoBY").value;
    let bz = document.getElementById("puntoBZ").value;

   // alert("("+ax+","+ay+","+az+")"); = Pruebas
    //alert("("+bx+","+by+","+bz+")"); = Pruebas

    let vx = bx-ax,
    vy = by-ay,
    vz = bz-az;

    let vectorFinal = `(${vx},${vy},${vz})`;

// Para poner en el span
    document.getElementById("result").innerHTML = vectorFinal;
    document.getElementById("result2").innerHTML = vectorFinal;
    document.getElementById("result3").innerHTML = vectorFinal;
    document.getElementById("result4").innerHTML = vectorFinal;
    //alert(vectorFinal);
}