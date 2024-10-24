// ----------------------------
// Inicialización de Variables:
// ----------------------------
var scene    = null,
    camera   = null,
    renderer = null,
    controls = null,
    clock = null;

var sound1      = null,
    countPoints = null,
    modelLoad   = null,
    light       = null,
    figuresGeo  = [];

var MovingCube         = null,
    collidableMeshList = [],
    lives              = 3,
    numberToCreate     = 5;

var color = new THREE.Color();

var scale  = 1;
var rotSpd = 0.05;
var spd    = 0.05;
var input  = {left:0,right:0, up: 0, down: 0};

var posX = 3;
var posY = 0.5;
var posZ = 1;
// ----------------------------
// Funciones de creación init:
// ----------------------------

function start() {
    window.onresize = onWindowResize;
    initScene();
    animate();
    
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function initScene(){
    initBasicElements(); // Scene, Camera and Render
    initSound();         // To generate 3D Audio
    createLight();       // Create light
    initWorld();
    createPlayerMove();
    createFrontera();
}

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
    sound1.update(camera);
    movePlayer();
    collisionAnimate();
}

function initBasicElements() {
    scene    = new THREE.Scene();
    camera   = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#app") });
    clock    = new THREE.Clock();

    // controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.update();

    scene.background = new THREE.Color( 0x0099ff );
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );
           
    renderer.setSize(window.innerWidth, window.innerHeight - 4);
    document.body.appendChild( renderer.domElement );

    camera.position.x = 3;
    camera.position.y = 0.5;
    camera.position.z = 1;
}

function initSound() {
    sound1 = new Sound(["./songs/rain.mp3"],500,scene,{   // radio(10)
        debug:true,
        position: {x:camera.position.x,y:camera.position.y+10,z:camera.position.z}
    });
}

function createFistModel(generalPath, pathMtl, pathObj, position, scale) {
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath(generalPath);
  mtlLoader.setPath(generalPath);
  mtlLoader.load(pathMtl, function (materials) {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(generalPath);
      objLoader.load(pathObj, function (object) {
          modelLoad = object;
          figuresGeo.push(modelLoad);
          scene.add(object);
          
          object.scale.set(scale.x, scale.y, scale.z);  // Ajustar escala dinámica
          object.position.set(position.x, position.y, position.z);  // Posicionar dinámicamente
      });
  });
}


function createLight() {
    var light2 = new THREE.AmbientLight(0xffffff);
    light2.position.set(10, 10, 10);
    scene.add(light2);
    light = new THREE.DirectionalLight(0xffffff, 0, 1000);
    scene.add(light);
}

function initWorld() {
  // Cargar la isla
  var generalPathIsla = './modelos/island/';
  createFistModel(generalPathIsla, 'littleisle.mtl', 'littleisle.obj', { x: 0, y: -2, z: 0 }, { x: 0.5, y: 0.5, z: 0.5 });

  // Cargar y patrullar el pato
  loadPato({ x: 5, y: 0, z: 5 }, { x: 0.2, y: 0.2, z: 0.2 });
}

function loadPato(position, scale) {
  var loader = new THREE.GLTFLoader();
  loader.load('./modelos/other/Duck.gltf', function(gltf) {
      pato = gltf.scene;  // Guardamos el pato en una variable global
      pato.scale.set(scale.x, scale.y, scale.z);
      pato.position.set(position.x, position.y, position.z); // Asegúrate de que 'y' esté ajustado
      scene.add(pato);

      animatePato(pato);  // Llamar a la animación del pato
  });
}

var pato = null;  // Variable para almacenar el pato cargado

var pato = null;  // Variable para almacenar el pato cargado
var isPatoScaled = false; // Variable para controlar el estado del escalado

// Función de ataque
function ataqueDePato() {
    if (pato) {
        if (!isPatoScaled) {
            pato.scale.set(pato.scale.x * 3, pato.scale.y * 3, pato.scale.z * 3);  // Escalar al triple
            isPatoScaled = true; // Cambiar el estado a escalado
        } else {
            pato.scale.set(pato.scale.x / 3, pato.scale.y / 3, pato.scale.z / 3);  // Volver al tamaño original
            isPatoScaled = false; // Cambiar el estado a no escalado
        }
    } else {
        console.log("El pato aún no está cargado.");
    }
}
function animatePato(pato) {
  // Definir las esquinas del cuadrado
  var corners = [
      new THREE.Vector3(5, 0, 5),    // Esquina 1 (superior derecha)
      new THREE.Vector3(-5, 0, 5),   // Esquina 2 (superior izquierda)
      new THREE.Vector3(-5, 0, -5),  // Esquina 3 (inferior izquierda)
      new THREE.Vector3(5, 0, -5)    // Esquina 4 (inferior derecha)
  ];

  var currentCornerIndex = 0; // Índice de la esquina actual
  var speed = 0.02; // Velocidad del pato
  var direction = new THREE.Vector3(); // Dirección del movimiento
  var target = corners[currentCornerIndex]; // Objetivo inicial

  function move() {
      // Calcular la dirección hacia la esquina objetivo
      direction.copy(target).sub(pato.position).normalize();
      
      // Mover el pato en la dirección calculada
      pato.position.add(direction.multiplyScalar(speed));

      // Comprobar si el pato ha alcanzado la esquina objetivo
      if (pato.position.distanceTo(target) < 0.1) {
          // Cambiar a la siguiente esquina
          currentCornerIndex = (currentCornerIndex + 1) % corners.length;
          target = corners[currentCornerIndex];
      }

      requestAnimationFrame(move); // Continuar la animación
  }

  move(); // Iniciar la animación
}


