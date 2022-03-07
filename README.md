# Api Boardcamp

### Descritivo:

- No seu segundo projeto back-end, você construirá o sistema de gestão de uma locadora de jogos de tabuleiro!

    # Requisitos

- Geral
    - A porta utilizada pelo seu servidor deve ser a 4000 
    - Faça commits a cada funcionalidade implementada
- CRUD de Categorias [Create|Read]
    - Listar categorias
        - **Rota**: **GET** /categories
    - Inserir categoria
        - **Rota**: **POST** /categories
        
- CRUD de Jogos [Create|Read]
    - Listar jogos
        - **Rota**: **GET** /games
        - **Regras de Negócio**
            - Caso seja passado um parâmetro `name` na **query string** da requisição, os jogos devem ser filtrados para retornar somente os que começam com a string passada (case insensitive). Exemplo:
                - Para a rota `/games?name=ba`, deve ser retornado uma array somente com os jogos que comecem com "ba", como "Banco Imobiliário", "Batalha Naval", etc
    - Inserir um jogo
        - **Rota**: **POST** /games
        - **Regras de Negócio**
            - `name` não pode estar vazio; `stockTotal` e `pricePerDay` devem ser transformados em números e serem maiores que 0; `categoryId` deve ser um id de categoria existente; ⇒ nesses casos, deve retornar **status 400**
            - `name` não pode ser um nome de jogo já existente ⇒ nesse caso deve retornar **status 409**
- CRUD de Clientes [Create|Read|Update]
    - Listar clientes
        - **Rota: GET** /customers
        - **Regras de Negócio**
            - Caso seja passado um parâmetro `cpf` na **query string** da requisição, os clientes devem ser filtrados para retornar somente os com CPF que comecem com a string passada. Exemplo:
                - Para a rota `/customers?cpf=012`, deve ser retornado uma array somente com os clientes que o CPF comece com "012", como "01234567890", "01221001200", etc
    - Buscar um cliente por id
        - **Rota: GET** /customers/:id
        - **Regras de Negócio:**
            - Se o cliente com id dado não existir, deve responder com **status 404**
    - Inserir um cliente
        - **Rota:** **POST** /customers
        - **Regras de negócio:**
            - `cpf` deve ser uma string com 11 caracteres numéricos; `phone` deve ser uma string com 10 ou 11 caracteres numéricos; `name` não pode ser uma string vazia; `birthday` deve ser uma data válida; ⇒ nesses casos, deve retornar **status 400**
            - `cpf` não pode ser de um cliente já existente; ⇒ nesse caso deve retornar **status 409**
    - Atualizar um cliente
        - **Rota:** **PUT** /customers/:id
        - **Regras de negócio:**
            - `cpf` deve ser uma string com 11 caracteres numéricos; `phone` deve ser uma string com 10 ou 11 caracteres numéricos; `name` não pode ser uma string vazia; `birthday` deve ser uma data válida ⇒ nesses casos, deve retornar **status 400**
            - `cpf` não pode ser de um cliente já existente ⇒ nesse caso deve retornar **status 409**
- CRUD de Aluguéis [Create|Read|Update|Delete]
    - Listar aluguéis
        - **Rota: GET** /rentals
        - **Regras de Negócio**
            - Caso seja passado um parâmetro `customerId` na **query string** da requisição, os aluguéis devem ser filtrados para retornar somente os do cliente solicitado. Exemplo:
                - Para a rota `/rentals?customerId=1`, deve ser retornado uma array somente com os aluguéis do cliente com id 1
            - Caso seja passado um parâmetro `gameId` na **query string** da requisição, os aluguéis devem ser filtrados para retornar somente os do jogo solicitado. Exemplo:
                - Para a rota `/rentals?gameId=1`, deve ser retornado uma array somente com os aluguéis do jogo com id 1
    - Inserir um aluguel
        - **Rota:** **POST** /rentals
        - **Regras de Negócio**
            - Ao inserir um aluguel, os campos `rentDate` e `originalPrice` devem ser populados automaticamente antes de salvá-lo:
                - `rentDate`: data atual no momento da inserção
                - `originalPrice`: `daysRented` multiplicado pelo preço por dia do jogo no momento da inserção
            - Ao inserir um aluguel, os campos `returnDate` e `delayFee` devem sempre começar como `null`
            - Ao inserir um aluguel, deve verificar se `customerId` se refere a um cliente existente. Se não, deve responder com **status 400**
            - Ao inserir um aluguel, deve verificar se `gameId` se refere a um jogo existente. Se não, deve responder com **status 400**
            - `daysRented` deve ser um número maior que 0. Se não, deve responder com **status 400**
            - Ao inserir um aluguel, deve-se validar que existem jogos disponíveis, ou seja, que não tem alugueis em aberto acima da quantidade de jogos em estoque. Caso contrário, deve retornar **status 400**
    - Finalizar aluguel
        - **Rota:** **POST** /rentals/:id/return
        - **Regras de Negócio**
            - Ao retornar um aluguel, o campo `returnDate` deve ser populado com a data atual do momento do retorno
            - Ao retornar um aluguel, o campo `delayFee` deve ser automaticamente populado com um valor equivalente ao número de dias de atraso vezes o preço por dia do jogo no momento do retorno. Exemplo:
                - Se o cliente aluguel no dia **20/06** um jogo por **3 dias**, ele deveria devolver no dia **23/06**. Caso ele devolva somente no dia **25/06**, o sistema deve considerar **2 dias de atraso**. Nesse caso, se o jogo custava **R$ 15,00** por dia, a `delayFee` deve ser de **R$ 30,00** (3000 centavos)
            - Ao retornar um aluguel, deve verificar se o `id` do aluguel fornecido existe. Se não, deve responder com **status 404**
            - Ao retornar um aluguel, deve verificar se o aluguel já não está finalizado. Se estiver, deve responder com **status 400**
    - Apagar aluguel
        - **Rota:** **DELETE** /rentals/:id
        - **Regras de Negócio**
            - Ao excluir um aluguel, deve verificar se o `id` fornecido existe. Se não, deve responder com **status 404**
            - Ao excluir um aluguel, deve verificar se o aluguel já não está finalizado (ou seja, `returnDate` já está preenchido). Se estiver, deve responder com **status 400**

