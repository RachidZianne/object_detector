import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions, LogBox, Platform, } from 'react-native';
import Constants from 'expo-constants';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from '@expo/vector-icons';
import Button from './src/components/Button';
//import * as cocoSsd from '@tensorflow-models/coco-ssd';
//import * as tf from '@tensorflow/tfjs';
//import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
//import Canvas from 'react-native-canvas';
//import * as mobilenet from '@tensorflow-models/mobilenet';

//const TensorCamera = cameraWithTensors(Camera);

//LogBox.ignoreAllLogs(true);

//const { width, height } = Dimensions.get('window');

// const initialiseTensorflow = async () => {
//   await tf.ready();
//   tf.getBackend();
// }

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
      // initialise Tensorflow
      //await initialiseTensorflow();
      // load the model
      //setNet(await mobilenet.load());
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
        console.log('======================');
        console.log(data.uri);
        console.log('======================');
      } catch (error) {
        console.log(error);
      }
    }
  };

  const savePicture = async () => {
    if (image) {
      try {
        const asset = await MediaLibrary.createAssetAsync(image);
        alert('Picture saved! 🎉');
        setImage(null);
        console.log('saved successfully');
        console.log('======================');
        console.log(asset);
        console.log('======================');
        
      } catch (error) {
        console.log(error);
      }
    }
  };

  // //const [model, setModel] = useState(cocoSsd.ObjectDetection);
  // let context = useRef(CanvasRenderingContext2D);
  // const canvas = useRef(Canvas);

  // let AUTORENDER = true
  // function handleCameraStream(images, updatePreview, gl) {
  //   const loop = async () => {
  //     if(!AUTORENDER) {
  //       updatePreview();
  //     }
  //     const nextImageTensor = images.next().value;

  //     if (!model || !nextImageTensor) throw new Error('no model');

  //     model
  //       .detect(nextImageTensor)
  //       .then((predictions) => {
  //         drawRectangle(predictions, nextImageTensor);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //       tf.dispose([imageTensor]);

  //       if(!AUTORENDER) {
  //         gl.endFrameEXP();
  //       }

  //     requestAnimationFrame(loop);
  //   };
  //   loop();
  // }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  let textureDims;
  Platform.OS === 'ios'
    ? (textureDims = { height: 1920, width: 1080 })
    : (textureDims = { height: 1200, width: 1600 });

  return (
    <View style={styles.container}>
      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          ref={cameraRef}
          flashMode={flash}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 30,
            }}
          >
            <Button
              title=""
              icon="retweet"
              onPress={() => {
                setType(
                  type === CameraType.back ? CameraType.front : CameraType.back
                );
              }}
            />
            <Button
              onPress={() =>
                setFlash(
                  flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
                )
              }
              icon="flash"
              color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#fff'}
            />
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: image }} style={styles.camera} />
      )}

      <View style={styles.controls}>
        {image ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 50,
            }}
          >
            <Button
              title="Re-take"
              onPress={() => setImage(null)}
              icon="retweet"
            />
            <Button title="Save" onPress={savePicture} icon="check" />
          </View>
        ) : (
          <Button title="Take a picture" onPress={takePicture} icon="camera" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#000',
    padding: 8,
  },
  controls: {
    flex: 0.5,
  },
  button: {
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#E9730F',
    marginLeft: 10,
  },
  camera: {
    flex: 5,
    borderRadius: 20,
  },
  topControls: {
    flex: 1,
  },
});