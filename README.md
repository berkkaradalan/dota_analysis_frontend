# Dota Analysis Frontend

Dota Analysis Frontend is the frontend of **Dota Analysis Backend**. It allows users to view their profile information, most played heroes, and match history.

### Live Demo
https://dotaanalysisfrontend-production.up.railway.app


## Features
- **User Card:** Displays user ID, last login, and username.
- **Most Played Heroes:** Lists the top 3 most played heroes by the user.
- **Match History:** Shows the user's recent matches.
- **Match Details:** 
  - **Performance:** KDA, level, net worth, GPM, XPM
  - **Impact:** Hero and tower damage, healing
  - **Farming:** Last hits, denies, gold spent
  - **Items & Abilities:** Items acquired and ability upgrades
  - **General Info:** Match duration, game mode, result

## Installation & Running

To start the project:

```bash
npm install
npm start
```

## Using Docker
### Example Build:
```bash
docker build -t data_analysis_frontend .
```
### Example Run:
```bash
docker run -d -p 4173:4173 -e VITE_API_BASE_URL="dota_analysis_backend:8000" --name dota_analysis_frontend --network dota_network data_analysis_frontend
```

## Images
![alt text](/images/frontend1.png)
![alt text](/images/frontend2.png)