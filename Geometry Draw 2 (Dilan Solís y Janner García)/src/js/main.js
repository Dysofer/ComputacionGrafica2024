var scene = null,
    camera = null,
    renderer = null,
    controls = null;
    light = null;
const size = 20,
    division = 20;
 
function startScene() {
    // Scene, Camera, Renderer
    scene  = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);
    camera = new THREE.PerspectiveCamera( 75,  // Angulo de Vision (Abajo o Arriba)
                                        window.innerWidth / window.innerHeight, // Relación Aspecto (16:9)
                                        0.1, // Mas Cerca (no renderiza)
                                        1000); // Mas lejos
    renderer = new THREE.WebGLRenderer({canvas: document.getElementById("app")});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
 
    //orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 5, 10);
    controls.update();

    //orbit helper
    const gridHelper = new THREE.GridHelper( size, division );
    scene.add( gridHelper );
 
    camera.position.z = 5;
    animate();

    // Luz - Light
    // Ambient Light
    const light = new THREE.AmbientLight( 0xffffff ); // soft white light
    scene.add( light );

    // Point Light
    const pointlight = new THREE.PointLight( 0xffffff, 1, 100 );
    pointlight.position.set( 0, 3, 3 );
    scene.add( pointlight );

    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper( pointlight, sphereSize );
    scene.add( pointLightHelper );
}
 
function createLight(typeLight){
switch(typeLight){

case "ambient":
    light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
    break;

    case "directionalLight":
        directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( light );
        break;

        case "pointLight":
            light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( 50, 50, 50 );
scene.add( light );
            break;

            case "SpotLight":
                light = new THREE.SpotLight( 0xffffff );
                light.position.set( 100, 1000, 100 );
                light.map = new THREE.TextureLoader().load( url );
                
                light.castShadow = true;
                
                light.shadow.mapSize.width = 1024;
                light.shadow.mapSize.height = 1024;
                
                light.shadow.camera.near = 500;
                light.shadow.camera.far = 4000;
                light.shadow.camera.fov = 30;
                
                scene.add( light );
                break;

}

}

function animate() {
    requestAnimationFrame(animate);
    controls.update
    renderer.render( scene, camera );
}

// Resize by Screen Size
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
 
function createGeometry(geometryDraw) {
  var geometryFigure = null;
  
  // Obtener valores de los inputs
  const width = parseFloat(document.getElementById('inputWidth').value);
  const height = parseFloat(document.getElementById('inputHeight').value);
  const depth = parseFloat(document.getElementById('inputDepth').value);
  
  switch(geometryDraw) {
      case 'Box':
          geometryFigure = new THREE.BoxGeometry(width, height, depth);
          break;
      case 'Torus':
          geometryFigure = new THREE.TorusGeometry(width, height, 16, 100);
          break;
      case 'Cone':
          geometryFigure = new THREE.ConeGeometry(width, height, 32);
          break;
  }
  
  var randomColor = +('0x' + Math.floor(Math.random()*16777215).toString(16));
  const material = new THREE.MeshStandardMaterial({
      color: randomColor,
      transparent: false,
      opacity: 0.5,
      wireframe: false,
      roughness: 0.5,
      metalness: 1
  });
  
  const objectDraw = new THREE.Mesh(geometryFigure, material);
  scene.add(objectDraw);

  // Aplicar rotación inicial
  updateRotation(objectDraw);
}

// Nueva función para actualizar la rotación
function updateRotation(object) {
  const rotationX = THREE.Math.degToRad(parseFloat(document.getElementById('inputRotationX').value));
  const rotationY = THREE.Math.degToRad(parseFloat(document.getElementById('inputRotationY').value));
  const rotationZ = THREE.Math.degToRad(parseFloat(document.getElementById('inputRotationZ').value));
  
  object.rotation.set(rotationX, rotationY, rotationZ);
}

function updateFigure() {
  // Actualizar geometría y rotación al presionar el botón
  createGeometry(currentGeometry);  // Reemplaza 'currentGeometry' con la variable adecuada si tienes un seguimiento de la geometría actual.
}
