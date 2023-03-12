---
layout: single
title: CRTP (Certified Red Team Professional) Review
date: 2023-02-21
classes: wide
header:
  teaser: /assets/images/crtp/CRTP-image.png
  teaser_home_page: true
categories:
  - certificados
  - review
tags:
  - review
---

Según el contenido del CRTP, esta certificación es apta para principiantes y estoy de acuerdo en que es una buena opción para aquellos que deseen iniciarse en Active Directory. Sin embargo, es importante tener en cuenta que se requiere un conocimiento mínimo previo debido a que esta es una certificación práctica. Dentro del material, encontrará conceptos teóricos que serán de ayuda, pero es fundamental reforzarlos, ya sea porque conozca la teoría detrás de Active Directory o porque, acompañado de lo que vaya aprendiendo, vaya investigando por su cuenta más acerca de cada concepto que se va explicando dentro del material.

Decidí tomar esta certificación porque quería probar mis habilidades básicas y reforzar aquellas que ya tenía en Active Directory. No estaba muy seguro de si tomar esta certificación o ir directamente por la CRTE, pero creo que, aún pensando que mis habilidades podrían estar para la siguiente certificación de Altered Security, no me arrepiento de haber dado esta certificación ya que aprendí algunos conceptos que me faltaban y también algunas formas más sutiles de hacer las cosas (aprender a hacer todo desde un equipo Windows) es algo que mejoré en esta certificación. También me gustaría agradecer al personal de Altered Security, ya que cualquier error que tuve tanto en mi laboratorio como en mi examen me brindaron apoyo para arreglar estos problemas. Espero que esta publicación pueda ser una guía para aquellos que piensan en dar esta certificación.

## Acerca del Curso y Laboratorio


Es importante destacar que, a medida que vaya avanzando en la certificación, encontrará desafíos más complejos y se le pedirá que aplique los conceptos aprendidos en situaciones más realistas. Por lo tanto, es recomendable que dedique tiempo suficiente para estudiar y practicar cada uno de los temas que se abordan en la certificación.
En conclusión, aunque esta certificación es apta para principiantes, es importante tener en cuenta que se requiere un conocimiento mínimo previo y dedicar tiempo y esfuerzo para poder aplicar los conceptos de manera efectiva. Si está dispuesto a invertir en su formación en ciberseguridad, el CRTP puede ser una excelente opción para iniciar su camino en el emocionante campo de Active Directory.



![](/assets/images/crtp/crtp-labo.png)


El material que se proporciona en esta certificación es muy completo y está disponible en diferentes formatos, incluyendo videos y PDFs. El contenido explica de manera detallada cada una de las secciones que se abordan en la certificación. Además, se proporciona un entorno de laboratorio que incluye un solucionario en PDF y videos que explican cómo resolver los retos en caso de quedarse atascado. Sin embargo, es importante tener en cuenta que no todo estará servido en bandeja y que el material es de ayuda, pero no cubrirá la solución completa.

Dentro del laboratorio, se pueden aprender y practicar temas importantes como la enumeración de Active Directory utilizando herramientas como PowerView, RSAT, Bloodhound, entre otras. También se abordan temas como el movimiento lateral, la escalación de privilegios en Active Directory utilizando ACLs y malas configuraciones, conceptos básicos de Kerberos y Kerberos Delegation, Across Forest, abuso de MSSQL Servers y múltiples métodos de persistencia. Es importante destacar que, aunque no se cubren todos los temas en profundidad, el material es muy útil para iniciarse en la materia y para aprender conceptos clave.
Además, dentro del material también se aborda la defensa de Active Directory, aunque se ahonda muy poco en estos temas. Sin embargo, se proporcionan algunos conceptos que se recomienda investigar.

El laboratorio de este curso es muy bueno y el rendimiento de todo el entorno es fantástico, lo que hace que sea muy fácil trabajar con él. En caso de que se presente algún error, el laboratorio proporciona muchas pistas que permiten solucionarlo rápidamente y, en caso de ser necesario, informar al equipo de Altered Security.


En mi experiencia, ya tenía mapeadas todas las herramientas que se utilizan en el curso y en el laboratorio. Sin embargo, encontré que fue muy divertido utilizarlas nuevamente. Mi consejo para aquellos que ya tienen experiencia en Active Directory es que intenten obtener todo el laboratorio como si fuera un entorno real, ya que es lo que el laboratorio simula. Para aquellos que recién se adentran en Active Directory, les recomiendo que utilicen el laboratorio al máximo y que vayan paso a paso con los retos que propone el material, ya que el curso es muy progresivo.


## En el examen

Antes de dar el examen de certificación, me dediqué a prepararme realizando simulaciones de examen con el laboratorio, lo cual resultó ser de gran ayuda, ya que el entorno del laboratorio está muy bien diseñado para el examen. De esta manera, fui al examen con bastante confianza, aunque también un poco nervioso, porque no sabía qué tan difícil podía ser.

Comencé el día del examen de manera tranquila, ya que el examen no se programa y se puede empezar en cualquier momento. Tomé tiempo para desayunar y estar lo suficientemente calmado antes del examen. Empecé a las 9 am, enumerando calmadamente el entorno que tenía y trazando un plan sobre todas las acciones que podía llevar a cabo para ir escalando de a poco en el dominio.

Traté de hacerlo rápido, ya que tenía un poco de miedo de perder agudeza mental y al ser un examen de 24 horas, mientras más me demorara, más se volvería una batalla contra mí mismo. Enumeré todos los caminos posibles y seguí la metodología que había armado en las simulaciones que realicé. Esto me llevó a tener el primer dominio completo a las 11 am y faltaba poco para obtener todo el bosque.

Por alguna razón, las cosas no me funcionaron en el último momento, pero el entorno del examen también te permite reiniciar los equipos desde cero, por lo que recurrí a esto pensando que había sido un error del propio examen. Así fue como a las 12 del mediodía ya había terminado el examen. Ahí fue cuando al fin pude respirar un poco y descansar, ya que creo que di este examen un poco apurado. Me di cuenta de que el examen no solo tiene una forma de hacerse, por lo que si algo no funciona en el momento del examen, recuerde que no solo hay un camino.

La parte del informe fue lo que más me costó, ya que el examen también pide colocar mitigaciones y recomendaciones a lo que va encontrando. Fue aquí donde me ayudo la experiencia que ya tenía haciendo este tipo de auditorías.

En resumen, la preparación previa y las simulaciones de examen me dieron la confianza necesaria para abordar el examen con calma y determinación. Aunque hubo momentos de incertidumbre y un poco de prisa al final, el entorno del laboratorio me permitió tener los conocimientos suficientes para culminar el examen con éxito.


## Conclusiones :

Mi experiencia con Altered Security fue realmente fantástica tanto en el laboratorio como en el examen. Durante el proceso de preparación, pude notar que el entorno simulado que ofrecen es realmente muy parecido al mundo real. Sin embargo, si ya se tiene experiencia con los temas mencionados, sería recomendable pasar a las siguientes certificaciones que ofrece Altered Security, especialmente las relacionadas con Active Directory.
	
En conclusión, si estás buscando una certificación en seguridad informática, el CRTP es una excelente opción. Su enfoque en la práctica y la simulación de situaciones reales hacen que esta certificación sea muy valiosa para cualquiera que quiera desarrollar sus habilidades en el campo de Active Directory.


## Certificado :

![](/assets/images/crtp/CRTP-image.png)












