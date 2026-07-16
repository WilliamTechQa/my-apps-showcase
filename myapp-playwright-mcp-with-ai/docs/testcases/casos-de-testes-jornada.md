# Documento de Casos de Testes - Sistema McBugs

**Objetivo:** Validar as jornadas funcionais de pedido no totem McBugs para os fluxos **Para comer aqui** e **Para levar**.

**Escopo:** Testes manuais funcionais a nível de jornada. Performance e automação estão fora do escopo deste documento.

---

### **CT001 - Jornada completa de pedido "Para comer aqui"**

#### **Objetivo**

Validar que o usuário consegue realizar um pedido completo selecionando a opção **Para comer aqui**, desde a tela inicial até a confirmação do pagamento no balcão, com o tipo de pedido registrado corretamente como consumo no local.

#### **Pré-Condições**

- O sistema McBugs deve estar online e acessível (ex.: `http://localhost:8080`).
- O Supabase deve estar configurado e a tabela `orders` disponível.
- O navegador deve estar limpo (sem pedido em andamento no `localStorage`).
- Deve existir ao menos um produto disponível no cardápio (ex.: Big Mock, categoria Lanches).

#### **Passos**

| **Id** | **Ação** | **Resultado Esperado** |
| ------ | -------- | ---------------------- |
| 1 | Acessar a página inicial do McBugs | A tela de boas-vindas é exibida com o logo, o título "McBugs" e as opções **Para comer aqui** e **Para levar**. |
| 2 | Clicar em **Para comer aqui** | O usuário é redirecionado para a página do cardápio (`/menu`). O tipo de pedido `dine-in` é registrado no contexto do carrinho. |
| 3 | Verificar as informações do restaurante no cardápio | São exibidos o logo McBugs, a descrição do restaurante e o status **Aberto!**. |
| 4 | Navegar pelas categorias do cardápio (Lanches, Fritas, Bebidas, Sobremesas) | Cada aba de categoria exibe apenas os produtos correspondentes. |
| 5 | Selecionar um produto da lista (ex.: Big Mock) | A página de detalhes do produto é aberta com nome, preço, descrição, ingredientes e controle de quantidade. |
| 6 | Ajustar a quantidade desejada (ex.: 2 unidades) e clicar em **Quero** | O produto é adicionado ao carrinho com a quantidade informada. O usuário retorna ao cardápio. |
| 7 | Verificar a barra fixa do carrinho na parte inferior da tela | A barra exibe o total parcial e a quantidade de itens, com o botão **Ver pedido** habilitado. |
| 8 | Clicar em **Ver pedido** | A página **Meu pedido** (`/cart`) é exibida com os itens adicionados, quantidades e o **Total do pedido** calculado corretamente. |
| 9 | Clicar em **Finalizar pedido** | O drawer **Finalizar Pedido** é aberto solicitando o nome do cliente. |
| 10 | Informar um nome válido (ex.: "Maria Silva") e clicar em **Finalizar** | É exibida a mensagem de carregamento **enviando a cozinha....** e, em seguida, o pedido é criado no sistema. O carrinho é esvaziado e o usuário é direcionado para a tela de pagamento. |
| 11 | Na tela de pagamento, verificar o resumo do pedido | São exibidos o número do pedido (ex.: `#123`), o total e as opções PIX, Cartão de Débito e Cartão de Crédito. |
| 12 | Selecionar a forma de pagamento **PIX** | O usuário é redirecionado para a tela de confirmação do pagamento (`/payment/pix/confirm`). |
| 13 | Verificar os detalhes na tela de confirmação | Os dados exibidos devem incluir: nome do cliente, tipo **Comer no local**, forma de pagamento **PIX**, data do pedido, lista de itens com quantidades e valores, e instrução **Pagamento no Balcão**. |
| 14 | Verificar a mensagem específica para consumo no local | Deve ser exibida a orientação: *"Após o pagamento, aguarde ser chamado pelo número do seu pedido."* |
| 15 | Clicar em **Fazer Novo Pedido** | O estado do pedido é reiniciado e o usuário retorna à tela inicial. |

#### **Resultados Esperados**

- O fluxo completo de pedido para consumo no local é concluído sem erros.
- O total do pedido reflete corretamente a soma dos itens e quantidades selecionadas.
- O pedido é persistido no banco de dados com `order_type = 'dine-in'`, `status = 'pending'` e `payment_method = 'pix'`.
- A tela de confirmação apresenta o tipo de pedido como **Comer no local** e a instrução de aguardar chamada pelo número do pedido.

#### **Critérios de Aceitação**

