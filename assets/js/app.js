// API fake kkk
const API = "http://localhost:3000/books";
let idEditando = null;

// Elemento do DOM
const corpoTabela = document.querySelector("#tbody");
const vazio = document.querySelector("#empty");
const contador = document.querySelector("#count");
const carregando = document.querySelector("#loading");
const erro = document.querySelector("#error");

const busca = document.querySelector("#search");
const filtroGenero = document.querySelector("#genreFilter");
const filtroStatus = document.querySelector("#statusFilter");
const btnLimpar = document.querySelector("#btnClear");
const btnNovo = document.querySelector("#btnOpenCreate");

const modal = document.querySelector("#bookModal");
const tituloModal = document.querySelector("#modalTitle");
const modalBootstrap = new bootstrap.Modal(modal);

const form = document.querySelector("#form");
const erroForm = document.querySelector("#formError");

const inputTitulo = document.querySelector("#title");
const inputAutor = document.querySelector("#author");
const inputGenero = document.querySelector("#genre");
const inputAno = document.querySelector("#year");
const inputStatus = document.querySelector("#status");

// UI
function mostrarCarregando(ativo) {
  carregando.classList.toggle("d-none", !ativo);
}

function mostrarErro(msg) {
  if (!msg) {
    erro.classList.add("d-none");
    erro.textContent = "";
    return;
  }
  erro.textContent = msg;
  erro.classList.remove("d-none");
}

function mostrarErroForm(msg) {
  if (!msg) {
    erroForm.classList.add("d-none");
    erroForm.textContent = "";
    return;
  }
  erroForm.textContent = msg;
  erroForm.classList.remove("d-none");
}

function limparFormulario() {
  inputTitulo.value = "";
  inputAutor.value = "";
  inputGenero.value = "";
  inputAno.value = "";
  inputStatus.value = "vou_ler";
}

function abrirModal(modo) {
  tituloModal.textContent = modo === "edit" ? "Editar livro" : "Novo livro";
  mostrarErroForm("");
  modalBootstrap.show();
  setTimeout(() => inputTitulo.focus(), 100);
}

function fecharModal() {
  modalBootstrap.hide();
  idEditando = null;
  limparFormulario();
  mostrarErroForm("");
}

// Status
function statusTexto(s) {
  if (s === "vou_ler") return "Vou ler";
  if (s === "lendo") return "Estou lendo";
  if (s === "lido") return "Ja li";
  return s;
}

function statusCor(s) {
  if (s === "lido") return "text-bg-success";
  if (s === "lendo") return "text-bg-primary";
  return "text-bg-secondary";
}

// Crudzinho básico
async function pegarLivros() {
  const q = busca.value.trim();
  const genero = filtroGenero.value;
  const status = filtroStatus.value;

  const params = {};
  if (q) params.q = q;
  if (genero) params.genre = genero;
  if (status) params.status = status;
  params._sort = "createdAt";
  params._order = "desc";

  try {
    const res = await axios.get(API, { params });
    return res.data;
  } catch {
    throw new Error("Falha ao buscar livros.");
  }
}

async function criarLivro(dados) {
  try {
    const res = await axios.post(API, dados);
    return res.data;
  } catch {
    throw new Error("Falha ao criar livro.");
  }
}

async function atualizarLivro(id, dados) {
  try {
    const res = await axios.put(`${API}/${id}`, dados);
    return res.data;
  } catch {
    throw new Error("Falha ao atualizar livro.");
  }
}

async function apagarLivro(id) {
  try {
    await axios.delete(`${API}/${id}`);
  } catch {
    throw new Error("Falha ao excluir livro.");
  }
}

async function atualizarStatus(id, novoStatus) {
  try {
    await axios.patch(`${API}/${id}`, { status: novoStatus });
  } catch {
    throw new Error("Falha ao atualizar status.");
  }
}

async function pegarLivroPorId(id) {
  try {
    const res = await axios.get(`${API}/${id}`);
    return res.data;
  } catch {
    throw new Error("Falha ao buscar livro.");
  }
}

// Criar td e tr da tabela
function criarTd(texto) {
  const td = document.createElement("td");
  td.textContent = texto ?? "";
  return td;
}

function criarTdStatus(livro) {
  const td = document.createElement("td");
  const badge = document.createElement("span");
  badge.className = `badge ${statusCor(livro.status)}`;
  badge.textContent = statusTexto(livro.status);
  td.appendChild(badge);
  return td;
}

