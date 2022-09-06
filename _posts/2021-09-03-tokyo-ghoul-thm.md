---
layout: single
title: Tokyo Ghoul - Tryhackme (Español)
date: 2021-05-10
classes: wide
header:
  teaser: /assets/images/tokyo-ghoul-thm/tokyo_logo.jpg
  teaser_home_page: true
categories:
  - writeup
tags:
  - THM
  - criptografia
---

Tokyo ghoul es un maquina interesante con posibles rabbit holes y que requiere de un pequeño conocimiento de criptografia o codigo morse y un poco de conocimiento de jails.




Escaneamos el sistema :

```
> nmap --open --top-ports 100 10.10.179.184

PORT   STATE SERVICE
21/tcp open  ftp
22/tcp open  ssh
80/tcp open  http
```

Usamos los scripts de nmap para obtener las versiones y posibles accesos a estos servicios :

```
> nmap -sC -sV -p21,22,80 10.10.173.53

PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_drwxr-xr-x    3 ftp      ftp          4096 Jan 23  2021 need_Help?
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to ::ffff:10.11.26.234
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 2
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.10 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 fa:9e:38:d3:95:df:55:ea:14:c9:49:d8:0a:61:db:5e (RSA)
|   256 ad:b7:a7:5e:36:cb:32:a0:90:90:8e:0b:98:30:8a:97 (ECDSA)
|_  256 a2:a2:c8:14:96:c5:20:68:85:e5:41:d0:aa:53:8b:bd (ED25519)
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-server-header: Apache/2.4.18 (Ubuntu)
|_http-title: Welcome To Tokyo goul
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel
```

Vemos que se tiene el servicio FTP con una configuracion incorrecta lo cual nos permite autenticarnos como usuario Anonimo :

![image-20210903144426867](/assets/images/tokyo-ghoul-thm/ftp_anonymous.png)

Ejecutamos el archivo obtenido :

![image-20210903144911602](/assets/images/tokyo-ghoul-thm/ejecutable_message.png)

Obtenemos todos estos archivos y despues de haber leido todos tenemos un executable que nos pide una contraseña y una imagen que posiblemente tenga dentro mas elementos a traves de tecnicas de esteganografia, por lo que si este ejecutable nos pide la contraseña quizas al ver los strings de este descubramos algo :

![image-20210903145229646](/assets/images/tokyo-ghoul-thm/strings-binary.png)

Para los que conocen la serie kamishiro es el nombre de la villana por lo que tiene mucho sentido que esta sea la contraseña que se nos pide :

![image-20210903145942431](/assets/images/tokyo-ghoul-thm/respuesta_exec.png)

Probamos extraer los datos que se encuentran dentro de la imagen con estas credenciales :

![image-20210903150035323](/assets/images/tokyo-ghoul-thm/steghide.png)

Nos extrae un archivo txt cuyo contenido esta codificado :

```
haha you are so smart kaneki but can you talk my code 

..... .-
....- ....-
....- -....
--... ----.
....- -..
...-- ..---
....- -..
...-- ...--
....- -..
....- ---..
....- .-
...-- .....
..... ---..
...-- ..---
....- .
-.... -.-.
-.... ..---
-.... .
..... ..---
-.... -.-.
-.... ...--
-.... --...
...-- -..
...-- -..


if you can talk it allright you got my secret directory 
```

Nos dice que podemos encontrar un directorio secreto si lo hablamos bien.

IMPORTANTE: En este punto es importante conocer un poco acerca de los tipos de codificacion que pueden haber algunos son inclusive lenguajes como el codigo morse que se aplica en este caso cabe recalcar que yo no lo descubri, le pregunte a un amigo un poco mas experto en ctfs y me indico que era codigo morse.

Al darme cuenta que se trataba de codigo morse fui a Cyberchef y lo decodifique :

### morse :

![image-20210903150809829](/assets/images/tokyo-ghoul-thm/morse.png)

### hexa :

![image-20210903150920092](/assets/images/tokyo-ghoul-thm/hexa.png)

### Base64 :

![image-20210903151235147](/assets/images/tokyo-ghoul-thm/base64.png)

Y tenemos el directorio secreto pero dentro no encontramos nada por lo que seguimos escaneando y buscamos directorios dentro de este a traves de la fuerza bruta :

```
gobuster dir -u "http://10.10.173.53/d1r3c70ry_center/" -w /usr/share/wordlists/dirb/common.txt -t 20
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.173.53/d1r3c70ry_center/
[+] Method:                  GET
[+] Threads:                 20
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Timeout:                 10s
===============================================================
2021/09/03 15:28:15 Starting gobuster in directory enumeration mode
===============================================================
/.htpasswd            (Status: 403) [Size: 277]
/.htaccess            (Status: 403) [Size: 277]
/.hta                 (Status: 403) [Size: 277]
/claim                (Status: 301) [Size: 329] [--> http://10.10.173.53/d1r3c70ry_center/claim/]
```

Una vez dentro de ese directorio al ver las opciones, la interaccion de la pagina y la url :

```
http://10.10.173.53/d1r3c70ry_center/claim/index.php?view=flower.gif
```

Nos podemos dar cuenta que esta llamando a un archivo que se encuentra de manera local lo cual puede ser traducido en una vulnerabilidad LFI por lo cual vamos a probar con unos cuantos payloads  :

```
https://raw.githubusercontent.com/emadshanab/LFI-Payload-List/master/LFI%20payloads.txt
```

Lo probamos con Burp Intruder :

![image-20210903153650320](/assets/images/tokyo-ghoul-thm/burp-intruder.png)

nos quedamos con su hash y lo crackeamos usando john the ripper :

![image-20210903153921692](/assets/images/tokyo-ghoul-thm/john-ripper.png)

Nos conectamos por ssh con la clave y nos preparamos para escalar privilegios e intento averiguar si el usuario esta agregado al archivo SUDOERS :

![image-20210903160950158](/assets/images/tokyo-ghoul-thm/sudoers.png)

Solo podemos ejecutar el archivo jail.py como sudo por lo que inspeccionaremos este :

```
#! /usr/bin/python3
#-*- coding:utf-8 -*-
def main():
    print("Hi! Welcome to my world kaneki")
    print("========================================================================")
    print("What ? You gonna stand like a chicken ? fight me Kaneki")
    text = input('>>> ')
    for keyword in ['eval', 'exec', 'import', 'open', 'os', 'read', 'system', 'write']:
        if keyword in text:
            print("Do you think i will let you do this ??????")
            return;
    else:
        exec(text)
        print('No Kaneki you are so dead')
if __name__ == "__main__":
    main()
```



Investigando mas acerca de lo que son las jails encontre un articulo interesante que te explica como escapar de estas :

(https://anee.me/escaping-python-jails-849c65cf306e)[https://anee.me/escaping-python-jails-849c65cf306e] 

Siguiendo los pasos del tutorial podemos ejecutar algo que a nivel de sistema nos garantize una shell por lo cual le doy permisos de suid al binario bash y con esto ya seriamos root del sistema :

![image-20210903160359236](/assets/images/tokyo-ghoul-thm/root.png)




