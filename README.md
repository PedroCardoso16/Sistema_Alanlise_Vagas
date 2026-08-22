# Sistema de análise de vagas

Sistema que coleta, processa e analisa vagas de emprego, unindo engenharia de dados e análise de dados, com os resultados apresentados em um dashboard.

Documentação completa (stack, escopo e casos de uso) em [`docs/escopo-e-casos-de-uso.md`](./docs/escopo-e-casos-de-uso.md).

## Estrutura do repositório

```
sistema-analise-vagas/
├── frontend/          # Dashboard (React) — construído em conjunto
├── backend/            # API (FastAPI) — construído em conjunto
├── data-engineering/    # Coleta, pipeline, orquestração
├── data-analysis/       # Exploração, NLP, métricas
└── docs/                 # Escopo, casos de uso e demais documentos
```

## Divisão de responsabilidades

| Área | Responsável | Casos de uso |
|---|---|---|
| Engenharia de dados | Integrante A | UC01, UC02 |
| Análise de dados | Integrante B | UC03 |
| Backend e frontend | Ambos | UC04, UC05 |

## Fluxo de trabalho (Git)

- `main`: branch estável, protegida.
- `dev`: branch de integração.
- Branches de feature a partir de `dev`: `feat/nome-da-tarefa`.
- Todo merge para `dev`/`main` passa por Pull Request com revisão do outro integrante.

## Como rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

Os passos de backend, coleta e pipeline serão adicionados aos respectivos READMEs conforme forem implementados.
