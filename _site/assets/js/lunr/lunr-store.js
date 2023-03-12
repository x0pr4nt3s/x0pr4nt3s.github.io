var store = [{
        "title": "Lame - Hack the Box (Español)",
        "excerpt":"Esta es una de las maquinas mas sencillas de la lista de TJNULL para la preparacion OSCP, en este desafio nos encontramos con uno que otro servicio que parecen vulnerables mas el servicio a explotar es SMB debido a una vulnerabilidad que permite ejecutar codigo de manera remota con privilegios...","categories": ["writeup"],
        "tags": ["HTB","SMB vulnerability"],
        "url": "http://localhost:4000/lame-writeup/",
        "teaser":"http://localhost:4000/assets/images/lame-writeup/lame_logo.jpg"},{
        "title": "Legacy - Hack the Box (Español)",
        "excerpt":"Solucion de la maquina Legacy de Hack the Box escaneo de puertos : &gt; nmap -Pn --top-ports 1000 10.10.10.4 PORT STATE SERVICE 139/tcp open netbios-ssn 445/tcp open microsoft-ds 3389/tcp closed ms-wbt-server Intentamos con los scripts de nmap para identificar vulnerabilidades en smb : &gt; nmap -Pn --script vuln -p445 10.10.10.4...","categories": ["writeup"],
        "tags": ["HTB","SMB vulnerability"],
        "url": "http://localhost:4000/legacy-writeup/",
        "teaser":"http://localhost:4000/assets/images/legacy-writeup/legacy_logo.jpg"},{
        "title": "Tokyo Ghoul - Tryhackme (Español)",
        "excerpt":"Tokyo ghoul es un maquina interesante con posibles rabbit holes y que requiere de un pequeño conocimiento de criptografia o codigo morse y un poco de conocimiento de jails. Escaneamos el sistema : &gt; nmap --open --top-ports 100 10.10.179.184 PORT STATE SERVICE 21/tcp open ftp 22/tcp open ssh 80/tcp open...","categories": ["writeup"],
        "tags": ["THM","criptografia"],
        "url": "http://localhost:4000/tokyo-ghoul-thm/",
        "teaser":"http://localhost:4000/assets/images/tokyo-ghoul-thm/tokyo_logo.jpg"},{
        "title": "Brainfuck - Hack the Box (Español)",
        "excerpt":"Brainfuck es una maquina especializada para aprender a explotar wordpress a traves de sus diferentes vulnerabilidades en los plugins y tambien poner a prueba temas de criptografia basica como por el ejemplo el cifrado polialfabetico y llega hasta temas como RSA. Escaneo Escaneamos los puertos de la maquina : &gt;...","categories": ["writeup"],
        "tags": ["HTB","hash","criptografia","wordpress"],
        "url": "http://localhost:4000/brainfuck-writeup/",
        "teaser":"http://localhost:4000/assets/images/brainfuck-writeup/brainfuck_logo.jpg"},{
        "title": "Enumeracion de Active Directory sin herramientas RSAT",
        "excerpt":"Enumeracion y descubrimiento de Active Directory sin que el Antivirus u otro control de seguridad te detecte usando Powershell y las herramientas firmadas por Microsoft para gestionar Active Directory (RSAT). ¿Como enumerar Active Directory sin que lo detecte Windows Defender u otros Antivirus de manera manual sin herramientas RSAT? Hay...","categories": ["active-directory","enumeracion"],
        "tags": ["active-directory","windows"],
        "url": "http://localhost:4000/AD-Enum-without-RSAT/",
        "teaser":"http://localhost:4000/assets/images/ad-enum-without-rsat/rsat-logo.png"},{
        "title": "Kenobi - Tryhackme (Español)",
        "excerpt":"Solucionamos la maquina kenobi de Tryhackme, una maquina muy divertida con diferentes servicios y concatenando diferentes vulnerabilidades por cada servicio y por ultimo una escalacion de privilegios basica en linux. Escaneamos la maquina : &gt; nmap --open -p- 10.10.100.158 PORT STATE SERVICE 21/tcp open ftp 22/tcp open ssh 80/tcp open...","categories": ["writeup"],
        "tags": ["THM","FTP","NFS","SMB","SUIDS"],
        "url": "http://localhost:4000/kenobi-solution/",
        "teaser":"http://localhost:4000/assets/images/kenobi-writeup/kenobi_logo.jpg"},{
        "title": "eJPT (eLearnSecurity Junior Penetration Tester) Review",
        "excerpt":"Muchos dicen que este certificado no es lo suficientemente retador como para darlo pero es una buena forma de introducirse a este mundo de la ciberseguridad de una manera estructurada y con unos laboratorios con buen material, en mi opinion es importante la introduccion que puede tener uno en el...","categories": ["certificados","review"],
        "tags": ["review"],
        "url": "http://localhost:4000/ejpt-exam-experience/",
        "teaser":"http://localhost:4000/assets/images/about/ejpt.png"}]
