import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

const colorPalette = ["#E23A45", "#392DCA", "#ACA7E9"];

interface HexagonAnimation {
  mesh: THREE.Mesh;
  originalColor: THREE.Color;
  targetColor: THREE.Color;
  startTime: number;
  duration: number;
  isReturning: boolean;
}

const BackgroundLoader = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [targetHexCoords, setTargetHexCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  useEffect(() => {
    // Check device type on initial load and window resize
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1200);
    };

    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);

    return () => {
      window.removeEventListener("resize", checkDeviceType);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent
    containerRef.current.appendChild(renderer.domElement);

    // Create scene
    const scene = new THREE.Scene();

    // Original SVG dimensions
    const SVG_WIDTH = 1400;
    const SVG_HEIGHT = 800;

    // Responsive zoom factor based on device type
    let zoomFactor = 1.4; // Default for desktop

    if (isMobile) {
      zoomFactor = 0.9; // More zoomed out for mobile to show more content
    } else if (isTablet) {
      zoomFactor = 1.2; // Intermediate zoom for tablets
    }

    const cameraWidth = SVG_WIDTH * zoomFactor;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const cameraHeight = cameraWidth / aspectRatio;

    const camera = new THREE.OrthographicCamera(
      -cameraWidth / 2,
      cameraWidth / 2,
      cameraHeight / 2,
      -cameraHeight / 2,
      0.1,
      2000,
    );

    // Adjust camera position based on device type
    // For mobile and tablet, we want to position the camera to show the center part of the SVG
    // while allowing the sides to extend beyond the viewport
    const cameraOffsetX = isMobile ? -100 : isTablet ? -50 : 0;

    // Position camera at the adjusted center of SVG
    camera.position.set(SVG_WIDTH / 2 + cameraOffsetX, SVG_HEIGHT / 2, 100);
    camera.lookAt(SVG_WIDTH / 2 + cameraOffsetX, SVG_HEIGHT / 2, 0);

    // Group for hexagons
    const hexGroup = new THREE.Group();
    scene.add(hexGroup);

    // Store hexagons and their colors
    const hexagons: THREE.Mesh[] = [];
    const originalColors: THREE.Color[] = [];
    const activeAnimations: Map<number, HexagonAnimation> = new Map();

    // Load SVG
    const loader = new SVGLoader();
    loader.load("/hero.svg", (data) => {
      // Flag to track if we found our target hexagon
      let targetHexagonFound = false;

      // Store the target path data to find
      const targetPathData =
        "M1009.9 403.7H1002.9L999.5 397.7L1002.9 391.7H1009.9L1013.4 397.7L1009.9 403.7Z";

      // Process paths
      data.paths.forEach((path) => {
        const fillColor = path.userData?.style?.fill;
        if (!fillColor || fillColor === "none") return;

        if (
          typeof path.toShapes === "function" &&
          path.currentPath &&
          (path.currentPath as any).path === targetPathData
        ) {
          console.log("Found target hexagon in SVG data!");
          targetHexagonFound = true;

          // Calculate the center of the path
          const xValues = [1002.9, 1009.9, 1013.4, 999.5];
          const yValues = [391.7, 403.7, 397.7];

          const avgX =
            xValues.reduce((sum, val) => sum + val, 0) / xValues.length;
          const avgY =
            yValues.reduce((sum, val) => sum + val, 0) / yValues.length;

          console.log("Raw SVG coordinates of target hexagon:", {
            x: avgX,
            y: avgY,
          });

          // Convert SVG coordinates to screen coordinates
          // Adjust calculations based on device type
          let screenX, screenY;

          if (isMobile) {
            // For mobile, we adjust the calculation to account for the shifted view
            screenX = window.innerWidth * ((avgX + 100) / SVG_WIDTH);
            screenY = window.innerHeight * (avgY / SVG_HEIGHT);
          } else if (isTablet) {
            // For tablet, we use a smaller adjustment
            screenX = window.innerWidth * ((avgX + 50) / SVG_WIDTH);
            screenY = window.innerHeight * (avgY / SVG_HEIGHT);
          } else {
            // Original calculation for desktop
            screenX = window.innerWidth * (avgX / SVG_WIDTH);
            screenY = window.innerHeight * (avgY / SVG_HEIGHT);
          }

          console.log("Screen coordinates of target hexagon:", {
            x: screenX,
            y: screenY,
          });

          // Store the coordinates in state
          setTargetHexCoords({ x: screenX, y: screenY });
        }

        // Create shapes from path
        const shapes = path.toShapes(true);

        shapes.forEach((shape) => {
          const geometry = new THREE.ShapeGeometry(shape);
          const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(fillColor),
            side: THREE.DoubleSide,
          });

          const mesh = new THREE.Mesh(geometry, material);

          // Fix the orientation by flipping the Y axis
          mesh.scale.set(1, -1, 1);
          // Adjust Y position to account for the flip
          mesh.position.y = SVG_HEIGHT;

          // Store original color
          originalColors.push(new THREE.Color(fillColor));
          hexagons.push(mesh);
          hexGroup.add(mesh);
        });
      });

      // If target hexagon not found by path, try to find by color
      if (!targetHexagonFound) {
        console.log(
          "Target hexagon not found by path data, searching by color...",
        );

        // Find a hexagon with the light purple color
        const lightPurpleHexagons = hexagons.filter((hex, index) => {
          const color = originalColors[index];
          const hexColor = `#${color.getHexString()}`;
          return hexColor.toUpperCase() === "#ACA7E9";
        });

        if (lightPurpleHexagons.length > 0) {
          console.log(
            `Found ${lightPurpleHexagons.length} hexagons with light purple color`,
          );

          // Use the first match (or maybe a specific one based on position)
          const targetHex = lightPurpleHexagons[0];
          const position = new THREE.Vector3();
          targetHex.getWorldPosition(position);

          // Convert Three.js coordinates to screen coordinates - with responsive adjustment
          let screenX, screenY;

          if (isMobile) {
            screenX =
              window.innerWidth *
              ((position.x + SVG_WIDTH / 2 + 100) / SVG_WIDTH);
            screenY =
              window.innerHeight * ((position.y + SVG_HEIGHT / 2) / SVG_HEIGHT);
          } else if (isTablet) {
            screenX =
              window.innerWidth *
              ((position.x + SVG_WIDTH / 2 + 50) / SVG_WIDTH);
            screenY =
              window.innerHeight * ((position.y + SVG_HEIGHT / 2) / SVG_HEIGHT);
          } else {
            screenX =
              window.innerWidth * ((position.x + SVG_WIDTH / 2) / SVG_WIDTH);
            screenY =
              window.innerHeight * ((position.y + SVG_HEIGHT / 2) / SVG_HEIGHT);
          }

          console.log("Screen coordinates of target hexagon (by color):", {
            x: screenX,
            y: screenY,
          });

          // Store the coordinates in state
          setTargetHexCoords({ x: screenX, y: screenY });
        } else {
          console.log("No hexagons with light purple color found");
        }
      }

      // Set the animation going immediately
      setInterval(changeRandomHexagons, 2000);
      animate();
    });

    // Adjust animation density for mobile/tablet
    // Function to change colors of random hexagons
    function changeRandomHexagons() {
      // Determine number of hexagons to animate, fewer on mobile for better performance
      const multiplier = isMobile ? 0.005 : isTablet ? 0.01 : 0.015;
      const count = Math.max(
        1,
        Math.floor(hexagons.length * (Math.random() * multiplier + 0.005)),
      );

      // Maximum simultaneous animations based on device
      const maxAnimations = isMobile ? 8 : isTablet ? 12 : 15;

      // Select random hexagons
      for (let i = 0; i < count; i++) {
        if (activeAnimations.size >= maxAnimations) break; // Limit max simultaneous animations

        const index = Math.floor(Math.random() * hexagons.length);
        if (activeAnimations.has(index)) continue;

        const hex = hexagons[index];
        const originalColor = originalColors[index].clone();

        // Choose a random color from palette
        const randomColorHex =
          colorPalette[Math.floor(Math.random() * colorPalette.length)];
        const targetColor = new THREE.Color(randomColorHex);

        // Duration for fade-in and fade-out (in milliseconds)
        // Shorter durations on mobile for better perceived performance
        const durationMultiplier = isMobile ? 0.8 : isTablet ? 0.9 : 1;
        const fadeInDuration = (500 + Math.random() * 500) * durationMultiplier;
        const holdDuration = (1000 + Math.random() * 2000) * durationMultiplier;
        const fadeOutDuration =
          (500 + Math.random() * 500) * durationMultiplier;

        // Start the fade-in animation
        const animation: HexagonAnimation = {
          mesh: hex,
          originalColor: originalColor,
          targetColor: targetColor,
          startTime: performance.now(),
          duration: fadeInDuration,
          isReturning: false,
        };

        activeAnimations.set(index, animation);

        // Schedule the fade-out animation after hold duration
        setTimeout(() => {
          if (activeAnimations.has(index)) {
            const currentAnim = activeAnimations.get(index)!;
            // Start fade-out animation
            activeAnimations.set(index, {
              ...currentAnim,
              targetColor: originalColor,
              originalColor: targetColor,
              startTime: performance.now(),
              duration: fadeOutDuration,
              isReturning: true,
            });

            // Remove from active animations after fade-out completes
            setTimeout(() => {
              activeAnimations.delete(index);
            }, fadeOutDuration + 50); // Add small buffer
          }
        }, fadeInDuration + holdDuration);
      }
    }

    // Enhanced resize handler with responsive adjustments
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update device type detection
      const newIsMobile = width < 768;
      const newIsTablet = width >= 768 && width < 1200;

      // Only update state if device type has changed (avoid unnecessary re-renders)
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
      }
      if (newIsTablet !== isTablet) {
        setIsTablet(newIsTablet);
      }

      // Update renderer
      renderer.setSize(width, height);

      // Adjust zoom factor based on device
      let newZoomFactor = 1.4; // Default for desktop
      if (newIsMobile) {
        newZoomFactor = 0.9;
      } else if (newIsTablet) {
        newZoomFactor = 1.2;
      }

      const newCameraWidth = SVG_WIDTH * newZoomFactor;
      const newAspectRatio = width / height;
      const newCameraHeight = newCameraWidth / newAspectRatio;

      // Update camera parameters
      camera.left = -newCameraWidth / 2;
      camera.right = newCameraWidth / 2;
      camera.top = newCameraHeight / 2;
      camera.bottom = -newCameraHeight / 2;

      // Adjust camera position for device type
      const cameraOffsetX = newIsMobile ? -100 : newIsTablet ? -50 : 0;
      camera.position.set(SVG_WIDTH / 2 + cameraOffsetX, SVG_HEIGHT / 2, 100);
      camera.lookAt(SVG_WIDTH / 2 + cameraOffsetX, SVG_HEIGHT / 2, 0);

      camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", handleResize);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Update color transitions
      const currentTime = performance.now();

      activeAnimations.forEach((animation, index) => {
        const {
          mesh,
          originalColor,
          targetColor,
          startTime,
          duration,
          isReturning,
        } = animation;

        // Calculate progress (0 to 1)
        let progress = (currentTime - startTime) / duration;
        progress = Math.min(1, Math.max(0, progress)); // Clamp between 0 and 1

        // Apply easing function for smoother transition
        const easedProgress = isReturning
          ? easeOutCubic(progress)
          : easeInCubic(progress);

        // Interpolate color
        const currentColor = new THREE.Color();
        currentColor.r =
          originalColor.r + (targetColor.r - originalColor.r) * easedProgress;
        currentColor.g =
          originalColor.g + (targetColor.g - originalColor.g) * easedProgress;
        currentColor.b =
          originalColor.b + (targetColor.b - originalColor.b) * easedProgress;

        // Update mesh color
        (mesh.material as THREE.MeshBasicMaterial).color.copy(currentColor);
      });

      renderer.render(scene, camera);
    }

    // Easing functions for smoother transitions
    function easeInCubic(x: number): number {
      return x * x * x;
    }

    function easeOutCubic(x: number): number {
      return 1 - Math.pow(1 - x, 3);
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      hexagons.forEach((hex) => {
        if (hex.geometry) hex.geometry.dispose();
        if (hex.material) {
          if (Array.isArray(hex.material)) {
            hex.material.forEach((mat) => mat.dispose());
          } else {
            (hex.material as THREE.Material).dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, [isMobile, isTablet]); // Add device type dependencies to re-render when they change

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{
          zIndex: 1,
        }}
      />

      {/* Red box at target hexagon coordinates - only shown in development */}
      {targetHexCoords && (
        <div
          className="absolute"
          style={{
            zIndex: 100,
            left: `${targetHexCoords.x}px`,
            top: `${targetHexCoords.y}px`,
            width: isMobile ? "10px" : "20px",
            height: isMobile ? "10px" : "20px",
            backgroundColor: "red",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </>
  );
};

export default BackgroundLoader;
