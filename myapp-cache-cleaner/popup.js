function getStatus() {
  return document.getElementById("status");
}

function setStatus(text) {
  const el = getStatus();
  if (el) el.innerText = text;
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });
  return tab;
}

function isSupportedUrl(url) {
  if (!url) return false;
  return (
    url.startsWith("http://") ||
    url.startsWith("https://")
  );
}

async function getOriginAtual() {
  const tab = await getActiveTab();
  if (!isSupportedUrl(tab?.url)) {
    throw new Error("Abra uma aba HTTP/HTTPS para usar a extensão.");
  }
  return new URL(tab.url).origin;
}

async function limparCacheDoSite(origin) {
  await chrome.browsingData.remove(
    { origins: [origin] },
    {
      cache: true,
      cacheStorage: true,
      serviceWorkers: true
    }
  );
}

function urlComNocache(url) {
  const parsed = new URL(url);
  parsed.searchParams.set("nocache", Date.now());
  return parsed.toString();
}

function waitForTabLoad(tabId, timeoutMs = 5000) {
  return new Promise((resolve) => {
    let settled = false;

    const done = () => {
      if (settled) return;
      settled = true;
      chrome.tabs.onUpdated.removeListener(onUpdated);
      clearTimeout(timer);
      resolve();
    };

    const onUpdated = (updatedTabId, changeInfo) => {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        done();
      }
    };

    chrome.tabs.onUpdated.addListener(onUpdated);
    const timer = setTimeout(done, timeoutMs);
  });
}

async function voltarParaOriginal(tab, originalUrl, comNocache = false) {
  const destino = comNocache ? urlComNocache(originalUrl) : originalUrl;
  await chrome.tabs.update(tab.id, { url: destino });
  await waitForTabLoad(tab.id);
}

async function executarComFeedback(fn) {
  try {
    await fn();
  } catch (err) {
    setStatus(`❌ ${err.message || "Erro ao executar a ação."}`);
  }
}

/**
 * 🧹 Site — limpa cache HTTP, Cache Storage e service workers do domínio atual
 */
async function limparCacheServidor() {
  const tab = await getActiveTab();
  const originalUrl = tab.url;
  const origin = await getOriginAtual();

  setStatus("🧹 Limpando cache do site...");
  await limparCacheDoSite(origin);

  setStatus("↩️ Recarregando página...");
  await voltarParaOriginal(tab, originalUrl);

  setStatus("✅ Cache do site limpo");
}

/**
 * 🔄 Reload — limpa cache do site e recarrega ignorando cache do navegador
 */
async function reloadSemCache() {
  const tab = await getActiveTab();
  const originalUrl = tab.url;
  const origin = await getOriginAtual();

  setStatus("🧹 Limpando cache do site...");
  await limparCacheDoSite(origin);

  setStatus("↩️ Voltando para página original...");
  await voltarParaOriginal(tab, originalUrl);

  setStatus("🔄 Recarregando sem cache...");
  chrome.tabs.reload(tab.id, { bypassCache: true });

  setStatus("✅ Reload executado");
}

/**
 * 🚀 Bypass — limpa cache e recarrega com parâmetro ?nocache=timestamp
 */
async function abrirSemCache() {
  const tab = await getActiveTab();
  const originalUrl = tab.url;
  const origin = await getOriginAtual();

  setStatus("🧹 Limpando cache do site...");
  await limparCacheDoSite(origin);

  setStatus("↩️ Voltando para página original...");
  await voltarParaOriginal(tab, originalUrl, true);

  setStatus("✅ Bypass executado");
}

/**
 * 🧨 Completa — limpeza do site, bypass de versão e hard reload
 */
async function limpezaCompleta() {
  const tab = await getActiveTab();
  const originalUrl = tab.url;
  const origin = await getOriginAtual();

  setStatus("🧨 Executando Limpeza Completa...");

  await limparCacheDoSite(origin);

  setStatus("↩️ Voltando para página original...");
  await voltarParaOriginal(tab, originalUrl, true);

  setStatus("🔄 Recarregando sem cache...");
  chrome.tabs.reload(tab.id, { bypassCache: true });

  setStatus("✅ Limpeza Completa finalizada");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-server")
    ?.addEventListener("click", () => executarComFeedback(limparCacheServidor));

  document.getElementById("btn-reload")
    ?.addEventListener("click", () => executarComFeedback(reloadSemCache));

  document.getElementById("btn-bypass")
    ?.addEventListener("click", () => executarComFeedback(abrirSemCache));

  document.getElementById("btn-full")
    ?.addEventListener("click", () => executarComFeedback(limpezaCompleta));
});