function criarTdAcoes(livro) {
  const td = document.createElement("td");
  td.className = "text-end";

  const area = document.createElement("div");
  area.className = "d-inline-flex flex-wrap gap-2 justify-content-end";

  if (livro.status === "vou_ler") {
    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-outline-light";
    btn.textContent = "Começar";
    btn.onclick = async () => {
      try {
        mostrarErro("");
        mostrarCarregando(true);
        await atualizarStatus(livro.id, "lendo");
        await carregar();
      } catch (e) {
        mostrarErro(e.message);
      } finally {
        mostrarCarregando(false);
      }
    };
    area.appendChild(btn);
  }

  if (livro.status === "lendo") {
    const btnLido = document.createElement("button");
    btnLido.className = "btn btn-sm btn-success";
    btnLido.textContent = "Marcar lido";
    btnLido.onclick = async () => {
      try {
        mostrarErro("");
        mostrarCarregando(true);
        await atualizarStatus(livro.id, "lido");
        await carregar();
      } catch (e) {
        mostrarErro(e.message);
      } finally {
        mostrarCarregando(false);
      }
    };

    const btnVoltar = document.createElement("button");
    btnVoltar.className = "btn btn-sm btn-outline-light";
    btnVoltar.textContent = "Voltar";
    btnVoltar.onclick = async () => {
      try {
        mostrarErro("");
        mostrarCarregando(true);
        await atualizarStatus(livro.id, "vou_ler");
        await carregar();
      } catch (e) {
        mostrarErro(e.message);
      } finally {
        mostrarCarregando(false);
      }
    };

    area.appendChild(btnLido);
    area.appendChild(btnVoltar);
  }

  if (livro.status === "lido") {
    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-outline-light";
    btn.textContent = "Reler";
    btn.onclick = async () => {
      try {
        mostrarErro("");
        mostrarCarregando(true);
        await atualizarStatus(livro.id, "lendo");
        await carregar();
      } catch (e) {
        mostrarErro(e.message);
      } finally {
        mostrarCarregando(false);
      }
    };
    area.appendChild(btn);
  }

  const btnEditar = document.createElement("button");
  btnEditar.className = "btn btn-sm btn-primary";
  btnEditar.textContent = "Editar";
  btnEditar.onclick = () => {
    idEditando = livro.id;
    inputTitulo.value = livro.title ?? "";
    inputAutor.value = livro.author ?? "";
    inputGenero.value = livro.genre ?? "";
    inputAno.value = livro.year ?? "";
    inputStatus.value = livro.status ?? "vou_ler";
    abrirModal("edit");
  };

  const btnExcluir = document.createElement("button");
  btnExcluir.className = "btn btn-sm btn-danger";
  btnExcluir.textContent = "Excluir";
  btnExcluir.onclick = async () => {
    const ok = confirm(`Excluir "${livro.title}"?`);
    if (!ok) return;

    try {
      mostrarErro("");
      mostrarCarregando(true);
      await apagarLivro(livro.id);
      await carregar();
    } catch (e) {
      mostrarErro(e.message);
    } finally {
      mostrarCarregando(false);
    }
  };

  area.appendChild(btnEditar);
  area.appendChild(btnExcluir);

  td.appendChild(area);
  return td;
}

function renderizar(livros) {
  corpoTabela.innerHTML = "";
  contador.textContent = `${livros.length} livro(s)`;
  vazio.classList.toggle("d-none", livros.length !== 0);

  livros.forEach((livro) => {
    const tr = document.createElement("tr");
    tr.appendChild(criarTd(livro.title));
    tr.appendChild(criarTd(livro.author));
    tr.appendChild(criarTd(livro.genre));
    tr.appendChild(criarTd(String(livro.year)));
    tr.appendChild(criarTdStatus(livro));
    tr.appendChild(criarTdAcoes(livro));
    corpoTabela.appendChild(tr);
  });
}

// Carregar lista
async function carregar() {
  try {
    mostrarCarregando(true);
    mostrarErro("");
    const livros = await pegarLivros();
    renderizar(livros);
  } catch (e) {
    mostrarErro(e.message);
  } finally {
    mostrarCarregando(false);
  }
}

// Eventos
btnNovo.onclick = () => {
  idEditando = null;
  limparFormulario();
  abrirModal("create");
};

busca.oninput = () => carregar();
filtroGenero.onchange = () => carregar();
filtroStatus.onchange = () => carregar();

btnLimpar.onclick = () => {
  busca.value = "";
  filtroGenero.value = "";
  filtroStatus.value = "";
  carregar();
};

form.onsubmit = async (ev) => {
  ev.preventDefault();

  const dados = {
    title: inputTitulo.value.trim(),
    author: inputAutor.value.trim(),
    genre: inputGenero.value,
    year: Number(inputAno.value),
    status: inputStatus.value,
    createdAt: new Date().toISOString(),
  };

  if (!dados.title || !dados.author || !dados.genre || !dados.year) {
    mostrarErroForm("Preencha todos os campos.");
    return;
  }

  try {
    mostrarErro("");
    mostrarErroForm("");
    mostrarCarregando(true);

    if (idEditando) {
      const atual = await pegarLivroPorId(idEditando);
      dados.createdAt = atual.createdAt || dados.createdAt;
      await atualizarLivro(idEditando, dados);
    } else {
      await criarLivro(dados);
    }

    fecharModal();
    await carregar();
  } catch (e) {
    mostrarErroForm(e.message);
  } finally {
    mostrarCarregando(false);
  }
};

modal.addEventListener("hidden.bs.modal", () => {
  idEditando = null;
  limparFormulario();
  mostrarErroForm("");
});


carregar();