// ----------------------------------
// Función Para mover al jugador:
// ----------------------------------
function movePlayer(){
    if(input.right == 1){
      camera.rotation.y -= rotSpd;
      MovingCube.rotation.y -= rotSpd;
    }
    if(input.left == 1){
      camera.rotation.y += rotSpd; 
      MovingCube.rotation.y += rotSpd;
    }
    
     if(input.up == 1){
      camera.position.z -= Math.cos(camera.rotation.y) * spd;
      camera.position.x -= Math.sin(camera.rotation.y) * spd;

      MovingCube.position.z -= Math.cos(camera.rotation.y) * spd;
      MovingCube.position.x -= Math.sin(camera.rotation.y) * spd;
    }
    if(input.down == 1){
      camera.position.z += Math.cos(camera.rotation.y) * spd;
      camera.position.x += Math.sin(camera.rotation.y) * spd;
      
      MovingCube.position.z += Math.cos(camera.rotation.y) * spd;
      MovingCube.position.x += Math.sin(camera.rotation.y) * spd;
    }
  }
  
// Agrega el event listener para la tecla 'T'
window.addEventListener('keydown', function(e) {
  switch (e.keyCode) {
      case 68: // Tecla 'D'
          input.right = 1;
          break;
      case 65: // Tecla 'A'
          input.left = 1; 
          break;
      case 87: // Tecla 'W'
          input.up = 1;
          break;
      case 83: // Tecla 'S'
          input.down = 1;
          break;
      case 84: // Keycode de la tecla 'T'
          ataqueDePato();  // Llamar a la función de ataque
          break;
      case 27: // Tecla 'Escape'
          document.getElementById("blocker").style.display = 'block'; //Para volver a la página
          break;
  }
});


  window.addEventListener('keyup', function(e) {
    switch (e.keyCode) {
      case 68:
        input.right = 0;
        break;
      case 65:
        input.left = 0;
        break;
      case 87:
        input.up = 0;
        break;
      case 83:
        input.down = 0;
        break;
    }
  });
// ----------------------------------
// Funciones llamadas desde el index:
// ----------------------------------
function go2Play() {
    document.getElementById('blocker').style.display = 'none';
    document.getElementById('cointainerOthers').style.display = 'block';
    playAudio(x);
    initialiseTimer();
}

function initialiseTimer() {
    var sec = 0;
    function pad ( val ) { return val > 9 ? val : "0" + val; }

    setInterval( function(){
        document.getElementById("seconds").innerHTML = String(pad(++sec%60));
        document.getElementById("minutes").innerHTML = String(pad(parseInt(sec/60,10)));
    }, 1000);
}

function showInfoCreator() {
    if( document.getElementById("myNameInfo").style.display == "none")
        document.getElementById("myNameInfo").style.display = "block";
    else
        document.getElementById("myNameInfo").style.display = "none";

}
// ----------------------------------
// Funciones llamadas desde el index:
// ----------------------------------
function createPlayerMove() {
  var cubeGeometry = new THREE.CubeGeometry(1,1,1,1,1,1);
	var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe:true, transparent: false, opacity: 0.0 } );
	MovingCube = new THREE.Mesh( cubeGeometry, wireMaterial );
	MovingCube.position.set(camera.position.x,camera.position.y,camera.position.z);
	scene.add( MovingCube );
}

function createFrontera() {
    var cubeGeometry = new THREE.CubeGeometry(12,5,12,1,1,1);
	var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe:true, transparent: false, opacity: 0.0 } );
	worldWalls = new THREE.Mesh( cubeGeometry, wireMaterial );
	worldWalls.position.set(5,0,0);
	scene.add( worldWalls );
    collidableMeshList.push(worldWalls);
}

function collisionAnimate() {
    
    var originPoint = MovingCube.position.clone();

    for (var vertexIndex = 0; vertexIndex < MovingCube.geometry.vertices.length; vertexIndex++)
	{		
		var localVertex = MovingCube.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( MovingCube.matrix );
		var directionVector = globalVertex.sub( MovingCube.position );
		
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
        var collisionResults = ray.intersectObjects( collidableMeshList );
		if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){ 
            document.getElementById("lives").innerHTML = lives;//'toco, '+ JSON.stringify(collisionResults[0].object.name);//points;
            camera.position.set(posX,posY,posZ);
            MovingCube.position.set(posX,posY,posZ);
            lives = lives - 1;
            if(lives==0){
                document.getElementById("lost").style.display = "block";
                document.getElementById("cointainerOthers").style.display = "none";
                pauseAudio(x);
                playAudio(y);
            }
        }else{
            document.getElementById("lives").innerHTML = lives; // 'no toco';  
        }
	}
}