# Bônus

- Paginação
    - **GET** /categories, /games, /customers, /rentals
        - Caso seja passado um parâmetro `offset` na **query string** da requisição, deve-se obter somente os registros no banco após o offset determinado. Ex: se for passado `offset=20` e existirem 100 produtos no banco, só devem ser retornados os 80 últimos (do 21º ao 100º)
            - **Dica**: pesquise por SQL OFFSET
        - Caso seja passado um parâmetro `limit` na query string da requisição, deve-se limitar a quantidade de registros retornados a esse limite no máximo. Ex: se for passado `limit=30` e existirem 100 produtos no banco, só devem ser retornados os 30 primeiros
        - Caso tanto `limit` quanto `offset` sejam passados, ambos devem ser aplicados. Ex: se for passado `offset=20&limit=30`, caso existam 100 produtos no banco, só devem ser retornados os produtos do 21º ao 50º.
- Ordenação
    - **GET** /categories, /games, /customers, /rentals
        - Caso seja passado um parâmetro `order` na **query string** da requisição, deve-se retornar os registros ordenados pela coluna passada em ordem ascendente. Ex: se for passado `order=name`, os registros devem ser ordenados alfabeticamente pela coluna `name`
        - Caso seja passado também um parâmetro `desc` na **query string**, deve-se inverter esta ordem para descendente. Ex: se for passado `order=name&desc=true`, os registros devem ser ordenados alfabeticamente invertidos pela coluna `name`
- Filtragem por data
    - **GET** /rentals
        - Caso seja passado um parâmetro `status` na **query string** da requisição, os aluguéis devem ser filtrados para retornar somente aqueles que estão naquele estado. Exemplo:
            - Para a rota `/rentals?status=open`, deve ser retornado uma array somente com os aluguéis não finalizados
            - Para a rota `/rentals?status=closed`, deve ser retornado uma array somente com os aluguéis finalizados
        - Caso seja passado um parâmetro `startDate` na **query string** da requisição, os aluguéis devem ser filtrados para retornar somente os que foram feitos a partir daquela data. Exemplo:
            - Para a rota `/rentals?startDate=2021-06-10`, deve ser retornado uma array somente com os aluguéis com `rentDate` maior ou igual a `2021-06-10`
- Cálculo de faturamento
    - **GET** /rentals/metrics
        
  
### Tecnologias utilizadas:

<p align="left">
  <a href="https://www.w3schools.com/css/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a> 
  <a href="https://www.w3.org/html/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> </a> 
  <a href="https://git-scm.com/" target="_blank"> <img src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" alt="git" width="40" height="40"/> </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> 
  <a href="https://www.linux.org/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg" alt="linux" width="40" height="40"/> </a> 
  <a href="https://nodejs.org" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> 
  <a href="https://www.postgresql.org/" target="_blank"> <img src="https://icongr.am/devicon/postgresql-original.svg?size=128&color=currentColor" alt="postgresql" width="40" height="40"/> </a> 
  <a href="https://expressjs.com/pt-br/" target="_blank"> <img src="https://icongr.am/devicon/express-original-wordmark.svg?size=128&color=currentColor" alt="express" width="40" height="40"/> </a> 
</p>

## Available Scripts:

In the project directory, you can run:

- First clone this repository

- Run: npm i

- Run: npm start

- Run: npm run dev (with nodemon)