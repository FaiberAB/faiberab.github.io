// Convierte grados a radianes
function toRad(deg) {
  return deg * Math.PI / 180;
}

// Calcula tensiones T1, T2, T3 con fórmula analítica
function resolverTensiones(anguloA, anguloB, masa, g = 10) {
  const a = toRad(anguloA);
  const b = toRad(anguloB);
  const peso = masa * g;
  const delta = Math.sin(b - a);

  if (Math.abs(delta) < 1e-6) {
    throw new Error("Ángulos A y B no pueden ser iguales o muy cercanos.");
  }

  const t2 = peso * Math.cos(a) / delta;
  const t1 = peso * Math.cos(b) / delta;
  const t3 = peso;

  return { t1, t2, t3, a, b };
}

// Dibuja vectores T1 (azul), T2 (verde), T3 (rojo) en un canvas
function graficarDirecciones(a, b) {
  const canvas = document.getElementById("canvasGrafico");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const origX = w / 2, origY = h / 2;
  const scale = 100; // 1 unidad = 100 px

  ctx.clearRect(0, 0, w, h);

  // Ejes
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(0, origY);
  ctx.lineTo(w, origY);
  ctx.moveTo(origX, 0);
  ctx.lineTo(origX, h);
  ctx.stroke();

  // Flecha
  function arrow(theta, color) {
    const dx = Math.cos(theta) * scale;
    const dy = Math.sin(theta) * scale;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(origX, origY);
    ctx.lineTo(origX + dx, origY - dy);
    ctx.stroke();

    // Cabeza de flecha
    const headlen = 10;
    const angle = Math.atan2(-dy, dx);
    ctx.beginPath();
    ctx.moveTo(origX + dx, origY - dy);
    ctx.lineTo(
      origX + dx - headlen * Math.cos(angle - Math.PI/6),
      origY - dy - headlen * Math.sin(angle - Math.PI/6)
    );
    ctx.lineTo(
      origX + dx - headlen * Math.cos(angle + Math.PI/6),
      origY - dy - headlen * Math.sin(angle + Math.PI/6)
    );
    ctx.closePath();
    ctx.fill();
  }

  arrow(a, "blue");
  arrow(b, "green");
  arrow(-Math.PI/2, "red");
}

// Manejador del formulario
document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const A = parseFloat(document.getElementById("anguloA").value);
  const B = parseFloat(document.getElementById("anguloB").value);
  const M = parseFloat(document.getElementById("masa").value);
  const out = document.getElementById("resultado");

  out.innerHTML = '';  // Limpia

  const contRes = document.createElement('div');

  try {
    const { t1, t2, t3, a, b } = resolverTensiones(A, B, M);

    contRes.innerHTML = `
      <h2>Resultados</h2>
      <p><strong>T1:</strong> ${Math.abs(t1).toFixed(2)} N</p>
      <p><strong>T2:</strong> ${t2.toFixed(2)} N</p>
      <p><strong>T3:</strong> ${t3.toFixed(2)} N</p>
    `;

    const canvas = document.createElement('canvas');
    canvas.id = 'canvasGrafico';
    canvas.width = 400;
    canvas.height = 400;
    contRes.appendChild(canvas);

    out.appendChild(contRes);
    graficarDirecciones(a, b);

  } catch (err) {
    contRes.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    out.appendChild(contRes);
  }
});
