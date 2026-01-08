# Biblioteca Pessoal

CRUD simples para organizar livros em 3 status:
* Vou ler
* Estou lendo
* Já li

Stack: HTML, CSS, Bootstrap 5, JavaScript, JSON Server.

## Estrutura
```
biblioteca/
  index.html
  styles.css
  app.js
  db.json
  package.json
```

## Requisitos
* Node.js + npm

## Como executar

1) Instalar dependências
```bash
npm install
```

2) Subir a API (JSON Server)
```bash
npm run api
```
API: http://localhost:3000/books

3) Abrir o frontend (use servidor local)

Opção A (VS Code):
* Instale a extensão Live Server
* Clique com o botão direito em `index.html`
* Open with Live Server

## Se der erro “Falha ao buscar livros”
* Confirme que `npm run api` está rodando
* Teste a API: http://localhost:3000/books
* Não abra o HTML com duplo clique, use Live Server ou `npx serve`

## Scripts
```bash
npm run api
```


# Evolução do Projeto
* Usar uma API real para buscar as informçaões dos livros: https://openlibrary.org/developers/api