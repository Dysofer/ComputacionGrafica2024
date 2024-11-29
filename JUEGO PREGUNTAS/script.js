let preguntas_aleatorias = true;
let mostrar_pantalla_juego_términado = true;
let reiniciar_puntos_al_reiniciar_el_juego = true;

// Variables de Three.js
let scene, camera, renderer, mtlLoader, objLoader;
let backgroundObjects = []; // Array para manejar varios objetos

window.onload = function () {
  base_preguntas = readText("base-preguntas.json");
  interprete_bp = JSON.parse(base_preguntas);
  escogerPreguntaAleatoria();

  // Inicializar Three.js
  initThreeJS();
};

function initThreeJS() {
  // Crear la escena
  scene = new THREE.Scene();

  // Crear la cámara
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 10;

  // Crear el renderizador
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Crear los cargadores de OBJ y MTL
  mtlLoader = new THREE.MTLLoader();
  objLoader = new THREE.OBJLoader();

  // Cargar los modelos 3D
  load3DModels();

  // Añadir un fondo de color a la escena
  scene.background = new THREE.Color(0xeeeeee);

  // Animar la escena
  animate();
}

function load3DModels() {
  const models = [
    { mtl: 'assets/edificio.mtl', obj: 'assets/edificio.obj', scale: 3 },
    { mtl: 'assets/personaje.mtl', obj: 'assets/personaje.obj', scale: 5 },
    { mtl: 'assets/modelo3.mtl', obj: 'assets/modelo3.obj', scale: 4 },
  ];

  models.forEach((model, index) => {
    // Cargar el archivo MTL
    mtlLoader.load(model.mtl, function (materials) {
      materials.preload();
      
      // Cargar el archivo OBJ
      objLoader.setMaterials(materials);
      objLoader.load(model.obj, function (object) {
        // Ajustar escala y posición inicial
        object.scale.set(model.scale, model.scale, model.scale);
        object.position.x = index * 10 - 10; // Distribuir los modelos en el eje X
        scene.add(object);
        backgroundObjects.push(object);
      });
    });
  });
}

function animate() {
  requestAnimationFrame(animate);
  backgroundObjects.forEach((object, index) => {
    object.rotation.y += 0.005; // Rotar cada modelo
    if (index % 2 === 0) object.rotation.x += 0.002; // Rotar alternadamente en X
  });
  renderer.render(scene, camera);
}

// Ajustar el tamaño del lienzo de Three.js para que se adapte a la pantalla
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// Lógica de las preguntas y respuestas del juego
let pregunta;
let posibles_respuestas;
btn_correspondiente = [
  select_id("btn1"),
  select_id("btn2"),
  select_id("btn3"),
  select_id("btn4")
];
let npreguntas = [];

let preguntas_hechas = 0;
let preguntas_correctas = 0;

function escogerPreguntaAleatoria() {
  let n;
  if (preguntas_aleatorias) {
    n = Math.floor(Math.random() * interprete_bp.length);
  } else {
    n = 0;
  }

  while (npreguntas.includes(n)) {
    n++;
    if (n >= interprete_bp.length) {
      n = 0;
    }
    if (npreguntas.length == interprete_bp.length) {
      if (mostrar_pantalla_juego_términado) {
        swal.fire({
          title: "Juego finalizado",
          text: "Puntuación: " + preguntas_correctas + "/" + (preguntas_hechas - 1),
          icon: "success"
        });
      }
      if (reiniciar_puntos_al_reiniciar_el_juego) {
        preguntas_correctas = 0;
        preguntas_hechas = 0;
      }
      npreguntas = [];
    }
  }
  npreguntas.push(n);
  preguntas_hechas++;

  escogerPregunta(n);
}

function escogerPregunta(n) {
  pregunta = interprete_bp[n];
  select_id("categoria").innerHTML = pregunta.categoria;
  select_id("pregunta").innerHTML = pregunta.pregunta;
  select_id("numero").innerHTML = n;
  let pc = preguntas_correctas;
  if (preguntas_hechas > 1) {
    select_id("puntaje").innerHTML = pc + "/" + (preguntas_hechas - 1);
  } else {
    select_id("puntaje").innerHTML = "";
  }

  style("imagen").objectFit = pregunta.objectFit;
  desordenarRespuestas(pregunta);
  if (pregunta.imagen) {
    select_id("imagen").setAttribute("src", pregunta.imagen);
    style("imagen").height = "200px";
    style("imagen").width = "100%";
  } else {
    style("imagen").height = "0px";
    style("imagen").width = "0px";
    setTimeout(() => {
      select_id("imagen").setAttribute("src", "");
    }, 500);
  }
}

function desordenarRespuestas(pregunta) {
  posibles_respuestas = [
    pregunta.respuesta,
    pregunta.incorrecta1,
    pregunta.incorrecta2,
    pregunta.incorrecta3,
  ];
  posibles_respuestas.sort(() => Math.random() - 0.5);

  select_id("btn1").innerHTML = posibles_respuestas[0];
  select_id("btn2").innerHTML = posibles_respuestas[1];
  select_id("btn3").innerHTML = posibles_respuestas[2];
  select_id("btn4").innerHTML = posibles_respuestas[3];
}

let suspender_botones = false;

function oprimir_btn(i) {
  if (suspender_botones) {
    return;
  }
  suspender_botones = true;
  if (posibles_respuestas[i] == pregunta.respuesta) {
    preguntas_correctas++;
    btn_correspondiente[i].style.background = "lightgreen";
  } else {
    btn_correspondiente[i].style.background = "pink";
  }
  for (let j = 0; j < 4; j++) {
    if (posibles_respuestas[j] == pregunta.respuesta) {
      btn_correspondiente[j].style.background = "lightgreen";
      break;
    }
  }
  setTimeout(() => {
    reiniciar();
    suspender_botones = false;
  }, 3000);
}

function reiniciar() {
  for (const btn of btn_correspondiente) {
    btn.style.background = "white";
  }
  escogerPreguntaAleatoria();
}

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}

function readText(ruta_local) {
  var texto = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", ruta_local, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    texto = xmlhttp.responseText;
  }
  return texto;
}
