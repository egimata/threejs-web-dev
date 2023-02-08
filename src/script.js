import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
const params = {
    color: 0x3D3D3D,
    material: '#a3a3a3'
  };
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( params.color );
scene.fog = new THREE.Fog( params.color, 1, 20 );

gui.addColor(params, 'color').name('BgColor').onChange(function(value) {

    scene.background.set( value );
    scene.fog.set( value );

});

/**
 * Model
 */
const gltfLoader = new GLTFLoader();

gltfLoader.load(
    '/models/glTF/MaterialsVariantsShoe.gltf',
    (gltf) =>
    {
        gltf.scene.traverse( function( node ) {

            if ( node.isMesh ) { node.castShadow = true; }
    
        } );
        const mesh = gltf.scene;
        mesh.scale.set( 10.0, 10.0, 10.0 );
		mesh.castShadow = true;
        scene.add( mesh );
        gui.add(mesh.position, 'x').min(- 5).max(5).step(0.001).name('MeshPositionX');
        gui.add(mesh.position, 'y').min(- 5).max(5).step(0.001).name('MeshPositionY');
        gui.add(mesh.position, 'z').min(- 5).max(5).step(0.001).name('MeshPositionZ');

    }
)



/**
 * Materials
 */
const planeMaterial = new THREE.MeshStandardMaterial({ color: params.color });
planeMaterial.roughness = 0.7
gui.add(planeMaterial, 'metalness').name('MaterialMetalness').min(0).max(1).step(0.001)
gui.add(planeMaterial, 'roughness').name('MaterialRoughness').min(0).max(1).step(0.001)

/**
 * Plane for shadow
 */
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = - Math.PI / 2;
planeMesh.position.y = - 0.5;
planeMesh.receiveShadow = true;

scene.add( planeMesh );

gui.addColor(params, 'color').setValue(params.material).name('PlaneColor').onChange(function(value) {

    planeMaterial.color.set( value );

});


/**
 * Lights
 */

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 3,854 )
directionalLight.position.set(2.173, 4.017, -3.112)
directionalLight.castShadow = true;
scene.add(directionalLight)

//Helpers
gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('light Intensity')
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
camera.position.set( 2.5, 1.5, 3.0 );
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.target.set( 0, 0.5, - 0.2 );
controls.enableDamping = true
controls.minDistance = 2;
controls.maxDistance = 10;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;


/**
 * Animation
 */
const animate = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call animate on the next frame
    window.requestAnimationFrame(animate)
}

animate();
