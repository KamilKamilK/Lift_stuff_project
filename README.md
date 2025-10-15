# 🏋️‍♂️ Rep Log App

Aplikacja do rejestrowania treningów siłowych – tworzona w **Symfony** z użyciem **jQuery** i **AJAX**.  
Umożliwia dodawanie, przeglądanie i usuwanie rekordów z treningu oraz automatyczne obliczanie całkowitego ciężaru.

---

## 📋 Spis treści

1. [Opis projektu](#-opis-projektu)
2. [Funkcjonalności](#-funkcjonalności)
3. [Nowoczesny JavaScript (ES6)](#-nowoczesny-javascript-es6)
4. [Stack technologiczny](#-stack-technologiczny)
5. [Instalacja i uruchomienie](#️-instalacja-i-uruchomienie)
6. [Struktura aplikacji](#-struktura-aplikacji)
7. [API](#-api)
8. [Walidacja i obsługa błędów](#-walidacja-i-obsługa-błędów)
9. [Dlaczego Babel](#-dlaczego-babel)
8. [Cel projektu](#-autor-i-cel-projektu)


---

## 🧠 Opis projektu

**Rep Log App** to aplikacja webowa do rejestrowania wyników treningowych użytkownika.  
Pozwala zapisywać serie ćwiczeń, liczbę powtórzeń oraz automatycznie oblicza łączny ciężar.

Projekt został stworzony jako ćwiczenie z integracji **Symfony (backend)** i **nowoczesnego JavaScriptu (frontend)**, z wykorzystaniem **AJAX** i **REST API**.

---

## ⚙️ Funkcjonalności
- ➕ Dodawanie nowych rekordów (ćwiczenie + liczba powtórzeń)
- 📊 Automatyczne obliczanie sumarycznego ciężaru
- 🗑️ Usuwanie wpisów bez przeładowania strony (AJAX)
- 📈 Dynamiczne odświeżanie tabeli i sumy ciężaru
- 🚨 Walidacja formularza z komunikatami błędów
- 💾 Dane zapisywane w bazie danych użytkownika
- 🔄 Asynchroniczna komunikacja z API w formacie JSON
- ⚙️ Obsługa błędów sieci i walidacji po stronie frontendowej
- 🧮 Zarządzanie stanem aplikacji po stronie klienta (`Map`, `Helper`, klasy ES6)

---

## ⚡ Nowoczesny JavaScript (ES6)
Projekt wykorzystuje nowoczesne elementy ECMAScript 2015+, w tym:

- `let` i `const` – deklaracje zmiennych z zakresem blokowym
- Template literals (`` `Witaj ${user}` ``) – czytelniejsza interpolacja tekstu
- **Arrow functions** (`()=>{}`) – uproszczone funkcje i automatyczne bindowanie `this`
- **Destructuring** – szybkie wyciąganie właściwości z obiektów i tablic
- **Default parameters** – wartości domyślne w funkcjach
- **Rest / Spread operator (`...`)** – dynamiczne operacje na argumentach i obiektach
- **Klasy ES6 (`class`)** – obiektowość z metodami i dziedziczeniem (`Helper`, `RepLogApp`)
- **Static methods** – np. `Helper._calculateWeight()`
- **Map / WeakMap** – nowe struktury danych do zarządzania stanem (np. `HelperInstances`)
- **Promises** – obsługa AJAX i asynchroniczności bez callbacków
- **Moduły (`import/export`)** – strukturyzacja kodu pod Webpack / Babel

---

## 🧩 Stack technologiczny

| Warstwa | Technologia |
|----------|--------------|
| **Backend** | [Symfony 7.3](https://symfony.com/) |
| **Frontend** | [Twig](https://twig.symfony.com/), [jQuery](https://jquery.com/), [Underscore.js](https://underscorejs.org/) |
| **Routing JS** | [FOSJsRoutingBundle](https://github.com/FriendsOfSymfony/FOSJsRoutingBundle) |
| **Baza danych** | Doctrine ORM (MySQL) |
| **UI / CSS** | [Bootstrap 5](https://getbootstrap.com/) |
| **Bundler** | Webpack Encore + Babel |
| **AJAX / API** | JSON REST API (Symfony + jQuery) |
---

## 🛠️ Instalacja i uruchomienie

### 1️⃣ Sklonuj repozytorium
```bash
git clone https://github.com/KamilKamilK/Lift_stuff_project.git
cd replog-app
```

### 2️⃣ Zainstaluj zależności
```bash
composer install
npm install
npm run build
```

### 3️⃣ Skonfiguruj środowisko
Skopiuj plik `.env`:
```bash
cp .env .env.local
```

Uzupełnij połączenie do bazy danych:
```
DATABASE_URL="mysql://user:password@127.0.0.1:3306/replog"
```

### 4️⃣ Utwórz bazę i migracje
```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

### 5️⃣ Uruchom serwer Symfony
```bash
symfony serve -d
```

Aplikacja będzie dostępna pod adresem:  
👉 [http://localhost:8000](http://localhost:8000)

---

## 🧱 Struktura aplikacji

```
src/
 ├─ Controller/
 │   └─ RepLogController.php   # Logika API
 ├─ Entity/
 │   └─ RepLog.php             # Encja Doctrine
 ├─ Form/
 │   └─ Type/RepLogType.php    # Formularz Symfony
templates/
 └─ lift/
     ├─ index.html.twig        # Główny widok
     ├─ _form.html.twig        # Formularz dodawania
     ├─ _repRow.html.twig      # Szablon wiersza tabeli
     └─ _leaderboard.html.twig # Tablica wyników
assets/js/
 └─ RepLogApp.js               # Główna logika frontendowa (AJAX + DOM)
```

---

## 🌐 API

| Metoda | Endpoint | Opis |
|--------|-----------|------|
| `GET` | `/reps` | Lista wszystkich rekordów użytkownika |
| `POST` | `/reps` | Dodanie nowego wpisu |
| `GET` | `/reps/{id}` | Pobranie jednego rekordu |
| `DELETE` | `/reps/{id}` | Usunięcie rekordu |

Przykładowy `POST /reps`:
```json
{
  "item": "laptop",
  "reps": 10
}
```

Przykładowy `GET /reps`:
```json
{
  "items": [
    {
      "id": 1,
      "itemLabel": "Laptop",
      "reps": 10,
      "totalWeightLifted": 300
    }
  ]
}
```

---

## 🚨 Walidacja i obsługa błędów

- Walidacja wykonywana jest po stronie **Symfony Forms**.
- Błędy są zwracane w formacie JSON i mapowane do pól formularza.
- Dynamiczne podświetlenie błędnych pól (`.has-error`)
- Automatyczne czyszczenie błędów po poprawnym zapisie
- Inputy z błędami są oznaczane na czerwono (`border-color: #dc3545;`), a komunikaty błędów pojawiają się poniżej pól.

---

## 🧰 Dlaczego Babel

Babel umożliwia korzystanie z nowoczesnych funkcji JavaScriptu (ES6+), nawet jeśli przeglądarka ich nie wspiera.  
Dzięki Babel możesz pisać w czystym, nowoczesnym JS, a narzędzie automatycznie transpiluje kod do kompatybilnego ES5.

📦 Instalacja:
```bash
npm install --save-dev @babel/core @babel/preset-env babel-loader
```

Przykład integracji z Webpack Encore:
```js
Encore.configureBabel((config) => {
  config.presets.push('@babel/preset-env');
});
```

---

## 👨‍💻 Cel projektu

Projekt został stworzony przez w ramach nauki **Symfony, AJAX i integracji frontendu z backendem**.

Celem było zrozumienie:
- Integracji **Symfony** z frontendem opartym o **AJAX i JSON API**
- Tworzenia klas ES6 i zarządzania stanem aplikacji w JS
- Obsługi asynchroniczności z wykorzystaniem **Promises**
- Walidacji danych po stronie backendu i ich wizualnego odwzorowania w frontendzie
- Modularnego pisania kodu i pracy z Webpack Encore + Babel
- Wdrażania logiki CRUD z dynamicznym odświeżaniem danych
- Refaktoryzacji starszego kodu JS (jQuery) do składni ES6

---
