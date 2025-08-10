import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// A-Frame VR Scene for Prehistoric Liberia Museum
const VR_SCENE = `
<!DOCTYPE html>
<html>
<head>
  <title>Prehistoric Liberia VR Museum</title>
  <script src="https://aframe.io/releases/1.4.2/aframe.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.1/dist/aframe-extras.min.js"></script>
  <style>
    body { margin: 0; background: #000; }
    
    /* Cardboard Lens Overlay */
    .cardboard-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      z-index: 999;
    }
    
    .lens-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      position: relative;
    }
    
    .lens {
      width: 45vw;
      height: 65vw;
      max-width: 400px;
      max-height: 600px;
      min-width: 200px;
      min-height: 300px;
      border-radius: 50% / 45%;
      overflow: hidden;
      margin: 0 2vw;
      box-shadow: 0 0 20px rgba(0,0,0,0.8);
      background: #111;
      border: 3px solid #333;
    }
    
    .nose-bridge {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 4vw;
      min-width: 20px;
      max-width: 40px;
      height: 50vw;
      min-height: 100px;
      max-height: 400px;
      background: #111;
      border-radius: 15px;
      box-shadow: 0 0 20px rgba(0,0,0,0.9);
      z-index: 998;
    }
    
    .vignette {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      background: radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%);
      z-index: 997;
    }
    
    .loading-screen {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: #191919;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-family: Arial, sans-serif;
      z-index: 1000;
    }
    .loading-text {
      font-size: 18px;
      margin-bottom: 20px;
    }
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #333;
      border-top: 4px solid #EA580C;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .vr-ui {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 100;
      color: #fff;
      font-family: Arial, sans-serif;
      background: rgba(0,0,0,0.7);
      padding: 10px;
      border-radius: 8px;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .lens {
        width: 42vw;
        height: 60vw;
      }
      .nose-bridge {
        width: 5vw;
        height: 45vw;
      }
    }
  </style>
</head>
<body>
  <div class="loading-screen" id="loadingScreen">
    <div class="loading-text">Loading Prehistoric Liberia VR Museum...</div>
    <div class="loading-spinner"></div>
  </div>
  
  <!-- Cardboard Lens Overlay -->
  <div class="cardboard-overlay">
    <div class="vignette"></div>
    <div class="lens-container">
      <div class="lens" id="leftLens"></div>
      <div class="nose-bridge"></div>
      <div class="lens" id="rightLens"></div>
    </div>
  </div>
  
  <div class="vr-ui">
    <div>🎯 Tap to interact</div>
    <div>📱 Insert into Cardboard</div>
  </div>

  <a-scene 
    vr-mode-ui="enabled: false"
    embedded
    loading-screen="enabled: false"
    renderer="antialias: true; colorManagement: true; sortObjects: true"
    background="color: #191919"
    fog="type: exponential; color: #191919; density: 0.01"
    shadow="type: pcfsoft; autoUpdate: true"
    inspector="url: https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js"
    embedded="true"
    vr-mode-ui="enabled: false"
  >
    <!-- Environment -->
    <a-sky color="#191919"></a-sky>
    <a-plane 
      position="0 -2 0" 
      rotation="-90 0 0" 
      width="50" 
      height="50" 
      color="#222"
      shadow="receive: true"
    ></a-plane>

    <!-- Lighting -->
    <a-light type="ambient" color="#404040" intensity="0.4"></a-light>
    <a-light type="directional" position="0 10 5" color="#EA580C" intensity="0.8" cast-shadow></a-light>
    <a-light type="point" position="5 5 5" color="#FFC65D" intensity="0.6" distance="15"></a-light>
    <a-light type="point" position="-5 3 -5" color="#7BC8A4" intensity="0.4" distance="12"></a-light>

    <!-- Museum Exhibits - Prehistoric Liberia Artifacts -->
    
    <!-- Ancient Pottery Display -->
    <a-entity position="-3 0 -5">
      <a-cylinder 
        position="0 1 0" 
        radius="0.8" 
        height="2" 
        color="#8B4513" 
        shadow="cast: true"
        animation="property: rotation; to: 0 360 0; dur: 8000; easing: linear; loop: true"
      ></a-cylinder>
      <a-text 
        value="Ancient Kru Pottery\n(2000 BCE)" 
        position="0 2.5 0" 
        align="center" 
        color="#FFD700" 
        width="3"
        font="kelsonsans"
        shader="msdf"
        negate="false"
      ></a-text>
    </a-entity>

    <!-- Stone Tools Display -->
    <a-entity position="0 0 -5">
      <a-box 
        position="0 0.5 0" 
        width="0.3" 
        height="1" 
        depth="0.1" 
        color="#696969" 
        shadow="cast: true"
        animation="property: position; to: 0 1.5 0; dur: 2000; easing: easeInOutSine; loop: true; dir: alternate"
      ></a-box>
      <a-text 
        value="Stone Tools\n(Prehistoric)" 
        position="0 1.5 0" 
        align="center" 
        color="#FFD700" 
        width="2.5"
        font="kelsonsans"
        shader="msdf"
        negate="false"
      ></a-text>
    </a-entity>

    <!-- Tribal Mask Display -->
    <a-entity position="3 0 -5">
      <a-sphere 
        position="0 1.5 0" 
        radius="0.6" 
        color="#8B4513" 
        shadow="cast: true"
        animation="property: rotation; to: 0 180 0; dur: 6000; easing: easeInOutQuad; loop: true"
      ></a-sphere>
      <a-text 
        value="Sacred Tribal Mask\n(Grebo People)" 
        position="0 2.5 0" 
        align="center" 
        color="#FFD700" 
        width="3"
        font="kelsonsans"
        shader="msdf"
        negate="false"
      ></a-text>
    </a-entity>

    <!-- Rock Art Wall -->
    <a-entity position="0 0 -8">
      <a-plane 
        position="0 2 0" 
        width="6" 
        height="4" 
        color="#2F4F4F" 
        shadow="cast: true"
      ></a-plane>
      <a-text 
        value="Ancient Rock Art\nCave Paintings" 
        position="0 2 0.1" 
        align="center" 
        color="#FFD700" 
        width="5"
        font="kelsans"
        shader="msdf"
        negate="false"
      ></a-text>
    </a-entity>

    <!-- Floating Information Panels -->
    <a-entity position="-6 2 -3">
      <a-plane 
        position="0 0 0" 
        width="2" 
        height="1.5" 
        color="#333" 
        opacity="0.8"
        animation="property: position; to: -6 3 -3; dur: 3000; easing: easeInOutSine; loop: true; dir: alternate"
      ></a-plane>
      <a-text 
        value="Welcome to\nPrehistoric Liberia\nVR Museum" 
        position="0 0 0.1" 
        align="center" 
        color="#FFD700" 
        width="1.8"
        font="kelsans"
        shader="msdf"
        negate="false"
      ></a-text>
    </a-entity>

    <!-- Interactive Elements -->
    <a-entity position="6 1 -3">
      <a-sphere 
        position="0 0 0" 
        radius="0.3" 
        color="#EA580C" 
        class="clickable"
        animation="property: scale; to: 1.2 1.2 1.2; dur: 1000; easing: easeInOutSine; loop: true; dir: alternate"
        onclick="alert('Ancient Liberian Artifact Discovered!')"
      ></a-sphere>
      <a-text 
        value="Tap to\nExplore" 
        position="0 0.5 0" 
        align="center" 
        color="#FFD700" 
        width="1.5"
        font="kelsans"
        shader="msdf"
        negate="false"
      ></a-text>
    </a-entity>

    <!-- Camera and Controls -->
    <a-camera 
      position="0 1.6 0" 
      look-controls="enabled: true; reverseMouseDrag: false"
      wasd-controls="enabled: false"
      cursor="rayOrigin: mouse"
      raycaster="objects: .clickable"
    >
      <a-cursor 
        color="#EA580C" 
        animation__click="property: scale; startEvents: click; from: 0.1 0.1 0.1; to: 1 1 1; dur: 150"
        animation__fusing="property: scale; startEvents: fusing; from: 1 1 1; to: 0.1 0.1 0.1; dur: 1500"
        animation__mouseleave="property: scale; startEvents: mouseleave; to: 1 1 1; dur: 500"
      ></a-cursor>
    </a-camera>

    <!-- Audio Environment -->
    <a-sound 
      src="https://cdn.aframe.io/basic-guide/audio/backgroundNoise.mp3" 
      autoplay="false" 
      loop="true" 
      volume="0.3"
    ></a-sound>

  </a-scene>

  <script>
    // Cardboard VR Implementation
    document.addEventListener('DOMContentLoaded', function() {
      const scene = document.querySelector('a-scene');
      const loadingScreen = document.getElementById('loadingScreen');
      const leftLens = document.getElementById('leftLens');
      const rightLens = document.getElementById('rightLens');
      
      // Hide loading screen when scene is ready
      scene.addEventListener('loaded', function() {
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          setupCardboardView();
        }, 2000);
      });

      function setupCardboardView() {
        // Create canvas elements for left and right eyes
        const leftCanvas = document.createElement('canvas');
        const rightCanvas = document.createElement('canvas');
        
        leftCanvas.width = 400;
        leftCanvas.height = 600;
        rightCanvas.width = 400;
        rightCanvas.height = 600;
        
        leftLens.appendChild(leftCanvas);
        rightLens.appendChild(rightCanvas);
        
        // Get the A-Frame renderer
        const renderer = scene.renderer;
        const camera = scene.camera;
        
        // Set up stereoscopic rendering
        if (renderer && camera) {
          // Create left and right camera views
          const leftCamera = camera.clone();
          const rightCamera = camera.clone();
          
          // Offset cameras for stereoscopic effect
          leftCamera.position.x -= 0.032; // 32mm IPD
          rightCamera.position.x += 0.032;
          
          // Render loop for stereoscopic view
          function renderStereoscopic() {
            // Render left eye
            renderer.setViewport(0, 0, 400, 600);
            renderer.render(scene.object3D, leftCamera);
            leftCanvas.getContext('2d').drawImage(renderer.domElement, 0, 0, 400, 600);
            
            // Render right eye
            renderer.setViewport(0, 0, 400, 600);
            renderer.render(scene.object3D, rightCamera);
            rightCanvas.getContext('2d').drawImage(renderer.domElement, 0, 0, 400, 600);
            
            requestAnimationFrame(renderStereoscopic);
          }
          
          renderStereoscopic();
        }
      }

      // Handle device orientation for head tracking
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
          const camera = scene.camera;
          if (camera) {
            // Convert device orientation to camera rotation
            const alpha = event.alpha || 0;
            const beta = event.beta || 0;
            const gamma = event.gamma || 0;
            
            camera.rotation.y = THREE.MathUtils.degToRad(alpha);
            camera.rotation.x = THREE.MathUtils.degToRad(beta);
            camera.rotation.z = THREE.MathUtils.degToRad(gamma);
          }
        });
      }

      // Handle click events
      document.addEventListener('click', function(event) {
        console.log('VR scene clicked');
      });
    });
  </script>
</body>
</html>
`;

