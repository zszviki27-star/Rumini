import * as THREE from 'three';

export interface SignRig {
  group: THREE.Group;
  signPivot: THREE.Group;
  chainLeft: THREE.Mesh;
  chainRight: THREE.Mesh;
}

export interface CartActorRig {
  group: THREE.Group;
  wheels: THREE.Group[];
  ruminiLegL: THREE.Mesh;
  ruminiLegR: THREE.Mesh;
  puvaLegL: THREE.Mesh;
  puvaLegR: THREE.Mesh;
}

export interface StreetEnvironmentRig {
  group: THREE.Group;
  targetRing: THREE.Mesh;
  gangGroup: THREE.Group;
}

export function createStreetAndTavern(
  cobbleMap: THREE.CanvasTexture,
  timberMap: THREE.CanvasTexture,
  enableShadows: boolean,
): StreetEnvironmentRig {
  const group = new THREE.Group();

  // Extended cobblestone street & harbor quay (no enclosed box void)
  const streetGeo = new THREE.PlaneGeometry(46, 28);
  const streetMat = new THREE.MeshStandardMaterial({
    map: cobbleMap,
    roughness: 0.88,
    metalness: 0.08,
  });
  const street = new THREE.Mesh(streetGeo, streetMat);
  street.rotation.x = -Math.PI / 2;
  street.receiveShadow = enableShadows;
  group.add(street);

  // Dark harbor water strip along the front-south edge
  const waterGeo = new THREE.PlaneGeometry(46, 14);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x091628,
    roughness: 0.16,
    metalness: 0.72,
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, -0.18, 12);
  group.add(water);

  // Stone quay edge curb
  const curbGeo = new THREE.BoxGeometry(46, 0.35, 0.6);
  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.85,
    metalness: 0.05,
  });
  const curb = new THREE.Mesh(curbGeo, stoneMat);
  curb.position.set(0, 0.08, 5.1);
  curb.receiveShadow = enableShadows;
  group.add(curb);

  // Wooden mooring bollards along the quay
  const woodDarkMat = new THREE.MeshStandardMaterial({
    map: timberMap,
    color: 0x6b472f,
    roughness: 0.82,
    metalness: 0.05,
  });
  const bollardGeo = new THREE.CylinderGeometry(0.16, 0.2, 0.85, 12);
  [-7, -2, 3, 8].forEach((bx) => {
    const post = new THREE.Mesh(bollardGeo, woodDarkMat);
    post.position.set(bx, 0.425, 4.9);
    post.castShadow = enableShadows;
    post.receiveShadow = enableShadows;
    group.add(post);
  });

  // Drop zone target ring under the tavern sign at x = 3.8, z = 0.2
  const ringGeo = new THREE.RingGeometry(0.95, 1.22, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const targetRing = new THREE.Mesh(ringGeo, ringMat);
  targetRing.rotation.x = -Math.PI / 2;
  targetRing.position.set(3.8, 0.025, 0.2);
  group.add(targetRing);

  // A Hétágú Szigony Tavern Building (back-right at x = 3.8, z = -3.4)
  const tavern = new THREE.Group();
  tavern.position.set(3.8, 0, -3.4);

  const plasterMat = new THREE.MeshStandardMaterial({
    color: 0x3b332b,
    roughness: 0.9,
    metalness: 0.04,
  });
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.78,
    metalness: 0.12,
  });
  const glowWindowMat = new THREE.MeshStandardMaterial({
    color: 0xffb84d,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.5,
    roughness: 0.3,
  });

  // 1. Stone foundation plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.1, 4.2), stoneMat);
  plinth.position.y = 0.55;
  plinth.castShadow = enableShadows;
  plinth.receiveShadow = enableShadows;
  tavern.add(plinth);

  // 2. Main timber-framed upper body
  const wallBody = new THREE.Mesh(new THREE.BoxGeometry(6.9, 3.6, 3.9), plasterMat);
  wallBody.position.y = 2.9;
  wallBody.castShadow = enableShadows;
  wallBody.receiveShadow = enableShadows;
  tavern.add(wallBody);

  // 3. Timber corner beams & lintels
  [-3.35, -1.1, 1.1, 3.35].forEach((tx) => {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.24, 4.6, 0.24), woodDarkMat);
    beam.position.set(tx, 2.3, 1.98);
    beam.castShadow = enableShadows;
    tavern.add(beam);
  });
  const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(7.1, 0.28, 0.28), woodDarkMat);
  crossBeam.position.set(0, 2.55, 1.98);
  tavern.add(crossBeam);

  // 4. Pitched roof
  const roofLeft = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.25, 3.0), roofMat);
  roofLeft.position.set(0, 5.4, 1.0);
  roofLeft.rotation.x = 0.52;
  roofLeft.castShadow = enableShadows;
  tavern.add(roofLeft);

  const roofRight = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.25, 3.0), roofMat);
  roofRight.position.set(0, 5.4, -1.0);
  roofRight.rotation.x = -0.52;
  roofRight.castShadow = enableShadows;
  tavern.add(roofRight);

  // 5. Heavy oak tavern door
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.2, 0.16), woodDarkMat);
  door.position.set(0, 1.1, 2.02);
  tavern.add(door);

  // 6. Glowing leaded-glass windows
  [-2.2, 2.2].forEach((wx) => {
    const win = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 0.14), glowWindowMat);
    win.position.set(wx, 1.65, 2.0);
    tavern.add(win);

    const upperWin = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.14), glowWindowMat);
    upperWin.position.set(wx, 3.5, 1.98);
    tavern.add(upperWin);
  });

  // 7. Leaning wooden ladder against tavern facade
  const ladder = new THREE.Group();
  ladder.position.set(-1.35, 0, 2.55);
  ladder.rotation.x = -0.22;
  const railGeo = new THREE.CylinderGeometry(0.05, 0.05, 4.3, 8);
  const railL = new THREE.Mesh(railGeo, woodDarkMat);
  railL.position.set(-0.28, 2.15, 0);
  const railR = new THREE.Mesh(railGeo, woodDarkMat);
  railR.position.set(0.28, 2.15, 0);
  ladder.add(railL, railR);
  const rungGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.56, 8);
  rungGeo.rotateZ(Math.PI / 2);
  for (let i = 0; i < 7; i++) {
    const rung = new THREE.Mesh(rungGeo, woodDarkMat);
    rung.position.set(0, 0.45 + i * 0.55, 0);
    ladder.add(rung);
  }
  tavern.add(ladder);

  // 8. Street barrels near the tavern corner
  const barrelMat = new THREE.MeshStandardMaterial({
    color: 0x7c4d2b,
    roughness: 0.78,
    metalness: 0.1,
  });
  const barrelGeo = new THREE.CylinderGeometry(0.42, 0.38, 0.95, 14);
  [
    [-4.3, 0.475, 1.6],
    [-4.9, 0.475, 2.35],
    [3.1, 0.475, 2.1],
  ].forEach(([bx, by, bz]) => {
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.position.set(bx, by, bz);
    barrel.castShadow = enableShadows;
    barrel.receiveShadow = enableShadows;
    tavern.add(barrel);
  });

  group.add(tavern);

  // Neighboring bazaar buildings to the left so the street continues organically
  const bazaarStall = new THREE.Group();
  bazaarStall.position.set(-5.8, 0, -3.5);
  const stallBody = new THREE.Mesh(new THREE.BoxGeometry(6.4, 3.8, 3.6), plasterMat);
  stallBody.position.y = 1.9;
  stallBody.castShadow = enableShadows;
  stallBody.receiveShadow = enableShadows;
  bazaarStall.add(stallBody);

  const awningMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    roughness: 0.85,
    metalness: 0.02,
  });
  const awning = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.14, 2.2), awningMat);
  awning.position.set(0, 2.45, 2.4);
  awning.rotation.x = 0.25;
  awning.castShadow = enableShadows;
  bazaarStall.add(awning);
  group.add(bazaarStall);

  // Rizsa & gang silhouettes on the tavern eaves/ladder
  const gangGroup = new THREE.Group();
  gangGroup.position.set(2.55, 3.85, -1.25);
  const cloakMat = new THREE.MeshStandardMaterial({
    color: 0x1e2430,
    roughness: 0.85,
    metalness: 0.05,
  });
  [-0.35, 0.35].forEach((gx) => {
    const thief = new THREE.Group();
    thief.position.set(gx, 0, 0);
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.42, 6, 10), cloakMat);
    body.position.y = 0.4;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), cloakMat);
    head.position.y = 0.82;
    thief.add(body, head);
    gangGroup.add(thief);
  });
  group.add(gangGroup);

  return {group, targetRing, gangGroup};
}

