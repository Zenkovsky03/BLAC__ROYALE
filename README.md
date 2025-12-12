# Internetowe Kasyno

> **Motto projektu:** *„Dzisiaj w Betlejem, jutro Bentleyem”* 🚗💨  
> Platforma rozrywkowa online oferująca proste gry losowe i zręcznościowe dla pełnoletnich użytkowników.  
> Każdy znajdzie coś dla siebie — od klasycznej ruletki po dynamiczny coinflip!

---

<p align="center">
  <img src="./design/logo_prototype.jpeg" alt="kasyno logo" width="300">
</p>




## Opis projektu

**Internetowe Kasyno** to aplikacja webowa umożliwiająca użytkownikom grę w różne mini-gry oparte na losowości i zręczności.  
Celem projektu jest stworzenie bezpiecznego, intuicyjnego i atrakcyjnego środowiska do rozgrywki online z zachowaniem zasad fair play.

Projekt ma charakter **edukacyjny i demonstracyjny** – nie służy do prawdziwego hazardu.

---

## Zakres MVP (Minimum Viable Product)


### Rejestracja i logowanie
- Tworzenie nowego konta użytkownika  
- Logowanie z wykorzystaniem hasła (opcjonalnie 2FA)  
- Weryfikacja pełnoletności

### Zarządzanie kontem użytkownika
- Edycja danych profilu  
- Zmiana hasła  
- Podgląd historii gier i transakcji  

### Portfel i saldo użytkownika
- Wirtualna waluta (MufaCOIN)  
- Doładowanie i wypłata środków (symulacja)  
- Historia transakcji  

### Rozgrywka – proste gry
Dostępne mini-gry w wersji MVP:
- 🎲 **Ruletka** – klasyczna europejska ruletka z jednym zerem  
- 💣 **Saper** – gra logiczno-losowa z możliwością wygrania punktów  
- 🎰 **Slot** – automat z symbolami (trzy bębny, system nagród)  
- 🎯 **Suwak** – gra refleksu i precyzji  
- 🪙 **Coinflip** – rzut monetą: orzeł czy reszka?

### Bezpieczeństwo
- Szyfrowanie haseł
- Walidacja danych użytkownika  
- Sesje z tokenami JWT  

### System rankingowy
- Tabela najlepszych graczy (tygodnia?)
- Punkty rankingowe zależne od aktywności i wygranych  
- Odznaki i poziomy prestiżu  

---

## Technologia

| Warstwa | Technologia |
|----------|--------------|
| Frontend | Vue |
| Backend  | Node.js (Express) |
| Baza danych |  PostgreSQL |
| ORM | Prisma |
| Dokumentacja | Swagger UI |


---

## Backend - Instrukcja uruchomienia
Aby poprawnie uruchomić serwer lokelnie, wykonaj poniższe kroki w głównym katalogu projektu.

### 1. Instalacja zależności
    npm install

### 2. Konfiguracja zmiennych środowiskowych (.env)
Utwórz plik .env w głównym katalogu (tam gdzie package.json) i uzupełnij go według wzoru:

    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    JWT_SECRET="twoj_tajny_klucz_jwt"

### 3. Baza danych (Prisma)
Synchronizacja schematu bazy danych (tworzenie tavel) oraz generowanie klienta Prisma.
**Uwaga:** Plik schematu znajduje się w folderze backend/prisma/

Wpisz następujące komendy do terminala:

  #### Generowanie klienta (wymagane przy pierwszym uruchomieniu)
    npx prisma generate --schema ./backend/prisma/schema.prisma

  #### Wypchnięcie zmian do bazy danych
    npx prisma db push --schema ./backend/prisma/schema.prisma

### 4.Uruchomienie serwera
Uruchom backend w trybie developerskim (z automatycznym restartem nodemon):

    npm run backend

Po wpisaniu komendy powinno wypisać adres serwera i dokumentacji API np.

Server running on http://localhost:8000  
API Documentation available at http://localhost:8000/docs

**Uwaga:** Backend domyślnie uruchamia się na porcie **8000**. Jeśli chcesz zmienić port, ustaw odpowiednią zmienną środowiskową w pliku `.env`.

## Dokumentacja API
Projekt posiada automatycznie generowaną dokumentację endpointów (Swagger).
Po uruchomieniu serwera wejdź na adres z dopiskiem `/docs` w adresie, np.:

http://localhost:8000/docs

### Opis endpointów

#### Roulette
- `POST /api/games/play-roulette` – Gra w ruletkę

#### Coin Flip
- `POST /api/games/play-coin-flip` – Gra w orzeł czy reszka

#### Slots
- `POST /api/games/play-slots` – Gra na automacie

#### Slider
- `POST /api/games/play-slider` – Gra na suwaku

#### Rankings
- `GET /api/ranking/{period}` – Ranking graczy (wg wygranych)

#### Sapper Game
- `POST /api/Sapper/start-sapper` – Rozpocznij nową grę Saper
- `POST /api/Sapper/play-sapper` – Wykonaj ruch w Saperze
- `POST /api/Sapper/resign-sapper` – Zakończ grę Saper

#### Users
- `GET /api/users/profile` – Pobierz profil użytkownika
- `POST /api/users/register` – Rejestracja
- `POST /api/users/login` – Logowanie
- `GET /api/users/is-authenticated` – Sprawdź autoryzację
- `PATCH /api/users/update-username` – Zmień nazwę użytkownika

#### Wallet
- `GET /api/wallet/get-wallet` – Pobierz portfel
- `POST /api/wallet/deposit` – Dodaj środki do portfela
- `POST /api/wallet/withdraw` – Wypłać środki z portfela

#### General
- `GET /` – Endpoint powitalny


## Struktura katalogów (Backend)
- **backend/src/Controllers** - Logika biznesowa gier i użytkowników.
- **backend/src/Routes** - Definicje ścieżek URL.
- **backend/src/Middlewares** - Weryfikacja JWT i walidacja.
- **backend/prisma/schema.prisma** - Struktura bazy danych.