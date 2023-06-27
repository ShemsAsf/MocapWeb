let urlParams = new URLSearchParams(window.location.search);
let dataString = urlParams.get("data");
if (!dataString) {
  filename = "null";
}
else{
  let dataname = JSON.parse(decodeURIComponent(dataString));
  filename = dataname.name;
}
console.log("FILENAME = "+filename);







if(filename != "null" && window.location.pathname === '/reading.html'){

  function getItem() {
    return new Promise((resolve, reject) => {
      $.get('static/dataMocap.json', function(data) {
        console.log(data);
        item = "";
        for (let i = 0; i < data.datas.length; i++) {
          console.log("being looped");
          const dict = data.datas[i];
          if (dict.name === filename) {
            item = dict;
          }
        }
        console.log("resolved item : " + item);
        resolve(item);
      });
  });
  }
  const canvas = document.getElementById('canvas');

  canvas.width = window.innerWidth * 50 / 100;
  canvas.height = window.innerHeight * 50 / 100;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);

  camera.position.set(150, 300, -350);
  const renderer = new THREE.WebGLRenderer({ canvas });
  //const lookAtPoint = new THREE.Vector3(0, 300, 0);
  //camera.lookAt(lookAtPoint);

  renderer.setClearColor(0xffffff);
  renderer.setSize(canvas.width, canvas.height);

  renderer.setPixelRatio(window.devicePixelRatio);
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.target.set(0, 300, 0);
  controls.update();

  const size = 100;
  const divisions = 10;
  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  function createSphere(x, y, z, color) {
    const radius = 3;
    const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(x, y, z);
    scene.add(sphere);
  }

  function drawLineBetweenSpheres(coords1, coords2) {
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const geometry = new THREE.BufferGeometry();
    const startPoint = new THREE.Vector3(coords1[0], coords1[1], coords1[2]);
    const endPoint = new THREE.Vector3(coords2[0], coords2[1], coords2[2]);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([startPoint.x, startPoint.y, startPoint.z, endPoint.x, endPoint.y, endPoint.z], 3));
    const line = new THREE.Line(geometry, material);
    scene.add(line);
  }

  function createPlane(coords1, coords2, coords3, coords4) {
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    const geometry = new THREE.BufferGeometry();
    const vertices = [
      coords1[0], coords1[1], coords1[2],
      coords2[0], coords2[1], coords2[2],
      coords3[0], coords3[1], coords3[2],
      coords4[0], coords4[1], coords4[2]
    ];
    const indices = [0, 1, 2, 0, 2, 3];
    geometry.setIndex(indices);
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
  }

  function drawCylinder(coords1, coords2) {
    radius1 = 10;
    radius2 = 5;
    color = 0xff0000;
    const startPoint = new THREE.Vector3(coords1[0], coords1[1], coords1[2]);
    const endPoint = new THREE.Vector3(coords2[0], coords2[1], coords2[2]);
    const material = new THREE.MeshBasicMaterial({ color });
    const direction = endPoint.clone().sub(startPoint);
    const edgeGeometry = new THREE.CylinderGeometry(radius1, radius2, direction.length(), 8, 1);
    const cylinder = new THREE.Mesh(edgeGeometry, material);
    cylinder.rotation.z = Math.atan2(direction.y, direction.x);
    cylinder.position.x = (startPoint.x + endPoint.x) / 2;
    cylinder.position.y = (startPoint.y + endPoint.y) / 2;
    cylinder.position.z = (startPoint.z + endPoint.z) / 2;
    scene.add(cylinder);
  }

  async function draw() {
    const item = await getItem();
    console.log("item : " + item);
    const lines = item.positions;
    console.log(lines);
    const coordinates = lines.trim().split('\n').map(line => line.split(','));

    const response2 = await fetch('static/couples.txt');
    const couples = await response2.text();
    const couple = couples.trim().split('\n').map(line => line.split(','));
    
    

    while(1){
      for (let i = 0; i < coordinates.length; i++) {
        const line = coordinates[i];
        const sphereCoords = [];
        for (let j = 0; j < line.length; j += 3) {
          const x = parseFloat(line[j])/2 ;
          const y = parseFloat(line[j + 1])/2;
          const z = parseFloat(line[j + 2])/2;
          const color = 0xDB0F27;
          createSphere(x, y, z, color);
          sphereCoords.push([x, y, z]);
        }
        for (let k = 0; k < couple.length; k++){
          drawLineBetweenSpheres(sphereCoords[parseInt(couple[k][0])], sphereCoords[parseInt(couple[k][1])]);
        }
        createPlane(sphereCoords[11], sphereCoords[12], sphereCoords[24], sphereCoords[23]);
        //drawCylinder(sphereCoords[24], sphereCoords[26]);

        await new Promise(resolve => setTimeout(resolve, 50));
        scene.children = [];
      }

    }
    
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  draw();
}

