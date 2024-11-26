
function initShaders() {
  const shaders = []; // Store all shader materials
  //Shaders
  const SHADER_COLOR = new THREE.Color(1.0, 0.0, 0.0); // Example: Red color
  // Initialize Three.js Scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.id = 'background-canvas'; // Optional: give it an ID
  document.getElementById('background-webgl').appendChild(renderer.domElement);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('warp-webgl').appendChild(renderer.domElement);

  // Fullscreen Plane for Shader
  const planeGeometry = new THREE.PlaneGeometry(2, 2);
  function createShaderMaterial(vertexShader, fragmentShader, customUniforms = {}) {
    const defaultUniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    };
    return new THREE.ShaderMaterial({
      uniforms: { ...defaultUniforms, ...customUniforms },
      vertexShader,
      fragmentShader,
    });
  }

  // vertical
  const verticalShader = new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_audio: { value: 0.0 },
      u_lineColor: { value: SHADER_COLOR }, // Use constant color
    },
    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        precision highp float;
        uniform float u_time;
        uniform vec3 u_lineColor;
        uniform vec2 u_resolution;
        uniform float u_audio; // Audio intensity
        varying vec2 vUv;

        // Simple random function
        float random(float x) {
            return fract(sin(x) * 43758.5453123);
        }

        void main() {
            // Normalize UV coordinates
            vec2 uv = vUv * 10.0;

            // Audio-driven line width modulation
            float lineWidth = 0.01 + u_audio * 0.05; // Width increases with audio
            float lineSpacing = 0.1;

            // Vibrating effect based on audio
            float vibration = sin(u_time * 2.0 + uv.x * 30.0) * u_audio * 0.1;

            // Apply vibration to line positions
            uv.x += vibration;

            // Distance to line centers
            float centerDist = abs(fract(uv.x / lineSpacing) - 0.5);

            // Randomized fading effect (still present, but subtle)
            float randomness = random(floor(uv.x / lineSpacing));
            float fade = 0.5 + 0.5 * sin(u_time * 2.0 + randomness * 6.28318);

            // Combine all effects
            float intensity = step(centerDist, lineWidth) * fade;

            // Apply color and transparency
            vec3 color = u_lineColor * intensity;
            gl_FragColor = vec4(color, intensity);
        }
    `,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const verticalPlane = createShaderPlane(verticalShader, { x: 0, y: 0, z: -3 });
  scene.add(verticalPlane);
  shaders.push(verticalShader);

  // horizontal
  const horizontalShader = new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 0 }, // Time for consistency
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_audio: { value: 0.0 }, // Audio interaction uniform
      u_lineColor: { value: SHADER_COLOR }, // Consistent color with vertical lines
    },
    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        precision highp float;
        uniform vec2 u_resolution; // Screen resolution
        uniform vec3 u_lineColor; // Line color
        uniform float u_audio; // Audio interaction
        varying vec2 vUv;

        void main() {
            // Map lineY to 33% of the height of the screen (normalized)
            float lineY = 0.33;

            // Define line thickness (adjustable via audio input)
            float lineWidth = 0.005 + u_audio * 0.02;

            // Calculate distance from the horizontal line
            float distToLine = abs(vUv.y - lineY);

            // Smooth fade for line edges
            float intensity = smoothstep(lineWidth, 0.0, distToLine);

            // Apply color and intensity
            vec3 color = u_lineColor * intensity;
            gl_FragColor = vec4(color, intensity);
        }
    `,
    blending: THREE.AdditiveBlending, // Enable blending for better visibility
    transparent: true,                // Allow transparency
    depthWrite: false,                // Prevent conflicts in Z-buffer
  });

  // Create and position the horizontal plane
  const horizontalPlane = createShaderPlane(horizontalShader, { x: 0, y: 0, z: -3 }, { x: 10, y: 1 });
  scene.add(horizontalPlane);
  shaders.push(horizontalShader);

  function createShaderPlane(shaderMaterial, position = { x: 0, y: 0, z: -3 }, scale = { x: 10, y: 10 }) {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial);
    plane.position.set(position.x, position.y, position.z);
    plane.scale.set(scale.x, scale.y, 1);
    return plane;
  }

  function updateAudioUniform(audioLevel) {
    shaders.forEach(shader => {
      if (shader.uniforms.u_audio) {
        shader.uniforms.u_audio.value = audioLevel;
      }
    });
  }

  function updateShaderUniforms(time, resolution) {
    shaders.forEach((shader) => {
      if (shader.uniforms.u_time) {
        shader.uniforms.u_time.value = time;
      }
      if (shader.uniforms.u_resolution) {
        shader.uniforms.u_resolution.value.set(resolution.x, resolution.y);
      }
      if (shader.uniforms.u_pointerSpeed) {
        shader.uniforms.u_pointerSpeed.value = pointerSpeed.magnitude;
      }
    });
    updateAudioUniform(smoothedAudio); // Keep existing audio updates
  }

  // Set Camera Position
  camera.position.z = 1;

  // Animation Loop
  const clock = new THREE.Clock();
  let smoothedAudio = 0.0; // Store the smoothed audio value
  const smoothingFactor = 0.1; // Lower values = smoother transitions

  function animate() {
    let audioLevel = 0;

    // Check if analyser exists and process audio data
    if (analyser) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      // Calculate average audio level
      audioLevel = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length / 255;

      // Apply smoothing
      smoothedAudio = smoothedAudio * (1 - smoothingFactor) + audioLevel * smoothingFactor;
    }

    // Update shader uniforms
    updateShaderUniforms(clock.getElapsedTime(), { x: window.innerWidth, y: window.innerHeight });

    // Render scene
    renderer.render(scene, camera);

    // Request next frame
    requestAnimationFrame(animate);
  }

  animate();

  // Handle Resizing
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    verticalShader.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
  });

}