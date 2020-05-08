import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, Button, ScrollView, ImageBackground, Image } from 'react-native';
import treenit from './treenit';
import ProgressCircle from 'react-native-progress-circle';
import { NativeRouter, Route, Link } from "react-router-native";
import { useHistory } from 'react-router-dom';

function luoLiikelista(index) {
  let liikelista = [];
  treenit[index].treeni.forEach( sarja => {
    for (let i=1; i<=sarja.toistot; i++) {
      sarja.liikkeet.forEach( liike => {
        const lisattava = { ...liike }
        liikelista.push(lisattava);
      } );
    }
  });
  return liikelista;
} 

function TreeniValmis(props) {
  return (
    <View style={styles.treenivalmis}>
      <Text style={styles.treenivalmis_teksti}>Onnittelut! Suoritit treenin!</Text>
      <Link to="/">
        <Text style={styles.treeniinfo_nappi}>Takaisin treenilistaan</Text>
      </Link>
    </View>
  );
}

function Treeni(props) {
  const [liike, setLiike] = useState(0);

  const history = useHistory();

  const onNext = () => {
    if (liike < (props.liikesarja.length-1)) {
      setLiike(liike+1);
    } else {
      history.push("/valmis");
    }
  }

  const suoritettava = props.liikesarja[liike];
  const seuraava = (liike+1 < props.liikesarja.length) ? props.liikesarja[liike+1] : undefined;

  return (
    <View style={styles.treeni}>
      <Text style={styles.treeninimi}>{props.treeni.nimi}</Text>
      <Liike liike={suoritettava} onNext={onNext} seuraava={seuraava} />
    </View>
  );
}

function Liike(props) {
  const [aika, setAika] = useState(props.liike.aika);
  const [isActive, setIsActive] = useState(true);

  useEffect( () => {
    let interval = null;
    if (isActive && aika === 0) {
      setIsActive(false);
      props.onNext();
    }
    if (isActive) {
      interval = setInterval(() => {
        setAika(aika => aika - 1);
      }, 1000);
    } else if (!isActive && aika === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, aika] 
  );

  useEffect( () => {
    setAika(props.liike.aika);
    setIsActive(true);
  }, [props.liike]);

  const percentValue = Math.floor((aika/props.liike.aika)*100);

  return (
    <View style={styles.liike}>
      <Text style={styles.liiketeksti}>{props.liike.liike} ({props.liike.aika}sec)</Text>
      <ProgressCircle
            percent={percentValue}
            radius={130}
            borderWidth={25}
            color="#C7D3D4"
            shadowColor="#47686A"
            bgColor="#133F45"
        >
            <Text style={{ fontSize: 90, color: "#fff" }}>{aika}</Text>
        </ProgressCircle>

      <View style={styles.liikenappi}>
        <Button color="#47686A" title={isActive ? "tauko" : "jatka"} onPress={() => {setIsActive(!isActive)}} />
      </View>
      <View >
        { isActive ? 
            <Text style={styles.liikekeskeyta}></Text>
          :
            <Link to="/"><Text style={styles.liikekeskeyta}>keskeytä harjoitus</Text></Link>
        }
      </View>
      <View>
        <Text style={styles.liikeseuraava_teksti}>{ props.seuraava ? "Seuraava liike: " : ""}</Text> 
        <Text style={styles.liikeseuraava_liike}>{ props.seuraava ? props.seuraava.liike + " (" + props.seuraava.aika + " sec)" : ""}</Text>
      </View>
    </View>
  );
}

function TreeniWrapper(props) {
  const index = props.match.params.id;
  const liikelista = luoLiikelista(index);
  const treeni = treenit[index];
  return (
    <Treeni liikesarja={liikelista} treeni={treeni} />
  )
}

function Treenilista(props) {
  const lista = treenit.map((treeni,index) => {
    return (
      <View style={styles.treenilista_treeni} key={treeni.id}>
        <Link to={"/info/"+index}>
          <Text style={styles.treenilista_nimi}>{treeni.nimi}</Text>
        </Link>
      </View>
    )
  });
  return (
    <View style={styles.treenilista}>
      <ImageBackground source={require("./assets/bgimage.jpg")} style={styles.image}>
        <Image source={require("./assets/logo.png")} style={{width:350, height: 200,  resizeMode: "contain"}}/>
        <ScrollView style={styles.treenilista_treenit}>
          {lista}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

function TreeniInfo(props) {
  const index = props.match.params.id;
  const treeni = treenit[index];
  return (
    <View style={styles.treeniinfo}>
      <Text style={styles.treeniinfo_nimi}>{treeni.nimi}</Text>
      <Text style={styles.treeniinfo_kuvaus}>{treeni.kuvaus}</Text>
      <Link to={"/treeni/"+index}>
        <Text style={styles.treeniinfo_nappi}>Aloita treeni</Text>
      </Link>
      <Link to="/">
        <Text style={styles.treeniinfo_back}>takaisin treenilistaan</Text>
      </Link>
    </View>
  );
}

export default function App() {
  return (
    <NativeRouter>
      <View style={styles.container}>
        <StatusBar backgroundColor="#133F45" barStyle="light-content" />
        <Route exact path="/">
          <Treenilista />
        </Route>
        <Route path="/treeni/:id" component={TreeniWrapper} />
        <Route path="/info/:id" component={TreeniInfo} />
        <Route path="/valmis" component={TreeniValmis} />
      </View>
    </NativeRouter>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#133F45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeni: {
    flex: 1,
    paddingTop: 25,
    width: '100%'
  },
  treeninimi: {
    fontSize: 25,
    backgroundColor: '#0B1D1C',
    color: '#fff',
    width: '100%',
    padding: 10,
    textAlign: 'center'
  },
  liike: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  liiketeksti: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 25,
    padding: 20 
  },
  liikeseuraava_teksti: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
  liikeseuraava_liike: {
    color: '#ccc',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20
  },
  liikenappi: {
    width: '40%',
    justifyContent: 'center'
  },
  liikekeskeyta: {
    color: "#809293"
  },
  treenilista: {
    flex: 1,
    width: "100%"
  },
  treenilista_teksti: {
    fontSize: 40,
    color: "#fff",
    marginTop: 30,
    textAlign: "center",
    marginBottom: 10,
  },
  treenilista_nimi: {
    color: "#133F45",
    backgroundColor: "#809293",
    padding: 10,
    fontSize: 22,
    borderRadius: 5,
    margin: 20,
    marginTop: 0,
    marginBottom: 10, 
  },
  treenivalmis_teksti: {
    fontSize: 25,
    color: "#fff",
    marginTop: 30,
    textAlign: "center",
    marginBottom: 30,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center"
  },
  treeniinfo: {
    flex: 1,
    padding: 25,
    alignItems: "center"
  },
  treeniinfo_nimi: {
    color: "#fff",
    fontSize: 35,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center"
  },
  treeniinfo_kuvaus: {
    color: "#C7D3D4",
    fontSize: 20,
    marginBottom: 20
  },
  treeniinfo_nappi: {
    color: "#C7D3D4",
    backgroundColor: "#4B3224",
    fontSize: 25,
    padding: 10,
    borderColor: "#0B1D1C",
    borderWidth: 1,
    paddingHorizontal: 20,
    marginBottom: 10
  },
  treeniinfo_back: {
    color: "#C7D3D4",
    fontSize: 15
  }
});
