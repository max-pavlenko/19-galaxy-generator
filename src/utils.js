import * as THREE from 'three';

export function populateStars({particlesCount, branches, galaxyRadius, spiralAngleInRadians, outsideColor, insideColor}) {
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const particlesInfo = [];

    for (let i = 0; i < particlesCount; i++) {
        const currentVertexIndex = i * 3;
        const currentBranchAngle = (i % branches) / branches * 2 * Math.PI;
        const randomRadius = galaxyRadius * Math.random();
        const spiralAngle = randomRadius * spiralAngleInRadians;
        const randomess = Math.pow(Math.random(), (Math.random() - 0.5));
        particlesInfo.push({
            distance: randomRadius,
        });

        positions[currentVertexIndex] = randomRadius * Math.cos(currentBranchAngle + spiralAngle) + randomess;
        positions[currentVertexIndex + 1] = (Math.random() - .5) * .2;
        positions[currentVertexIndex + 2] = randomRadius * Math.sin(currentBranchAngle + spiralAngle) + randomess;

        const newColor = mixColors({outsideColor, insideColor, alpha: randomRadius / galaxyRadius});
        colors[currentVertexIndex] = newColor.r;
        colors[currentVertexIndex + 1] = newColor.g;
        colors[currentVertexIndex + 2] = newColor.b;
    }

    return [positions, colors, particlesInfo];
}

export function paintStars({particlesCount, outsideColor, insideColor, particlesInfo, galaxyRadius}) {
    const colors = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
        const currentVertexIndex = i * 3;
        const newColor = mixColors({outsideColor, insideColor, alpha: particlesInfo[i].distance / galaxyRadius});

        colors[currentVertexIndex] = newColor.r;
        colors[currentVertexIndex + 1] = newColor.g;
        colors[currentVertexIndex + 2] = newColor.b;
    }

    return colors;
}


export function mixColors({outsideColor, insideColor, alpha}) {
    const inColor = new THREE.Color(insideColor);
    const outColor = new THREE.Color(outsideColor);
    const mixedColor = inColor.clone();
    mixedColor.lerp(outColor, alpha);

    return mixedColor;
}
