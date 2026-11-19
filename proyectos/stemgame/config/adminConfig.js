// Controla el modo administrador de la web.
// El estado se guarda en localStorage para que no se pierda al recargar la página.
const CLAVE_STORAGE = "stemgame-admin";
const PASSWORD = "admin123"; // ← cambia la contraseña si quieres

// Devuelve true si el usuario tiene el modo admin activado en este navegador.
export function esAdmin() {
  return localStorage.getItem(CLAVE_STORAGE) == "1";
}

// Pide la contraseña al usuario y activa el modo admin si es correcta.
// Devuelve true si se activó, false si canceló o puso mal la contraseña.
export function activarAdmin() {
  const intento = prompt("Introduce la contraseña de administrador:");
  if (intento == null) return false; // el usuario canceló el diálogo
  if (intento == PASSWORD) {
    localStorage.setItem(CLAVE_STORAGE, "1");
    return true;
  }
  alert("Contraseña incorrecta");
  return false;
}

// Desactiva el modo admin borrando la clave del localStorage.
export function desactivarAdmin() {
  localStorage.removeItem(CLAVE_STORAGE);
}

// Si el admin está activo lo desactiva, y si no lo está pide la contraseña.
// En ambos casos recarga la página para que los cambios se apliquen.
export function toggleAdmin() {
  if (esAdmin()) {
    desactivarAdmin();
    location.reload();
  } else if (activarAdmin()) {
    location.reload();
  }
}
