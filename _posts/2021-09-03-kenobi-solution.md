---
layout: single
title: Kenobi - Tryhackme (Español)
date: 2021-09-03
classes: wide
header:
  teaser: /assets/images/kenobi-writeup/kenobi_logo.jpg
  teaser_home_page: true
  icon: /assets/images/hackthebox.webp
categories:
  - writeup
tags:
  - THM
  - FTP
  - NFS
  - SMB
  - SUIDS
---

Solucionamos la maquina kenobi de Tryhackme, una maquina muy divertida con diferentes servicios y concatenando diferentes vulnerabilidades por cada servicio y por ultimo una escalacion de privilegios basica en linux.


Escaneamos la maquina :

```
> nmap --open -p- 10.10.100.158

PORT      STATE SERVICE
21/tcp    open  ftp
22/tcp    open  ssh
80/tcp    open  http
111/tcp   open  rpcbind
139/tcp   open  netbios-ssn
445/tcp   open  microsoft-ds
2049/tcp  open  nfs
34801/tcp open  unknown
39035/tcp open  unknown
41037/tcp open  unknown
57199/tcp open  unknown
```

Buscamos las versiones e informacion extra con los scripts de nmap :

```
> nmap -sC -sV -p21,22,80,111,139,445,2049,34801,39035,41037,57199 10.10.100.158

PORT      STATE SERVICE     VERSION
21/tcp    open  ftp         ProFTPD 1.3.5
22/tcp    open  ssh         OpenSSH 7.2p2 Ubuntu 4ubuntu2.7 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 b3:ad:83:41:49:e9:5d:16:8d:3b:0f:05:7b:e2:c0:ae (RSA)
|   256 f8:27:7d:64:29:97:e6:f8:65:54:65:22:f7:c8:1d:8a (ECDSA)
|_  256 5a:06:ed:eb:b6:56:7e:4c:01:dd:ea:bc:ba:fa:33:79 (ED25519)
80/tcp    open  http        Apache httpd 2.4.18 ((Ubuntu))
| http-robots.txt: 1 disallowed entry 
|_/admin.html
|_http-server-header: Apache/2.4.18 (Ubuntu)
|_http-title: Site doesn't have a title (text/html).
111/tcp   open  rpcbind     2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|   100000  3,4          111/udp6  rpcbind
|   100003  2,3,4       2049/tcp   nfs
|   100003  2,3,4       2049/tcp6  nfs
|   100003  2,3,4       2049/udp   nfs
|   100003  2,3,4       2049/udp6  nfs
|   100005  1,2,3      39735/udp6  mountd
|   100005  1,2,3      41037/tcp   mountd
|   100005  1,2,3      54887/tcp6  mountd
|   100005  1,2,3      57351/udp   mountd
|   100021  1,3,4      34801/tcp   nlockmgr
|   100021  1,3,4      36811/tcp6  nlockmgr
|   100021  1,3,4      47011/udp   nlockmgr
|   100021  1,3,4      48852/udp6  nlockmgr
|   100227  2,3         2049/tcp   nfs_acl
|   100227  2,3         2049/tcp6  nfs_acl
|   100227  2,3         2049/udp   nfs_acl
|_  100227  2,3         2049/udp6  nfs_acl
139/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp   open  netbios-ssn Samba smbd 4.3.11-Ubuntu (workgroup: WORKGROUP)
2049/tcp  open  nfs_acl     2-3 (RPC #100227)
34801/tcp open  nlockmgr    1-4 (RPC #100021)
39035/tcp open  mountd      1-3 (RPC #100005)
41037/tcp open  mountd      1-3 (RPC #100005)
57199/tcp open  mountd      1-3 (RPC #100005)
Service Info: Host: KENOBI; OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel
```

A primera vista nos damos cuenta de un servicio nfs, un ftp con una version antigua, un http con un admin.html, y un servicio smb que puede tener recursos compartidos asi que vamos desde los primeros puertos a los mas altos :

### Servicio FTP :

Buscamos si esta version del servicio ftp cuenta con vulnerabilidades :

![image-20210903185827713](/assets/images/kenobi-writeup/searchsploit.png) 

Por la descripcion de la vulnerabilidad y los ejemplos lo que hace la vulnerabilidad es copiar y pegar un archivo a otra direccion por lo que es una vulnerabilidad que con acceso a una ubicacion me podria servir :

![image-20210903190216465](/assets/images/kenobi-writeup/vuln-info.png)

### HTTP :

![image-20210903190447758](/assets/images/kenobi-writeup/trap.png)

Por lo que vi despues de enumerar el servicio no habia mucho por hacer.

### NFS :

![image-20210903190644226](/assets/images/kenobi-writeup/showmount.png)

Al enumerar el servicio podemos ver que el directorio /var esta siendo compartido y eso nos puede servir para inspeccionarlo.

### SMB : 

![image-20210903190816542](/assets/images/kenobi-writeup/smbclient.png)

Al enumerar el servicio smb vemos un recurso compartido anonymous intentamos loggearnos e inspeccionar :

![image-20210903190932206](/assets/images/kenobi-writeup/smbclient2.png)

Al ver el archivo log.txt obtenemos la ubicacion de la llave privada del usuario kenobi :

![image-20210903191126285](/assets/images/kenobi-writeup/log.png)

## Explotacion concatenando vulnerabilidades 

Ya con lo encontrado puedo darme cuenta de la ubicacion de las llaves de la victima, hay un directorio al que puedo acceder el cual es el directorio /var y tambien puedo copiar y pegar archivos a donde yo quiera. Creo que lo que se tiene que hacer es evidente para la vista por lo que seguimos :

### Copiamos el archivo id_rsa a /var/tmp

![image-20210903192054987](/assets/images/kenobi-writeup/cp_paste.png)

### Compartimos el recurso /var/tmp 

![image-20210903192303377](/assets/images/kenobi-writeup/mount.png)

### Nos conectamos por ssh 

![image-20210903192524419](/assets/images/kenobi-writeup/ssh_idrsa.png)

### Escalamos privilegios 

Una vez dentro tenemos que escalar privilegios a root por lo cual lo primero que hago siempre es buscar archivos con permisos suid :

![image-20210903192709090](/assets/images/kenobi-writeup/find_suids.png)

Encontramos el binario menu que al ejecutarlo nos da las tres opciones y ejecuta la que le digamos :

![image-20210903192813164](/assets/images/kenobi-writeup/menu_bin.png)

Ahora lo que se me ocurre para escalar privilegios seria crear nuestro propio binario con una shell o que ejecute algo que nos de permisos de root y para hacer que ejecute nuestro binario y no el real tenemos que priorizar la ruta de donde se encuentre nuestro binario en este caso yo lo creare ahi mismo :

![image-20210903193142172](/assets/images/kenobi-writeup/change_path.png)

Procedemos a ejecutar el binario :

![image-20210903193256323](/assets/images/kenobi-writeup/change_bash.png)

Y listo ya tendriamos permisos de root :

![image-20210903193343450](/assets/images/kenobi-writeup/root.png)



