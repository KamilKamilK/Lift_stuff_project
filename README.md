# 🏋️‍♂️ Rep Log App

Aplikacja do rejestrowania treningów siłowych – tworzona w **Symfony** z użyciem **jQuery** i **AJAX**.  
Umożliwia dodawanie, przeglądanie i usuwanie rekordów z treningu oraz automatyczne obliczanie całkowitego ciężaru.

---

## 📋 Spis treści

1. [Opis projektu](#-opis-projektu)
2. [Funkcjonalności](#-funkcjonalności)
3. [Stack technologiczny](#-stack-technologiczny)
4. [Instalacja i uruchomienie](#️-instalacja-i-uruchomienie)
5. [Struktura aplikacji](#-struktura-aplikacji)
6. [API](#-api)
7. [Walidacja i obsługa błędów](#-walidacja-i-obsługa-błędów)
8. [Przykładowe zrzuty ekranu](#-przykładowe-zrzuty-ekranu)
9. [Autor i cel projektu](#-autor-i-cel-projektu)
10. [Licencja](#-licencja)

---

## 🧠 Opis projektu

**Rep Log App** to prosta aplikacja webowa, która pozwala użytkownikowi zapisywać i analizować swoje wyniki treningowe.  
Projekt został stworzony jako ćwiczenie z integracji **Symfony (backend)** z **JavaScript/jQuery (frontend)** przy użyciu REST API i asynchronicznych żądań AJAX.

---

## ⚙️ Funkcjonalności

- ➕ Dodawanie nowych rekordów (ćwiczenie + liczba powtórzeń)
- 📊 Automatyczne obliczanie sumarycznego ciężaru
- 🗑️ Usuwanie wpisów bez przeładowania strony (AJAX)
- 📈 Leaderboard prezentujący wyniki
- 🚨 Walidacja formularza z komunikatami błędów
- 💾 Dane zapisywane w bazie danych użytkownika
- 🔄 Dynamiczne odświeżanie tabeli i sumy ciężaru

---

## 🧩 Stack technologiczny

| Warstwa | Technologia                                                                                                 |
|----------|-------------------------------------------------------------------------------------------------------------|
| **Backend** | [Symfony 7.3](https://symfony.com/)                                                                        |
| **Frontend** | [Twig](https://twig.symfony.com/), [jQuery](https://jquery.com/), [Underscore.js](https://underscorejs.org/) |
| **Routing JS** | [FOSJsRoutingBundle](https://github.com/FriendsOfSymfony/FOSJsRoutingBundle)                                |
| **Baza danych** | Doctrine ORM (MySQL)                                                                   |
| **UI / CSS** | [Bootstrap 5](https://getbootstrap.com/)                                                                    |
| **AJAX** | JSON API (Symfony + jQuery)                                                                                 |

---

## 🛠️ Instalacja i uruchomienie

### 1️⃣ Sklonuj repozytorium
```bash
git clone https://github.com/yourusername/replog-app.git
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
- Inputy z błędami są oznaczane na czerwono (`border-color: #dc3545;`), a komunikaty błędów pojawiają się poniżej pól.

---

## 👨‍💻 Cel projektu

Projekt został stworzony przez w ramach nauki **Symfony, AJAX i integracji frontendu z backendem**.

Celem było zrozumienie:
- komunikacji między frontendem a API REST,
- obsługi JSON w Symfony,
- zarządzania stanem po stronie frontendu (bez frameworka SPA),
- walidacji danych i UX formularzy.

---

> 💡 **Tip:**  
> Ten projekt może posłużyć jako przykład aplikacji CRUD w portfolio lub jako baza do nauki React / Vue – wystarczy przepisać część frontendową w nowym frameworku.
