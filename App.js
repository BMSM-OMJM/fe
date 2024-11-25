import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native"; // Added Modal and TouchableOpacity
import { useState } from "react";
import { useFonts } from "expo-font";
import Logo from "./assets/logo.svg";
import Heart from "./assets/heart.svg";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

// HomeScreen 컴포넌트 정의
function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function HomeScreen() {
  return (
    <View>
      <Text>Drawer로 감싸고, HomeScreen을 정의해주는 부분입니다.</Text>
    </View>
  );
}

function CustomDrawer({ visible, onClose }) { 
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
    >
      <View style={styles.drawerContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text>닫기</Text>
        </TouchableOpacity>
        <Text>여기에 필요한 내용을 넣으세요</Text>
      </View>
    </Modal>
  );
}

export default function App() {
  const [bpm, setBpm] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false); 

  // 폰트 로드
  const [fontsLoaded] = useFonts({
    MaplestoryOTFLight: require("./assets/fonts/MaplestoryOTFLight.otf"),
    YOnepickBold: require("./assets/fonts/YOnepick-Bold.ttf"),
  });

  // 폰트 로드 상태 확인
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Fonts...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <View style={styles.container}>
        {/* 로고 */}
        <View style={styles.logo}>
          <Logo />
        </View>

        {/* 메인 기능 */}
        <View style={styles.main}>
          {/* 텍스트 */}
          <View>
            <Text style={styles.onepickFont}>내 마음은?</Text>
          </View>

          {/* 하트 아이콘 */}
          <View style={styles.r}>
            <Heart />
          </View>

          {/* BPM 표시 */}
          <View>
            <Text style={[styles.bpmText, styles.mapleFont]}>{bpm} bpm</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setDrawerVisible(true)}>
          <Text>클릭해봐요!! 예시 드로워 (응용해서 만들어봐요)</Text>
        </TouchableOpacity>
        <CustomDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />

        {/* 바텀스크롤 */}
        <View>
          <Drawer.Navigator>
            <Drawer.Screen name="Home" component={HomeScreen} />
          </Drawer.Navigator>
        </View>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#BFEAFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    position: "absolute",
    top: 55,
    left: 7,
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  r: {
    backgroundColor: "#FFF1C1",
    padding: 40,
    borderRadius: 1000,
  },
  mapleFont: {
    fontFamily: "MaplestoryOTFLight",
  },
  bpmText: {
    fontSize: 50,
    marginTop: 26,
  },
  onepickFont: {
    fontFamily: "YOnepickBold",
    fontSize: 45,
    marginBottom: 13,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "flex-start",
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
});