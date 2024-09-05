// Creation of basic elements

// var // Contexto global
//let // Si va a existir solo en un entorno (solo en una función)
//const // Si va a manejar valores constantes y no variables

var scene = null,
    camera = null,
    renderer = null,
    controls = null;

const size = 20,
    division = 20;

function startScene() {
    // Scene, Camera, Render
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x524E4E);
    camera = new THREE.PerspectiveCamera(75, // Angulo de visión (Abajo o Arriba) 
        window.innerWidth / window.innerHeight, // Relación de Aspecto (16:9)  <-- Default
        0.1, // Lo más Cerca del angulo de visión (No renderiza)
        1000); // Lo más lejo del ángulo de visión
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("app") });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Orbit Controls

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0,0,0);
    controls.update();

    //Grid Helper

    const size = 10;
const divisions = 10;

const gridHelper = new THREE.GridHelper( size, division );
scene.add( gridHelper );


// Create a Box
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;
    animate();
}
function animate() {
    requestAnimationFrame(animate);
    controls.update();
	renderer.render( scene, camera );
}

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}