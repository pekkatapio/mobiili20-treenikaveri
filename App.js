import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import treenit from './treenit';
import ProgressCircle from 'react-native-progress-circle'

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

function Treeni(props) {
  const [liike, setLiike] = useState(0);

  const onNext = () => {
    if (liike < (props.liikesarja.length-1)) {
      setLiike(liike+1);
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
      <Text style={styles.liiketeksti}>{props.liike.liike}, {props.liike.aika}sec</Text>
      <ProgressCircle
            percent={percentValue}
            radius={130}
            borderWidth={25}
            color="#3399FF"
            shadowColor="#777"
            bgColor="#666"
        >
            <Text style={{ fontSize: 75, color: "#fff" }}>{aika}</Text>
        </ProgressCircle>

      <View style={styles.liikenappi}>
        <Button title={isActive ? "tauko" : "jatka"} onPress={() => {setIsActive(!isActive)}} />
      </View>
      <Text style={styles.liikeseuraava}>{ props.seuraava ? "Seuraava liike: " + props.seuraava.liike + 
                               " (" + props.seuraava.aika + " sec)" : ""}</Text>
    </View>
  );
}

export default function App() {
  const liikkeet = luoLiikelista(0);
  console.log(liikkeet);
  return (
    <View style={styles.container}>
      <Treeni liikesarja={liikkeet} treeni={treenit[0]}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeni: {
    flex: 1,
    paddingTop: 40,
    width: '100%'
  },
  treeninimi: {
    fontSize: 25,
    backgroundColor: '#333',
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
  liikeprogress: {
    width: 300,
    alignItems: 'center',
    justifyContent: 'center'
  },
  liikeaika: {
    color: '#fff',
    textAlign: 'center',
    padding: 20,
    fontSize: 120,
    position: 'absolute',
    top: 10,

  },
  liiketeksti: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 25,
    padding: 20 
  },
  liikeseuraava: {
    color: '#ccc',
    fontSize: 18,
    textAlign: 'center',
    padding: 20
  },
  liikenappi: {
    width: '40%',
    justifyContent: 'center'
  }
});