// Placeholder for native module integration
async function getInstalledApps() {
  // This should be replaced with a real native module call
  // Example return value:
  return [
    { name: 'PrehistoricLiberia VR', package: 'com.rypto.prehistoricliberia', icon: 'cube-scan', url: 'prehistoricliberia://' },
    { name: 'Prehistoric Artifacts', package: 'com.rypto.prehistoricartifacts', icon: 'pot-mix', url: 'prehistoricartifacts://' },
    { name: 'OtherApp', package: 'com.example.other', icon: 'apps', url: '' },
  ];
}

export default function VRPage() {
  const router = useRouter();
  const [installedApps, setInstalledApps] = useState<any[]>([]);
  const [selectedApps, setSelectedApps] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      // On Android, try to get installed apps (simulate for now)
      getInstalledApps().then(apps => {
        setInstalledApps(apps.filter(app => app.name.toLowerCase().includes('prehistoric') || app.package.toLowerCase().includes('prehistoric')));
      });
    }
  }, []);

  const handleAddApp = (app: any) => {
    if (!selectedApps.find(a => a.package === app.package)) {
      setSelectedApps([...selectedApps, app]);
    }
    setShowPicker(false);
  };

  const handleOpenApp = (url: string) => {
    if (!url) {
      Alert.alert('No Deep Link', 'This app does not have a deep link URL.');
      return;
    }
    Linking.openURL(url).catch(() => {
      Alert.alert('App Not Found', 'This Prehistoric app is not installed or cannot be opened.');
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.hubHeader}>
        <MaterialCommunityIcons name="home-modern" size={36} color="#EA580C" />
        <Text style={styles.hubTitle}>Prehistoric VR Museum Hub</Text>
        <Text style={styles.hubSubtitle}>Add and launch Prehistoric apps installed on your device.</Text>
        {Platform.OS === 'android' ? (
          <TouchableOpacity style={styles.scanButton} onPress={() => setShowPicker(true)}>
            <MaterialCommunityIcons name="plus-circle" size={22} color="#fff" />
            <Text style={styles.scanButtonText}>Add Prehistoric App</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.iosNote}>App picker is not available on iOS for privacy reasons.</Text>
        )}
      </View>
      {/* App Picker Modal */}
      {showPicker && (
        <Modal
          visible={showPicker}
          animationType="slide"
          transparent
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { width: 340, maxHeight: 420 }] }>
              <Text style={styles.modalTitle}>Select Prehistoric App</Text>
              <View style={{ flex: 1, width: '100%' }}>
                {installedApps.length === 0 ? (
                  <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 30 }}>No Prehistoric apps found on your device.</Text>
                ) : (
                  <ScrollView style={{ width: '100%' }}>
                    {installedApps.map((app, idx) => (
                      <TouchableOpacity key={idx} style={styles.appPickerCard} onPress={() => handleAddApp(app)}>
                        <MaterialCommunityIcons name={app.icon} size={32} color="#fff" style={{ marginRight: 14 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'Tanker' }}>{app.name}</Text>
                          <Text style={{ color: '#aaa', fontSize: 12 }}>{app.package}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
              <TouchableOpacity style={[styles.modalButton, { marginTop: 18, backgroundColor: '#333' }]} onPress={() => setShowPicker(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      <View style={styles.appList}>
        {selectedApps.length === 0 && (
          <View style={styles.noAppsBox}>
            <MaterialCommunityIcons name="emoticon-sad-outline" size={40} color="#aaa" />
            <Text style={styles.noAppsText}>No Prehistoric apps added.</Text>
            <Text style={styles.noAppsSubtext}>Tap 'Add Prehistoric App' to select from your device.</Text>
          </View>
        )}
        {selectedApps.map((app, idx) => (
          <View key={idx} style={styles.appCard}>
            <MaterialCommunityIcons name={app.icon} size={40} color="#fff" style={{ marginBottom: 8 }} />
            <Text style={styles.appName}>{app.name}</Text>
            <Text style={styles.appDesc}>{app.package}</Text>
            <TouchableOpacity style={styles.openButton} onPress={() => handleOpenApp(app.url)}>
              <Text style={styles.openButtonText}>Open</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191919',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    fontFamily: 'Tanker',
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Regular',
  },
  spinner: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: '#333',
    borderTopColor: '#EA580C',
    borderRadius: 20,
    marginTop: 30,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'SpaceMono-Regular',
  },
  hubHeader: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  hubTitle: {
    color: '#EA580C',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginTop: 8,
  },
  hubSubtitle: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'SpaceMono-Regular',
  },
  appList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  appCard: {
    backgroundColor: '#232323',
    borderRadius: 18,
    padding: 18,
    margin: 10,
    width: 180,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  appName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginBottom: 4,
    textAlign: 'center',
  },
  appDesc: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
    marginBottom: 10,
  },
  openButton: {
    backgroundColor: '#EA580C',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  openButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'SpaceMono-Regular',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 8,
    alignSelf: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'SpaceMono-Regular',
    marginLeft: 10,
  },
  iosNote: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Regular',
  },
  noAppsBox: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  noAppsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    fontFamily: 'Tanker',
  },
  noAppsSubtext: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 4,
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'SpaceMono-Regular',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#232323',
    borderRadius: 18,
    padding: 28,
    width: 320,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#EA580C',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginBottom: 18,
  },
  input: {
    width: '100%',
    backgroundColor: '#191919',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 15,
    fontFamily: 'SpaceMono-Regular',
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: '#EA580C',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'SpaceMono-Regular',
  },
  appPickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
}); 