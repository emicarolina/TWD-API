# 🧟 The Walking Dead API

- Uma API REST pública e gratuita com informações sobre personagens e episódios da série The Walking Dead (2010–2022).

- Sem necessidade de autenticação, totalmente aberta e pronta para uso em projetos, estudos ou integrações.
  
> Esta API é somente leitura.
> Não há suporte para criação, edição ou exclusão de dados.

## 📌 Base URL

https://api-twd.vercel.app/api

## ⚡ Endpoints

### 👥 Personagens

| Parâmetro |  Tipo  | Descrição                                |
| --------- | ------ | -----------------------------------------
| page      | number | Página atual (padrão: 1)                 |
| limit     | number | Itens por página (padrão: 12, max: 100)  |
| name      | string | Filtrar por nome (case-insensitive)      |
| status    | string | Filtrar por status (alive ou deceased)   |

### Exemplo de resposta:
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
### Exemplos de uso:
### Todos os personagens
- GET `/api/characters?limit=100`

### Personagens da primeira página
- GET `/api/characters`

### Página específica
- GET `/api/characters?page=2`

### Buscar por nome
- GET `/api/characters?name=rick`

### Filtrar por status
- GET `/api/characters?status=alive`

### Combinar filtros
- GET `/api/characters?status=deceased&limit=20`

### Buscar personagem por ID
- GET `/api/characters/1`

### Exemplo de resposta:
```
{
  "id": 1,
  "name": "Rick Grimes",
  "status": "alive",
  "firstAppeared": 1,
  "image": "/images/rick.webp"
}
```
# 📺 Episódios

| Parâmetro |  Tipo  | Descrição                    |
| --------- | ------ | -----------------------------
| season    | number | Filtrar por temporada (1-11) |

### Todos os episódios
- GET `/api/episodes`

**Retorna:** Array com todos os 177 episódios da série.

### Exemplo de resposta:
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
### Episódios por temporada
GET `/api/episodes?season=1`

### Buscar episódio por ID 
GET `/api/episodes/1`

### Exemplo de resposta:
```
{
  "id": 1,
  "season": 1,
  "number": 1,
  "title": "Days Gone Bye",
  "summary": "Rick acorda em um hospital e descobre que o mundo foi devastado por mortos-vivos."
}
```
# 🖼️ Imagens

#### **GET** `/images/:filename.webp`
Retorna a imagem do personagem em formato **_.webp_**, por exemplo:

https://api-twd.vercel.app/images/rick.webp

### Notas:

- Apenas arquivos .webp são permitidos
- Cache habilitado (7 dias)
- Retorna 404 se a imagem não existir

# 💓 Health Check

Verifica se a API está online.

GET `/api/health`

### Exemplo de resposta:
```
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```
# 🏓 Ping

Endpoint simples para testar conectividade.

GET `/api/ping`

### Exemplo de resposta:
```
{
  "message": "API is awake!"
}
```
# 💡 Exemplos de Uso

1) JavaScript (Fetch API)
```
// Buscar todos os personagens vivos
async function getAliveCharacters() {
  const response = await fetch('https://api-twd.vercel.app/api/characters?status=alive');
  const data = await response.json();
  console.log(data.results);
}

// Buscar personagem específico
async function getCharacter(id) {
  const response = await fetch(`https://api-twd.vercel.app/api/characters/${id}`);
  const character = await response.json();
  console.log(character);
}

// Buscar episódios de uma temporada específica
async function getSeasonEpisodes(season) {
  const response = await fetch(`https://api-twd.vercel.app/api/episodes?season=${season}`);
  const episodes = await response.json();
  console.log(episodes);
}
```

2) Python (Requests)
```
import requests

# Buscar personagens
response = requests.get('https://api-twd.vercel.app/api/characters')
data = response.json()
print(data['results'])

# Buscar por nome
response = requests.get('https://api-twd.vercel.app/api/characters?name=Daryl')
data = response.json()
print(data['results'])

# Buscar episódios
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

# 🌐 CORS

A API possui CORS habilitado, permitindo requisições de qualquer origem.

# ⚡ Rate Limiting

A API possui limitação de taxa para garantir disponibilidade:

- Limite: 1000 requisições por 10 minutos por IP
  
### Headers de resposta:

- X-RateLimit-Limit: Limite total
- X-RateLimit-Remaining: Requisições restantes
- X-RateLimit-Reset: Timestamp de reset

# 📋 Códigos de Status
| Código |  Descrição                                  |
| ------ | -------------------------------------------
| 200    | Sucesso                                     |
| 400    | Requisição inválida (parâmetros incorretos) |
| 404    | Recurso não encontrado                      |
| 429    | Rate limit excedido                         |
| 500    | Erro interno do servidor                    |

# 📦 Estrutura de Erros
Todos os erros retornam um objeto JSON no seguinte formato:
```
{
  "error": "Tipo do erro",
  "message": "Descrição detalhada do erro"
}
```
# 🛠️ Tecnologias

- Node.js - Runtime JavaScript
- Express - Framework web
- Express Rate Limit - Controle de taxa
- CORS - Habilitação de requisições cross-origin
- Vercel - Hospedagem e deploy

# 📊 Dados Disponíveis

### Estatísticas

- 49 personagens principais
- 177 episódios (Temporadas 1-11)
- Imagens em formato WebP otimizado
  
### Status dos Personagens

- alive - Personagem vivo
- deceased - Personagem morto

# 🔧 Executar Localmente

Pré-requisitos:

- Node.js >= 18.x
- npm ou yarn

Instalação:
```
# Clone o repositório
git clone https://github.com/emicarolina/api-twd.git

# Entre na pasta
cd api-twd

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Ou em produção
npm start
```
A API estará disponível em **http://localhost:3000**

# 📝 Estrutura do Projeto
```
api-twd/
├── api/
│   ├── index.js          # Servidor Express principal
│   └── images.js         # Handler de imagens
├── routes/
│   ├── characters.js     # Rotas de personagens
│   └── episodes.js       # Rotas de episódios
├── public/
│   └── images/          # Imagens dos personagens
├── data.json            # Banco de dados JSON
├── package.json
├── vercel.json          # Configuração Vercel
└── README.md
```

# 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1) Fazer fork do projeto
2) Criar uma branch para sua feature (git checkout -b feature/NovaFeature)
3) Commit suas mudanças (git commit -m 'Add: Nova feature')
4) Push para a branch (git push origin feature/NovaFeature)
5) Abrir um Pull Request

### Ideias de contribuição
- [ ] Adicionar mais personagens
- [ ] Incluir informações de personagens
- [ ] Adicionar citações memoráveis
- [ ] Relacionamentos entre personagens

# Fim :)
### Feito com ❤️ por Emilly. Desenvolvido em 2025.

