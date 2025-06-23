function validarGmail() {
  const input = document.getElementById("gmail").value.trim();
  const mensagem = document.getElementById("mensagem");
  const dominio = "@gmail.com";

  if (input.toLowerCase().endsWith(dominio) && input.length > dominio.length) {
    mensagem.textContent = "Gmail valido.";
    mensagem.className = "valido";
  } else {
    mensagem.textContent = "Gmail invalido.";
    mensagem.className = "invalido";
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const cpfInput = document.getElementById("cpfInput");
  const messageDisplay = document.getElementById("message");
  const applyCpfMask = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  };
  const validateCpf = (cpf) => {
    cpf = cpf.replace(/ \D/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }
    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return false;
    }
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.substring(10, 11))) {
      return false;
    }

    return true;
  };
  cpfInput.addEventListener("input", (e) => {
    e.target.value = applyCpfMask(e.target.value);
  });
  cpfInput.addEventListener("blur", () => {
    const cpf = cpfInput.value.trim();
    messageDisplay.textContent = "";
    messageDisplay.className = "";

    if (cpf === "") {
      messageDisplay.textContent = "Por favor, digite um CPF.";
      messageDisplay.classList.add("error");
    } else {
      const cleanCpf = cpf.replace(/\D/g, "");
      if (validateCpf(cleanCpf)) {
        messageDisplay.textContent = "CPF valido!";
        messageDisplay.classList.add("success");
      } else {
        messageDisplay.textContent = "CPF invalido.";
        messageDisplay.classList.add("error");
      }
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  const personalNotesTextarea = document.getElementById("personalNotes");
  const saveStatusDisplay = document.getElementById("saveStatus");
  const profileDetailsList = document.getElementById("profile-details");

  const newProfileData = [];
  newProfileData.forEach((data) => {
    const listItem = document.createElement("li");
    const strongLabel = document.createElement("strong");
    strongLabel.textContent = data.label + ":";
    const valueText = document.createTextNode(" " + data.value);

    listItem.appendChild(strongLabel);
    listItem.appendChild(valueText);
    profileDetailsList.appendChild(listItem);
  });
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));
      button.classList.add("active");

      const targetTabId = button.dataset.tab;
      document.getElementById(targetTabId).classList.add("active");
    });
  });
  const saveNotes = () => {
    const notes = personalNotesTextarea.value;
    localStorage.setItem("myPersonalProfileNotes", notes);
    saveStatusDisplay.textContent = "Salvo!";
    saveStatusDisplay.className = "save-status saved";
    setTimeout(() => {
      saveStatusDisplay.textContent = "Salvando...";
      saveStatusDisplay.className = "save-status";
    }, 2000);
  };
  const loadNotes = () => {
    const savedNotes = localStorage.getItem("myPersonalProfileNotes");
    if (savedNotes) {
      personalNotesTextarea.value = savedNotes;
      saveStatusDisplay.textContent = "Carregado!";
      saveStatusDisplay.className = "save-status saved";
      setTimeout(() => {
        saveStatusDisplay.textContent = "Salvando...";
        saveStatusDisplay.className = "save-status";
      }, 2000);
    } else {
      saveStatusDisplay.textContent = "Nenhuma nota salva ainda.";
      saveStatusDisplay.className = "save-status";
    }
  };
  let saveTimeout;
  personalNotesTextarea.addEventListener("input", () => {
    saveStatusDisplay.textContent = "Salvando...";
    saveStatusDisplay.className = "save-status saving";
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveNotes, 1000);
  });
  personalNotesTextarea.addEventListener("blur", saveNotes);
  loadNotes();
});
document.addEventListener("DOMContentLoaded", () => {
  const addUcBtn = document.getElementById("addUcBtn");
  const listaUcs = document.getElementById("listaUcs");
  const renderizarLinhaUc = (nome) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
            <td>${nome}</td>
            <td class="acoes"> <button class="mover-para-cima" title="Mover para cima">&#9650;</button>
                <button class="mover-para-baixo" title="Mover para baixo">&#9660;</button>
            </td>
        `;
    return linha;
  };
  const atualizarEstadoBotoes = () => {
    const linhas = listaUcs.querySelectorAll("tr");
    if (linhas.length === 0) return;
    linhas.forEach((linha) => {
      linha.querySelector(".mover-para-cima").disabled = false;
      linha.querySelector(".mover-para-baixo").disabled = false;
    });
    linhas[0].querySelector(".mover-para-cima").disabled = true;
    linhas[linhas.length - 1].querySelector(
      ".mover-para-baixo"
    ).disabled = true;
  };
  const linhasIniciais = listaUcs.querySelectorAll("tr");
  linhasIniciais.forEach((linha) => {
    configurarEventosLinha(linha);
  });
  atualizarEstadoBotoes();
  function configurarEventosLinha(linha) {
    const btnMoverCima = linha.querySelector(".mover-para-cima");
    const btnMoverBaixo = linha.querySelector(".mover-para-baixo");

    btnMoverCima.addEventListener("click", () => {
      const linhaAtual = btnMoverCima.closest("tr");
      const linhaAnterior = linhaAtual.previousElementSibling;
      if (linhaAnterior) {
        listaUcs.insertBefore(linhaAtual, linhaAnterior);
        atualizarEstadoBotoes();
      }
    });
    btnMoverBaixo.addEventListener("click", () => {
      const linhaAtual = btnMoverBaixo.closest("tr");
      const proximaLinha = linhaAtual.nextElementSibling;
      if (proximaLinha) {
        listaUcs.insertBefore(linhaAtual, proximaLinha.nextElementSibling);
        atualizarEstadoBotoes();
      }
    });
  }
  addUcBtn.addEventListener("click", () => {
    const nomeUc = prompt("Digite o nome da UC:");
    if (!nomeUc) {
      alert("Nome da UC não pode ser vazio.");
      return;
    }
    const novaLinha = renderizarLinhaUc(nomeUc);
    listaUcs.appendChild(novaLinha);
    configurarEventosLinha(novaLinha);
    atualizarEstadoBotoes();
  });
});
