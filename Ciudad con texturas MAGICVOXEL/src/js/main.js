var scene = null;
var camera = null;
var renderer = null;
var controls = null;
var createdObjects = [];  // Arreglo para almacenar los objetos creados
var light = null;
var cube1 = null;
var cube2 = null;

function startScene() {
    // Crear la escena, cámara y renderizador
    scene  = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Azul cielo
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({canvas: document.getElementById("app")});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
 
    // Controles de órbita
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 10, 30);
    controls.update();

    // Crear el suelo de pasto para toda la ciudad
    createGrassGround();

    // Añadir luz
    createLight("ambient");
    createLight("directionalLight");

    // Crear la carretera
    createStraightRoad();

    // Crear edificios en las esquinas
    createCornerBuildings();

    // Crear edificios adicionales sin chocar con la carretera
    createAdditionalBuildings();

    // Crear árboles
    createTrees();
    loadObjMtl();
    
    createUI();
    animate(); // Llama a la función de animación 
}

function createLight(lightType) {


    switch (lightType) {
        case "ambient":
            light = new THREE.AmbientLight(0xf2f2d4, 0.5); // soft white light
            break;
        case "directional":
            light = new THREE.DirectionalLight(0xffffff, 3);
            const directionalHelper = new THREE.DirectionalLightHelper(light, 3);
            scene.add(directionalHelper);
            break;
        case "point":
            light = new THREE.PointLight(0xffffff, 7, 100);
            light.position.set(13, 13, 13);
            const pointHelper = new THREE.PointLightHelper(light, 1);
            scene.add(pointHelper);
            break;
        case "spot":
            light = new THREE.SpotLight(0xffffff);
            light.position.set(100, 1000, 100);
            const spotHelper = new THREE.SpotLightHelper(light);
            scene.add(spotHelper);
            break;
        default:
    }

    scene.add(light);
}

function animate() {

    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Eliminar todas las geometrías creadas
function deleteGeometry() {
    for (let i = 0; i < createdObjects.length; i++) {
        scene.remove(createdObjects[i]);  // Eliminar cada objeto de la escena
    }
    createdObjects = [];  // Vaciar el arreglo después de eliminar los objetos
}
function createGrassGround() {
    // Crear el suelo de pasto para toda la ciudad
    const grassTexture = new THREE.TextureLoader().load('./src/img/city/pasto.jpg');
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(10, 10); // Ajustar la repetición

    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: grassTexture,
        side: THREE.DoubleSide
    });
    const grassPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    grassPlane.rotation.x = -Math.PI / 2; // Plano horizontal
    scene.add(grassPlane);
}

function createStraightRoad() {
    // Cargar la textura de la carretera
    const roadTexture = new THREE.TextureLoader().load('./src/img/city/carretera.png');
    roadTexture.wrapS = THREE.RepeatWrapping;
    roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.repeat.set(1, 10); // Ajustar la repetición según el largo del camino

    // Crear un camino recto
    const roadWidth = 4; // Ancho de la carretera
    const roadLength = 50; // Longitud de la carretera

    const roadGeometry = new THREE.PlaneGeometry(roadLength, roadWidth);
    const roadMaterial = new THREE.MeshBasicMaterial({
        map: roadTexture,
        side: THREE.DoubleSide
    });
    const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
    roadMesh.rotation.x = -Math.PI / 2; // Ponerlo plano en el suelo
    roadMesh.position.set(0, 0.02, 0); // Elevar ligeramente
    scene.add(roadMesh);
}

function createCornerBuildings() {
    // Texturas de edificios
    const textures = [
        new THREE.TextureLoader().load('./src/img/city/edificio1.jpeg'),
        new THREE.TextureLoader().load('./src/img/city/edificio2.jpeg')
    ]; 

    // Coordenadas para los edificios en cada esquina
    const cornerPositions = [
        [-15, -10], // Esquina inferior izquierda
        [15, -10],  // Esquina inferior derecha
        [-15, 15],  // Esquina superior izquierda
        [15, 15]    // Esquina superior derecha
    ];

    // Crear 2 edificios en cada esquina
    cornerPositions.forEach((position, index) => {
        for (let i = 0; i < 2; i++) {
            const width = Math.random() * 2 + 1;  // Ancho entre 1 y 3
            const height = Math.random() * 8 + 2; // Altura entre 2 y 10
            const depth = Math.random() * 2 + 1;  // Profundidad entre 1 y 3
            const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
            const buildingMaterial = new THREE.MeshStandardMaterial({ 
                map: textures[index % textures.length],
                side: THREE.DoubleSide // Hacer visible desde ambos lados
            });
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);

            building.position.set(
                position[0] + (i * 1.5), // Desplazar un poco el segundo edificio en la esquina
                height / 2,               // Elevarlo para que no quede bajo el suelo
                position[1] + (i * 1)     // Ajustar la posición en Y para mantener un poco de separación
            );
            scene.add(building);
        }
    });
}

