const treenit = [
  {
    id: "12minperustreeni",
    nimi: "12 minuutin perustreeni",
    kuvaus: "Treenissä on neljä perusliikettä, joita toistetaan kolme kierrosta.",
    lammittely: "Lämmittele seuraavasti: ....",
    treeni: [
      { toistot: 3,
        liikkeet: [
            { liike: "lankku",
              aika: 5},
            { liike: "lepo",
              aika: 5},
            { liike: "askelkyykky",
              aika: 5},
            { liike: "lepo",
              aika: 5},            
            { liike: "punnerrus",
              aika: 30},
            { liike: "lepo",
              aika: 30},
            { liike: "vuorikiipeilijä",
              aika: 30},
            { liike: "lepo",
              aika: 30},              
        ]
      }
    ]
  },
  {
    id: "lankkutreeni",
    nimi: "Lankkutreeni",
    kuvaus: "Treenissä on kolme selälle ja vatsalle kohdistuvaa liikettä, joita toistetaan viisi kierrosta.",
    lammittely: "Lämmittele seuraavasti: ....",
    treeni: [
      { toistot: 5,
        liikkeet: [
            { liike: "kylkilankku, vasen puoli",
              aika: 20},
            { liike: "lepo",
              aika: 10},
            { liike: "kylkilankku, oikea puoli",
              aika: 20},
            { liike: "lepo",
              aika: 10},            
            { liike: "ylävartalon nosto",
              aika: 20},
            { liike: "lepo",
              aika: 10},             
        ]
      }
    ]
  },
]

export default treenit;