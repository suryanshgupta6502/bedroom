import * as three from 'three';
import { DRACOLoader, GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
import { Sky } from 'three/addons/objects/Sky.js'



const canvas = document.querySelector("#canvas")
const sizes = {
    width: canvas.clientWidth,
    height: canvas.clientHeight
}
const scene = new three.Scene();
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5;



// const box = new three.Mesh(new three.BoxGeometry(), new three.MeshNormalMaterial())
// scene.add(box)




const orbit = new OrbitControls(camera, canvas)

const dracoloader = new DRACOLoader()
dracoloader.setDecoderPath('node_modules/three/examples/jsm/libs/draco/')

const loader = new GLTFLoader()
loader.setDRACOLoader(dracoloader)
const modelg = await loader.loadAsync("glb test bedroom.compressed (1).glb")
console.log(modelg);


const box = new three.Box3().setFromObject(modelg.scene);
const center = box.getCenter(new three.Vector3());
modelg.scene.position.sub(center);
modelg.scene.traverse(each => {
    each.castShadow = true
    each.receiveShadow = true

})
scene.add(modelg.scene)

// Find the center point
// Reposition the model so that its center is at the origin





const ambient = new three.AmbientLight("white", .2)
// scene.add(ambient)

const direction = new three.DirectionalLight("white", 3)
direction.castShadow = true
direction.position.set(5, 3, -3)
// scene.add(direction)


scene.add(new three.AxesHelper(5))







const sun = new three.DirectionalLight("white", 2);
sun.castShadow = true;
// sun.shadow
// Configure shadow map
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 50;
sun.shadow.camera.left = -10;
sun.shadow.camera.right = 10;
sun.shadow.camera.top = 10;
sun.shadow.camera.bottom = -10;

scene.add(sun);


let timeOfDay = 0; // 0 = midnight, 0.5 = noon, 1 = next midnight

// function updateSunPosition(time) {
//     const angle = (time * 2 * Math.PI) - Math.PI / 2; // shift so 0.5 = noon
//     const radius = 10;

//     sun.position.set(radius * Math.cos(angle), radius * Math.sin(angle), 0);
//     sun.lookAt(0, 0, 0);
// }



// updateSunPosition(timeOfDay);



// const newsun = new three.Vector3()
sun.position.setFromSphericalCoords(2, Math.PI / 4, Math.PI / 4);


const sky = new Sky()
sky.scale.setScalar(450000);

scene.add(sky)

const skyUniforms = sky.material.uniforms;
console.log(skyUniforms);

// 3. Configure the atmospheric scattering parameters
skyUniforms['turbidity'].value = 20;
skyUniforms['rayleigh'].value = 4;
skyUniforms['mieCoefficient'].value = 0.02;
skyUniforms['mieDirectionalG'].value = 0.9;
skyUniforms['sunPosition'].value.copy(sun.position);




const renderer = new three.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = three.PCFSoftShadowMap
renderer.toneMappingExposure = 0


let directionn = 1
function animate() {
    renderer.render(scene, camera);
    orbit.update()


    // direction.position.z += .01 * directionn

    // if (direction.position.z > 3 || direction.position.z < -3) {
        // directionn *= -1
    // }




    // timeOfDay += .001 * directionn
    // if (timeOfDay > 1) {
    //     directionn *= -1
    // }
    // updateSunPosition(timeOfDay * directionn);
    // console.log(timeOfDay);


    window.requestAnimationFrame(animate)
}
animate()