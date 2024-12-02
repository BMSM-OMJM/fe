import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Logo from "./assets/logo.svg";
import Heart from "./assets/heart.svg";
import Check from "./assets/check.svg";
import CheckBox from "./assets/checkBox.svg";

// 스플래시 화면
function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("IPInput"); // 4초 후 IP 입력 화면으로 전환
    }, 4000);
    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  return (
    <View style={styles.loadingContainer}>
      <Image
        source={require("./assets/splash.png")}
        style={styles.splashImage}
      />
      <Text style={styles.loadingText}>당신의 마음을 읽는 중...</Text>
    </View>
  );
}

// IP 입력 화면
function IPInputScreen({ navigation }) {
  const [ip, setIp] = useState(""); // IP 상태를 관리합니다.

  const handleIpSubmit = () => {
    console.log("입력된 IP:", ip); // 입력된 IP를 콘솔에 출력합니다.
    if (ip.trim()) {
      navigation.replace("MainApp"); // IP 입력 후 메인 앱으로 이동
    } else {
      alert("IP를 입력해주세요!"); // IP가 비어있을 경우 경고 메시지
    }
  };

  return (
    <View style={styles.ipContainer}>
      <Text style={styles.ipInputTitle}>IP 입력</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.textInput}
          placeholder="IP를 입력해주세요"
          value={ip}
          onChangeText={setIp}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleIpSubmit}>
          <Text style={[styles.submitText, styles.mapleFont]}>확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 기존 HomeScreen 포함한 Drawer Navigator
function MainApp() {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}

// 기존 HomeScreen
function HomeScreen() {
  const [bpm, setBpm] = useState(0);
  const panY = useRef(new Animated.Value(0)).current;
  const { height: screenHeight } = useWindowDimensions();

  const logoPosition = 120;
  const drawerHeight = screenHeight;
  const maxTranslate = -(screenHeight - logoPosition - 190);

  const translateY = panY.interpolate({
    inputRange: [maxTranslate, 0],
    outputRange: [maxTranslate, 0],
    extrapolate: "clamp",
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const newValue = gestureState.dy;
        if (newValue <= 0) {
          panY.setValue(Math.max(maxTranslate, newValue));
        } else {
          panY.setValue(newValue);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        const currentPosition = panY._value;
        const halfPoint = maxTranslate / 2;

        if (Math.abs(gestureState.vy) > 2) {
          Animated.spring(panY, {
            toValue: gestureState.vy > 0 ? 0 : maxTranslate,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
            mass: 0.5,
          }).start();
        } else {
          Animated.spring(panY, {
            toValue: currentPosition < halfPoint ? maxTranslate : 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
            mass: 0.5,
          }).start();
        }
      },
    })
  ).current;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const heartbeat = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(500),
    ]).start(() => heartbeat());
  };

  useEffect(() => {
    heartbeat();
  }, []);
  const DATA = [
    { id: "1", date: "10월 5일", time: "오후 3시", bpm: "120BPM" },
    { id: "2", date: "10월 7일", time: "오전 10시", bpm: "116BPM" },
    { id: "3", date: "10월 13일", time: "오전 12시", bpm: "123BPM" },
    { id: "4", date: "11월 1일", time: "오후 7시", bpm: "140BPM" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Logo />
      </View>
      <View style={styles.main}>
        <Text style={styles.onepickFont}>내 마음은?</Text>
        <View style={styles.r}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Heart />
          </Animated.View>
        </View>
        <Text style={[styles.bpmText, styles.mapleFont]}>{bpm} bpm</Text>
      </View>
      <Animated.View
        style={[
          styles.defaultDrawer,
          { transform: [{ translateY }], height: drawerHeight },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.drawerHandle, styles.checkSVG]} />
        <View style={styles.recordCheck}>
          <Check />
          <Text style={[styles.mapleFont, styles.check]}>기록확인</Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}></Text>
          <Text style={styles.headerCell}>날짜</Text>
          <Text style={styles.headerCell}>시간</Text>
          <Text style={styles.headerCell}>심장박동수</Text>
        </View>
        {DATA.map((item) => {
          return (
            <View style={styles.row}>
              <View  style={styles.cell}>
                <TouchableOpacity>
                  <CheckBox />
                </TouchableOpacity>
              </View>
             
              <Text style={styles.cell}>{item.date}</Text>
              <Text style={styles.cell}>{item.time}</Text>
              <Text style={styles.cell}>{item.bpm}</Text>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    MaplestoryOTFLight: require("./assets/fonts/MaplestoryOTFLight.otf"),
    YOnepickBold: require("./assets/fonts/YOnepick-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require("./assets/splash.png")}
          style={styles.splashImage}
        />
        <Text style={styles.loadingText}>당신의 마음을 읽는 중...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="IPInput" component={IPInputScreen} />
        <Stack.Screen name="MainApp" component={MainApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    marginHorizontal: 30,
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    paddingVertical: 10,
    borderRadius: 5,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    marginHorizontal: 30,
    flexDirection: "row",
    borderBottomColor: "#E0E0E0",
  },
  cell: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "center",
    borderWidth: 1,
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BFEAFF",
  },
  splashImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  loadingText: {
    fontSize: 20,
    marginTop: 20,
    fontFamily: "MaplestoryOTFLight",
  },
  ipContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#BFEAFF",
  },
  ipInputTitle: {
    fontSize: 30,
    fontFamily: "YOnepickBold",
    marginBottom: 20,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BFEAFF",
    borderRadius: 10,
    padding: 10,
    width: 300,
    backgroundColor: "#FFFFFF",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    padding: 5,
  },
  submitButton: {
    backgroundColor: "#DDDDDD",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  container: {
    flex: 1,
    backgroundColor: "#BFEAFF",
    justifyContent: "center",
    alignItems: "center",
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
  onepickFont: {
    fontFamily: "YOnepickBold",
    fontSize: 45,
    marginBottom: 13,
  },
  mapleFont: {
    fontFamily: "Maplestory OTF",
  },
  bpmText: {
    fontSize: 50,
    marginTop: 26,
  },
  defaultDrawer: {
    position: "absolute",
    bottom: "-80%",
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: "center",
    paddingTop: 15,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#DDDDDD",
    borderRadius: 2,
    marginBottom: 15,
  },
  recordCheck: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom:0
  },
  checkSVG: {
    display: "flex",
  },
  check: {
    fontSize: 20,
    color: "#929292",
    marginLeft: 5,
  },
});
