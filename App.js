import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, Animated, PanResponder, useWindowDimensions, Easing} from "react-native";
import { useState, useRef, useEffect } from "react";
import { useFonts } from "expo-font";
import Logo from "./assets/logo.svg";
import Heart from "./assets/heart.svg";
import Check from "./assets/check.svg";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

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
    extrapolate: 'clamp'
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // 현재 위치에서의 드래그 허용
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
          // 빠른게 드로워 할 때
          Animated.spring(panY, {
            toValue: gestureState.vy > 0 ? 0 : maxTranslate,
            useNativeDriver: true,
            damping: 20,     // 감쇠 (진동 감소)
            stiffness: 200,  // 강성 (스프링의 힘)
            mass: 0.5        // 질량 (움직임의 무게감)
          }).start();
        } else {

          // 천천히 드로워 할 때
          Animated.spring(panY, {
            toValue: currentPosition < halfPoint ? maxTranslate : 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
            mass: 0.5
          }).start();
        }
      }
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

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Logo />
      </View>

      <View style={styles.main}>
        <View>
          <Text style={styles.onepickFont}>내 마음은?</Text>
        </View>

        <View style={styles.r}>
          <Animated.View 
            style={{
              transform: [{ scale: scaleAnim }]
            }}
          >
            <Heart />
          </Animated.View>
        </View>

        <View>
          <Text style={[styles.bpmText, styles.mapleFont]}>{bpm} bpm</Text>
        </View>
      </View>

      <Animated.View 
        style={[
          styles.defaultDrawer,
          {
            transform: [{ translateY }],
            height: drawerHeight
          }
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.drawerHandle, styles.checkSVG]} />
        <View style={styles.recordCheck}>
            <Check/>
            <Text style={[styles.mapleFont, styles.check]}>기록확인</Text>
        </View>
        
      </Animated.View>
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    MaplestoryOTFLight: require("./assets/fonts/MaplestoryOTFLight.otf"),
    YOnepickBold: require("./assets/fonts/YOnepick-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('./assets/splash.png')} 
          style={styles.splashImage}
        />
        <Text style={styles.loadingText}>당신의 마음을 읽는 중...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            headerShown: false
          }}
        />
      </Drawer.Navigator>
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
    marginLeft:20,
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
  defaultDrawer: {
    position: 'absolute',
    bottom: "-80%",
    width: '100%',
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
    paddingTop: 15,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDDDDD',
    borderRadius: 2,
    marginBottom: 15,
  },
  recordCheck:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
  },
  splashImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  loadingText: {
    fontSize: 20,
    marginTop: 20,
    fontFamily: 'MaplestoryOTFLight',
  },
  check: {
    fontSize: 20,
    color: "#929292",
    marginLeft: 5 
  },
  checkSVG:{
    display: "flex"
  }
});