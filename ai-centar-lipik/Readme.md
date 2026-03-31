# AI Centar Lipik

Pomoć za postavljanje razvojnog okruženja i pokretanje aplikacija.

## Kreiranje virtualnog okruženja

Nije potrebno stvarati okruženja za svaku novu vježbu, možete koristiti isto virtualno okruženje za sve vježbe. 

1. Kreirajte virtualno okruženje:
   ```bash
   python -m venv .venv
   ```
   Naziv direktorija je proizvoljan, no najčešće se koristi `.venv`.
   
2. Aktivirajte virtualno okruženje:
   - Na Windowsu:
     ```cmd
     .venv\Scripts\activate
     ```
    
   - Na Unix/Linux/MacOS:
     ```bash
     source .venv/bin/activate
     ```
     
3. Instalirajte potrebne pakete:
    
   ```bash
   pip install -r requirements.txt
   ```
   Datoteka `requirements.txt` sadrži sve potrebne biblioteke i njihove verzije koje su potrebne za pokretanje aplikacije.
   Dodatne pakete možete instalirati pojedinačno koristeći `pip install <naziv_paketa>`.

## Korištenje virtualnog okruženja

1. Aktivirajte virtualno okruženje (ako već nije aktivirano).
2. Pokrenite aplikaciju:
   ```bash
   python app.py
   ```
   ili putem VS Code-a.

## Struktura
Struktura projekta je organizirana na sljedeći način:
```
|-- Readme.md 
|-- requirements.txt
|-- vjezba1
|   |-- zadatak1.ipynb
|   |-- zadatak2.py
|   |-- automobil.jpg
|-- vjezba2
|   |-- zadatak1.ipynb
|   |-- zadatak2.py
|   |-- semafor.png
```
