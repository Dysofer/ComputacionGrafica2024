var currentObject = null; // Variable para almacenar el objeto actual

// Mapeo de modelos a sus archivos .obj y .mtl
const modelPaths = {
    "Mujer": { obj: "mujer.obj", mtl: "mujer.mtl" },
    "Hombre": { obj: "hombre.obj", mtl: "male02_dds.mtl", },
    "Luigi": { obj: "luigi.obj", mtl: "luigi.mtl" },
    "Mario": { obj: "mario.obj", mtl: "mario.mtl" },
    "Cerdo": { obj: "cerdo.obj", mtl: "cerdo.mtl" }
};

function createUI() {
    var gui = new dat.GUI();

    var param = {
        a: " ",
        b: "#FF00FF",
        c: 1
    };

    var g = gui.addFolder('Geometria');
    var player = g.add(param, 'a', Object.keys(modelPaths)).name("Modelos 3D");

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
    // General Path
    var generalPath = "./src/models/obj/myPlayer/";

    // Obtener los nombres de archivos para el modelo seleccionado
    var files = modelPaths[selectedPlayer];

    // Verificar si el modelo existe en modelPaths
    if (!files) {
        console.error("Modelo no encontrado para:", selectedPlayer);
        return; // Salir de la función si el modelo no existe
    }

    var fileObj = files.obj; // Obtener el nombre del archivo .obj
    var fileMtl = files.mtl; // Obtener el nombre del archivo .mtl

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

            // Ajustar la escala del objeto
            if (selectedPlayer === "Cerdo") {
                object.scale.set(0.8, 0.8, 0.8); // Escala para el cerdo
            } else {
                object.scale.set(0.02, 0.02, 0.02); // Escala para otros modelos
            }

            object.position.set(-2.0, 0, -4);
        }, undefined, function(error) {
            console.error("Error al cargar el modelo:", error);
        });
    });
}
