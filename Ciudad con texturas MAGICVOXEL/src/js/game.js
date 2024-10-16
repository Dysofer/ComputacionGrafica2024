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
        LoadObjMtl(myPlayer);
    });

    var l = gui.addFolder('Luces');
    var colorLight = l.addColor(param, 'b').name("Color de Luz");
    var intensityLight = l.add(param, 'c').min(0).max(1).step(0.1).name("Intensidad");

    colorLight.onChange(function(colorGet) {
        console.log(colorGet);
        light.color.setHex(Number(colorGet.toString().replace('#','0x')));
    });

    intensityLight.onChange(function(intensityGet) {
        light.intensity = intensityGet;
    });
}

function loadObjMtl(Modelz){
    //general path, nameObj, nameMTL



    var generalPath = "../src/models/modelos/obj/" + Modelz + "/";
    var fileObj = Modelz + ".obj";
    var fileMtl = Modelz + ".mtl";

    /*
    alert(generalPath);
    alert(fileObj);
    alert(fileMtl);
    */
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(generalPath);
    mtlLoader.setPath(generalPath);
    mtlLoader.load(fileMtl, function(materials) {
        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(generalPath);
        objLoader.load(fileObj, function(object) {

            

            //si se ponde solo la variable en el if es para confirmar si vale algo o existe
            if(Modelo){
                scene.remove(Modelo);
            }

            

            Modelo = object;
            scene.add(Modelo);

            
            

            

             object.scale.set(0.25,0.25,0.25);

            

            object.position.set( 2, 0.01, -1);

        });
    });
}