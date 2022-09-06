---
layout: single
title: Enumeracion de Active Directory sin herramientas RSAT
date: 2021-08-30
classes: wide
header:
  teaser: /assets/images/ad-enum-without-rsat/rsat-logo.png
  teaser_home_page: true
categories:
  - active-directory
  - enumeracion
tags:
  - active-directory
  - windows
---

Enumeracion y descubrimiento de Active Directory sin que el Antivirus u otro control de seguridad te detecte usando Powershell y las herramientas firmadas por Microsoft para gestionar Active Directory (RSAT).   


![](/assets/images/ad-enum-without-rsat/rsat-logo.png)


## ¿Como enumerar Active Directory sin que lo detecte Windows Defender u otros Antivirus de manera manual sin herramientas RSAT?

Hay muchas maneras de enumerar un Active Directory entre ellas estan las herramientas que pertenecen a [Bloodhound](https://github.com/BloodHoundAD/BloodHound/tree/master/Collectors)
o el script hecho en Powershell de [Voyeur](https://github.com/silverhack/voyeur) y demas. 
El unico inconveniente es que en caso de que la maquina atacada de la cual tenemos acceso tiene un antivirus sea Windows Defender, Kaspersky, Mcafee, etc y el perfil en el que nos encontramos tiene bajos priviligios tendriamos que enumerar de manera manual nuestro Active 
Directory. 


Para enumerar el domino de manera manual se necesita el modulo de powershell Active Directory el cual es un grupo de comandos que los administradores de Dominio usan para consultar y administrar objetos en Active Directory. El modulo de powershell Active Directory es parte de las Herramientas de administracion de servidor remoto (RSAT).

El modulo se puede habilitar en las caracteristicas de Windows al instalar el paquete RSAT.La desventaja de ventaja de instalar este paquete es que requiere privilegios de administrador.

![](/assets/images/ad-enum-without-rsat/win-features-ad.jpg)

En caso de que no tengamos privilegios de Administrador, podemos obtener la DLL de administracion de Microsoft de Active Directory desde cualquier host que tenga el paquete RSAT instalado y copiarla en la maquina de Windows que haremos la enumeracion.


Copie la DLL de Microsoft.ActiveDirectory.Management desde cualquier host con el paquete RSAT instalado y coloquelo en el sistema que queremos eumerar con este modulo.

Esta es la ubicacion de la DLL :

```
C:\Windows\Microsoft.NET\assembly\GAC_64\Microsoft.ActiveDirectory.Management\<version>
```

![](/assets/images/ad-enum-without-rsat/dll-ad-path.jpg)


Una vez copiada la DLL procederemos a importarla a nuestro powershell con este comando :

```
Import-Module Microsoft.ActiveDirectory.Management.dll
```

![](/assets/images/ad-enum-without-rsat/dll-ad-exec.jpg)

Una vez hecho ya podemos usar los comandos para la enumeracion de nuestro Active Directory

## Enumeracion de Active Directory

Ya con los comandos que nos proporciono la DLL podemos usar estos comandos para enumerar nuestro Active Directory estos son unos cuantos comandos para la enumeracion :

- Get-ADDomain : El comando enumera todas las propiedades relacionadas con el dominio actual.

- Get-ADDomainController : El comando enumera todos los controladores de dominio en un dominio especifico.

- Get-ADUser : El comando enumera todos los usuarios del dominio actual o especificado

- Get-ADComputer : El comando enumera todos los objetos de la computadora en el dominio actual o en uno especificado.

- Get-ADGroup : El comando enumera todos los grupos en el domino actual o especificado.

- Get-ADGroupMember : Muestra una lista de todos los miembros de un grupo especifico.


Acompañado a estos comandos existen varios parametros que podemos usar para especificar nuestra enumeracion.

Ejemplos :

![](/assets/images/ad-enum-without-rsat/ad-enum-user-properties.jpg)

![](/assets/images/ad-enum-without-rsat/ad-enum-user-filters.jpg)


## Recursos para una enumeracion mas completa 

Al realizar la enumeracion del Active Directory importando solo el modulo anterior las Propiedades de los objetos que enumeramos estan limitadas ya que esta dll se apoya de otros recursos, este es un ejemplo de la enumeracion que podemos obtener importando solo este modulo :

![](/assets/images/ad-enum-without-rsat/propiedades_low_computer.jpg)

Estamos seleccionando que queremos ver todas las propiedades pero aun asi hay informacion que quiero obtener y aun no se muestra como por ejemplo ipv4,.

Para obtener estos recursos de Active Directory e importarlos a la powershell necesitamos obtenerlos de un Host con estas herramientas instaladas y obtenerlos de esta ruta :

```
C:\Windows\System32\WindowsPowershell\v1.0\Modules\ActiveDirectory\
```

![](/assets/images/ad-enum-without-rsat/recursos-ad-rsat-path.jpg)



Copiamos todo el contenido y lo pegamos dentro de nuestro Host, luego importamos solamente el Modulo ActiveDirectory.psd1

![](/assets/images/ad-enum-without-rsat/import-recursos-ad-rsat.jpg)



La cantidad de propiedades obtenidas con el mismo comando sera mayor a la anterior ejecucion :

![](/assets/images/ad-enum-without-rsat/computer-properties-full.jpg)


Una vez hecho esto podra ver mas propiedades en su enumeracion lo que le permitira una enumeracion mucho mas completa.

Los recursos y la DLL de ActiveDirectoryManagement.dll los puedes encontrar [aqui](https://github.com/x0pr4nt3s/Tools_enum_AD_without-RSAT).

