document.getElementById("tensionForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const anguloA = parseFloat(e.target.anguloA.value.replace(",", "."));
  const anguloB = parseFloat(e.target.anguloB.value.replace(",", "."));
  const masa = parseFloat(e.target.masa.value.replace(",", "."));

  if (isNaN(anguloA) || isNaN(anguloB) || isNaN(masa)) {
    alert("Por favor, ingresa valores numéricos válidos. Usa punto o coma para decimales.");
    return;
  }

  const g = 10;
  const peso = masa * g;

  const a = anguloA * Math.PI / 180;
  const b = anguloB * Math.PI / 180;

  function ecuacionT2(t2) {
    const t1 = (-Math.cos(b) * t2) / Math.cos(a);
    return (t1 * Math.sin(a) + t2 * Math.sin(b)) - peso;
  }

  function fsolve(func, guess) {
    let x = guess;
    for (let i = 0; i < 100; i++) {
      const fx = func(x);
      const dfx = (func(x + 1e-6) - fx) / 1e-6;
      x = x - fx / dfx;
      if (Math.abs(fx) < 1e-6) break;
    }
    return x;
  }

  const t2 = fsolve(ecuacionT2, 10);
  const t1 = Math.abs((-Math.cos(b) * t2) / Math.cos(a));
  const t3 = peso;

  document.getElementById("t1").textContent = t1.toFixed(2);
  document.getElementById("t2").textContent = t2.toFixed(2);
  document.getElementById("t3").textContent = t3.toFixed(2);
  document.getElementById("anguloT1").textContent = anguloA;
  document.getElementById("anguloT2").textContent = anguloB;
  document.getElementById("resultado").style.display = "block";

  const canvas = document.getElementById("grafico");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const escala = 140;

  // Dibujar plano cartesiano
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

  function dibujarFlecha(x0, y0, x1, y1, color, etiqueta) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    const ang = Math.atan2(y1 - y0, x1 - x0);
    const flechaTamaño = 10;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - flechaTamaño * Math.cos(ang - 0.3), y1 - flechaTamaño * Math.sin(ang - 0.3));
    ctx.lineTo(x1 - flechaTamaño * Math.cos(ang + 0.3), y1 - flechaTamaño * Math.sin(ang + 0.3));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.fillStyle = color;
    ctx.font = "14px Arial";
    ctx.fillText(etiqueta, x1 + 5, y1 + 5);
  }

  const T1_x = Math.cos(a) * escala;
  const T1_y = -Math.sin(a) * escala;
  const T2_x = Math.cos(b) * escala;
  const T2_y = -Math.sin(b) * escala;
  const T3_x = 0;
  const T3_y = escala;

  dibujarFlecha(centerX, centerY, centerX + T1_x, centerY + T1_y, "blue", "T1");
  dibujarFlecha(centerX, centerY, centerX + T2_x, centerY + T2_y, "green", "T2");
  dibujarFlecha(centerX, centerY, centerX + T3_x, centerY + T3_y, "red", "T3");
});
