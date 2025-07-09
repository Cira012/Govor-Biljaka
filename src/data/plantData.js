// Common locations data
const commonLocations = [
  {
    lat: 44.8200, 
    lng: 20.4600, 
    location: 'Ada Ciganlija, Beograd',
    verified: true,
    description: 'Found in forested areas and meadows.',
    date: '2024-03-15'
  },
  {
    lat: 44.8186, 
    lng: 20.4541, 
    location: 'Košutnjak Park, Beograd',
    verified: true,
    description: 'Growing in partial shade near walking paths.',
    date: '2024-03-18'
  },
  {
    lat: 44.8167,
    lng: 20.4667,
    location: 'Avala Mountain',
    verified: true,
    description: 'Forest clearings and edges.',
    date: '2024-03-10'
  },
  {
    lat: 44.6693,
    lng: 20.6863,
    location: 'Kosmaj Mountain',
    verified: true,
    description: 'Deciduous forests and clearings.',
    date: '2024-03-12'
  },
  {
    lat: 43.6189,
    lng: 21.8962,
    location: 'Sićevo Gorge',
    verified: true,
    description: 'Rocky slopes and forest edges.',
    date: '2024-03-20'
  }
];

export const plantsData = [
  {
    id: 1,
    name: "Visibaba",
    scientificName: "Galanthus nivalis L.",
    description: "Visibaba je osnovni međunarodni fenološki objekat. Visibaba raste skoro u celoj severnoj, srednjoj, a ponegde i u južnoj Evropi. Visibaba je najranija efemeroidna, višegodišnja biljka sa lukovicom. Često cveta u šumama (dok sneg još nije okopnio) u periodu od januara do marta. Koren joj je žiličast. Stablo zeljasto i uspravno. Podzemni deo stabla je lukovica. Listovi su nepotpuni (sedeći) i u vreme cvetanja su 8 do 9 cm dugi i oko pola centimetra široki. Iz osnove izlaze 2 do 3 linearna lista. Cvetovi su pojedinačni, snežno beli, slabog mirisa. Plod je mesnata čaura, žuto-zelene boje i otvara se sa tri šava. Sadrži nekoliko semena svetle boje. Visibaba je mirmekohorna biljka, što znači da njeno seme raznose mravi. Živi u listopadnim, mešovitim i četinarskim šumama, od poplavnih nizijskih šuma do subalpskih regiona. U Alpima se može naći na visinama i do 2200 m nadmorske visine. Raste u manje-više vlažnim šumama. Pojava prvih cvetova označava donekle kraj zime, odnosno početak vegetacionog perioda, tj. vreme kada vegetacija počinje da buja.",
    image: "/assets/plants/VISIBABA_-_Galanthus_nivalis_20250507T174625.png",
    locations: [
      {
        lat: 44.8167,
        lng: 20.4667,
        location: 'Avala Mountain',
        verified: true,
        description: 'Found in forest clearings and edges.',
        date: '2024-02-15'
      },
      ...commonLocations.filter(loc => !loc.location.includes('Avala'))
    ],
    floweringSeason: "February - April"
  },
  {
    id: 2,
    name: "Podbel (Konjsko kopito)",
    scientificName: "Tussilago farfara L.",
    description: "Podbel ili konjsko kopito je osnovni međunarodni fenološki objekat. Višegodišnja zeljasta biljka sa većim brojem stabala koji su pokriveni ljuspastim, zelenim ili ružičastim listićima. Na vrhu stabaoceta je zlatnožuta cvast glavica. Krupni, zeleni listovi na dugačkim drškama obrazuju se posle cvetanja. Podbel je široko rasprostranjen, zato je faza prvih cvetova isto tako značajna kao kod visibabe i označava početak predproleća. Podbel obični raste u velikim skupinama te ga je lako primetiti. Počinje da cveta već vrlo rano: u toplijim krajevima, na sunčanim položajima i u godinama sa blagim zimama već krajem februara, a ponekad tek krajem marta, zavisi od toga kakve su vremenske prilike i položaj mesta.",
    image: "/assets/plants/PODBEL_KONJSKO_KOPITO_-_Tussilago_farfar_20250507T174703.png",
    locations: [
      {
        lat: 44.6693,
        lng: 20.6863,
        location: 'Kosmaj Mountain',
        verified: true,
        description: 'Common on sunny slopes and forest edges.',
        date: '2024-03-01'
      },
      ...commonLocations.filter(loc => !loc.location.includes('Kosmaj'))
    ],
    floweringSeason: "February - April"
  },
  {
    id: 3,
    name: "Mrazovac",
    scientificName: "Colchicum autumnale L.",
    description: "Mrazovac je osnovni međunarodni fenološki objekat. Pojava prvih cvetova kod mrazovca je vrlo značajna, jer označava nastupanje rane jeseni. Uskoro posle završetka košenja otave, na pokošenim livadama se pojavljuju svetloljubičasti cvetovi mrazovca, kao prvi vesnici približavajuće jeseni. Krunični listići levkasto - zvonastog cveta su sa donje strane srasli u belo cvetno stablo. U vreme pupoljaka stablo je još kratko, kasnije, kad cvet odraste, stablo se izduži i do 10 cm dužine. Cvetovi se otvaraju samo pri vedrom vremenu, a pri oblačnom vremenu cvetovi su zatvoreni i prašnici se ne vide. Zatvoreni ali već odrasli cvetovi razlikuju se od pupoljaka samo po tome što su duži i deblji. Mrazovac ima šest prašnika za razliku od šafrana koji ima tri prašnika i koji mu je inače po izgledu cveta sličan, te se ova dva objekta često mešaju. U osnovi razlikuju se po vremenu cvetanja, šafran je vesnik proleća, a mrazovac jeseni. Osim toga, kod mrazovca u vreme cvatnje iz lukovice izraste samo cvet – bez lišća. Sledećeg proleća raste lišće i razvija se seme.",
    image: "/assets/plants/MRAZOVAC_-_Colchicum_autumnale_20250507T174732.png",
    locations: [
      {
        lat: 43.6189,
        lng: 21.8962,
        location: 'Sićevo Gorge',
        verified: true,
        description: 'Found in meadows and grassy areas.',
        date: '2023-09-15'
      },
      ...commonLocations.filter(loc => !loc.location.includes('Sićevo'))
    ],
    floweringSeason: "September - October"
  },
  {
    id: 4,
    name: "Leska",
    scientificName: "Corylus avellana L.",
    description: "Leska je osnovni međunarodni fenološki objekat. Leske imaju jednostavne, zaobljene listove sa dvostruko nazubljenim rubovima. Cvetovi se razvijaju u vrlo ranoj fazi proleća, pre lišća, i jednodomni su, sa jednopolnim resama; muške rese su bledožute i duge 5–12 cm, a ženske su vrlo male i većim delom skrivene u pupoljcima; vidljivi su samo svetlocrveni delovi tučka dužine 1–3 mm. Plodovi su orasi dužine 1–2,5 cm i prečnika 1–2 cm, oko kojih je ljuska (involukrum), koja delimično ili potpuno zatvara orah. Leska, kao jednodoma biljka, ima na istom grmu i muške - prašne i ženske - tučkaste cvetove. Početak cvetanja se osmatra na muškim cvetovima. Oni su cvasti viseće rese. Rese sa muškim cvetovima se pojavljuju već leti. Tada su one maslinasto zelene boje, kratke, dužine 2-3 cm i tvrde. Sledeće godine, obično u februaru ili martu, a ako je zima blaga već u januaru, rese se otvore, omekšaju i izduže do dužine 4-6 cm. Opšte cvetanje osmatra se na ženskim - tučkastim cvetovima. Oni su sitni, slični lisnim pupoljcima i iz njih vire lepljive, koralno crvene niti. Datum opšteg cvetanja beleži se tada kada su na osmatranom grmu već otvoreni mnogobrojni ženski cvetovi koralno crvene boje. Iz oplođenih ženskih cvetova razvijaju se plodovi - odrvenele orašice, sa ukusnim uljanim semenom - lešnikom.",
    image: "/assets/plants/LESKA_-_Corylus_20250507T174753.png",
    locations: [
      {
        lat: 44.8200,
        lng: 20.4600,
        location: 'Ada Ciganlija, Beograd',
        verified: true,
        description: 'Common in forest undergrowth.',
        date: '2024-02-10'
      },
      ...commonLocations.filter(loc => !loc.location.includes('Ada Ciganlija'))
    ],
    floweringSeason: "January - March"
  },
  {
    id: 5,
    name: "Vrba iva",
    scientificName: "Salix caprea L.",
    description: "Vrba iva je osnovni međunarodni fenološki objekat. Iva spada u brojnu familiju vrba, zato je važno da se ne zameni sa drugim vrbama. Od ostalih vrba se između ostalog razlikuje po obliku lišća, po obliku i veličini resa i po vremenu cvetanja. Zeleno lišće nije tako dugo, usko i dugačko zašiljeno kao kod većine drugih vrba, već kraće, široko, jajoliko odnosno elipsasto. Rese su kraće i deblje. Od svih vrba ona prva cveta. Iva je dvodoma biljka, muški (prašni) cvetovi nalaze se na jednom žbunu, a ženski (tučkasti) na drugom. Muški cvetovi su goli (pojedinačni cvet sastavljen je samo iz dva prašnika) i združeni su u resu. Rese su kasno u jesen prikrivene debelim zaštitnim ljuskama i slične su zadebljalim lisnim pupoljcima, blede zelenkasto - žute boje. Već u toku zime zaštitne ljuske postanu mrke i iz njih izvire svilenkaste, srebrno bele dlakave rese.",
    image: "/assets/plants/VRBA_IVA_-_Salix_caprea_20250507T174859.png",
    locations: [
      {
        lat: 44.8186,
        lng: 20.4541,
        location: 'Košutnjak Park, Beograd',
        verified: true,
        description: 'Found near water sources and in wet areas.',
        date: '2024-03-15'
      },
      ...commonLocations.filter(loc => !loc.location.includes('Košutnjak'))
    ],
    floweringSeason: "March - April"
  },
  {
    id: 6,
    name: "Trnjina",
    scientificName: "Prunus spinosa L.",
    description: "Trnjina je vrsta šljive, raste u vidu listopadnog žbunastog grma. Boja kore drveta se menja sa starošću i jako je bogata lenticelama. Široko je rasprostranjena u Evropi, severozapadnoj Africi, zapadnoj Aziji. Trnjina je osnovni međunarodni fenološki objekat. Početak cvetanja označava glavni period ranog proleća, to je period kada temperaturni uslovi već dozvoljavaju sađenje ranog krompira, setvu stočne repe, cvetanje ranih vrsta voćaka itd. Pojava početka listanja označava početak pravog proleća. Trnjina već pre listanja razvije sitne bele cvetove u takvom mnoštvu, da je celi grm beo kao da je pokriven snegom. Prelaz iz pupoljaka u početak cvetanja, kao i u opšte cvetanje je vrlo nagao, naročito pri toplom i sunčanom vremenu. Odrasli listovi trnjine su relativno mali; prosečna dužina iznosi oko 4 cm a širina lista obično nije veća od 2 cm.",
    image: "/assets/plants/TRNJINA_-_Prunus_spinoza_20250507T174918.png",
    locations: [
      {
        lat: 44.6693,
        lng: 20.6863,
        location: 'Kosmaj Mountain',
        verified: true,
        description: 'Common in hedgerows and forest edges.',
        date: '2024-03-20'
      },
      ...commonLocations.filter(loc => !loc.location.includes('Kosmaj'))
    ],
    floweringSeason: "March - April"
  },
  {
    id: 7,
    name: "Divlji kesten",
    scientificName: "Aesculus hippocastanum L.",
    description: "Divlji kesten je vrlo važan osnovni međunarodni fenološki objekat. Divlji kesten, jedan je od retkih fenoloških objekata koji doseže relativno daleko na sever i jug Evrope, sve od Norveške pa do Italije. On je posredni vremenski i klimatski pokazatelj za velika teritorijalna područja. Divlji kesten je listopadno drvo i nije srodan sa pitomim kestenom. Prstasto složeni listovi su na dugoj lisnoj dršci sa 6-9 sedećih listova, elipsoidno izduženih i po obodu testerasti, srednji je najveći, a svaki ispod njega je manji. Cvetovi su skupljeni u metličaste, krupne i uspravne cvasti. Plod je okruglasta kožasta, bodljikava okrugla čaura veličine oko 6cm. Čaura nakon sazrevanja puca na tri dela, oslobađajući od jednog do tri krupna poluloptasta do loptasta semena.",
    image: "/assets/plants/DIVLJI_KESTEN_-_Aesculus_hipocastanum_20250507T174933.png",
    locations: [
      {
        lat: 44.8182,
        lng: 20.4515,
        location: 'Tašmajdan Park, Beograd',
        verified: true,
        description: 'Common in parks and urban areas.',
        date: '2024-04-25'
      },
      ...commonLocations.filter(loc => !loc.location.includes('Tašmajdan'))
    ],
    floweringSeason: "April - June"
  },
  {
    id: 8,
    name: "Lipa krupnolisna",
    scientificName: "Tilia grandifolia L.",
    description: "Lipa krupnolisna je osnovni međunarodni fenološki objekat. Listopadno je drvo koje dostiže visinu do 40 m i razvija široku krunu i snažno stablo. Kora stabla puca još jače u odnosu na kasnu lipu, a grančice i pupoljci mogu malo da budu dlakavi. Koren je jako razvijen, prodire duboko u zemljište. List je veći u odnosu na list kasne lipe, sa obe strane meko dlakav, bledozelen. U jesen listovi postaju žuti. Cvetovi su hermafroditni, entomofilni skupljeni u štitastu cvast. Cveta posle listanja, u junu. Plod je ahenija okruglasta ili široko ovalna. Plodovi sazrevaju u avgustu-septembru. Težište areala lipe je uglavnom u Evropi. Vrsta je polusenke. Odgovaraju joj plodna zemljišta, ali uspeva na silikatima i krečnjaku. Otporna je na gradske uslove, ali osetljiva na kasne prolećne mrazeve. Medonosna i lekovita je vrsta.",
    image: "/assets/plants/Lipa.png",
    locations: [
      {
        lat: 44.8182,
        lng: 20.4515,
        location: 'Tašmajdan Park, Beograd',
        verified: true,
        description: 'Mature specimen near the church.',
        date: '2024-05-10'
      },
      {
        lat: 44.8170,
        lng: 20.4573,
        location: 'Pioneers Park, Beograd',
        verified: true,
        description: 'Group of trees near the main fountain.',
        date: '2024-05-12'
      },
      ...commonLocations.slice(2)
    ],
    floweringSeason: "June - July"
  },
  {
    id: 9,
    name: "Bukva",
    scientificName: "Fagus sylvatica L.",
    description: "Bukva je veoma važan osnovni međunarodni fenološki objekat. Bukva raste kako u nizijskim, tako i u visinskim predelima. Od svog listopadnog drveća, koje je uključeno u fenološki program osmatranja, bukva dostiže na najveće visine, tako da je kod nas nalazimo i na visini od oko 1500 m. Zato je ona dobar klimatsko-fenološki pokazatelj za predele sa različitim nadmorskim visinama. Bukva je jednodomo drvo: muški i ženski cvetovi su na istom drvetu. Muški cvetovi su skupljeni u svetlo-zelene rese, koje vise nadole. Za razliku od leske, breze, rese kod bukve nisu duge, već su slične okruglastom klupku, koje visi na relativno dugoj peteljci. Ženski cvetovi stoje usamljeni ili po dva zajedno na kraju mladog izdanka, cvetove odaje meko - bodljikast omotač crvenkaste boje. Pojava početka cvetanja osmatra se na muškim resama, koje se opažaju tek u proleće. Sazreo plod predstavlja odrvenjenu bodljikavu čahuru u kojoj se obično nalaze po dva svetlomrka oraščića. Bukva cveta obično samo svakih pet do sedam godina. U pojedinim godinama se dakle može dogoditi da osmatrano drvo uopšte ne cveta.",
    image: "/assets/plants/BUKVA_-_Fagus_silvatica_20250507T175016.png",
    locations: [
      {
        lat: 44.8167,
        lng: 20.4667,
        location: 'Avala Mountain',
        verified: true,
        description: 'Common in beech forests at higher elevations.',
        date: '2024-04-20'
      },
      ...commonLocations.filter(loc => !loc.location.includes('Avala'))
    ],
    floweringSeason: "April - May"
  },
  {
    id: 10,
    name: "Hrast lužnjak",
    scientificName: "Quercus robur L.",
    description: "Hrast lužnjak je osnovni međunarodni fenološki objekat. Ima više vrsta hrastova. Fenološke faze razvoja se kod pojedinačnih vrsta hrastova pojavljuju u različito vreme, zato se mora tačno utvrditi da li je osmatrano drvo zaista hrast lužnjak. Ovaj se od drugih hrastova razlikuje između ostalog i po listovima i plodovima. Hrast lužnjak ima lišće sa kratkim peteljkama - peteljka nije duža od 1 cm. Kod hrasta lužnjaka lisne površine nisu zaoštrene, već su tupo zaobljene, osnova lista nije klinasta već srcoliko urezana, kod peteljke malo uvijena i ima oblik donjeg dela uha. Još lakše razlikujemo hrast lužnjak od drugih hrastova po plodovima nego po lišću. Od svih hrastova hrast lužnjak ima plodove - žirove na najdužoj peteljci. Hrast lužnjak je, slično kao drugi hrastovi, jednodomo drvo, na istom drvetu su muški – prašni i ženski - tučkasti cvetovi. Oni su združeni u duge rese. Obično na jednoj resi ima 15 do 20 cvetova. Rese se pojavljuju tek u proleće i to na novim izdancima. Imaju bledo zelenu boju, sličnu kao mlado lišće i zato se teško vide iz daljine. Plod je žir.",
    image: "/assets/plants/HRAST_LU_NJAK_-_Quercus_pedunculata_20250507T175059.png",
    locations: [
      {
        lat: 44.8200,
        lng: 20.4600,
        location: 'Ada Ciganlija, Beograd',
        verified: true,
        description: 'Mature trees in the forested areas.',
        date: '2024-04-15'
      },
      ...commonLocations.filter(loc => !loc.location.includes('Ada Ciganlija'))
    ],
    floweringSeason: "April - May"
  },
  {
    id: 11,
    name: "Jasen",
    scientificName: "Fraxinus excelsior L.",
    description: "Jasen bijeli veliki, osnovni je međunarodni fenološki objekat. Raste skoro u celoj srednjoj Evropi, osim u severoistočnoj Rusiji i na Pirinejskom poluostrvu. Kod jasena cvetanje nastaje pre listanja. Zbog njegovog visokog rasta osmatranje cvetanja je otežano, mada nije nemoguće. Beli jasen je drvo visoko od 10 do 40 m. Listovi su naspramni, složeno perasti, sastavljeni od 7 do 13 uskih, po obodu nazubljenih, šiljastih, duguljastih listića. Cvetovi su bez cvetnog omotača, sakupljeni u metlice, crvenkasti, hermafroditni, muški i ženski. Plod je krilata orasica.",
    image: "/assets/plants/JASEN_-_Fraxinus_excelsior_20250507T175053.png", // Jasen
    locations: [
      {
        lat: 44.8200,
        lng: 20.4500,
        location: 'Ada Ciganlija, Beograd',
        verified: true,
        description: 'Common in forested areas and along paths.',
        date: '2024-04-20'
      },
      {
        lat: 44.8186,
        lng: 20.4541,
        location: 'Košutnjak Forest, Beograd',
        verified: true,
        description: 'Found in clearings and forest edges.',
        date: '2024-04-15'
      },
      ...commonLocations.filter(loc => !['Ada Ciganlija', 'Košutnjak'].some(term => loc.location.includes(term)))
    ],
    floweringSeason: "April - May"
  },
  {
    id: 12,
    name: "Jorgovan",
    scientificName: "Syringa vulgaris L.",
    description: "Jorgovan je osnovni međunarodni fenološki objekat. Kod jorgovana se osmatraju dve faze: početak cvetanja i opšte cvetanje Ove faze označavaju glavni period pravog proleća. Mnogobrojni, sitni, ljubičasti i jako mirisni cvetovi združeni su u uspravne grozdaste cvasti. Slično kao kod divljeg kestena i kod jorgovana počinju prvo da se otvaraju cvetovi na donjem delu cvasti; najstariji cvetovi su pri dnu cvasti, a najmlađi pri vrhu. Datum početka cvetanja beleži se odmah kada se na prvim cvastima rascvetaju cvetovi na donjem delu grozdaste cvasti, pojedinačni cvetovi su otvoreni. Ako se cvet pogleda iz blizine, unutar svakog cveta vidi se dva žuta prašnika, prirasla za cevastu krunicu. Datum opšteg cvetanja beleži se kada se rascveta većina cvetova na većem broju grozdastih cvasti. Na gornjem i na donjem delu grozdaste cvasti su cvetovi rascvetani. Jorgovan je listopadni žbun jugoistočne Evrope i Male Azije. Ime mu potiče od grčke reči syrinx-pištaljka, pošto se njegovo drvo koristi za izradu pištaljki. Visina mu varira 2-10 m. Listovi su prosti, ovalni do izduženi, zelene boje. Cveta od aprila do maja. Cvetovi su mirisni, skupljeni u cvasti konusnog ili piramidalnog oblika. Mogu biti ljubičaste, bledoljubičaste i bele boje. Plod je čaura. Razmnožava se semenom, poluodrvenelim reznicama u julu i avgustu kao i kalemljenjem. Dobro raste na otvorenim i osunčanim položajima, senku i polusenku loše podnosi.",
    image: "/assets/plants/JORGOVAN_-_Syringa_vulgaris_20250507T175240.png", // Jorgovan
    locations: [
      {
        lat: 44.8200,
        lng: 20.4500,
        location: 'Ada Ciganlija, Beograd',
        verified: true,
        description: 'Common in forested areas and along paths.',
        date: '2024-05-15'
      },
      {
        lat: 44.8186,
        lng: 20.4541,
        location: 'Košutnjak Forest, Beograd',
        verified: true,
        description: 'Found in clearings and forest edges.',
        date: '2024-05-10'
      },
      ...commonLocations.filter(loc => !['Ada Ciganlija', 'Košutnjak'].some(term => loc.location.includes(term)))
    ],
    floweringSeason: "April - June"
  },
  {
    id: 13,
    name: "Bagrem",
    scientificName: "Robinia pseudoacacia L.",
    description: "Bagrem je osnovni međunarodni fenološki objekat. Bagrem je listopadno drvo koje naraste 25-30 m visine. Kora je tamno siva, duboko ispucala. Listovi su perasto složeni, sa 9-19 jajastih, celivih listića. Cvetovi su beli, mirisni, u gronjastim cvatovima. Cveta u maju i junu. Plod je mahuna, 5-10 cm duga, sa 4-10 semenki. Bagrem je brzorastuće drvo, otporno na sušu i zagađenje vazduha. Koristi se za pošumljavanje, kao ukrasno drvo, u zaštitnim pojasevima, za stabilizaciju padina. Drvo je tvrdo, otporno na truljenje, koristi se za izradu nameštaja, podova, žičara, ograda. Cvetovi su medonosni i koriste se u ishrani i za proizvodnju meda. Bagrem je invazivna vrsta u mnogim delovima sveta, uključujući i Srbiju, gde se širi po livadama i šumskim čistinama, ugrožavajući autohtone vrste.",
    image: "/assets/plants/Bagrem.png",
    locations: [
      {
        lat: 44.8200,
        lng: 20.4500,
        location: 'Ada Ciganlija, Beograd',
        verified: true,
        description: 'Common in forested areas and along paths.',
        date: '2024-05-15'
      },
      {
        lat: 44.8186,
        lng: 20.4541,
        location: 'Košutnjak Forest, Beograd',
        verified: true,
        description: 'Found in clearings and forest edges.',
        date: '2024-05-10'
      },
      ...commonLocations.filter(loc => !['Ada Ciganlija', 'Košutnjak'].some(term => loc.location.includes(term)))
    ],
    floweringSeason: "May - June"
  },
  {
    id: 15,
    name: "Menta spicata",
    scientificName: "Mentha spicata L.",
    description: "Menta spicata, poznata i kao zelena metvica ili menta, je višegodišnja zeljasta biljka iz porodice usnatica (Lamiaceae). Naraste 30-100 cm u visinu. Stablo je uspravno, četvrtastog preseka, golo ili retko dlakavo. Listovi su nasuprotni, jajasti do duguljasti, nazubljeni, dugi 5-9 cm i široki 1,5-3 cm. Cvetovi su ljubičasti, skupljeni u tanke, vitke klasove duge 4-8 cm. Cveta od jula do septembra. Plod je mali orah. Menta spicata je aromatična biljka, karakterističnog mirisa i ukusa. Koristi se u ishrani, medicini i kozmetici. Listovi se koriste sveži ili sušeni, kao začin u kulinarstvu, za pripremu čajeva, sokova, sirupa, slatkiša, žvakaćih guma, pastila, sladoleda. Esencijalno ulje mentole se koristi u prehrambenoj, farmaceutskoj i kozmetičkoj industriji. U narodnoj medicini se koristi za lečenje probavnih smetnji, glavobolje, prehlade, groznice, bolova u mišićima i zglobovima. Menta spicata se lako gaji u baštama i saksijama, voli vlažna, plodna zemljišta i sunčana ili polusenovita mesta. Može se množiti semenkama, ali češće vegetativno, izdanjcima ili delenjem biljke.",
    image: "/assets/plants/mentha-spicata.png",
    locations: [
      {
        lat: 44.7866,
        lng: 20.4485,
        location: 'Ada Huja, Beograd',
        verified: true,
        description: 'Found in moist areas near the river.',
        date: '2024-07-10'
      },
      ...commonLocations.filter(loc => !loc.location.includes('Ada Huja'))
    ],
    floweringSeason: "July - September"
  },
  {
    id: 14,
    name: "Zova",
    scientificName: "Sambucus nigra L.",
    description: "Zova je osnovni međunarodni fenološki objekat. Cvetovi su male, žuto-bele mirisne 'zvezdice' sa 5 čašičnih, 5 kruničnih listića i sa 5 prašnika. Cvetovi su združeni u velike štitašte cvasti. Cvetanje se vrši tako, što najpre počinju da cvetaju cvetovi na spoljašnjoj ivici štitaste cvasti. Kao cvetovi i plodovi su udruženi u štitašte cvasti. Plodovi su male, ljubičasto-crne, sjajne i meke bobice. Zova je listopadni žbun ili nisko drvo visine 3-7 m, sa izrazito lomljivim granama. Kora je svetlo siva, izbrazdana i ispucala. Listovi su naspramni, neparno perasto složeni sa 5-7 jajastih, zašiljenih listića. Cveta u maju i junu. Cvetovi su beli ili bledožuti, mirisni, skupljeni u velike, spljoštene cvatove. Plod je ljubičastocrna, sočna koštunica. Zova raste u šumama, šikarama, živicama, uz potoke i puteve, od nizija do planinskog pojasa. Sirovina su joj cvetovi i plodovi. Cvetovi sadrže etično ulje, flavonoide, triterpene, fenolne kiseline, sluz i druge materije. Plodovi sadrže antocijane, flavonoide, organske kiseline, vitamine C i B, minerale i druge materije. U narodnoj medicini se koristi za lečenje prehlade, groznice, upale grla, kašlja, bronhitisa, reumatoidnog artritisa, upale mokraćnih puteva i drugih oboljenja. Cvetovi se koriste za pripremu čaja, sirupa, sokova, vina i drugih napitaka, a plodovi za pripremu džemova, kompota, sokova, vina i drugih proizvoda.",
    image: "/assets/plants/ZOVA_-_Sambucus_nigra_20250507T175239.png",
    locations: [
      {
        lat: 44.7950,
        lng: 20.4547,
        location: 'Zemunski Kej, Beograd',
        verified: true,
        description: 'Growing along the riverbank and in nearby parks.',
        date: '2024-05-20'
      },
      ...commonLocations.filter(loc => !loc.location.includes('Zemunski'))
    ],
    floweringSeason: "May - June"
  },
  {
    id: 16,
    name: "Maslačak",
    scientificName: "Taraxacum officinale L.",
    description: "Maslačak je osnovni međunarodni fenološki objekat. To je višegodišnja zeljasta biljka iz familije glavočika (Asteraceae). Ima karakteristične žute glavice koje se sastoje od brojnih cvetova jezika, a kasnije se pretvaraju u leteće plodove sa papučicama. Listovi su prizemne rozete, duboko razdijeljeni, nazubljeni, mesnati i bezdlaki. Stablo je šuplje i sadrži mlečni sok. Cveta od proleća do jeseni, a cvetovi se otvaraju ujutru i zatvaraju uveče ili pre kiše. Plod je ahenija sa papučicom koja olakšava širenje vetrom. Raste na livadama, pašnjacima, putevima i vrtovima, od nizija do planinskog pojasa. Sirovina su joj koren, list i cvet. Sadrži gorke materije, inulin, flavonoide, taraksacozid, karotenoide, vitamine A, B, C i D, minerale i druge materije. U narodnoj medicini se koristi za lečenje bolesti jetre, žučnih puteva, bubrega, mokraćnih puteva, želuca, creva, kože i drugih oboljenja. Mladi listovi su jestivi i koriste se u salatama, a od korena se pravi kafa i pivo. Cvetovi se koriste za pripremu soka, vina i drugih napitaka, a od mlečnog soka se može dobiti guma.",
    image: "/assets/plants/taraxacum-officinale.png",
    locations: [...commonLocations],
    floweringSeason: "Mart - Oktobar"
  },
  {
    id: 17,
    name: "Ljubičica",
    scientificName: "Viola odorata L.",
    description: "Ljubičica je osnovni međunarodni fenološki objekat. To je višegodišnja zeljasta biljka iz familije ljutića (Violaceae). Ima karakteristične mirisne ljubičaste cvetove, ređe bele ili ružičaste boje. Listovi su srcolikog oblika, nazubljeni, duguljasti, sa dugim drškama i prizemnoj rozeti. Cveta rano u proleće, od februara do aprila, a ponekad i kasnije u jesen. Cvet ima 5 latica, od kojih je donja izdužena u ostrugu, a poslednja je najveća i najšira. Plod je tobolac koji se otvara na tri dela. Raste u šumama, šikarama, živicama, parkovima i vrtovima, od nizija do planinskog pojasa. Sirovina su joj cvet, list i koren. Sadrži salicilne materije, saponine, flavonoide, eterično ulje, sluz, vitamina C i druge materije. U narodnoj medicini se koristi za lečenje kašlja, bronhitisa, upale grla, glavobolje, nesanice, reume, artritisa, kožnih oboljenja i drugih bolesti. Cvetovi se koriste u kozmetici za pripremu parfema, sapuna, losiona i drugih kozmetičkih proizvoda, a takođe i u prehrambenoj industriji za aromatizaciju slatkiša, sladoleda, sokova i drugih proizvoda.",
    image: "/assets/plants/violet.png",
    locations: [...commonLocations],
    floweringSeason: "March - May"
  }
];
