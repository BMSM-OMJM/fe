import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { useFonts } from "expo-font";
import Logo from "./assets/logo.svg";
import Heart from "./assets/heart.svg";

export default function App() {
  const [bpm, setBpm] = useState(0);

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

      {/* 바텀스크롤 */}
      <View></View>
    </View>
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
    fontFamily: "YOnepickBold", // 폰트 이름 정확히 매칭
    fontSize: 45,
    marginBottom: 13,
  },
});