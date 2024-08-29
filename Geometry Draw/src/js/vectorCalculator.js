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
}
  function vector2() {

    
       let ax = document.getElementById("puntoAX2").value;
        let ay = document.getElementById("puntoAY2").value;
        let az = document.getElementById("puntoAZ2").value;
    
        let bx = document.getElementById("puntoBX2").value;
        let by = document.getElementById("puntoBY2").value;
        let bz = document.getElementById("puntoBZ2").value;

        var vx2 = parseInt(bx) + parseInt (ax),
        vy2 = parseInt(by) + parseInt(ay),
        vz2 = parseInt(bz) + parseInt(az);
        
        let vectorFinal2 = `(${vx2},${vy2},${vz2})`;
    document.getElementById("result2").innerHTML = vectorFinal2;
    }

    function vector3() {

    
        let ax = document.getElementById("puntoAX3").value;
         let ay = document.getElementById("puntoAY3").value;
         let az = document.getElementById("puntoAZ3").value;
     
         let bx = document.getElementById("puntoBX3").value;
         let by = document.getElementById("puntoBY3").value;
         let bz = document.getElementById("puntoBZ3").value;
 
         
     let vx3 = bx*ax,
     vy3 = by*ay,
     vz3 = bz*az;
     vr = (vx3+vy3+vz3);

    
     let vectorFinal3 = `(${vr})`;
     document.getElementById("result3").innerHTML = vectorFinal3;
    }

    function vector4(){
        let ax = document.getElementById("puntoAX4").value;
         let bx = document.getElementById("puntoBX4").value;

         let vx4 = Math.sqrt(Math.pow(ax,2) + Math.pow(bx,2));

         let vectorFinal4 = `(${vx4})`;

    document.getElementById("result4").innerHTML = vectorFinal4;

    }