export function createTridentSign(enableShadows: boolean): SignRig {
  const group = new THREE.Group();
  group.position.set(3.8, 4.45, -1.2);

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.45,
    metalness: 0.82,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.22,
    metalness: 0.92,
    emissive: 0x451a03,
    emissiveIntensity: 0.2,
  });

  // Wrought-iron bracket jutting out over street (to z = +1.4 local => world z = +0.2)
  const bracketArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.85), ironMat);
  bracketArm.position.set(0, 0, 0.72);
  bracketArm.castShadow = enableShadows;
  group.add(bracketArm);

  const brace = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.25), ironMat);
  brace.position.set(0, -0.38, 0.45);
  brace.rotation.x = -0.62;
  group.add(brace);

  // Two chains hanging from bracket end (local z = 1.4)
  const chainGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.65, 8);
  const chainLeft = new THREE.Mesh(chainGeo, ironMat);
  chainLeft.position.set(-0.42, -0.34, 1.4);
  const chainRight = new THREE.Mesh(chainGeo, ironMat);
  chainRight.position.set(0.42, -0.34, 1.4);
  group.add(chainLeft, chainRight);

  // Sign pivot (hangs at local y = -0.66, z = 1.4 => world (3.8, 3.79, 0.2))
  const signPivot = new THREE.Group();
  signPivot.position.set(0, -0.66, 1.4);

  // Ornate sign frame bar
  const topBar = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.1, 0.12), brassMat);
  topBar.castShadow = enableShadows;
  signPivot.add(topBar);

  // Framed backing plaque
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x2c1b12,
    roughness: 0.65,
    metalness: 0.2,
  });
  const backing = new THREE.Mesh(new THREE.BoxGeometry(1.18, 1.15, 0.08), frameMat);
  backing.position.y = -0.64;
  backing.castShadow = enableShadows;
  signPivot.add(backing);

  // Seven-Pronged Trident Emblem (7 vertical brass prongs + crossbar + shaft!)
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.95, 10), brassMat);
  shaft.position.set(0, -0.68, 0.07);
  signPivot.add(shaft);

  const crossbar = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.08, 0.08), brassMat);
  crossbar.position.set(0, -0.45, 0.07);
  signPivot.add(crossbar);

  // 7 distinct gilded trident prongs!
  for (let i = -3; i <= 3; i++) {
    const prongH = i === 0 ? 0.42 : Math.abs(i) === 3 ? 0.34 : 0.3;
    const prong = new THREE.Mesh(
      new THREE.ConeGeometry(0.038, prongH, 8),
      brassMat,
    );
    prong.position.set(i * 0.135, -0.41 + prongH * 0.5, 0.07);
    prong.castShadow = enableShadows;
    signPivot.add(prong);
  }

  group.add(signPivot);
  return {group, signPivot, chainLeft, chainRight};
}

