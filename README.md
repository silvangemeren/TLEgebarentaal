Use guide voor local gebruik - back end
```
download bestanden van github
run npm install
run npm run dev
als het een error geeft
run npm install opnieuw
run daarna npm run dev opnieuw

maak in postman een POST request naar: 
http://localhost:8000/auth/register
voer vervolgens in body -> raw 
{
    "name": "studentuser1",
    "token": "",
    "role": "admin",
    "email": "student1@example.com",
    "loginCode": "1234"
}
je hebt de rollen student, teacher en admin.

de token kan je vinden:
https://cmgt.hr.nl/chat-login/handle/tle2-1?redirect=http://localhost:8000/auth/register

vervolgens als je op de link drukt zal het er zo uitzien:
http://localhost:8000/auth/register?token=b14766793114df9e12d18509a65a6e6b16bfeb911bdc66bdaa24f813e279b12b&name=Jansen,%20J.K.%20(1000000)&email=1000000@hr.nl

kopieer van je eigen link de token en zet deze als token neer in de body -> raw in postman
vervolgens in de code ga naar routes/auth.js
command hier regel 85 tot 96 uit
dit zorgt ervoor dat je geen logincode nodig hebt om een account te maken
vervolgens als je het verzend krijg je een "responseToken", kopieer deze, ga naar Authorization in postman een onder Auth Type druk op Bearer Token. voer nu hier rechts ervan de responseToken in die je gekregen hebt

nu heb je toegang om de gebaren op te halen, zorg ervoor dat authorization op bearer token staat, anders krijg je de error: 
{
    "error": "Geen token, toegang geweigerd"
}

hieronder volgen voorbeelden van requests in postman.
dit is een link die je kan gebruiken om signs in de database te zetten, maak een POST request met de volgende link: http://localhost:8000/signs?
ga naar body -> x-www-form-urlencoded
en zet de volgende erin
Key     Value
method SEED
amount 300
reset TRUE

dit is een link die je kan gebruiken voor een GET met shuffle van les 1: 
http://localhost:8000/signs/filtered?lesson=1&method=SHUFFLE

dit is een link die je kan gebruiken voor een GET van alle items: 
http://localhost:8000/signs


voer de volgende request met een PUT
http://localhost:8000/signs/*id*
zet op de plek van id een id van een bestaand item.
vervolgens kan je in de body -> x-www-form-urlencoded items zoals hieronder neerzetten om het opgegeven item te editen
Key         Value
translation afwezig
lesson      4

voor een DELETE uit door voor het DELETE request te kiezen en de volgende link erbij te zetten.
http://localhost:8000/signs/*id*

om een logincode te genereren gebruik de POST request:
http://localhost:8000/logincodesga naar body -> x-www-form-urlencoded
en zet de volgende erin
Key     Value
method  RANDOM
```
