function createUI(){

    var gui = new dat.GUI();

    var param = {

        a: "OBJ",
        b: "#FF00FF",
        c: 1
    };

    var g = gui.addFolder('Geometry');
    g.add(param, 'a', ["Mujer", "Hombre", "Luigi", "Mario", "Ronin"]).name("3D Models");

}