function createMouseCharacter(
  furColor: number,
  tunicColor: number,
  capColor: number,
  enableShadows: boolean,
): {charGroup: THREE.Group; legL: THREE.Mesh; legR: THREE.Mesh} {
  const charGroup = new THREE.Group();

  const furMat = new THREE.MeshStandardMaterial({
    color: furColor,
    roughness: 0.78,
    metalness: 0.04,
  });
  const tunicMat = new THREE.MeshStandardMaterial({
    color: tunicColor,
    roughness: 0.72,
    metalness: 0.05,
  });
  const capMat = new THREE.MeshStandardMaterial({
    color: capColor,
    roughness: 0.6,
    metalness: 0.08,
  });

  // Legs (pivoted near hip for walking animation)
  const legGeo = new THREE.CapsuleGeometry(0.065, 0.18, 4, 8);
  const legL = new THREE.Mesh(legGeo, furMat);
  legL.position.set(0, 0.16, -0.11);
  legL.castShadow = enableShadows;

  const legR = new THREE.Mesh(legGeo, furMat);
  legR.position.set(0, 0.16, 0.11);
  legR.castShadow = enableShadows;

  // Torso
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.28, 6, 12), tunicMat);
  torso.position.set(0, 0.48, 0);
  torso.rotation.z = -0.18; // Leaning forward to push the cart
  torso.castShadow = enableShadows;

  // Head + snout
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 14), furMat);
  head.position.set(0.08, 0.78, 0);
  head.castShadow = enableShadows;

  const snout = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.16, 10), furMat);
  snout.rotation.z = -Math.PI / 2;
  snout.position.set(0.24, 0.75, 0);

  // Round mouse ears
  const earGeo = new THREE.CylinderGeometry(0.095, 0.095, 0.03, 14);
  earGeo.rotateZ(Math.PI / 2);
  const earL = new THREE.Mesh(earGeo, furMat);
  earL.position.set(0.02, 0.93, -0.12);
  const earR = new THREE.Mesh(earGeo, furMat);
  earR.position.set(0.02, 0.93, 0.12);

  // Cap
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
  cap.position.set(0.06, 0.85, 0);

  // Arms reaching forward toward the cart push-bar
  const armGeo = new THREE.CapsuleGeometry(0.05, 0.26, 4, 8);
  armGeo.rotateZ(Math.PI / 2.3);
  const armL = new THREE.Mesh(armGeo, tunicMat);
  armL.position.set(0.2, 0.56, -0.14);
  const armR = new THREE.Mesh(armGeo, tunicMat);
  armR.position.set(0.2, 0.56, 0.14);

  // Tail
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.14, 0.34, 0),
    new THREE.Vector3(-0.34, 0.28, 0.08),
    new THREE.Vector3(-0.48, 0.38, -0.04),
  ]);
  const tail = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 12, 0.025, 6, false), furMat);

  charGroup.add(legL, legR, torso, head, snout, earL, earR, cap, armL, armR, tail);
  return {charGroup, legL, legR};
}

