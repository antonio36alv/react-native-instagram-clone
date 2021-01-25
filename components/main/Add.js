import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if(camera) {
        const data = await camera.takePictureAsync(null);
        setImage(data.uri)
    }
  }

  return (
    <View style={styles.container}>

        <View style={styles.cameraContainer}>
          <Camera 
            ref={ref => setCamera(ref)}
            style={styles.fixedRatio} 
            type={type} 
            ratio={"1:1"} 
          />
        </View>

        {/* <View style={styles.buttonContainer}> */}
          <Button
            style={styles.button}
            title="Flip Image"
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
          </Button>
          <Button title="Take Picture" onPress={() => takePicture()} />
          {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cameraContainer: {
        flex: 1,
        flexDirection: "row"
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    },
    image: {
        flex: 1
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "row"
    },
    button: {
        flex: 0.1,
        alignSelf: "flex-end",
        alignItems: "center"
    },
    text: {
        fontSize: 10,
        marginBottom: 10,
        color: "white",
    }
});