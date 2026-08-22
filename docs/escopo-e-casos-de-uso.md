# Sistema de Análise de Vagas
### Documento de Projeto — Stack, Escopo e Casos de Uso

---

## 1. Visão Geral

Sistema que coleta vagas de emprego (TI, mas extensível a outras áreas), processa e armazena esses dados, e gera análises/insights sobre o mercado — tecnologias mais pedidas, faixas salariais, senioridade, localização, tendências ao longo do tempo etc.

O projeto une duas frentes complementares:

- **Engenharia de Dados**: coleta, pipeline, armazenamento, qualidade e disponibilização dos dados.
- **Análise de Dados**: exploração, estatística, NLP e geração de insights a partir dos dados coletados.

Front-end e back-end são construídos em conjunto pelos dois integrantes, como camada de integração entre as duas frentes.

---

## 2. Stack e Ferramentas Recomendadas

### 2.1 Engenharia de Dados (coleta e pipeline)

| Etapa | Ferramenta | Observação |
|---|---|---|
| Coleta (scraping) | Python + `httpx`/`requests`, `BeautifulSoup`, `Playwright` | Playwright para sites com JS dinâmico |
| Coleta (APIs) | Adzuna API, RemoteOK, Arbeitnow, JSearch (RapidAPI) | Fontes com API pública são mais estáveis e evitam problemas de ToS (evite scraping direto de LinkedIn/Indeed) |
| Orquestração | Apache Airflow ou Prefect | Prefect é mais simples para começar; Airflow é mais "peso pesado" e comum no mercado |
| Armazenamento bruto (raw) | Arquivos Parquet + MinIO (S3-compatible, roda em Docker local) | Simula um data lake real sem custo de nuvem |
| Armazenamento processado | PostgreSQL | Também serve como banco analítico |
| Transformação (ETL/ELT) | `pandas` / `Polars` + `dbt` | dbt para modelagem SQL versionada, ótimo para o portfólio |
| Qualidade de dados | Great Expectations (opcional) | Validação de schema e regras de negócio |

### 2.2 Análise de Dados

| Etapa | Ferramenta |
|---|---|
| Exploração | Jupyter Notebook, `pandas`, `numpy` |
| Extração de skills/tecnologias das descrições | `spaCy` ou regras + regex, com evolução para NER customizado |
| Estatística e clustering | `scikit-learn`, `scipy`, `statsmodels` |
| Visualização/BI | Metabase (self-hosted, fácil de subir em Docker) ou Streamlit para dashboards mais customizados |

### 2.3 Backend e Frontend (compartilhado pelos dois)

| Camada | Ferramenta |
|---|---|
| API | FastAPI (Python) — natural para quem já trabalha com Python nas outras frentes |
| Frontend | React + TypeScript, com Recharts ou Chart.js para os gráficos |
| Autenticação (se necessário) | JWT via FastAPI |

### 2.4 Infraestrutura e DevOps

- **Containerização**: Docker + Docker Compose (sobe todo o ambiente local — Postgres, MinIO, Airflow/Prefect, API, front)
- **Versionamento**: Git + GitHub
- **CI/CD**: GitHub Actions (testes automáticos, lint, build)
- **Testes**: `pytest`
- **Documentação**: Markdown no próprio repositório (README, docs/)

---

## 3. Escopo do Projeto

### 3.1 Objetivo Geral

Construir um sistema completo que colete, processe e analise vagas de emprego, disponibilizando os resultados em um dashboard, servindo como projeto de portfólio que demonstre competências em engenharia de dados e análise de dados de forma integrada.

### 3.2 Objetivos Específicos

- Coletar vagas de forma automatizada e recorrente de pelo menos 2-3 fontes.
- Estruturar um pipeline de dados (raw → processado → analítico).
- Extrair informações-chave das descrições (tecnologias, senioridade, modalidade, faixa salarial quando disponível).
- Gerar análises e visualizações sobre tendências do mercado.
- Expor os dados via API e apresentá-los em um dashboard web.

### 3.3 Divisão de Responsabilidades

- **Responsável por Engenharia de Dados**: scraping/consumo de APIs, orquestração do pipeline, modelagem do banco, qualidade e versionamento dos dados.
- **Responsável por Análise de Dados**: limpeza analítica, NLP para extração de atributos, análises estatísticas, definição das métricas e insights do dashboard.
- **Em conjunto**: definição do modelo de dados compartilhado, API (FastAPI) e frontend (React).

### 3.4 Funcionalidades por Fase

