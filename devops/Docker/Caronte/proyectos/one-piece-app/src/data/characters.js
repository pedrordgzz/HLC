export const characters = [
    // --- Piratas del Sombrero de Paja ---
    {
        id: 'luffy',
        name: 'Monkey D. Luffy',
        affiliation: 'Piratas del Sombrero de Paja',
        role: 'Capitán',
        bounty: '3,000,000,000',
        devilFruit: {
            hasFruit: true,
            name: 'Hito Hito no Mi, Modelo: Nika',
            type: 'Zoan Mítica'
        },
        haki: ['Conquistador', 'Armamento', 'Observación'],
        description: 'El Capitán de los Sombrero de Paja y uno de los Cuatro Emperadores. Sueña con encontrar el One Piece y convertirse en el Rey de los Piratas.',
        image: '/images/luffy.jpg',
        hints: [
            'Es miembro de la "Peor Generación".',
            'Nació en el East Blue.',
            'Su padre es el líder del Ejército Revolucionario.',
            'Tiene una cicatriz debajo de su ojo izquierdo.',
            'Ama la carne más que nada.'
        ]
    },
    {
        id: 'zoro',
        name: 'Roronoa Zoro',
        affiliation: 'Piratas del Sombrero de Paja',
        role: 'Combatiente',
        bounty: '1,111,000,000',
        devilFruit: {
            hasFruit: false,
            name: null,
            type: null
        },
        haki: ['Conquistador', 'Armamento', 'Observación'],
        description: 'El primer miembro en unirse a la tripulación. Un maestro espadachín que aspira a ser el Mejor Espadachín del Mundo.',
        image: '/images/zoro.jpg',
        hints: [
            'Anteriormente era un cazarecompensas.',
            'Usa el estilo de tres espadas (Santoryu).',
            'Tiene un terrible sentido de la orientación.',
            'Fue entrenado por Dracule Mihawk durante el salto temporal.',
            'Posee el estilo "Rey del Infierno".'
        ]
    },
    {
        id: 'nami',
        name: 'Nami',
        affiliation: 'Piratas del Sombrero de Paja',
        role: 'Navegante',
        bounty: '366,000,000',
        devilFruit: {
            hasFruit: false,
            name: null,
            type: null
        },
        haki: [],
        description: 'La Navegante de los Sombrero de Paja. Sueña con dibujar un mapa de todo el mundo.',
        image: '/images/nami.jpg',
        hints: [
            'Fue miembro de los Piratas de Arlong.',
            'Le encanta el dinero y las mandarinas.',
            'Usa el Sorcery Clima-Tact.',
            'Ahora posee a Zeus, un homie de Big Mom.',
            'Es conocida como la "Gata Ladrona".'
        ]
    },
    {
        id: 'usopp',
        name: 'Usopp',
        affiliation: 'Piratas del Sombrero de Paja',
        role: 'Francotirador',
        bounty: '500,000,000',
        devilFruit: {
            hasFruit: false,
            name: null,
            type: null
        },
        haki: ['Observación'],
        description: 'El Francotirador de la tripulación. Sueña con convertirse en un valiente guerrero del mar.',
        image: '/images/usopp.jpg',
        hints: [
            'Es hijo de Yasopp de los Piratas del Pelirrojo.',
            'A menudo cuenta historias exageradas.',
            'Usa una resortera llamada "Kabuto".',
            'Despertó su Haki de Observación en Dressrosa.',
            'También es conocido como "Dios Usopp".'
        ]
    },
    {
        id: 'sanji',
        name: 'Vinsmoke Sanji',
        affiliation: 'Piratas del Sombrero de Paja',
        role: 'Cocinero',
        bounty: '1,032,000,000',
        devilFruit: {
            hasFruit: false,
            name: null,
            type: null
        },
        haki: ['Armamento', 'Observación'],
        description: 'El Cocinero de los Sombrero de Paja. Sueña con encontrar el All Blue.',
        image: '/images/sanji.jpg',
        hints: [
            'Es un príncipe del Reino Germa.',
            'Pelea usando solo sus piernas.',
            'Nunca golpearía a una mujer.',
            'Fue entrenado por "Pierna Roja" Zeff.',
            'Tiene modificaciones genéticas que despertaron recientemente.'
        ]
    },
    {
        id: 'chopper',
        name: 'Tony Tony Chopper',
        affiliation: 'Piratas del Sombrero de Paja',
        role: 'Médico',
        bounty: '1,000',
        devilFruit: {
            hasFruit: true,
            name: 'Hito Hito no Mi',
            type: 'Zoan'
        },
        haki: [],
        description: 'El Médico de la tripulación. Un reno que comió la Fruta Humano-Humano.',
        image: '/images/chopper.jpg',
        hints: [
            'A menudo es confundido con una mascota.',
            'Creó la Rumble Ball.',
            'Puede transformarse en Monster Point.',
            'Fue mentoreado por la Dra. Kureha y el Dr. Hiriluk.',
            'Ama el algodón de azúcar.'
        ]
    },
    {
        id: 'robin',
        name: 'Nico Robin',
        affiliation: 'Piratas del Sombrero de Paja',
        role: 'Arqueóloga',
        bounty: '930,000,000',
        devilFruit: {
            hasFruit: true,
            name: 'Hana Hana no Mi',
            type: 'Paramecia'
        },
        haki: ['Armamento'],
        description: 'La Arqueóloga. Es la única persona que puede leer los Poneglyphs y busca la historia verdadera.',
        image: '/images/robin.jpg',
        hints: [
            'Fue conocida como la "Niña Demonio" desde los 8 años.',
            'Puede hacer brotar partes del cuerpo en cualquier lugar.',
            'Anteriormente fue Miss All Sunday en Baroque Works.',
            'Sobrevivió a la Buster Call de Ohara.',
            'Recientemente despertó una forma de "Demonio".'
        ]
    },
    {
        id: 'franky',
        name: 'Franky',
        affiliation: 'Piratas del Sombrero de Paja',
        role: 'Carpintero',
        bounty: '394,000,000',
        devilFruit: {
            hasFruit: false,
            name: null,
            type: null
        },
        haki: [],
        description: 'El Carpintero. Un cíborg que construyó el Thousand Sunny.',
        image: '/images/franky.jpg',
        hints: [
            'Funciona con cola.',
            'Fue aprendiz de Tom, quien construyó el Oro Jackson.',
            'Lidera la Familia Franky.',
            'Posee el láser radical beam.',
            'Su verdadero nombre es Cutty Flam.'
        ]
    },
    {
        id: 'brook',
        name: 'Brook',
        affiliation: 'Piratas del Sombrero de Paja',
        role: 'Músico',
        bounty: '383,000,000',
        devilFruit: {
            hasFruit: true,
            name: 'Yomi Yomi no Mi',
            type: 'Paramecia'
        },
        haki: [],
        description: 'El Músico. Un esqueleto viviente que volvió a la vida para cumplir una promesa.',
        image: '/images/brook.jpg',
        hints: [
            'También es conocido como "Soul King".',
            'Tiene más de 90 años.',
            'Usa una espada escondida en un bastón.',
            'Quiere reunirse con Laboon.',
            'Puede separar su alma de su cuerpo.'
        ]
    },
    {
        id: 'jinbe',
        name: 'Jinbe',
        affiliation: 'Piratas del Sombrero de Paja',
        role: 'Timonel',
        bounty: '1,100,000,000',
        devilFruit: {
            hasFruit: false,
            name: null,
            type: null
        },
        haki: ['Armamento', 'Observación'],
        description: 'El Timonel. Un ex Guerrero del Mar y maestro del Karate Gyojin.',
        image: '/images/jinbe.jpg',
        hints: [
            'Es un Gyojin Tiburón Ballena.',
            'Fue el capitán de los Piratas del Sol.',
            'Compartió sangre con Luffy para salvarle la vida.',
            'Es conocido como el "Caballero del Mar".',
            'Se unió oficialmente a la tripulación en Wano.'
        ]
    },

    // --- Ejército Revolucionario ---
    {
        id: 'dragon',
        name: 'Monkey D. Dragon',
        affiliation: 'Ejército Revolucionario',
        role: 'Comandante Supremo',
        bounty: 'Desconocida',
        devilFruit: {
            hasFruit: true,
            name: 'Desconocida (¿Viento/Tormenta?)',
            type: 'Desconocida'
        },
        haki: ['Conquistador', 'Armamento', 'Observación'],
        description: 'El Criminal más Buscado del Mundo y líder del Ejército Revolucionario.',
        image: '/images/dragon.jpg',
        hints: [
            'Es el padre de Monkey D. Luffy.',
            'Es el hijo de Monkey D. Garp.',
            'Salvó a Luffy en Loguetown.',
            'Busca derrocar al Gobierno Mundial.',
            'Tiene un tatuaje en el lado izquierdo de su cara.'
        ]
    },
    {
        id: 'sabo',
        name: 'Sabo',
        affiliation: 'Ejército Revolucionario',
        role: 'Jefe de Estado Mayor',
        bounty: '602,000,000',
        devilFruit: {
            hasFruit: true,
            name: 'Mera Mera no Mi',
            type: 'Logia'
        },
        haki: ['Armamento', 'Observación'],
        description: 'El No. 2 del Ejército Revolucionario y hermano jurado de Luffy y Ace.',
        image: '/images/sabo.jpg',
        hints: [
            'Nació como noble en el Reino de Goa.',
            'Heredó la fruta del diablo de Ace.',
            'Usa un estilo de lucha llamado Ryusoken (Garra de Dragón).',
            'Fue dado por muerto durante muchos años.',
            'Es conocido como el "Emperador de las Llamas".'
        ]
    },
    {
        id: 'ivankov',
        name: 'Emporio Ivankov',
        affiliation: 'Ejército Revolucionario',
        role: 'Comandante (Ejército G)',
        bounty: 'Desconocida',
        devilFruit: {
            hasFruit: true,
            name: 'Horu Horu no Mi',
            type: 'Paramecia'
        },
        haki: ['Armamento', 'Observación'],
        description: 'La Reina del Reino Kamabakka y comandante del Ejército Revolucionario.',
        image: '/images/ivankov.jpg',
        hints: [
            'Sirve como comandante del Ejército G.',
            'Puede manipular hormonas.',
            'Ayudó a Luffy a escapar de Impel Down.',
            'Es un maestro del Newkama Kenpo.',
            'Tiene una cabeza muy grande.'
        ]
    },

    // --- Marina ---
    {
        id: 'akainu',
        name: 'Sakazuki (Akainu)',
        affiliation: 'Marina',
        role: 'Almirante de Flota',
        bounty: 'Ninguna',
        devilFruit: {
            hasFruit: true,
            name: 'Magu Magu no Mi',
            type: 'Logia'
        },
        haki: ['Armamento', 'Observación'],
        description: 'El Almirante de Flota de la Marina. Cree en la "Justicia Absoluta".',
        image: '/images/akainu.jpg',
        hints: [
            'Mató a Portgas D. Ace.',
            'Peleó contra Aokiji durante 10 días en Punk Hazard.',
            'Tiene el poder del Magma.',
            'Odia a los piratas con pasión.',
            'Viste un traje rojo y una gorra.'
        ]
    },
    {
        id: 'kizaru',
        name: 'Borsalino (Kizaru)',
        affiliation: 'Marina',
        role: 'Almirante',
        bounty: 'Ninguna',
        devilFruit: {
            hasFruit: true,
            name: 'Pika Pika no Mi',
            type: 'Logia'
        },
        haki: ['Armamento', 'Observación'],
        description: 'Un Almirante de la Marina. Sigue la "Justicia incierta".',
        image: '/images/kizaru.jpg',
        hints: [
            'Se mueve a la velocidad de la luz.',
            'Habla muy despacio.',
            'Derrotó a varios Supernovas en Sabaody.',
            'Viste un traje a rayas amarillo.',
            'Usa patadas basadas en luz.'
        ]
    },
    {
        id: 'garp',
        name: 'Monkey D. Garp',
        affiliation: 'Marina',
        role: 'Vicealmirante',
        bounty: 'Ninguna (Cross Guild: 3 Coronas)',
        devilFruit: {
            hasFruit: false,
            name: null,
            type: null
        },
        haki: ['Conquistador', 'Armamento', 'Observación'],
        description: 'El Héroe de la Marina. Abuelo de Luffy y padre de Dragon.',
        image: '/images/garp.jpg',
        hints: [
            'Fue rival del Rey de los Piratas, Gold Roger.',
            'Usa sus puños para pelear (Galaxy Impact).',
            'Rechazó el puesto de Almirante múltiples veces.',
            'Lanza balas de cañón como pelotas de béisbol.',
            'Ama las galletas de arroz.'
        ]
    },
    {
        id: 'fujitora',
        name: 'Issho (Fujitora)',
        affiliation: 'Marina',
        role: 'Almirante',
        bounty: 'Ninguna',
        devilFruit: {
            hasFruit: true,
            name: 'Zushi Zushi no Mi',
            type: 'Paramecia'
        },
        haki: ['Armamento', 'Observación'],
        description: 'Un Almirante ciego reclutado durante el salto temporal.',
        image: '/images/fujitora.jpg',
        hints: [
            'Se cegó a sí mismo para no ver la corrupción del mundo.',
            'Puede manipular la gravedad.',
            'Le encantan los juegos de azar.',
            'Quiere abolir el sistema de los Siete Guerreros del Mar.',
            'Empuña una shikomizue (espada bastón).'
        ]
    },
    {
        id: 'smoker',
        name: 'Smoker',
        affiliation: 'Marina',
        role: 'Vicealmirante',
        bounty: 'Ninguna',
        devilFruit: {
            hasFruit: true,
            name: 'Moku Moku no Mi',
            type: 'Logia'
        },
        haki: ['Armamento', 'Observación'],
        description: 'Un Vicealmirante que ha perseguido a Luffy desde Loguetown.',
        image: '/images/smoker.jpg',
        hints: [
            'Es un hombre de humo.',
            'Siempre fuma dos puros a la vez.',
            'Usa un jitte con punta de piedra marina.',
            'Es comandado por Tashigi.',
            'Es conocido como el "Cazador Blanco".'
        ]
    },
    // --- Cuatro Emperadores (Yonko) ---
    {
        id: 'shanks',
        name: 'Shanks',
        affiliation: 'Piratas del Pelirrojo',
        role: 'Capitán',
        bounty: '4,048,900,000',
        devilFruit: { hasFruit: false, name: null, type: null },
        haki: ['Conquistador', 'Armamento', 'Observación'],
        description: 'El jefe de los Piratas del Pelirrojo y quien inspiró a Luffy. Poseedor de un Haki del Conquistador abrumador.',
        image: '/images/shanks.jpg',
        hints: ['Perdió su brazo salvando a Luffy.', 'Fue aprendiz en el barco de Roger.', 'Detuvo la Guerra de Marineford.', 'Es un maestro del Haki.', 'Tiene una cicatriz en el ojo izquierdo hecha por Barbanegra.']
    },
    {
        id: 'blackbeard',
        name: 'Marshall D. Teach',
        affiliation: 'Piratas de Barbanegra',
        role: 'Almirante',
        bounty: '3,996,000,000',
        devilFruit: { hasFruit: true, name: 'Yami Yami / Gura Gura', type: 'Logia / Paramecia' },
        haki: ['Armamento', 'Observación'],
        description: 'El único ser conocido capaz de usar dos Frutas del Diablo.',
        image: '/images/blackbeard.jpg',
        hints: ['Traicionó a Barbablanca matando a Thatch.', 'Entregó a Ace a la Marina.', 'Posee el poder de la Oscuridad y el Terremoto.', 'Su bandera tiene tres calaveras.', 'Le encantan las tartas de cereza.']
    },
    {
        id: 'kaido',
        name: 'Kaido',
        affiliation: 'Piratas Bestia',
        role: 'Gobernador General',
        bounty: '4,611,100,000',
        devilFruit: { hasFruit: true, name: 'Uo Uo no Mi, Modelo: Seiryu', type: 'Zoan Mítica' },
        haki: ['Conquistador', 'Armamento', 'Observación'],
        description: 'La Criatura más Fuerte del Mundo. Gobernó Wano con puño de hierro.',
        image: '/images/kaido.jpg',
        hints: ['Puede transformarse en un dragón gigante.', 'Intentó suicidarse múltiples veces por diversión.', 'Tiene una hija llamada Yamato.', 'Fue derrotado por Luffy en Onigashima.', 'Bebedor empedernido.']
    },
    {
        id: 'bigmom',
        name: 'Charlotte Linlin',
        affiliation: 'Piratas de Big Mom',
        role: 'Reina',
        bounty: '4,388,000,000',
        devilFruit: { hasFruit: true, name: 'Soru Soru no Mi', type: 'Paramecia' },
        haki: ['Conquistador', 'Armamento', 'Observación'],
        description: 'La Reina de Totto Land. Sueña con una familia de todas las razas.',
        image: '/images/bigmom.jpg',
        hints: ['Tiene 85 hijos.', 'Puede robar la esperanza de vida.', 'Sufre de ataques de hambre incontrolables.', 'Creó a Zeus, Prometheus y Napoleon.', 'Tiene una piel de hierro natural.']
    },
    {
        id: 'buggy',
        name: 'Buggy el Payaso',
        affiliation: 'Cross Guild',
        role: 'Presidente',
        bounty: '3,189,000,000',
        devilFruit: { hasFruit: true, name: 'Bara Bara no Mi', type: 'Paramecia' },
        haki: ['Observación (Básico)'],
        description: 'Un pirata suertudo que ascendió a Emperador por error.',
        image: '/images/buggy.jpg',
        hints: ['Es inmune a los cortes.', 'Fue aprendiz de Roger junto a Shanks.', 'Odia que se burlen de su nariz.', 'Líder de la organización Cross Guild (en papel).', 'Inventó la Buggy Bala.']
    },

    // --- Guerreros del Mar (Ex y Actuales) ---
    {
        id: 'mihawk',
        name: 'Dracule Mihawk',
        affiliation: 'Cross Guild',
        role: 'Espadachín',
        bounty: '3,590,000,000',
        devilFruit: { hasFruit: false, name: null, type: null },
        haki: ['Armamento', 'Observación'],
        description: 'El Espadachín más Fuerte del Mundo. Empuña la espada negra Yoru.',
        image: '/images/mihawk.jpg',
        hints: ['Viaja en un bote ataúd.', 'Entrenó a Zoro.', 'Es rival de Shanks.', 'Tiene ojos de halcón.', 'No tiene tripulación pero vive con Perona y mandriles.']
    },
    {
        id: 'crocodile',
        name: 'Sir Crocodile',
        affiliation: 'Cross Guild',
        role: 'Fundador',
        bounty: '1,965,000,000',
        devilFruit: { hasFruit: true, name: 'Suna Suna no Mi', type: 'Logia' },
        haki: ['Armamento', 'Observación'],
        description: 'Ex guerrero del mar y cerebro criminal. Puede controlar la arena.',
        image: '/images/crocodile.jpg',
        hints: ['Intentó apoderarse de Alabasta.', 'Tiene un garfio venenoso.', 'Su debilidad es el agua (o líquidos).', 'Fue derrotado por Luffy en el desierto.', 'Fuma puros constantemente.']
    },
    {
        id: 'hancock',
        name: 'Boa Hancock',
        affiliation: 'Piratas Kuja',
        role: 'Emperatriz Pirata',
        bounty: '1,659,000,000',
        devilFruit: { hasFruit: true, name: 'Mero Mero no Mi', type: 'Paramecia' },
        haki: ['Conquistador', 'Armamento', 'Observación'],
        description: 'La mujer más hermosa del mundo y líder de las Amazonas Lily.',
        image: '/images/hancock.jpg',
        hints: ['Está enamorada de Luffy.', 'Puede convertir a la gente en piedra.', 'Fue esclava de los Dragones Celestiales.', 'Tiene dos hermanas serpiente.', 'Odia a los hombres (excepto a Luffy).']
    },
    {
        id: 'doflamingo',
        name: 'Donquixote Doflamingo',
        affiliation: 'Piratas Donquixote',
        role: 'Capitán',
        bounty: '340,000,000 (Congelada)',
        devilFruit: { hasFruit: true, name: 'Ito Ito no Mi', type: 'Paramecia' },
        haki: ['Conquistador', 'Armamento', 'Observación'],
        description: 'El Demonio Celestial. Gobernó Dressrosa desde las sombras.',
        image: '/images/doflamingo.jpg',
        hints: ['Es un ex Dragón Celestial.', 'Controla a las personas como marionetas con hilos.', 'Siempre usa gafas de sol.', 'Su apodo es "Joker".', 'Asesinó a su propio hermano y padre.']
    },
    {
        id: 'law',
        name: 'Trafalgar D. Water Law',
        affiliation: 'Piratas Heart',
        role: 'Capitán / Médico',
        bounty: '3,000,000,000',
        devilFruit: { hasFruit: true, name: 'Ope Ope no Mi', type: 'Paramecia' },
        haki: ['Armamento', 'Observación'],
        description: 'El Cirujano de la Muerte. Formó una alianza clave con Luffy.',
        image: '/images/law.jpg',
        hints: ['Puede operar dentro de su "Room".', 'Busca conocer el significado de la "D".', 'Odia el pan.', 'Viaja en un submarino amarillo.', 'Sobrevivió gracias al sacrificio de Corazón.']
    },

    // --- Leyendas y Otros ---
    {
        id: 'ace',
        name: 'Portgas D. Ace',
        affiliation: 'Piratas de Barbablanca',
        role: 'Comandante 2ª División',
        bounty: '550,000,000',
        devilFruit: { hasFruit: true, name: 'Mera Mera no Mi', type: 'Logia' },
        haki: ['Conquistador', 'Armamento', 'Observación'],
        description: 'El hermano mayor de Luffy. Hijo de Gol D. Roger.',
        image: '/images/ace.jpg',
        hints: ['Murió protegiendo a Luffy en Marineford.', 'Su padre era el Rey de los Piratas.', 'Tenía pecas y siempre se quedaba dormido comiendo.', 'Persiguió a Barbanegra por venganza.', 'Su tatuaje tenía una "S" tachada.']
    },
    {
        id: 'yamato',
        name: 'Yamato',
        affiliation: 'Alianza Ninja-Pirata-Mink-Samurái',
        role: 'Guardián',
        bounty: 'Desconocida',
        devilFruit: { hasFruit: true, name: 'Inu Inu no Mi, Modelo: Okuchi no Makami', type: 'Zoan Mítica' },
        haki: ['Conquistador', 'Armamento', 'Observación'],
        description: 'Hijo de Kaido que se autoproclama Kozuki Oden.',
        image: '/images/yamato.jpg',
        hints: ['Quiere salir al mar como Oden.', 'Conoció a Ace en Wano.', 'Leyó el diario de Oden.', 'Tiene cuernos de oni.', 'Peleó contra su padre Kaido en el tejado.']
    },
    {
        id: 'rayleigh',
        name: 'Silvers Rayleigh',
        affiliation: 'Piratas de Roger',
        role: 'Vicecapitán (Retirado)',
        bounty: 'Desconocida',
        devilFruit: { hasFruit: false, name: null, type: null },
        haki: ['Conquistador', 'Armamento', 'Observación'],
        description: 'El Rey Oscuro. Primer oficial del Rey de los Piratas.',
        image: '/images/rayleigh.jpg',
        hints: ['Entrenó a Luffy en Haki durante 2 años.', 'Vive en el Archipiélago Sabaody.', 'Es un experto recubridor de barcos.', 'Nadó por el Calm Belt.', 'Le gusta el alcohol y las apuestas.']
    },
    {
        id: 'kuma',
        name: 'Bartholomew Kuma',
        affiliation: 'Ejército Revolucionario',
        role: 'Ex Comandante',
        bounty: '296,000,000 (Antes)',
        devilFruit: { hasFruit: true, name: 'Nikyu Nikyu no Mi', type: 'Paramecia' },
        haki: ['Armamento', 'Observación'],
        description: 'El Tirano. Fue convertido en el Pacifista PX-0.',
        image: '/images/kuma.jpg',
        hints: ['Tiene almohadillas de pata en las manos.', 'Puede repeler cualquier cosa, incluido el dolor.', 'Es el padre de Jewelry Bonney.', 'Protegió el Sunny durante 2 años.', 'Pertenece a la raza Buccaneer.']
    }
];
