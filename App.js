import React, { useState, useEffect, useRef, useContext, createContext } from "react";
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
  useState, 
  useEffect,
} from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Logo from "./assets/logo.svg";
import Heart from "./assets/heart.svg";
import Check from "./assets/check.svg";
import CheckBox from "./assets/checkBox.svg";
import { Table, Row, Rows } from "react-native-table-component";

const IpContext = createContext();

const App = () => {
  // IP 주소 상태 관리
  const [ip, setIp] = useState("");

  return (
    // 2. Provider로 값 제공
    <IpContext.Provider value={ip}>
      <IPInputScreen />
      <HomeScreen />
    </IpContext.Provider>
  );
};


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
useContext 
/// IP 입력 화면
function IPInputScreen({ navigation }) {
  const [ip, setIp] = useContext(IpContext); // IP 주소 상태 관리용 state

  // IP 제출 처리 함수
  const handleIpSubmit = async () => {
    console.log("입력된 IP:", ip); // 디버깅용 로그
    if (ip.trim()) {
      try {
        // 서버로 IP 전송
        const response = await fetch('/api/userIP', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',  // JSON 형식으로 데이터 전송
          },
          body: JSON.stringify({ ip: ip }),  // 입력된 IP를 본문에 포함
        });

        if (!response.ok) {
          throw new Error('서버 요청 실패');
        }

        const responseData = await response.json();  // 서버 응답 처리
        console.log('서버 응답:', responseData);
        
        // 성공적으로 IP를 서버에 전송한 후 MainApp으로 이동
        navigation.replace("MainApp"); 
      } catch (error) {
        console.error('요청 중 오류 발생:', error);  // 에러 처리
        alert('서버에 연결할 수 없습니다.');
      }
    } else {
      alert("IP를 입력해주세요!"); // IP가 비어있으면 경고 메시지
    }
  };

  // IP 입력 화면 UI 렌더링
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

// 메인 앱의 Drawer Navigator 설정
function MainAppDrawerNavigator() {
  const Drawer = createDrawerNavigator(); // Drawer Navigator 생성

  // Drawer Navigator 구조 정의
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false, // 헤더 숨김 설정
        }}
      />
    </Drawer.Navigator>
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

