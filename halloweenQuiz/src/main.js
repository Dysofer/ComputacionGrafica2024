// ----------------------------
// Inicialización de Variables:
// ----------------------------
var scene = null,
    camera = null,
    renderer = null,
    controls = null,
    clock = null,
    light = null;

var player = null,
    fallingObjects = [],
    score = 0,
    time = 30,
    gameOver = false,
    speed = 0.02,
    gravity = 0.01,
    maxObjects = 10,
    gravityIncrement = 0.001;

const keys = { left: false, right: false };

// UI Elements
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const resultMessage = document.getElementById("resultMessage");
const restartBtn = document.getElementById("restartBtn");

var color = new THREE.Color();

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

function initScene() {
    initBasicElements(); // Scene, Camera and Render
    initSound();         // To generate 3D Audio
    createLight();       // Create light
}

function initBasicElements() {
    const colorFog = 0x071D36,
          nearFog = 10,
          far = 70;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(colorFog);

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#app") });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.z = 5;

    scene.fog = new THREE.Fog(colorFog, nearFog, far);

    // Crear jugador (simple cubo)
    const geometryTexture = new THREE.TextureLoader().load('./src/img/TexturaPump.png');
    const geometry2 = new THREE.BoxGeometry(1, 1, 1);
    const material2 = new THREE.MeshBasicMaterial({   map: geometryTexture,
      side: THREE.DoubleSide });
    player = new THREE.Mesh(geometry2, material2);
    scene.add(player);
    player.position.y = -3;

    // Evento de teclado
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') keys.left = true;
        if (e.key === 'ArrowRight') keys.right = true;
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') keys.left = false;
        if (e.key === 'ArrowRight') keys.right = false;
    });

    // Iniciar la caída de objetos y la cuenta atrás
    spawnObject();
    setInterval(countdown, 1000);
}

function spawnObject() {
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('./src/modelos/cerdoH.mtl', function (materials) {
        materials.preload();
        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('./src/modelos/cerdoH.obj', function (object) {
          object.scale.set(0.5, 0.5, 0.5);
            object.position.set((Math.random() - 0.5) * 10, 5, 0);
            fallingObjects.push(object);
            scene.add(object);
        }, undefined, function (error) {
            console.error('Error al cargar el modelo:', error);
        });
    });

    // Seguir generando objetos hasta el límite
    if (!gameOver && fallingObjects.length < maxObjects) {
        setTimeout(spawnObject, Math.random() * 1500 + 500);
    }
}

function countdown() {
    if (gameOver) return;
    time--;
    timeDisplay.innerText = `Tiempo: ${time}`;

    // Incrementa la gravedad con el tiempo
    if (time <= 30 && time > 20) {
        gravity += gravityIncrement * 0.5;  // Aumenta la gravedad ligeramente en los primeros 10 segundos
    } else if (time <= 20 && time > 10) {
        gravity += gravityIncrement * 1;    // Aumenta más rápido en los siguientes 10 segundos
    } else if (time <= 10) {
        gravity += gravityIncrement * 1.5;  // Aumenta aún más rápido en los últimos 10 segundos
    }

    if (time <= 0) {
        endGame(false);
    }
}

function animate() {
    if (gameOver) return;

    requestAnimationFrame(animate);

    // Mover el jugador
    if (keys.left && player.position.x > -5) player.position.x -= 0.1;
    if (keys.right && player.position.x < 5) player.position.x += 0.1;

    // Mover objetos
    fallingObjects.forEach((object, index) => {
        object.position.y -= speed + gravity;  // Usa la gravedad ajustada

        // Verificar colisión con el jugador
        if (object.position.distanceTo(player.position) < 0.7) {
            score++;
            scoreDisplay.innerText = `Puntos: ${score}`;
            scene.remove(object);
            fallingObjects.splice(index, 1);

            if (score >= 10) {
                endGame(true);
            }
        }

        // Eliminar objetos que caen fuera de la pantalla
        if (object.position.y < -5) {
            scene.remove(object);
            fallingObjects.splice(index, 1);
        }
    });

    renderer.render(scene, camera);
}

function endGame(victory) {
    gameOver = true;
    resultMessage.classList.remove('hidden');
    restartBtn.classList.remove('hidden');

    if (victory) {
        resultMessage.innerText = '¡Ganaste! 🎃';
    } else {
        resultMessage.innerText = '¡Perdiste! 👻';
    }

    restartBtn.addEventListener('click', restartGame);
}

function restartGame() {
    // Reiniciar variables
    score = 0;
    time = 30;
    gravity = 0.01;  // Reiniciar gravedad
    gameOver = false;
    scoreDisplay.innerText = 'Puntos: 0';
    timeDisplay.innerText = 'Tiempo: 30';
    resultMessage.classList.add('hidden');
    restartBtn.classList.add('hidden');

    // Eliminar los objetos restantes
    fallingObjects.forEach(obj => scene.remove(obj));
    fallingObjects = [];

    // Iniciar nuevamente
    spawnObject();
    animate();
}

function initSound() {
    // 3D Sound
}

function createLight() {
    var light2 = new THREE.AmbientLight(0xffffff);
    light2.position.set(10, 10, 10);
    scene.add(light2);
    light = new THREE.DirectionalLight(0xffffff, 0.5); // Ajusta la intensidad si es necesario
    light.position.set(0, 10, 0);
    scene.add(light);
}

// ----------------------------------
// Funciones llamadas desde el index:
// ----------------------------------
function go2Play() {
    document.getElementById('blocker').style.display = 'none';
    document.getElementById('cointainerOthers').style.display = 'block';
    playAudio();
}

function showNameStudents() {
    alert("Los estudiantes del grupo son: Dilan Solís y Janner García");
}