1. **Fase 1 — Setup**: ambiente Docker, repositório, definição das fontes de dados.
2. **Fase 2 — Coleta**: scripts de coleta das primeiras fontes, armazenamento raw.
3. **Fase 3 — Pipeline ETL**: transformação, limpeza, carga no banco analítico.
4. **Fase 4 — Análise e NLP**: extração de skills, categorização, primeiras métricas.
5. **Fase 5 — Backend**: API FastAPI expondo os dados/métricas.
6. **Fase 6 — Frontend**: dashboard com filtros (tecnologia, cidade, senioridade, período).
7. **Fase 7 — Deploy e documentação**: publicação (Docker em VPS ou serviço gratuito) e README completo.

### 3.5 Fora de Escopo (v1)

- Login/cadastro de usuários e personalização de conta.
- Candidatura automatizada a vagas.
- Scraping de plataformas que violem explicitamente os termos de uso (ex: LinkedIn direto) — priorizar APIs públicas.
- Machine learning avançado (previsão de salário com modelos supervisionados) fica como possível v2.

---

## 4. Casos de Uso

### UC01 — Coletar vagas de fontes externas

- **Ator principal**: Orquestrador (Airflow/Prefect) — processo automatizado
- **Atores secundários**: APIs externas de vagas; sistema de armazenamento (MinIO)
- **Objetivo**: Obter vagas atualizadas das fontes configuradas e armazená-las em formato bruto
- **Pré-condições**: Fontes configuradas com endpoints/credenciais válidas; ambiente Docker ativo; scheduler configurado
- **Gatilho**: Horário agendado (ex.: a cada 6h) ou disparo manual
- **Fluxo principal**:
  1. Orquestrador inicia a DAG/flow de coleta.
  2. Sistema itera sobre a lista de fontes configuradas.
  3. Para cada fonte, o sistema faz a requisição (API) ou renderiza a página (scraping) e extrai os dados.
  4. Os dados brutos são normalizados minimamente (JSON) e recebem timestamp de coleta.
  5. Os dados são gravados no MinIO em formato Parquet, particionados por data e fonte.
  6. Sistema registra métricas de execução (quantidade coletada, tempo, erros) em log.
- **Fluxos alternativos**:
  - 3a. Fonte com paginação → sistema itera todas as páginas até o limite configurado ou fim dos resultados.
  - 3b. Fonte exige autenticação/token → sistema utiliza credencial armazenada em variável de ambiente/secret.
- **Fluxos de exceção**:
  - 3c. Fonte retorna erro HTTP ou timeout → até 3 tentativas com backoff; se persistir, a task é marcada como falha e um alerta é gerado, mas as demais fontes continuam sendo processadas.
  - 5a. Falha de escrita no MinIO → dados ficam em buffer local temporário e nova tentativa é feita na próxima execução.
- **Pós-condições**: Novo lote de dados brutos disponível para a etapa de ETL; log de execução registrado.
- **Regras de negócio**: Vagas já coletadas da mesma fonte no mesmo dia não são recoletadas; deduplicação por hash de (título + empresa + link).
- **Frequência**: Automática e recorrente (ex.: a cada 6–12h).

### UC02 — Processar e padronizar os dados coletados (ETL)

- **Ator principal**: Pipeline ETL — processo automatizado, disparado após o UC01
- **Atores secundários**: Responsável por Engenharia de Dados (monitoramento)
- **Objetivo**: Transformar dados brutos em dados limpos, padronizados e prontos para análise
- **Pré-condições**: Existem arquivos raw ainda não processados no data lake
- **Gatilho**: Conclusão (mesmo que parcial) do UC01, ou execução agendada
- **Fluxo principal**:
  1. Pipeline lê os arquivos Parquet mais recentes do MinIO.
  2. Remove registros duplicados (por hash).
  3. Padroniza campos (cidade, UF, modalidade: remoto/híbrido/presencial, senioridade).
  4. Executa extração de tecnologias/skills via NLP sobre a descrição da vaga.
  5. Aplica modelos dbt para transformar a camada de staging em tabelas analíticas.
  6. Carrega o resultado no PostgreSQL analítico.
  7. Executa testes de qualidade (Great Expectations) sobre o resultado.
- **Fluxos alternativos**:
  - 3a. Localização ambígua (ex.: "SP") → sistema aplica dicionário de normalização.
  - 4a. Descrição sem tecnologias identificáveis → vaga é marcada como "não classificada", mas mantida no dataset.
- **Fluxos de exceção**:
  - 7a. Teste de qualidade falha (ex.: % de nulos acima do limite) → pipeline interrompe a carga na tabela final, envia alerta, e os dados problemáticos ficam retidos em uma tabela de quarentena.
- **Pós-condições**: Dados tratados e validados disponíveis na camada analítica.
- **Regras de negócio**: Vaga sem título ou empresa é descartada; salário fora de uma faixa plausível é tratado como nulo em vez de removido.
- **Frequência**: Automática, após cada execução de coleta.

### UC03 — Gerar análises e métricas de mercado