// 메인 홈 화면 컴포넌트
function HomeScreen() {
  const [bpm, setBpm] = useState(0);  // 심박수 상태 관리
  const {ip} = useContext(IpContext);
  const userIP = ip;  // 실제 사용자 IP 값으로 대체하세요
  const panY = useRef(new Animated.Value(0)).current;  // 드로워의 Y축 위치값
  const { height: screenHeight } = useWindowDimensions();  // 화면 높이 가져오기

  // 드로워 위치 계산을 위한 상수들
  const logoPosition = 120;  // 로고의 상단 위치
  const drawerHeight = screenHeight - 80;  // 드로워의 전체 높이
  const maxTranslate = -(screenHeight - logoPosition - 100);  // 드로워가 올라갈 수 있는 최대 높이

  // 드로워의 Y축 애니메이션 값 설정
  const translateY = panY.interpolate({
    inputRange: [maxTranslate, 0],  // 입력 범위: 최대 높이부터 0까지
    outputRange: [maxTranslate, 0],  // 출력 범위: 입력값과 동일
    extrapolate: "clamp",  // 범위를 벗어나는 값 제한
  });

  // 드로워의 드래그 제스처 처리를 위한 PanResponder 설정
  const panResponder = useRef(
    PanResponder.create({
      // 터치 시작 시 드래그 허용 여부
      onStartShouldSetPanResponder: () => false,
      // 터치 이동 시 드래그 허용 여부 (10픽셀 이상 움직였을 때만 드래그 시작)
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      // 드래그 중 위치 업데이트
      onPanResponderMove: (event, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      // 드래그 종료 시 처리
      onPanResponderRelease: (event, gestureState) => {
        const currentPosition = panY._value;  // 현재 드로워 위치
        const halfPoint = maxTranslate / 2;   // 중간 지점 계산

        // 작은 움직임은 원위치로 돌아가기
        if (Math.abs(gestureState.dy) < 50) {
          Animated.spring(panY, {
            toValue: 0,                // 원래 위치로
            useNativeDriver: true,     // 네이티브 드라이버 사용
            damping: 30,              // 감쇠 (높을수록 빨리 안정됨)
            stiffness: 100,           // 강성 (높을수록 빠른 움���임)
            mass: 1,                  // 질량 (높을수록 느린 움직임)
            velocity: 0,              // 초기 속도
          }).start();
          return;
        }

        // 애니메이션 공통 설정
        const animationConfig = {
          useNativeDriver: true,
          damping: 30,               // 감쇠 계수
          stiffness: 100,            // 강성 계수
          mass: 1.2,                 // 질량
          velocity: gestureState.vy * 0.05,  // 드래그 속도 반영
          overshootClamping: false,  // 경계값 초과 허용
          restDisplacementThreshold: 0.01,  // 정지 위치 임계값
          restSpeedThreshold: 0.01,  // 정지 속도 임계값
        };

        // 드래그 방향과 거리에 따른 애니메이션 처리
        if (gestureState.dy > 100) {  // 아래로 많이 드래그
          Animated.spring(panY, {
            toValue: drawerHeight,    // 완전히 내리기
            ...animationConfig,
          }).start();
        } else if (gestureState.dy < -100) {  // 위로 많이 드래그
          Animated.spring(panY, {
            toValue: maxTranslate,    // 최대로 올리기
            ...animationConfig,
          }).start();
        } else {  // 중간 정도 드래그
          Animated.spring(panY, {
            toValue: currentPosition < halfPoint ? maxTranslate : 0,  // 가까운 위치로
            ...animationConfig,
          }).start();
        }
      },
    })
  ).current;

  // 심장 박동 애니메이션을 위한 scale 값
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 심장 박동 애니메이션 시퀀스 정의
  const heartbeat = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,        // 20% 커지기
        duration: 500,       // 0.5초 동안
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,          // 원래 크기로
        duration: 500,       // 0.5초 동안
        useNativeDriver: true,
      }),
      Animated.delay(500),   // 0.5초 대기
    ]).start(() => heartbeat());  // 애니메이션 반복
  };

  // 컴포넌트 마운트 시 심장 박동 애니메이션 시작
  useEffect(() => {
    heartbeat();
  }, []);

  // 표 헤더와 데이터 정의
  const tableHead = ["", "날짜", "시간", "심장박동수"];  // 표 헤더
  const tableData = [
    ["□", "10월 5일", "오후 3시", "120 BPM"],    // 첫 번째 행
    ["□", "10월 7일", "오전 10시", "116 BPM"],   // 두 번째 행
    ["□", "10월 13일", "전 12시", "123 BPM"],  // 세 번째 행
    ["□", "11월 1일", "오후 7시", "140 BPM"],    // 네 번째 행
  ];

  // UI 렌더링
  return (
    <View style={styles.container}>
      {/* 좌측 상단 로고 */}
      <View style={styles.logo}>
        <Logo />
      </View>

      {/* 중앙 메인 콘텐츠 */}
      <View style={styles.main}>
        <Text style={styles.onepickFont}>내 마음은?</Text>
        {/* 심장 애니메이션 영역 */}
        <View style={styles.r}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Heart />
          </Animated.View>
        </View>
        {/* BPM 수치 표시 */}
        <Text style={[styles.bpmText, styles.mapleFont]}>{bpm} bpm</Text>
      </View>

      {/* 하단 드로워 영역 */}
      <Animated.View
        style={[
          styles.defaultDrawer,
          { transform: [{ translateY }], height: drawerHeight },
        ]}
        {...panResponder.panHandlers}
      >
        {/* 드로워 상단 핸들 */}
        <View style={[styles.drawerHandle, styles.checkSVG]} />
        {/* 기록 확인 헤더 */}
        <View style={styles.recordCheck}>
          <Check />
          <Text style={[styles.mapleFont, styles.check]}>기록확인</Text>
        </View>

        {/* 기록 테���블 */}
        <View style={styles.tableContainer}>
          <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
            <Row
              data={tableHead}
              style={{ height: 40, backgroundColor: "#BFEAFF" }}
              textStyle={{
                textAlign: "center",
                fontFamily: "MaplestoryOTFLight",
                color: "#000",
              }}
            />
            <Rows
              data={tableData}
              style={{ height: 40 }}
              textStyle={{
                textAlign: "center",
                fontFamily: "MaplestoryOTFLight",
              }}
            />
          </Table>
        </View>
      </Animated.View>
    </View>
  );
}

// 네비게이션 스택 생성
const Stack = createStackNavigator();

// 앱의 메인 컴포넌트
export default function App() {
  // 커스텀 폰트 로드
  const [fontsLoaded] = useFonts({
    MaplestoryOTFLight: require("./assets/fonts/MaplestoryOTFLight.otf"),
    YOnepickBold: require("./assets/fonts/YOnepick-Bold.ttf"),
  });

  // 폰트 로딩 중일 때 로딩 화면 표시
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

  // 앱의 네비게이션 구조 정의
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
  tableContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    width: "100%",
  },
});
