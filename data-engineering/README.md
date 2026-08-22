# Data engineering

Coleta, pipeline e armazenamento das vagas de emprego.

- **Stack sugerida**: Python (coleta), Airflow/Prefect (orquestração), MinIO + Parquet (raw), PostgreSQL + dbt (camada analítica)
- **Responsabilidade**: scripts de coleta (APIs/scraping), pipeline ETL, qualidade e versionamento dos dados
- **Casos de uso relacionados**: UC01 (coletar vagas) e UC02 (processar e padronizar dados) — ver `docs/escopo-e-casos-de-uso.md`

## Estrutura sugerida (a evoluir)

```
data-engineering/
├── coleta/        # scripts de coleta por fonte
├── pipeline/       # ETL, transformações, dbt
└── requirements.txt
```
