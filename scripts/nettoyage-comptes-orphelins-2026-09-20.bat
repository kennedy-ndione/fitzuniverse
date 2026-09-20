@echo off
setlocal enabledelayedexpansion
set PROJECT=scholarbridge-e0d84
set FIREBASE=%~dp0..\node_modules\.bin\firebase

echo ===============================================================
echo  Nettoyage Firestore - documents users/{uid} orphelins
echo  (comptes Authentication deja supprimes le 20 septembre 2026)
echo  24 documents au total - suppression recursive (avec sous-collections)
echo ===============================================================
echo.
echo Comptes CONSERVES (ne figurent pas dans cette liste) :
echo   - charlendione30@gmail.com (toi)
echo   - rayndione30@gmail.com
echo   - papaaronasagna52@gmail.com
echo.
pause

echo.
echo --- Groupe 1 : 17 fiches vides (jamais completees) ---
for %%U in (
  0GzYk0L7QmRrqLRjpWO9GzBNtxI2
  3DoN6UeZ7SNTv3ABAChXftVyeBo2
  CFKPpjJf2AQpIsYavKylbrZWZRy1
  GmlhBDPRH0R73fgb16HAHAzsq653
  KBKvaqqw5La5GfrsjDDHFM3mivn1
  NHlNyaIVHIMunjMsRHvOGuckdLC3
  OVaoqUo8pHU7NFzTF16xEtyHmMP2
  RhSXoN8KlJSIrFOy877JJoqr3Rm2
  YQ9RR9HUp2YCvKEzDkcgZ3JNPrp1
  hFbZX6OE3kNqy3uJzAOwdJ3cmb92
  inrqo7IYwIPpZNXyHfAiVPNmg7r2
  k4MbKycaCzfjb3CrGxgThsXikOx1
  lc2LKIiJ2CYOrVUs6CJgy3B95RI3
  pJZvyxKSuMc8bq2JnqrsX7kX5Jw2
  pxgS2ODSiUegJGc8Z17J7PZDKCa2
  q4gqncb8ZCaAXmtGny6G6CXJC8N2
  tKFZ7Tiv2Ke20OwEAX0WqKN6Czn1
) do (
  echo Suppression de users/%%U ...
  call "%FIREBASE%" firestore:delete users/%%U --recursive -y --project %PROJECT%
)

echo.
echo --- Groupe 2 : 3 comptes de test explicites ---
for %%U in (
  G9JAtinWcebjh8PysNzRQLOqI9B3
  bicADeR9nPdWCu37hMg3cf22BUo2
  pvVPP9rXmbQfkRy95jqkzHkot8p1
) do (
  echo Suppression de users/%%U ...
  call "%FIREBASE%" firestore:delete users/%%U --recursive -y --project %PROJECT%
)

echo.
echo --- Groupe 3 : 4 comptes "Angelique Ndour / Salimata Diouf" (confirmes par toi) ---
for %%U in (
  Bf6IS7TsW4UbPBcZzxURLT2kcMs2
  Pq7IxP8IBReckcazfoZaKGVhBEs2
  gc8jOBKilRVp1tKCLbjHyjipSOu2
  pseohTA993QDV4uVFOmKts9vKg82
) do (
  echo Suppression de users/%%U ...
  call "%FIREBASE%" firestore:delete users/%%U --recursive -y --project %PROJECT%
)

echo.
echo ===============================================================
echo  Termine. Verifie dans la console Firebase que la collection
echo  users ne contient plus que 3 documents.
echo ===============================================================
pause
