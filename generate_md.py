import json
import os

markdown_output = "# Inventario Editorial de Conferencias\n\n"

# Definimos la metadata procesada manualmente para completar descripciones faltantes
data = [
    {
        "url": "https://www.youtube.com/watch?v=2pGObT6T-XE",
        "title": "Extractos Conferencia | John Tomasi",
        "date": "22 de Octubre de 2020",
        "participants": "John Tomasi",
        "bio": "John Tomasi es un reconocido filósofo político estadounidense, fundador del Political Theory Project en la Universidad de Brown y autor del libro 'Free Market Fairness', en el que intenta conciliar el libre mercado con ideales de justicia social.",
        "summary": "Breves extractos de la conferencia de John Tomasi sobre libre mercado, equidad y justicia social, destacando sus reflexiones sobre el modelo liberal y su impacto en la sociedad."
    },
    {
        "url": "https://www.youtube.com/watch?v=9gTf8H3Ya9k",
        "title": "Extractos Conferencia '¿Qué es ser liberal?' | Mario Vargas Llosa",
        "date": "22 de Octubre de 2020",
        "participants": "Mario Vargas Llosa",
        "bio": "Mario Vargas Llosa es un destacado escritor, ensayista y político peruano, galardonado con el Premio Nobel de Literatura en 2010. Es uno de los intelectuales y defensores del liberalismo más influyentes de habla hispana.",
        "summary": "Selección de los mejores momentos de la conferencia de Vargas Llosa, donde reflexiona profundamente sobre el significado de ser liberal en el mundo contemporáneo y los desafíos de la libertad."
    },
    {
        "url": "https://www.youtube.com/watch?v=A0mRUTTPt30",
        "title": "Narcotráfico: La otra mirada de la pandemia y la recesión | Óscar Naranjo",
        "date": "19 de Junio de 2020",
        "participants": "Óscar Naranjo",
        "bio": "El General Óscar Naranjo es uno de los líderes más respetados de Colombia y América Latina. Ex Vicepresidente de Colombia y ex Director de la Policía Nacional, es experto en inteligencia, seguridad, negociación y manejo de crisis.",
        "summary": "El General Naranjo analiza el impacto de la pandemia y la recesión económica en el narcotráfico y la seguridad regional, aportando lecciones sobre liderazgo y transformación en tiempos de crisis."
    },
    {
        "url": "https://www.youtube.com/watch?v=BI2jcDcGq6g",
        "title": "La Otra Mirada a la geopolítica y la seguridad",
        "date": "6 de Mayo de 2026",
        "participants": "Panel de expertos",
        "bio": "Diversos especialistas y analistas internacionales en materia de política exterior, defensa y relaciones internacionales.",
        "summary": "Un panel experto aborda los principales desafíos del escenario geopolítico actual, analizando las tensiones globales y las estrategias de seguridad con distintas perspectivas."
    },
    {
        "url": "https://www.youtube.com/watch?v=cQ1BB0tOMI0",
        "title": "Extractos conferencia | Niall Ferguson",
        "date": "20 de Octubre de 2020",
        "participants": "Niall Ferguson",
        "bio": "Niall Ferguson es un historiador, autor y comentarista británico, investigador en la Institución Hoover de la Universidad de Stanford. Es especialista en historia económica y financiera, además de historia imperial.",
        "summary": "Extractos clave de la presentación del historiador Niall Ferguson, analizando hitos de la historia económica mundial y lecciones aplicables a las crisis contemporáneas."
    },
    {
        "url": "https://www.youtube.com/watch?v=EDCqWK8h5AE",
        "title": "Conferencia completa | Niall Ferguson",
        "date": "20 de Octubre de 2020",
        "participants": "Niall Ferguson",
        "bio": "Niall Ferguson es un historiador, autor y comentarista británico, investigador en la Institución Hoover de la Universidad de Stanford. Es especialista en historia económica y financiera.",
        "summary": "Conferencia íntegra de Niall Ferguson donde desglosa su visión sobre la geopolítica, el orden económico global y cómo las pandemias e hitos históricos moldean a las sociedades."
    },
    {
        "url": "https://www.youtube.com/watch?v=EeKw2kfwFYA",
        "title": "La Otra Mirada de las Empresas: Post Pandemia | Paul Polman",
        "date": "19 de Mayo de 2020",
        "participants": "Paul Polman",
        "bio": "Paul Polman es un empresario y líder corporativo neerlandés. Fue CEO de Unilever, donde destacó por integrar la sostenibilidad en la estrategia de la compañía, y cofundador de IMAGINE, una organización que impulsa el liderazgo sustentable.",
        "summary": "Paul Polman discute cómo la crisis del COVID-19 representa una excelente oportunidad para replantear la misión empresarial, buscar el impacto social y elevar el nivel de conciencia respecto al medio ambiente y el cambio climático."
    },
    {
        "url": "https://www.youtube.com/watch?v=erbqSsUBK0k",
        "title": "La Otra Mirada del Juez | Sérgio Moro",
        "date": "30 de Julio de 2020",
        "participants": "Sérgio Moro, Cristián Bofill",
        "bio": "Sérgio Moro es un exjuez y político brasileño, conocido internacionalmente por liderar la Operación Lava Jato contra la corrupción. Cristián Bofill es un destacado periodista y analista político chileno.",
        "summary": "El exjuez brasileño Sérgio Moro es entrevistado por Cristián Bofill. Abordan la lucha contra la corrupción, el sistema judicial y su experiencia en uno de los casos más grandes de América Latina."
    },
    {
        "url": "https://www.youtube.com/watch?v=Ey4XuixqdKQ",
        "title": "Conferencia 'Libertad' de Mario Vargas Llosa",
        "date": "30 de Septiembre de 2022",
        "participants": "Mario Vargas Llosa, Álvaro Vargas Llosa, Agustín Squella",
        "bio": "Mario Vargas Llosa (Nobel de Literatura), junto a su hijo Álvaro Vargas Llosa (periodista y ensayista) y Agustín Squella (jurista, periodista y académico chileno), referentes del debate intelectual.",
        "summary": "Conferencia central del Premio Nobel sobre la libertad, complementada por un enriquecedor conversatorio con Álvaro Vargas Llosa y Agustín Squella sobre los retos políticos de la región."
    },
    {
        "url": "https://www.youtube.com/watch?v=hL0883CI0BQ",
        "title": "Conferencia completa | Ayaan Hirsi Ali",
        "date": "20 de Octubre de 2020",
        "participants": "Ayaan Hirsi Ali",
        "bio": "Ayaan Hirsi Ali es una activista, política y escritora somalí-neerlandesa. Conocida por su crítica radical al islam y su defensa de los derechos de las mujeres y la libertad de expresión.",
        "summary": "Conferencia en profundidad donde Ayaan Hirsi Ali comparte sus experiencias, su perspectiva sobre la libertad individual frente a los dogmas y los desafíos de Occidente."
    },
    {
        "url": "https://www.youtube.com/watch?v=J6plxDBnz5A",
        "title": "Presidente de Colombia | Iván Duque Márquez",
        "date": "10 de Septiembre de 2020",
        "participants": "Iván Duque Márquez, Nicolás Ibáñez",
        "bio": "Iván Duque Márquez es político y abogado, ex Presidente de la República de Colombia. Nicolás Ibáñez es un prominente empresario y filántropo chileno.",
        "summary": "Entrevista exclusiva al entonces Presidente de Colombia, Iván Duque, conducida por Nicolás Ibáñez. Se discuten las políticas públicas, el desarrollo económico de Colombia y el contexto latinoamericano."
    },
    {
        "url": "https://www.youtube.com/watch?v=jCKWiwdpuuY",
        "title": "Conferencia online | Deirdre McCloskey",
        "date": "20 de Octubre de 2020",
        "participants": "Deirdre McCloskey",
        "bio": "Deirdre McCloskey es una economista, historiadora y académica estadounidense, reconocida por sus estudios sobre la historia económica y la ética burguesa que propició el Gran Enriquecimiento.",
        "summary": "Conferencia de Deirdre McCloskey donde analiza el rol de la innovación, el liberalismo económico y cómo los cambios en las ideas impulsaron la prosperidad moderna."
    },
    {
        "url": "https://www.youtube.com/watch?v=l1DbR3EQZtI",
        "title": "Conferencia Online | Moisés Naím",
        "date": "20 de Agosto de 2020",
        "participants": "Moisés Naím, Patricio Fernández",
        "bio": "Moisés Naím es un analista venezolano, autor de 'El fin del poder', experto en economía y política internacional. Patricio Fernández es un reconocido escritor y periodista chileno.",
        "summary": "Conversación entre Moisés Naím y Patricio Fernández sobre las dinámicas de poder en la actualidad, la política internacional y las transformaciones de las sociedades post-pandemia."
    },
    {
        "url": "https://www.youtube.com/watch?v=Ld8dkr_pnGY",
        "title": "Libertad y Pandemia | Mario Vargas Llosa",
        "date": "9 de Junio de 2020",
        "participants": "Mario Vargas Llosa, Héctor Soto",
        "bio": "Mario Vargas Llosa, Premio Nobel de Literatura. Héctor Soto es un destacado periodista, crítico de cine y columnista político chileno.",
        "summary": "Entrevista al intelectual peruano realizada por Héctor Soto. Se explora cómo la crisis sanitaria de la pandemia impactó las libertades civiles y los riesgos autoritarios emergentes."
    },
    {
        "url": "https://www.youtube.com/watch?v=mm8bDMegZik",
        "title": "Conferencia completa | Moisés Naím",
        "date": "27 de Noviembre de 2020",
        "participants": "Moisés Naím",
        "bio": "Moisés Naím, uno de los líderes de opinión más influyentes y experto en economía global.",
        "summary": "Análisis extenso del contexto sociopolítico global por parte de Moisés Naím, enfocándose en las tendencias que están reconfigurando el poder y las instituciones a nivel mundial."
    },
    {
        "url": "https://www.youtube.com/watch?v=nB0YeCZMg1E",
        "title": "Conferencia completa '¿Qué es ser liberal?' | Mario Vargas Llosa",
        "date": "22 de Octubre de 2020",
        "participants": "Mario Vargas Llosa",
        "bio": "Mario Vargas Llosa, galardonado escritor y pensador liberal.",
        "summary": "Presentación completa donde Vargas Llosa expone de forma magistral los principios fundamentales del liberalismo, la tolerancia política y la defensa de la libertad frente al estatismo."
    },
    {
        "url": "https://www.youtube.com/watch?v=tlGY6s-ZJug",
        "title": "Conferencia: 'Políticamente indeseable' | Cayetana Álvarez de Toledo",
        "date": "4 de Mayo de 2022",
        "participants": "Cayetana Álvarez de Toledo",
        "bio": "Cayetana Álvarez de Toledo es una política, periodista e historiadora española. Ha sido diputada y figura clave del Partido Popular en España, conocida por su estilo directo y crítico.",
        "summary": "Presentación de su libro y visión política en Santiago de Chile. Aborda la crisis política, la libertad de expresión, y el fenómeno de la polarización y la corrección política."
    },
    {
        "url": "https://www.youtube.com/watch?v=tm2jCUGG-Lo",
        "title": "Extractos conferencia | Yoani Sánchez",
        "date": "22 de Octubre de 2020",
        "participants": "Yoani Sánchez",
        "bio": "Yoani Sánchez es una filóloga y periodista cubana, creadora del blog 'Generación Y'. Es una de las voces disidentes más reconocidas mundialmente por su defensa de la libertad de expresión en Cuba.",
        "summary": "Momentos destacados de la conferencia de la periodista cubana, donde relata los desafíos de la disidencia, el periodismo independiente y la lucha por las libertades en regímenes totalitarios."
    },
    {
        "url": "https://www.youtube.com/watch?v=TmG5OizxSAo",
        "title": "¿Es justo el libre mercado? | John Tomasi",
        "date": "22 de Octubre de 2020",
        "participants": "John Tomasi",
        "bio": "John Tomasi, destacado filósofo político y promotor del 'Free Market Fairness'.",
        "summary": "Conferencia íntegra donde Tomasi presenta sus argumentos filosóficos sobre cómo un sistema de libre mercado puede no solo crear riqueza, sino también satisfacer las exigencias de la justicia social."
    },
    {
        "url": "https://www.youtube.com/watch?v=uGrPdngMZ7A",
        "title": "La otra mirada de Latinoamérica | Mauricio Macri",
        "date": "8 de Julio de 2020",
        "participants": "Mauricio Macri, Álvaro Vargas Llosa",
        "bio": "Mauricio Macri es un ingeniero, empresario y político, expresidente de la Nación Argentina (2015-2019). Álvaro Vargas Llosa es un escritor y comentarista político peruano-español.",
        "summary": "Mauricio Macri dialoga con Álvaro Vargas Llosa sobre el rumbo de América Latina, las secuelas de la pandemia, los retos democráticos y su experiencia al mando de Argentina."
    },
    {
        "url": "https://www.youtube.com/watch?v=VN6S-csF8Gk",
        "title": "Conferencia Completa | Moisés Naím - 'La Revancha de los Poderosos'",
        "date": "4 de Septiembre de 2023",
        "participants": "Moisés Naím",
        "bio": "Moisés Naím es un intelectual venezolano considerado por la revista Prospect como uno de los líderes de mayor influencia global, exministro de fomento de Venezuela.",
        "summary": "Naím explica las tesis de su libro 'La Revancha de los Poderosos', analizando cómo los autócratas contemporáneos están subvirtiendo la democracia utilizando el populismo, la polarización y la posverdad."
    },
    {
        "url": "https://www.youtube.com/watch?v=WDH8JoVU6aU",
        "title": "Ordenamiento mundial post Pandemia | Guy Sorman",
        "date": "2 de Mayo de 2020",
        "participants": "Guy Sorman",
        "bio": "Guy Sorman es un economista, periodista y filósofo francés. Seguidor de la tradición liberal clásica y fundador de Acción contra el Hambre, es un agudo analista del capitalismo moderno.",
        "summary": "El intelectual francés ofrece su perspectiva sobre el nuevo orden global tras la crisis sanitaria del COVID-19, analizando el papel de China, EE.UU. y las tensiones geopolíticas emergentes."
    }
]

