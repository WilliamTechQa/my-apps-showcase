# Gerador de Arquivos Fictícios (HTML/CSS/JS)

Projeto web para gerar arquivos fictícios em lote para testes. Permite salvar diretamente em uma pasta local ou baixar tudo compactado em ZIP, no mesmo padrão do script `.bat`.

## Como usar

1. Rode em servidor local (PWA não funciona em `file://`). Exemplo:
   - `python -m http.server 5500`
   - depois abra `http://localhost:5500`
2. Ajuste:
   - total de arquivos (ex.: 120)
   - prefixo (ex.: DummyFile)
   - selecione as extensões desejadas
   - adicione/remova extensões quando necessário
3. Clique em **Selecionar pasta** (obrigatório se o modo sem ZIP estiver ativo; opcional se o ZIP estiver permitido).
4. Por padrão, **Somente gravação direta na pasta selecionada (sem compactar ZIP)** vem marcado:
   - com essa opção ativa, a pasta de destino é obrigatória e o app não gera ZIP
   - desmarque para permitir fallback/download em ZIP
5. (Opcional) Marque **Limpar pasta de destino antes de gerar** para remover arquivos antigos da pasta `ArquivosDiarios`.
6. (Opcional) Marque **Abrir pasta após gerar** para exibir automaticamente a lista de arquivos gerados na interface após a conclusão.
7. Clique em **Gerar arquivos**.
8. Se disponível, clique em **Instalar app** para instalar como PWA.

## Saída

- Modo 1: grava diretamente na pasta selecionada, dentro de `ArquivosDiarios`.
- Modo 2: baixa um ZIP com pasta `ArquivosDiarios` (quando o modo sem ZIP estiver desmarcado e a gravação direta não for usada).
- Arquivos no formato `DummyFile_<contador>_<yyyy-MM-dd_HH-mm>.<ext>`.
- Conteúdo interno (não-imagem): `Teste arquivo fictício <guid> - <ddMMyyyyHHmmss>`.
- Extensões de imagem (`png`, `jpg`, `bmp`, `gif`, etc.): geram conteúdo de imagem fictícia (não o texto acima).

## Cache e permissões

- O app salva em cache as configurações do formulário.
- O catálogo de extensões (marcadas e personalizadas) também é salvo em cache.
- O modo **sem ZIP** também é salvo em cache.
- A opção de limpeza da pasta de destino também é salva em cache.
- A opção de abrir lista após geração também é salva em cache.
- A última pasta escolhida é mantida em cache quando o navegador suportar a API de acesso ao sistema de arquivos.
- Se o modo **sem ZIP** estiver desmarcado e a permissão/pasta não estiver disponível, o app usa ZIP.
- Se o modo **sem ZIP** estiver ativo e não houver pasta com permissão de escrita, a geração falha (não há fallback para ZIP).
- O botão **Limpar cache** remove preferências e referência da pasta salva.

## Compatibilidade

- Para gravação direta em pasta, use navegador com suporte à File System Access API (ex.: versões recentes de Chromium/Edge).
- Quando não houver suporte e o modo sem ZIP estiver desmarcado, o fluxo de ZIP continua funcionando normalmente.

## PWA

- O projeto inclui `manifest.webmanifest` e `sw.js`.
- O botão **Instalar app** aparece quando o navegador permite `beforeinstallprompt`.
- Para instalação, use contexto seguro (`https` ou `localhost`).

---

## English

Web app (PWA) for generating dummy files in bulk for testing. Save directly to a local folder or download everything as a ZIP.

### How to use

1. Run on a local server (PWA does not work on `file://`). Example:
   - `python -m http.server 5500`
   - then open `http://localhost:5500`
2. Configure:
   - total file count (e.g. 120)
   - filename prefix (e.g. DummyFile)
   - select the extensions you need
3. Click **Select folder** (required when direct-write mode is active; optional when ZIP is allowed).
4. By default, **Direct write to selected folder only (no ZIP)** is checked:
   - with this on, a destination folder is required and no ZIP is generated
   - uncheck to allow ZIP fallback/download
5. (Optional) Check **Clear destination folder before generating** to remove old files from `ArquivosDiarios`.
6. (Optional) Check **Open folder after generating** to show the file list in the UI when done.
7. Click **Generate files**.
8. If available, click **Install app** to install as a PWA.

### Output

- Mode 1: writes directly to the selected folder, inside `ArquivosDiarios`.
- Mode 2: downloads a ZIP with an `ArquivosDiarios` folder (when direct-write mode is off).
- Files follow the pattern `DummyFile_<counter>_<yyyy-MM-dd_HH-mm>.<ext>`.
- Non-image files contain dummy text; image extensions generate fake image content.

### Compatibility

- Direct folder write requires a browser with File System Access API support (recent Chromium/Edge).
- When unsupported and direct-write mode is off, the ZIP flow works normally.
- PWA install requires a secure context (`https` or `localhost`).
