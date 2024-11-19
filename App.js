import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import { useState } from "react";
import Logo from "./assets/logo.svg";
import Heart from "./assets/heart.svg";

export default function App() {
  const [bpm, setBpm] = useState(0);

  // 두 개의 폰트 로드
  const [fontsLoaded] = useFonts({
    MaplestoryOTFLight: require("./assets/fonts/MaplestoryOTFLight.otf"),
    YOnepickBold: require("./assets/fonts/YOnepick-Bold.ttf"),
  });

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
          <Text style={[styles.txt, styles.onepickFont]}>내 마음은?</Text>
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
  mapleFont: {},
  bpmText: {
    fontSize: 50,
    marginTop: 26,
  },
  onepickFont: {
    fontSize: 50,
    marginBottom: 13,
  },
});
