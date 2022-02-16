// Call your styles
import './style.css'
// Get the library
import * as THREE from 'three'
// Get controls for the object(s)
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Texture Loader (load this first for better performance)
const textureLoader = new THREE.TextureLoader() // create constant for textureLoader
const normalTexture = textureLoader.load('/textures/NormalMap.png') // reference the file of the normalmap *Dont forget to call it in the material it is used on

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.BoxGeometry( 1, 1, 1 );

// Background Objects
const sphere = new THREE.SphereGeometry( 0.5, 32, 16 );

for ( let i = 0; i < 11111; i ++ ) {

    const spheres = new THREE.Mesh( sphere, new THREE.MeshPhongMaterial( { 
        color: Math.random() * 0x352676,
        emissive: Math.random() * 0x352676,
        shininess: 10,
    } ) );

    spheres.position.x = Math.random() * 400 - 100;
    spheres.position.y = Math.random() * 400 - 100;
    spheres.position.z = Math.random() * 400 - 100;

    spheres.scale.x = Math.random() + 2;
    spheres.scale.y = Math.random() + 2;
    spheres.scale.z = Math.random() + 2;

    scene.add( spheres );

}

// Materials
const material = new THREE.MeshStandardMaterial()
// below properties could also be within brackets such as MeshStandardMaterial({})
// material.emissive.setHex( 0x3fffff )
material.metalness = 0.3
material.roughness = 0.2
material.normalMap = normalTexture; // calling the normal map to the material
material.color = new THREE.Color(0x352676)

// Mesh
const cube = new THREE.Mesh(geometry,material)
scene.add(cube)

// Light 1
const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
// pointLight.position.set(2, 3, 4) this shows how you can do the above code into one line (x, y, z) such as the other lights below
scene.add(pointLight)

// Light 2
// duplicating the above pointLight for another light in the scene and adding '2' to make it unique
const pointLight2 = new THREE.PointLight(0x352676, 2)
pointLight2.position.set(-1.8, 1, -1.6)
pointLight2.intensity = 10
scene.add(pointLight2)

// Light 2 Color
const light2Color = {
    color: 0x352676
}

// Light 3
const pointLight3 = new THREE.PointLight(0x352676, 2)
pointLight3.position.set(1.8, 1, -1.6)
pointLight3.intensity = 10
scene.add(pointLight3)

// Light 3 Color
const light3Color = {
    color: 0x352676
}

// Fog
scene.fog = new THREE.FogExp2( 0x000000, 0.03 );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Below is to make the canvas responsive: window resizes, so does canvas
window.addEventListener('resize', () => {
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
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 2
controls.maxDistance = 10
controls.autoRotate = true;
controls.autoRotateSpeed = 0.3;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.noPan = false;
// controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true // this makes the render transparent so that the background (such as CSS) is the actual bg color
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

// add eventlistener
document.addEventListener('mousemove', onDocumentMouseMove)

// create variables
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

// declare constants and divide window size by 2
const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

// function to use variables for event with calculations from constants
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowX)
    mouseY = (event.clientY - windowY)
}

/**
 * Constant browser update
 */

const clock = new THREE.Clock()

const tick = () => {

    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    cube.rotation.y = 0.2 * elapsedTime
    cube.rotation.z = 0.2 * elapsedTime

    cube.rotation.y += 1.5 * (targetX - cube.rotation.y)
    // adding one below to compensate for autorotation
    cube.rotation.x += 1.5 * (targetY - cube.rotation.x)
    // use position to bring z-index forward and back
    cube.position.z += 1 * (targetY - cube.rotation.x)

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()