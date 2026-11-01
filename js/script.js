/**
 * Portafolio Unidad 1: Transmisión y Almacenamiento de Información
 * Script interactivo: Navegación, Cifrado César interactivo, Calculadora de Unidades y UX moderna.
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. NAVEGACIÓN Y MENÚ MÓVIL ACCESIBLE
  // ==========================================================================
  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const sections = document.querySelectorAll("section[id]");
  const btnScrollTop = document.getElementById("btnScrollTop");

  // Control del menú hamburguesa
  if (navToggle && navMenu) {
    const setMenuOpen = (isOpen) => {
      navMenu.classList.toggle("active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú" : "Abrir menú",
      );

      const icon = navToggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-xmark", isOpen);
      }
    };

    navToggle.addEventListener("click", () => {
      const isCurrentlyOpen = navMenu.classList.contains("active");
      setMenuOpen(!isCurrentlyOpen);
    });

    // Cerrar al pulsar un enlace
    navMenu.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) {
        setMenuOpen(false);
      }
    });

    // Cerrar con tecla Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navMenu.classList.contains("active")) {
        setMenuOpen(false);
        navToggle.focus();
      }
    });

    // Cerrar al hacer clic fuera del menú
    document.addEventListener("click", (event) => {
      if (
        navMenu.classList.contains("active") &&
        !navMenu.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    });
  }

  // Header sticky shadow y ScrollSpy de secciones activas
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header sombreado al hacer scroll
    if (header) {
      header.classList.toggle("scrolled", scrollY > 20);
    }

    // Botón flotante volver arriba
    if (btnScrollTop) {
      btnScrollTop.classList.toggle("visible", scrollY > 320);
    }

    // ScrollSpy: Resaltar enlace según la sección visible
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id") || "";
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${currentSectionId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Ejecución inicial

  // Botón volver arriba
  if (btnScrollTop) {
    btnScrollTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ==========================================================================
  // 2. WIDGET INTERACTIVO: CALCULADORA DE UNIDADES DE INFORMACIÓN
  // ==========================================================================
  const unitButtons = document.querySelectorAll(".unit-btn");
  const unitDisplay = document.getElementById("unitDisplay");

  const unitExplanations = {
    bit: "1 Bit (b) = Unidad elemental binaria (0 o 1). Base de toda la lógica digital.",
    byte: "1 Byte (B) = 8 Bits = 1 Carácter alfanumérico en codificación ASCII estándar.",
    kb: "1 Kilobyte (KB) = 1,024 Bytes = Equivale aproximadamente a una página de texto plano.",
    mb: "1 Megabyte (MB) = 1,024 KB = 1,048,576 Bytes = Aproximadamente 1 minuto de música MP3.",
    gb: "1 Gigabyte (GB) = 1,024 MB = 1,073,741,824 Bytes = Alrededor de 250 pistas de audio de alta fidelidad.",
    tb: "1 Terabyte (TB) = 1,024 GB = 1,099,511,627,776 Bytes = Capacidad típica en discos duros y SSDs modernos.",
  };

  unitButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      unitButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const unit = btn.getAttribute("data-unit");
      if (unit && unitDisplay && unitExplanations[unit]) {
        unitDisplay.textContent = unitExplanations[unit];
      }
    });
  });

  // ==========================================================================
  // 3. LABORATORIO INTERACTIVO DE CRIPTOGRAFÍA (CIFRADO CÉSAR)
  // ==========================================================================
  const cancionInput = document.getElementById("cancionInput");
  const claveInput = document.getElementById("claveInput");
  const claveRange = document.getElementById("claveRange");
  const btnEncriptar = document.getElementById("btnEncriptar");
  const btnActionText = document.getElementById("btnActionText");
  const resultadoCifrado = document.getElementById("resultadoCifrado");
  const btnCopiar = document.getElementById("btnCopiar");
  const btnCopyText = document.getElementById("btnCopyText");
  const btnClearInput = document.getElementById("btnClearInput");
  const charCount = document.getElementById("charCount");
  const alphabetShiftVisual = document.getElementById("alphabetShiftVisual");
  const stepFormula = document.getElementById("stepFormula");
  const resultTitle = document.getElementById("resultTitle");
  const resultStatusPill = document.getElementById("resultStatusPill");

  const btnModeEncrypt = document.getElementById("btnModeEncrypt");
  const btnModeDecrypt = document.getElementById("btnModeDecrypt");
  const presetPills = document.querySelectorAll(".preset-pill");

  // Estado del Laboratorio
  let currentMode = "encrypt"; // 'encrypt' | 'decrypt'

  /**
   * Algoritmo de Cifrado y Descifrado César
   * C = (P + K) mod 26 para Cifrar
   * P = (C - K) mod 26 para Descifrar
   * Maneja correctamente módulos negativos en JavaScript.
   */
  function aplicarCifradoCesar(texto, clave, modo = "encrypt") {
    let desplazamiento = parseInt(clave, 10);
    if (isNaN(desplazamiento)) desplazamiento = 0;

    // Normalizar desplazamiento en rango 0..25
    desplazamiento = ((desplazamiento % 26) + 26) % 26;

    // Si es modo descifrar, invertimos el desplazamiento
    const shift = modo === "encrypt" ? desplazamiento : -desplazamiento;

    return texto
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);

        // Letras mayúsculas (ASCII 65 - 90: 'A' - 'Z')
        if (code >= 65 && code <= 90) {
          const base = 65;
          const nuevoCodigo = ((((code - base + shift) % 26) + 26) % 26) + base;
          return String.fromCharCode(nuevoCodigo);
        }

        // Letras minúsculas (ASCII 97 - 122: 'a' - 'z')
        if (code >= 97 && code <= 122) {
          const base = 97;
          const nuevoCodigo = ((((code - base + shift) % 26) + 26) % 26) + base;
          return String.fromCharCode(nuevoCodigo);
        }

        // Caracteres especiales, números, tildes y espacios permanecen intactos
        return char;
      })
      .join("");
  }

  /**
   * Actualiza la visualización del mapeo de letras de muestra
   */
  function actualizarVisualizadorAlfabeto(clave, modo) {
    if (!alphabetShiftVisual) return;
    let k = parseInt(clave, 10) || 0;
    k = ((k % 26) + 26) % 26;

    const shift = modo === "encrypt" ? k : -k;
    const shiftChar = (ch) => {
      const code = ch.charCodeAt(0);
      const nuevoCodigo = ((((code - 65 + shift) % 26) + 26) % 26) + 65;
      return String.fromCharCode(nuevoCodigo);
    };

    const mapA = shiftChar("A");
    const mapB = shiftChar("B");
    const mapC = shiftChar("C");

    alphabetShiftVisual.innerHTML = `A &rarr; <strong>${mapA}</strong> &nbsp;|&nbsp; B &rarr; <strong>${mapB}</strong> &nbsp;|&nbsp; C &rarr; <strong>${mapC}</strong>`;
  }

  /**
   * Ejecuta el procesamiento del texto en tiempo real
   */
  function procesarTexto() {
    if (!cancionInput || !resultadoCifrado) return;

    const texto = cancionInput.value;
    const clave = claveInput ? claveInput.value : 3;
    const numClave = parseInt(clave, 10) || 0;

    // Actualizar contador de caracteres
    if (charCount) {
      charCount.textContent = `${texto.length} carácter${texto.length === 1 ? "" : "es"}`;
    }

    // Botón limpiar input
    if (btnClearInput) {
      btnClearInput.style.display = texto.length > 0 ? "inline-block" : "none";
    }

    // Actualizar visualización del abecedario
    actualizarVisualizadorAlfabeto(numClave, currentMode);

    // Actualizar etiqueta de fórmula
    if (stepFormula) {
      if (currentMode === "encrypt") {
        stepFormula.textContent = `C = (P + ${numClave}) mod 26`;
      } else {
        stepFormula.textContent = `P = (C - ${numClave} + 26) mod 26`;
      }
    }

    // Si el texto está vacío
    if (texto.trim() === "") {
      resultadoCifrado.textContent = "(Esperando texto...)";
      resultadoCifrado.style.opacity = "0.5";
      if (resultStatusPill) {
        resultStatusPill.innerHTML =
          '<i class="fa-solid fa-clock"></i> Esperando';
        resultStatusPill.style.color = "var(--text-muted)";
      }
      return;
    }

    resultadoCifrado.style.opacity = "1";
    const resultado = aplicarCifradoCesar(texto, numClave, currentMode);
    resultadoCifrado.textContent = resultado;

    if (resultStatusPill) {
      resultStatusPill.innerHTML =
        '<i class="fa-solid fa-check"></i> Procesado';
      resultStatusPill.style.color = "var(--accent-emerald)";
    }
  }

  // Sincronización bidireccional Slider <-> Input numérico
  if (claveRange && claveInput) {
    claveRange.addEventListener("input", () => {
      claveInput.value = claveRange.value;
      procesarTexto();
    });

    claveInput.addEventListener("input", () => {
      let val = parseInt(claveInput.value, 10);
      if (isNaN(val)) val = 0;
      if (val < 0) val = 0;
      if (val > 25) val = 25;
      claveInput.value = val;
      claveRange.value = val;
      procesarTexto();
    });
  }

  // Evento de escritura en tiempo real en la caja de texto
  if (cancionInput) {
    cancionInput.addEventListener("input", procesarTexto);
  }

  // Botón Limpiar Texto
  if (btnClearInput && cancionInput) {
    btnClearInput.addEventListener("click", () => {
      cancionInput.value = "";
      cancionInput.focus();
      presetPills.forEach((p) => p.classList.remove("active"));
      procesarTexto();
    });
  }

  // Cambio de Modo: Cifrar vs Descifrar
  if (btnModeEncrypt && btnModeDecrypt) {
    btnModeEncrypt.addEventListener("click", () => {
      currentMode = "encrypt";
      btnModeEncrypt.classList.add("active");
      btnModeDecrypt.classList.remove("active");
      if (btnActionText) btnActionText.textContent = "Cifrar Mensaje";
      if (resultTitle) resultTitle.textContent = "Resultado Cifrado";
      procesarTexto();
    });

    btnModeDecrypt.addEventListener("click", () => {
      currentMode = "decrypt";
      btnModeDecrypt.classList.add("active");
      btnModeEncrypt.classList.remove("active");
      if (btnActionText) btnActionText.textContent = "Descifrar Mensaje";
      if (resultTitle) resultTitle.textContent = "Resultado Descifrado";
      procesarTexto();
    });
  }

  // Botón manual de procesar
  if (btnEncriptar) {
    btnEncriptar.addEventListener("click", () => {
      procesarTexto();
      // Efecto sutil de pulso al presionar
      resultadoCifrado.style.transform = "scale(1.02)";
      setTimeout(() => {
        resultadoCifrado.style.transform = "scale(1)";
      }, 150);
    });
  }

  // Píldoras de Canciones Sugeridas
  presetPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      presetPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      const songTitle = pill.getAttribute("data-song");
      if (songTitle && cancionInput) {
        cancionInput.value = songTitle;
        procesarTexto();
      }
    });
  });

  // Copiar Resultado al Portapapeles
  if (btnCopiar && resultadoCifrado) {
    btnCopiar.addEventListener("click", async () => {
      const textoACopiar = resultadoCifrado.textContent;
      if (!textoACopiar || textoACopiar === "(Esperando texto...)") return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textoACopiar);
        } else {
          // Fallback para entornos no HTTPS o navegadores antiguos
          const textArea = document.createElement("textarea");
          textArea.value = textoACopiar;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          textArea.remove();
        }

        // Feedback visual
        btnCopiar.classList.add("copied");
        if (btnCopyText) btnCopyText.textContent = "¡Copiado!";
        const copyIcon = btnCopiar.querySelector("i");
        if (copyIcon) {
          copyIcon.className = "fa-solid fa-check";
        }

        setTimeout(() => {
          btnCopiar.classList.remove("copied");
          if (btnCopyText) btnCopyText.textContent = "Copiar";
          if (copyIcon) {
            copyIcon.className = "fa-regular fa-copy";
          }
        }, 2000);
      } catch (err) {
        console.error("Error al copiar texto:", err);
      }
    });
  }

  // Inicializar estado del cifrador al cargar
  procesarTexto();
});
