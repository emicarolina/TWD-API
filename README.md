# 🧟 The Walking Dead API

- A **public and free REST API** with information about characters and episodes from *The Walking Dead* TV series (2010–2022).
- No authentication required — fully open and ready to be used in projects, studies, or integrations.
  
> This API is **read-only**.  
> There is no support for creating, updating, or deleting data.

## Base URL

https://api-twd.vercel.app/api

## Endpoints

### Characters

| Parameter |  Type  | Description                            |
| --------- | ------ | ---------------------------------------
| page      | number | Current page (default: 1)              |
| limit     | number | Items per page (default: 12, max: 100) |
| name      | string | Filter by name (case-insensitive)      |
| status    | string | Filter by status (alive or deceased))  |

### Example response:
```
{
  "info": {
    "items": 49,
    "pages": 5,
    "next": "/api/characters?page=2&limit=12",
    "prev": null
  },
  "results": [
    {
      "id": 1,
      "name": "Rick Grimes",
      "status": "alive",
      "firstAppeared": 1,
      "image": "/images/rick.webp"
    }
  ]
}
```
## Usage examples:
### All characters
- GET `/api/characters?limit=100`

### First page characters
- GET `/api/characters`

### Specific page
- GET `/api/characters?page=2`

### Search by name
- GET `/api/characters?name=rick`

### Filter by status
- GET `/api/characters?status=alive`

### Combine filters
- GET `/api/characters?status=deceased&limit=20`

### Get character by ID
- GET `/api/characters/1`

### Example response:
```
{
  "id": 1,
  "name": "Rick Grimes",
  "status": "alive",
  "firstAppeared": 1,
  "image": "/images/rick.webp"
}
```
# Episodes

| Parameter |  Type  | Description             |
| --------- | ------ | ------------------------
| season    | number | Filter by season (1–11) |

### All episodes
- GET `/api/episodes`

**Returns:** An array with all 177 episodes from the series.

### Example response:
```
[
  {
    "id": 1,
    "season": 1,
    "number": 1,
    "title": "Days Gone Bye",
    "summary": "Rick acorda em um hospital e descobre que o mundo foi devastado por mortos-vivos."
  },
  {
    "id": 2,
    "season": 1,
    "number": 2,
    "title": "Guts",
    "summary": "Rick e Glenn elaboram um plano arriscado para escapar dos walkers em Atlanta."
  }
]
```
### Episodes by season
GET `/api/episodes?season=1`

### Get episode by ID
GET `/api/episodes/1`

### Example response:
```
{
  "id": 1,
  "season": 1,
  "number": 1,
  "title": "Days Gone Bye",
  "summary": "Rick acorda em um hospital e descobre que o mundo foi devastado por mortos-vivos."
}
```
# Images
#### **GET** `/images/:filename.webp`
Returns the character image in **_.webp_**, for example:

https://api-twd.vercel.app/images/rick.webp

### Notes:
- Only **_.webp_** files are supported
- Cache enabled (7 days)
- Returns 404 if the image does not exist

# 💓 Health Check
Checks whether the API is online.

GET `/api/health`

### Example response:
```
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```
# 🏓 Ping
Simple endpoint to test connectivity.

GET `/api/ping`

### Example response:
```
{
  "message": "API is awake!"
}
```
# Usage Examples

1) JavaScript (Fetch API)
```
// Fetch all alive characters
async function getAliveCharacters() {
  const response = await fetch('https://api-twd.vercel.app/api/characters?status=alive');
  const data = await response.json();
  console.log(data.results);
}

// Fetch a specific character
async function getCharacter(id) {
  const response = await fetch(`https://api-twd.vercel.app/api/characters/${id}`);
  const character = await response.json();
  console.log(character);
}

// Fetch episodes from a specific season
async function getSeasonEpisodes(season) {
  const response = await fetch(`https://api-twd.vercel.app/api/episodes?season=${season}`);
  const episodes = await response.json();
  console.log(episodes);
}
```

2) Python (Requests)
```
import requests

# Fetch characters
response = requests.get('https://api-twd.vercel.app/api/characters')
data = response.json()
print(data['results'])

# Search by name
response = requests.get('https://api-twd.vercel.app/api/characters?name=Daryl')
data = response.json()
print(data['results'])

# Fetch episodes
response = requests.get('https://api-twd.vercel.app/api/episodes?season=1')
episodes = response.json()
for episode in episodes:
    print(f"S{episode['season']}E{episode['number']}: {episode['title']}")
```
3) React
```
import { useState, useEffect } from 'react';

function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api-twd.vercel.app/api/characters')
      .then(res => res.json())
      .then(data => {
        setCharacters(data.results);
        setLoading(false);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {characters.map(char => (
        <div key={char.id}>
          <img src={`https://api-twd.vercel.app/${char.image}`} alt={char.name} />
          <h3>{char.name}</h3>
          <p>Status: {char.status}</p>
        </div>
      ))}
    </div>
  );
}
```

# CORS
CORS is enabled, allowing requests from any origin.

# Rate Limiting
Rate limiting is enabled to ensure API availability:
- Limit: 1000 requests per 10 minutes per IP
  
### Response headers:
- X-RateLimit-Limit: Total request limit
- X-RateLimit-Remaining: Remaining requests
- X-RateLimit-Reset: Reset timestamp

# Status Codes
| Code   |  Description                     |
| ------ | ---------------------------------
| 200    | Success                          |
| 400    | Bad request (invalid parameters) |
| 404    | Resource not found               |
| 429    | Rate limit exceeded              |
| 500    | Internal server error            |

# Error Structure
All errors return a JSON object in the following format:
```
{
  "error": "Error type",
  "message": "Detailed error description"
}
```
# Technologies
- Node.js
- Express
- Express Rate Limit
- CORS
- Vercel (deployment)

# Available Data
### Statistics
- 49 main characters
- 177 episodes (Seasons 1–11)
- Optimized WebP images
  
### Character Status
- alive - Alive character
- deceased - Deceased character

# Running Locally
Requirements:
- Node.js >= 18.x
- npm ou yarn

Installation:
```
# Clone the repository
git clone https://github.com/emicarolina/api-twd.git

# Enter the project folder
cd api-twd

# Install dependencies
npm install

# Run in development mode
npm run dev

# Or run in production
npm start
```
The API will be available at **http://localhost:3000**

# Project Structure
```
api-twd/
├── api/
│   ├── index.js          # Main Express server
│   └── images.js         # Image handler
├── routes/
│   ├── characters.js     # Character routes
│   └── episodes.js       # Episode routes
├── public/
│   └── images/          # Character images
├── data.json            # JSON database
├── package.json
├── vercel.json          # Vercel configuration
└── README.md
```

# Contributing
Contributions are welcome! Feel free to:

1) Fork the project
2) Create a feature branch (git checkout -b feature/NewFeature)
3) Commit your changes (git commit -m 'Add: new feature')
4) Push to the branch (git push origin feature/NewFeature)
5) Open a Pull Request

### Contribution ideas
- [ ] Add more characters
- [ ] Include additional character details
- [ ] Add memorable quotes
- [ ] Character relationships

## Made with ❤️ by Emilly. Developed in 2025.