export function createCartAndMice(
  timberMap: THREE.CanvasTexture,
  enableShadows: boolean,
): CartActorRig {
  const group = new THREE.Group();

  const cartWoodMat = new THREE.MeshStandardMaterial({
    map: timberMap,
    color: 0x9a653a,
    roughness: 0.78,
    metalness: 0.06,
  });
  const ironRimMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.38,
    metalness: 0.82,
  });

  // 1. Cart flat bed
  const bed = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.12, 1.05), cartWoodMat);
  bed.position.set(0.4, 0.44, 0);
  bed.castShadow = enableShadows;
  bed.receiveShadow = enableShadows;
  group.add(bed);

  // 2. Cart side walls & front board
  const sideL = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.4, 0.08), cartWoodMat);
  sideL.position.set(0.4, 0.68, -0.49);
  sideL.castShadow = enableShadows;
  const sideR = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.4, 0.08), cartWoodMat);
  sideR.position.set(0.4, 0.68, 0.49);
  sideR.castShadow = enableShadows;
  const frontWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 1.02), cartWoodMat);
  frontWall.position.set(1.24, 0.68, 0);
  frontWall.castShadow = enableShadows;
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 1.02), cartWoodMat);
  backWall.position.set(-0.44, 0.68, 0);
  group.add(sideL, sideR, frontWall, backWall);

  // 3. Push handles extending backward (-X) for Rumini & Puva
  const handleGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.65, 8);
  handleGeo.rotateZ(Math.PI / 2);
  const handleL = new THREE.Mesh(handleGeo, cartWoodMat);
  handleL.position.set(-0.75, 0.62, -0.32);
  const handleR = new THREE.Mesh(handleGeo, cartWoodMat);
  handleR.position.set(-0.75, 0.62, 0.32);
  const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.72, 8), cartWoodMat);
  handleBar.rotation.x = Math.PI / 2;
  handleBar.position.set(-1.05, 0.62, 0);
  group.add(handleL, handleR, handleBar);

  // 4. Four spoked wheels (grounded at y = 0 => wheel center y = 0.32, radius = 0.32)
  const wheels: THREE.Group[] = [];
  const wheelPositions: [number, number][] = [
    [-0.2, -0.58],
    [-0.2, 0.58],
    [1.0, -0.58],
    [1.0, 0.58],
  ];

  const rimGeo = new THREE.TorusGeometry(0.29, 0.035, 10, 24);
  const hubGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.1, 12);
  hubGeo.rotateX(Math.PI / 2);
  const spokeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.56, 6);

  wheelPositions.forEach(([wx, wz]) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(wx, 0.32, wz);

    const rim = new THREE.Mesh(rimGeo, ironRimMat);
    rim.castShadow = enableShadows;
    const hub = new THREE.Mesh(hubGeo, cartWoodMat);

    const spoke1 = new THREE.Mesh(spokeGeo, cartWoodMat);
    const spoke2 = new THREE.Mesh(spokeGeo, cartWoodMat);
    spoke2.rotation.z = Math.PI / 2;
    const spoke3 = new THREE.Mesh(spokeGeo, cartWoodMat);
    spoke3.rotation.z = Math.PI / 4;
    const spoke4 = new THREE.Mesh(spokeGeo, cartWoodMat);
    spoke4.rotation.z = -Math.PI / 4;

    wheelGroup.add(rim, hub, spoke1, spoke2, spoke3, spoke4);
    wheels.push(wheelGroup);
    group.add(wheelGroup);
  });

  // 5. Rumini & Puva characters behind the cart
  const rumini = createMouseCharacter(0xb88655, 0x2563eb, 0x1d4ed8, enableShadows);
  rumini.charGroup.position.set(-1.35, 0, -0.24);
  group.add(rumini.charGroup);

  const puva = createMouseCharacter(0x9ca3af, 0xb45309, 0x78350f, enableShadows);
  puva.charGroup.position.set(-1.38, 0, 0.24);
  group.add(puva.charGroup);

  return {
    group,
    wheels,
    ruminiLegL: rumini.legL,
    ruminiLegR: rumini.legR,
    puvaLegL: puva.legL,
    puvaLegR: puva.legR,
  };
}