# Videos no disponibles o placeholders
unavailable_videos = [
    "https://www.youtube.com/watch?v=PiEk7zcpL7I",
    "https://www.youtube.com/watch?v=E1wUSUIPYFM",
    "https://www.youtube.com/watch?v=ezmvkG427gc",
    "https://www.youtube.com/watch?v=S_VIF_l4Ulc",
    "https://www.youtube.com/watch?v=TPCLHAtX7e8",
    "https://www.youtube.com/watch?v=wo3Mb0i25YA",
    "https://www.youtube.com/watch?v=yk1gRE1Rv8I",
    "https://www.youtube.com/watch?v=CmJzHrg7ceM",
    "https://www.youtube.com/watch?v=XHOmBV4js_E"
]

for video in data:
    markdown_output += f"## {video['url']}\n\n"
    markdown_output += f"# Conferencia Internacional: {video['title']}\n"
    markdown_output += "## Resumen Ejecutivo y Guía de Contenido para Landing Page\n"
    markdown_output += f"**Fecha:** {video['date']}\n\n"
    markdown_output += f"**Participantes:** {video['participants']}\n\n"
    markdown_output += f"**Biografía:** {video['bio']}\n\n"
    markdown_output += f"**Resumen:** {video['summary']}\n\n"
    markdown_output += "---\n\n"

for url in unavailable_videos:
    markdown_output += f"## {url}\n\n"
    markdown_output += f"# Conferencia Internacional: [Video No Disponible / Placeholder]\n"
    markdown_output += "## Resumen Ejecutivo y Guía de Contenido para Landing Page\n"
    markdown_output += "**Fecha:** N/A\n\n"
    markdown_output += "**Participantes:** N/A\n\n"
    markdown_output += "**Biografía:** Información no disponible en este momento debido a que el video ha sido eliminado o puesto en privado.\n\n"
    markdown_output += "**Resumen:** Contenido del video inaccesible.\n\n"
    markdown_output += "---\n\n"

with open(r"c:\Users\flipe\OneDrive\Documentos\la otra mirada\inventario_conferencias.md", "w", encoding="utf-8") as f:
    f.write(markdown_output)

print("Markdown generado exitosamente.")
