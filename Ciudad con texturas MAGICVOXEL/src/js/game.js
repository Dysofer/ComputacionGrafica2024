var currentObject = null; // Variable para almacenar el objeto actual

function createUI() {
    var gui = new dat.GUI();

    var param = {
        a: "Cerdo",
        b: "#FF00FF",
        c: 1
    };

    var g = gui.addFolder('Geometria');
    var player = g.add(param, 'a', ["Mujer", "Hombre", "Luigi", "Mario", "Cerdo"]).name("Modelos 3D");

    player.onChange(function(myPlayer) {
        console.log(myPlayer);
        loadObjMtl(myPlayer); // Llama a loadObjMtl con el modelo seleccionado
    });

    var l = gui.addFolder('Luces');
    var colorLight = l.addColor(param, 'b').name("Color de Luz");
    var intensityLight = l.add(param, 'c').min(0).max(1).step(0.1).name("Intensidad");

    colorLight.onChange(function(colorGet) {
        console.log(colorGet);
        light.color.setHex(Number(colorGet.toString().replace('#', '0x')));
    });

    intensityLight.onChange(function(intensityGet) {
        light.intensity = intensityGet;
    });
}

function loadObjMtl(selectedPlayer) {
    // General Path, nameObj, nameMTL
    var generalPath = "./src/models/obj/myPlayer/";
    var fileObj = selectedPlayer + ".obj"; // Cambiar el nombre del archivo según el jugador seleccionado
    var fileMtl = selectedPlayer + ".mtl"; // Cambiar el nombre del archivo según el jugador seleccionado

    // Si ya hay un objeto en la escena, lo eliminamos
    if (currentObject) {
        scene.remove(currentObject);
    }

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(generalPath);
    mtlLoader.setPath(generalPath);
    mtlLoader.load(fileMtl, function(materials) {
        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(generalPath);
        objLoader.load(fileObj, function(object) {
            currentObject = object; // Almacenar la referencia del objeto actual
            scene.add(object);
            object.scale.set(0.02, 0.02, 0.02);
            object.position.set(-1.2, 0, -4);
        });
    });
}
