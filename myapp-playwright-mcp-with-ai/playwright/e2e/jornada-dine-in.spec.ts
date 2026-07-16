import { test, expect, type Page } from '@playwright/test';

const CUSTOMER_NAME = 'Maria Silva';
const PRODUCT_NAME = 'Big Mock';
const EXPECTED_TOTAL = 'R$ 79,80';

async function clearAppState(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

test.describe('CT001 - Jornada completa de pedido "Para comer aqui"', () => {
  test('deve concluir pedido dine-in com pagamento PIX', async ({ page }) => {
    // Passo 1 — Tela inicial
    await clearAppState(page);
    await expect(page.getByRole('heading', { name: 'McBugs' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Seja bem-vindo!' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Para comer aqui/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Para levar/i })).toBeVisible();

    // Passo 2 — Selecionar "Para comer aqui"
    await page.getByRole('button', { name: /Para comer aqui/i }).click();
    await expect(page).toHaveURL(/\/menu$/);

    // Passo 3 — Informações do restaurante no cardápio
    await expect(page.getByText('O fast food favorito da comunidade de QAs')).toBeVisible();
    await expect(page.getByText('Aberto!')).toBeVisible();

    // Passo 4 — Navegar pelas categorias
    await expect(page.getByRole('button', { name: /Lanches/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Big Mock/i })).toBeVisible();

    await page.getByRole('button', { name: /Fritas/i }).click();
    await expect(page.getByRole('button', { name: /Batatas Full Stack/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Big Mock/i })).not.toBeVisible();

    await page.getByRole('button', { name: /Bebidas/i }).click();
    await expect(page.getByRole('button', { name: /Coca-Crash/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Batatas Full Stack/i })).not.toBeVisible();

    await page.getByRole('button', { name: /Sobremesas/i }).click();
    await expect(page.getByRole('button', { name: /Casquinha Vanilla JS/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Coca-Crash/i })).not.toBeVisible();

    await page.getByRole('button', { name: /Lanches/i }).click();
    await expect(page.getByRole('button', { name: /Big Mock/i })).toBeVisible();

    // Passo 5 — Selecionar produto Big Mock
    await page.getByRole('button', { name: /Big Mock/i }).click();
    await expect(page).toHaveURL(/\/product\/big-mock$/);
    await expect(page.getByRole('heading', { name: PRODUCT_NAME, level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sobre' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Ingredientes' })).toBeVisible();

    // Passo 6 — Ajustar quantidade para 2 e adicionar ao carrinho
    await expect(page.getByRole('button', { name: /Quero • R\$ 39,90/i })).toBeVisible();
    await page
      .locator('.flex.items-center.gap-2')
      .filter({ has: page.getByText('1', { exact: true }) })
      .getByRole('button')
      .last()
      .click();
    await expect(page.getByRole('button', { name: /Quero • R\$ 79,80/i })).toBeVisible();
    await page.getByRole('button', { name: /Quero • R\$ 79,80/i }).click();
    await expect(page).toHaveURL(/\/menu$/);

    // Passo 7 — Barra do carrinho
    const cartBar = page.locator('.fixed.bottom-0').filter({
      has: page.getByRole('button', { name: /Ver pedido/i }),
    });
    await expect(cartBar.getByText(EXPECTED_TOTAL)).toBeVisible();
    await expect(cartBar.getByText('/ 2 itens')).toBeVisible();
    await expect(page.getByRole('button', { name: /Ver pedido/i })).toBeEnabled();

    // Passo 8 — Página Meu pedido
    await page.getByRole('button', { name: /Ver pedido/i }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'Meu pedido' })).toBeVisible();
    await expect(page.getByText(PRODUCT_NAME)).toBeVisible();
    const cartTotalCard = page.locator('.bg-card.rounded-2xl').filter({ hasText: 'Total do pedido' });
    await expect(cartTotalCard.getByText(EXPECTED_TOTAL)).toBeVisible();

    // Passo 9 — Abrir drawer de finalização
    await page.getByRole('button', { name: /Finalizar pedido/i }).click();
    await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible();

    // Passo 10 — Informar nome e finalizar
    await page.getByLabel('Seu nome').fill(CUSTOMER_NAME);
    await page.getByRole('button', { name: 'Finalizar', exact: true }).click();
    await expect(page.getByRole('heading', { name: /enviando a cozinha/i })).toBeVisible();
    await expect(page).toHaveURL(/\/payment$/);

    // Passo 11 — Tela de pagamento
    const paymentSummary = page.locator('.bg-card.rounded-2xl').first();
    await expect(paymentSummary.getByText(/Pedido/)).toBeVisible();
    await expect(paymentSummary.getByText(EXPECTED_TOTAL)).toBeVisible();
    await expect(page.getByRole('button', { name: 'PIX' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Cartão de Débito/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Cartão de Crédito/i })).toBeVisible();

    // Passo 12 — Selecionar PIX
    await page.getByRole('button', { name: 'PIX' }).click();
    await expect(page).toHaveURL(/\/payment\/pix\/confirm$/);

    // Passo 13 — Detalhes na confirmação
    await expect(page.getByRole('heading', { name: 'Pagamento no Balcão' })).toBeVisible();
    const orderDetails = page.locator('.bg-card.rounded-2xl').filter({ hasText: 'Detalhes do pedido' });
    await expect(orderDetails.getByText(CUSTOMER_NAME)).toBeVisible();
    await expect(orderDetails.getByText('Comer no local')).toBeVisible();
    await expect(orderDetails.getByText('PIX', { exact: true })).toBeVisible();
    await expect(orderDetails.getByText(`2x ${PRODUCT_NAME}`)).toBeVisible();
    await expect(page.locator('.bg-card.rounded-2xl').first().getByText(EXPECTED_TOTAL)).toBeVisible();

    // Passo 14 — Mensagem específica para consumo no local
    await expect(
      page.getByText('Após o pagamento, aguarde ser chamado pelo número do seu pedido.')
    ).toBeVisible();

    // Passo 15 — Fazer novo pedido
    await page.getByRole('button', { name: /Fazer Novo Pedido/i }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'McBugs' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Para comer aqui/i })).toBeVisible();
  });
});
