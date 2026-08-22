# Backend

API do sistema de análise de vagas, responsável por expor os dados e métricas processados para o frontend consumir.

- **Stack sugerida**: FastAPI (Python)
- **Responsabilidade**: receber requisições do frontend, consultar o banco analítico (PostgreSQL) e retornar vagas, métricas e resultados filtrados
- **Construído em conjunto** pelos dois integrantes do projeto

Ver `docs/escopo-e-casos-de-uso.md` para o detalhamento completo de UC04 e UC05, que envolvem diretamente esta camada.

## Como rodar (a preencher conforme o setup avançar)

```bash
# cd backend
# python -m venv .venv
# source .venv/bin/activate
# pip install -r requirements.txt
# uvicorn main:app --reload
```