function createAdditionalBuildings() {
    // Texturas de edificios
    const textures = [
        new THREE.TextureLoader().load('./src/img/city/edificio1.jpeg'),
        new THREE.TextureLoader().load('./src/img/city/edificio2.jpeg'),
        new THREE.TextureLoader().load('./src/img/city/edificio3.jpeg')
    ];

    // Crear más edificios en posiciones aleatorias, evitando colisiones con la carretera
    for (let i = 0; i < 20; i++) {
        const width = Math.random() * 2 + 1;  // Ancho entre 1 y 3
        const height = Math.random() * 8 + 2; // Altura entre 2 y 10
        const depth = Math.random() * 2 + 1;  // Profundidad entre 1 y 3
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const buildingMaterial = new THREE.MeshStandardMaterial({ 
            map: textures[Math.floor(Math.random() * textures.length)],
            side: THREE.DoubleSide // Hacer visible desde ambos lados
        });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);

        // Posicionar el edificio evitando que choque con la carretera y otros edificios
        let x, z;
        let isCollision;
        do {
            x = (Math.random() - 0.5) * 40;
            z = (Math.random() - 0.5) * 40;
            isCollision = false;

            // Verificar colisiones con la carretera y otros edificios
            if (Math.abs(z) < 2) { // Mantener la distancia de la carretera
                isCollision = true;
            }

            scene.children.forEach(obj => {
                if (obj instanceof THREE.Mesh && obj.geometry.type === "BoxGeometry") {
                    const objBoundingBox = new THREE.Box3().setFromObject(obj);
                    const newBoundingBox = new THREE.Box3(
                        new THREE.Vector3(x - width / 2, height / 2, z - depth / 2),
                        new THREE.Vector3(x + width / 2, height / 2 + height, z + depth / 2)
                    );

                    if (objBoundingBox.intersectsBox(newBoundingBox)) {
                        isCollision = true;
                    }
                }
            });
        } while (isCollision); // Repetir si hay colisión

        building.position.set(x, height / 2, z);
        scene.add(building);
    }
}

function createTrees() {
    // Textura de árboles
    const treeTexture = new THREE.TextureLoader().load('./src/img/city/arbol.jpg');

    // Crear un número reducido de árboles en posiciones aleatorias
    for (let i = 0; i < 6; i++) { // Reducir el número de árboles a 6
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.5, 2, 8); // Tronco de árbol
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Color marrón para el tronco
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        
        const foliageGeometry = new THREE.ConeGeometry(1, 3, 8); // Follaje del árbol
        const foliageMaterial = new THREE.MeshBasicMaterial({
            map: treeTexture,
            transparent: true,
            opacity: 0.9 // Opacidad del follaje
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);

        // Posicionar los árboles aleatoriamente dentro de la escena
        let x, z;
        let isCollision;
        do {
            x = (Math.random() - 0.5) * 40;
            z = (Math.random() - 0.5) * 40;
            isCollision = false;

            // Verificar colisiones con edificios y la carretera
            scene.children.forEach(obj => {
                if (obj instanceof THREE.Mesh && obj.geometry.type === "BoxGeometry") {
                    const objBoundingBox = new THREE.Box3().setFromObject(obj);
                    const treeBoundingBox = new THREE.Box3(
                        new THREE.Vector3(x - 0.5, 1, z - 0.5),
                        new THREE.Vector3(x + 0.5, 3, z + 0.5)
                    );

                    if (objBoundingBox.intersectsBox(treeBoundingBox)) {
                        isCollision = true;
                    }
                }
            });

            if (Math.abs(z) < 2) { // Mantener la distancia de la carretera
                isCollision = true;
            }
        } while (isCollision); // Repetir si hay colisión

        trunk.position.set(x, 1, z); // Posicionar el tronco
        foliage.position.set(x, 3, z); // Colocar el follaje sobre el tronco

        scene.add(trunk);
        scene.add(foliage);
    }
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Ajustar la ventana al tamaño de la pantalla
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Iniciar la escena
startScene();