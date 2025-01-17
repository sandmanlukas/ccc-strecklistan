## Välkommen till CCCs Strecklista.
Strecklistan är tänkt att användas med hjälp av en streckkodläsare och är uppsatt i Källarn. Denna strecklista byggdes då jag (Ricky) tröttnat på lappar som sitter på kylen som bara blir blöta och går sönder.


## Setup
Installera alla dependencies, se till att ha node (>= 18.0) och yarn installerat först.

```bash
yarn install
```

För att kunna connecta till databaserna så måste du ha `.env` filen med alla env-variabler på toppnivå i repot. Hör av dig till Ricky eller Bits om du vill ha denna.

Detta projekt är byggt med Next.js så backend och frontend körs i samma repo/mapp, så för att starta strecklistan lokalt så är det bara att köra.

```bash
yarn dev
```

Gå sedan till [http://localhost:3000](http://localhost:3000) för att se strecklistan lokalt. Hör av dig till NS om du behöver inloggen.

För att få lite fejk-data och fejk-användare kan man köra, om man vill ändra vad som skapas i seedingen så kan man ändra i `seed.ts` filen.

```bash
yarn prisma db seed
```

## Deploys

Strecklistan är hostad på [https://strecklistan.ccc.tools](http://strecklistan.ccc.tools), och all CI/CD och deploymednt sköts genom Vercel, tyvärr så kan man inte ha teams eller fler än en person per projekt om man inte betalar för Vercel så tyvärr sköts allt av Ricky. Databaserna är också hostade genom Vercel.


Vercel kommer automatisk deploya vid varje push till main, så vid utveckling så rekommenderas att skapa en egen branch för att säkerställa att allt fungerar innan denna mergas in i main.

Se också till att `yarn build` inte ger några fel innan merge till main.

## Databaser
Databasen som hanterar alla transaktioner, användare, inventarie, etc är en Postgres databas och vi använder oss av Prisma för all kommunikation med databasen.

Vi har även ett blob-storage på Vercel som vi använder för att lagra alla profilbilder, etc.

## Utveckling
Om du vill utveckla ny streck-baserad funktionalitet så behövs en streckkodsläsare, om det inte är typ byggvecka så kan antagligen streckkodsläsarna som används till Blippsystemet användas för detta. Fråga sittande CCC snällt bara.