- **Ator principal**: Responsável por Análise de Dados
- **Atores secundários**: Banco analítico (PostgreSQL)
- **Objetivo**: Produzir métricas e insights consumíveis pelo dashboard
- **Pré-condições**: Dados tratados disponíveis; ambiente de notebooks configurado
- **Gatilho**: Rotina agendada (ex.: diária) ou execução manual pelo analista
- **Fluxo principal**:
  1. Analista (ou job agendado) executa o notebook/script de análise.
  2. Sistema calcula métricas agregadas: top tecnologias, distribuição salarial por senioridade, vagas por cidade/modalidade, evolução temporal.
  3. Métricas passam por uma checagem de sanidade pelo analista.
  4. Resultado é persistido em views/tabelas materializadas dedicadas ao consumo da API.
- **Fluxos alternativos**:
  - 2a. Analista deseja explorar uma nova hipótese → cria notebook exploratório à parte, sem impactar as tabelas de produção.
- **Fluxos de exceção**:
  - 3a. Métrica com valor incoerente (ex.: outlier de salário) → analista investiga e, se necessário, ajusta a regra de tratamento no UC02.
- **Pós-condições**: Tabelas/views de métricas atualizadas e prontas para consumo via API.
- **Regras de negócio**: Métricas consideram apenas vagas dos últimos N dias (janela configurável), para refletir tendências recentes.
- **Frequência**: Diária (automatizável) ou sob demanda.

### UC04 — Consultar dashboard de vagas

- **Ator principal**: Usuário final
- **Atores secundários**: API (FastAPI); Frontend (React)
- **Objetivo**: Visualizar o panorama do mercado de vagas
- **Pré-condições**: API e frontend no ar; existem métricas processadas
- **Gatilho**: Usuário acessa a URL do dashboard
- **Fluxo principal**:
  1. Usuário acessa o dashboard.
  2. Frontend faz requisição à API por métricas gerais (sem filtro).
  3. API consulta as views/tabelas de métricas no PostgreSQL.
  4. API retorna JSON com os dados.
  5. Frontend renderiza gráficos (tecnologias em alta, faixas salariais, distribuição geográfica) e lista de vagas recentes.
- **Fluxos alternativos**:
  - 5a. Usuário clica em uma vaga da lista → sistema exibe os detalhes completos (modal ou página dedicada).
- **Fluxos de exceção**:
  - 2a. API indisponível → frontend exibe mensagem de erro amigável, com opção de retry.
  - 4a. Resposta vazia (sem dados no período) → frontend exibe estado vazio com mensagem explicativa.
- **Pós-condições**: Usuário visualiza o panorama atualizado do mercado.
- **Regras de negócio**: Por padrão, o dashboard exibe dados dos últimos 30 dias.
- **Frequência**: Sob demanda, a cada acesso.

### UC05 — Filtrar vagas por critérios

- **Ator principal**: Usuário final
- **Atores secundários**: API; Frontend
- **Objetivo**: Refinar a visualização conforme o interesse específico do usuário
- **Pré-condições**: Dashboard carregado com dados (depende do UC04)
- **Gatilho**: Usuário interage com os controles de filtro
- **Fluxo principal**:
  1. Usuário seleciona um ou mais filtros (tecnologia, senioridade, cidade/remoto, período).
  2. Frontend monta a query com os parâmetros selecionados.
  3. Frontend envia a requisição à API com os filtros.
  4. API executa a consulta filtrada no banco analítico.
  5. API retorna o subconjunto de dados.
  6. Frontend atualiza gráficos e listagem em tempo real.
- **Fluxos alternativos**:
  - 1a. Usuário combina múltiplos filtros → sistema aplica lógica AND entre eles.
  - 6a. Usuário limpa os filtros → dashboard retorna à visão padrão (UC04).
- **Fluxos de exceção**:
  - 5a. Combinação de filtros sem resultados → frontend exibe estado vazio com sugestão de ajustar os filtros.
- **Pós-condições**: Usuário visualiza apenas os dados relevantes ao filtro escolhido.
- **Regras de negócio**: Período máximo selecionável é de 12 meses.
- **Frequência**: Sob demanda, conforme interação do usuário.

**Relações entre os casos de uso**: UC02 depende da saída do UC01 (`include`); UC03 depende da saída do UC02 (`include`); UC05 estende o UC04 (`extend`), pois filtrar é uma variação opcional da consulta padrão ao dashboard.

---

## 5. Próximos Passos Sugeridos

1. Definir as 2-3 fontes de dados iniciais (recomendo começar por APIs públicas, mais simples e estáveis).
2. Subir o ambiente Docker Compose base (Postgres + MinIO).
3. Cada integrante prototipa sua parte isoladamente (coleta vs. notebook de análise) antes de integrar via API.