- Todas as telas da jornada (inicial, cardápio, detalhe do produto, carrinho, pagamento e confirmação) são exibidas corretamente.
- O tipo de pedido **Para comer aqui** permanece consistente do início ao fim da jornada.
- O número do pedido, itens, total e nome do cliente na confirmação correspondem ao que foi selecionado no carrinho.
- A mensagem de aguardar chamada pelo número do pedido é exibida apenas para pedidos do tipo consumo no local.
- Ao finalizar com **Fazer Novo Pedido**, o sistema retorna ao estado inicial pronto para um novo fluxo.

---

### **CT002 - Jornada completa de pedido "Para levar"**

#### **Objetivo**

Validar que o usuário consegue realizar um pedido completo selecionando a opção **Para levar**, incluindo a montagem de um pedido com itens de categorias diferentes, até a confirmação do pagamento no balcão, com o tipo de pedido registrado corretamente como retirada.

#### **Pré-Condições**

- O sistema McBugs deve estar online e acessível (ex.: `http://localhost:8080`).
- O Supabase deve estar configurado e a tabela `orders` disponível.
- O navegador deve estar limpo (sem pedido em andamento no `localStorage`).
- Devem existir produtos disponíveis em pelo menos duas categorias distintas (ex.: Duplo Deploy em Lanches e Coca-Crash em Bebidas).

#### **Passos**

| **Id** | **Ação** | **Resultado Esperado** |
| ------ | -------- | ---------------------- |
| 1 | Acessar a página inicial do McBugs | A tela de boas-vindas é exibida com as opções **Para comer aqui** e **Para levar**. |
| 2 | Clicar em **Para levar** | O usuário é redirecionado para a página do cardápio (`/menu`). O tipo de pedido `takeaway` é registrado no contexto do carrinho. |
| 3 | Na categoria **Lanches**, selecionar um produto (ex.: Duplo Deploy) | A página de detalhes do produto é aberta corretamente. |
| 4 | Manter quantidade 1 e clicar em **Quero** | O produto é adicionado ao carrinho e o usuário retorna ao cardápio com a barra do carrinho visível. |
| 5 | Acessar a categoria **Bebidas** e selecionar um produto (ex.: Coca-Crash) | A página de detalhes da bebida é exibida. |
| 6 | Clicar em **Quero** para adicionar a bebida ao pedido | O carrinho passa a conter dois itens de categorias diferentes. A barra inferior atualiza total e contagem de itens. |
| 7 | Clicar em **Ver pedido** na barra do carrinho | A página **Meu pedido** lista os dois produtos com preços individuais e total consolidado. |
| 8 | Ajustar a quantidade de um item no carrinho (ex.: aumentar Coca-Crash para 2) | A quantidade é atualizada e o **Total do pedido** é recalculado automaticamente. |
| 9 | Clicar em **Finalizar pedido**, informar o nome do cliente (ex.: "João QA") e confirmar | O pedido é enviado à cozinha, o carrinho é esvaziado e o usuário é direcionado para a tela de pagamento. |
| 10 | Selecionar a forma de pagamento **Cartão de Débito** | O usuário é redirecionado para a tela de confirmação (`/payment/debit/confirm`). |
| 11 | Verificar os detalhes na tela de confirmação | Os dados exibidos devem incluir: nome do cliente, tipo **Para levar**, forma de pagamento **Cartão de Débito**, data, itens com quantidades atualizadas e valores corretos. |
| 12 | Verificar a ausência de mensagem de chamada por número | A orientação *"Após o pagamento, aguarde ser chamado pelo número do seu pedido"* **não** deve ser exibida para pedidos do tipo retirada. |
| 13 | Verificar as instruções de pagamento no balcão | Deve ser exibida a mensagem orientando o cliente a dirigir-se ao balcão para pagar com Cartão de Débito. |
| 14 | Clicar em **Fazer Novo Pedido** | O estado do pedido é reiniciado e o usuário retorna à tela inicial. |

#### **Resultados Esperados**

- O fluxo completo de pedido para retirada é concluído sem erros.
- O carrinho permite combinar produtos de categorias diferentes e recalcular o total ao alterar quantidades.
- O pedido é persistido no banco de dados com `order_type = 'takeaway'`, `status = 'pending'` e `payment_method = 'debit'`.
- A tela de confirmação apresenta o tipo de pedido como **Para levar**, sem a mensagem exclusiva de consumo no local.

#### **Critérios de Aceitação**

- A seleção **Para levar** na tela inicial define corretamente o tipo de pedido em toda a jornada.
- O total do pedido considera todas as quantidades informadas no carrinho antes da finalização.
- Os itens, quantidades e valores exibidos na confirmação correspondem exatamente ao pedido montado.
- A instrução de aguardar chamada pelo número do pedido não aparece em pedidos **Para levar**.
- O pedido é registrado no Supabase com os dados corretos de cliente, itens, total, tipo e forma de pagamento.
- O botão **Fazer Novo Pedido** encerra a jornada atual e permite iniciar um novo pedido do zero.

---
