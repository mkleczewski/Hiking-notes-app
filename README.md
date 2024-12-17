# Projekt zespołowy Grupa 2

## Opis projektu

Zrealizowany przez:

- Mateusz Bryl
- Hubert Grzesiak
- Szymon Grzesiak
- Marcin Kleczewski 👑
- Szymon Kolański

## Rozpoczęcie pracy

Te instrukcje pozwolą Ci na skopiowanie projektu i uruchomienie go na lokalnej maszynie do celów rozwojowych i testowych. Zapoznaj się z notatkami o wdrożeniu, aby dowiedzieć się, jak uruchomić projekt na żywym systemie.

### Wymagania wstępne

- Node.js (preferowana najnowsza stabilna wersja)
- npm (zwykle jest instalowany razem z Node.js)

### Instalacja

1. Sklonuj repozytorium:
   ```sh
   git clone git@gitlab.com:praca-zespo-owa/front.git
   ```
2. Przejdź do folderu projektu:
   ```sh
   cd front
   ```
3. Zainstaluj zależności projektu:
   ```sh
   npm install
   ```
4. Prisma:
   ```sh
   npx prisma generate
   ```

## Uruchamianie aplikacji

Aby uruchomić aplikację w trybie deweloperskim, wykonaj:

```sh
npm run dev

```

Aplikacja będzie dostępna pod adresem http://localhost:3000.

### Proces pracy nad projektem

1. Tworzenie ticketów na YouTrack.

2. Tworzenie nowego brancha na lokalnym repo o nazwie ticketu, np. FE-1:

```sh
git checkout main
git pull
git checkout -b FE-1

```

3. Po zakończeniu pracy i chęci commitowania zmian:

```sh
git add .
git commit -m "FE-1, krótki opis zmian po angielsku"
git push
```

4. Następnie, na GitLabie, robisz merge request do brancha main.

5. Na YouTrack przerzucasz ticket na kogoś do code review (CR).

### Licencja

Ten projekt jest objęty licencją MIT - szczegóły znajdziesz w pliku LICENSE.md.
