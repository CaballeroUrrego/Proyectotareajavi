document.addEventListener("DOMContentLoaded", () => {
  // 1. Menú hamburguesa responsive
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

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
      setMenuOpen(!navMenu.classList.contains("active"));
    });

    navMenu.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navMenu.classList.contains("active")) {
        setMenuOpen(false);
        navToggle.focus();
      }
    });
  }

  // 2. Lógica de Encriptación por desplazamiento (Cifrado César)[cite: 3]
  const btnEncriptar = document.getElementById("btnEncriptar");
  const cancionInput = document.getElementById("cancionInput");
  const claveInput = document.getElementById("claveInput");
  const resultadoCifrado = document.getElementById("resultadoCifrado");

  function cifrar(texto, clave) {
    const desplazamiento = parseInt(clave) || 0;
    return texto
      .split("")
      .map((char) => {
        let code = char.charCodeAt(0);

        // Letras mayúsculas (ASCII 65-90)
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + desplazamiento) % 26) + 65);
        }
        // Letras minúsculas (ASCII 97-122)
        if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + desplazamiento) % 26) + 97);
        }
        return char; // Mantiene espacios y caracteres especiales intactos
      })
      .join("");
  }

  function ejecutarCifrado() {
    if (!cancionInput || !resultadoCifrado) return;
    const textoOriginal = cancionInput.value;
    const clave = claveInput.value;

    if (textoOriginal.trim() === "") {
      resultadoCifrado.textContent = "Por favor ingrese un título.";
      return;
    }

    const textoCifrado = cifrar(textoOriginal, clave);
    resultadoCifrado.textContent = textoCifrado;
  }

  if (btnEncriptar) {
    btnEncriptar.addEventListener("click", ejecutarCifrado);
    ejecutarCifrado(); // Ejecuta una vez al cargar la página
  }
});
