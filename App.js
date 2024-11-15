import { StyleSheet, Text, View, Image } from "react-native";
import { useState } from "react";

export default function App(useState) {
  const [bpm, setBpm] = useState(0);
  return (
    <View style={styles.container}>
      {" "}
      {/*main*/}
      {/* logo */}
      <View>
        <Image
          source={require("./assets/logo.png")}
          style={styles.logo}
        ></Image>
      </View>
      {/* mainFunction */}
      <View style={styles.main}>
        {/* firstText */}
        <View>
          <Text style={styles.txt}>내 마음은?</Text>
        </View>
        {/* heartIcon */}
        <View style={styles.r}>
          <Image source={require("./assets/heart.png")}></Image>
        </View>
        {/* lastText */}
        <View>
          <Text>{bpm}bpm</Text>
        </View>
      </View>
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
    top: 50,
    left: 7,
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  r: {
    color: "#FFF1C1",
    borderRadius: 1000,
  },
});
