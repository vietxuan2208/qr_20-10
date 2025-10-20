// Minimal script to generate a greeting card with a QR code using the qrcode library included in index.html
const input = document.getElementById('input');
const mode = document.getElementById('mode');
const template = document.getElementById('template');
const generateBtn = document.getElementById('generate');
const generateGreetingBtn = document.getElementById('generateGreeting');
const greetingTargetSelect = document.getElementById('greetingTarget');
const customTargetInput = document.getElementById('customTarget');
const downloadBtn = document.getElementById('download');
const downloadQRBtn = document.getElementById('downloadQR');
const qrSizeSelect = document.getElementById('qrSize');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const qrStatus = document.getElementById('qrStatus');
const qrPayloadEl = document.getElementById('qrPayload');
const openPayloadBtn = document.getElementById('openPayload');
let lastQrDataUrl = null;
let lastQrPayload = null;

function drawCard(text, qrDataUrl, templateName){
  // clear
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // background card
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // decorative background based on template
  if(templateName === 'pink'){
    const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    g.addColorStop(0,'#ffd1dc');
    g.addColorStop(1,'#ff9ab3');
    ctx.fillStyle = g;
    roundRect(ctx,40,40,canvas.width-80,canvas.height-80,20,true,false);
  } else if(templateName === 'purple'){
    const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    g.addColorStop(0,'#e9d5ff');
    g.addColorStop(1,'#c4b5fd');
    ctx.fillStyle = g;
    roundRect(ctx,40,40,canvas.width-80,canvas.height-80,20,true,false);
  } else {
    const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    g.addColorStop(0,'#fff7ed');
    g.addColorStop(1,'#ffedd5');
    ctx.fillStyle = g;
    roundRect(ctx,40,40,canvas.width-80,canvas.height-80,20,true,false);
  }

  // Title
  ctx.fillStyle = '#2b2b2b';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Chúc mừng 20/10', canvas.width/2, 140);

  // message box
  const boxX = 120;
  const boxY = 180;
  const boxW = canvas.width - 240 - 260; // reserve right side for QR
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  roundRect(ctx, boxX, boxY, boxW, 420, 12, true, false);

  // draw message text
  ctx.fillStyle = '#111';
  ctx.font = '18px Arial';
  ctx.textAlign = 'left';
  wrapText(ctx, text, boxX + 20, boxY + 40, boxW - 40, 26);

  // draw QR image on right
  const qrSize = 320;
  const qrX = canvas.width - qrSize - 100;
  const qrY = 220;
  const img = new Image();
  img.onload = () => {
    // white background for QR
    roundRect(ctx, qrX-12, qrY-12, qrSize+24, qrSize+24, 16, true, false);
    ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

    // small caption under QR
    ctx.fillStyle = '#111';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Quét mã để xem', qrX + qrSize/2, qrY + qrSize + 32);

    downloadBtn.disabled = false;
  };
  img.src = qrDataUrl;
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  if (typeof r === 'undefined') r = 5;
  if (typeof stroke === 'undefined') stroke = true;
  if (typeof fill === 'undefined') fill = false;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(/\s+/);
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

async function generate() {
  const t = input.value.trim();
  if (!t) {
    alert('Vui lòng nhập nội dung hoặc URL');
    return;
  }
  let data = t;
  if (mode.value === 'url') {
    // if doesn't look like URL, add https://
    if (!/^https?:\/\//i.test(data)) {
      data = 'https://' + data;
    }
  }

  // generate QR as data URL
  try {
    if (typeof QRCode === 'undefined' || !QRCode.toDataURL) throw new Error('QR library chưa nạp (QRCode undefined)');
    const qrDataUrl = await QRCode.toDataURL(data, {width: 512, margin:1, color:{dark:'#000000', light:'#FFFFFF'}});
    // compose card
    drawCard(t, qrDataUrl, template.value);
  // remember last QR
  lastQrDataUrl = qrDataUrl;
  lastQrPayload = data;
    // update debug UI
    qrStatus.textContent = '';
    qrPayloadEl.textContent = data;
    // if it's a URL, enable open button
    try { const url = new URL(data); openPayloadBtn.disabled = false; openPayloadBtn.onclick = () => window.open(url.href, '_blank'); } catch(e){ openPayloadBtn.disabled = true; openPayloadBtn.onclick = null; }
  } catch (err) {
    console.error(err);
    qrStatus.textContent = 'Lỗi tạo QR — kiểm tra kết nối CDN hoặc mở console để xem lỗi.';
    qrPayloadEl.textContent = data || '';
    alert('Không thể tạo QR: ' + err);
  }
}

generateBtn.addEventListener('click', () => {
  downloadBtn.disabled = true;
  generate();
});

generateGreetingBtn.addEventListener('click', () => {
  downloadBtn.disabled = true;
  // Decide which URL to use based on greetingTarget
  let landingUrl = 'https://vietxuan2208.github.io/qr_20-10/landing.html';
  const target = greetingTargetSelect.value;
  if (target === 'greeting') landingUrl = 'https://vietxuan2208.github.io/qr_20-10/greeting.html';
  if (target === 'card') landingUrl = 'https://vietxuan2208.github.io/qr_20-10/card.html';
  if (target === 'custom') {
    const c = customTargetInput.value.trim();
    if (c) landingUrl = c;
  }
  if (typeof QRCode === 'undefined' || !QRCode.toDataURL) {
    qrStatus.textContent = 'QR library chưa nạp. Vui lòng kiểm tra mạng hoặc mở file qua HTTP.';
    alert('QR library chưa nạp (QRCode undefined) — kiểm tra kết nối CDN hoặc mở console để biết thêm.');
    return;
  }
  QRCode.toDataURL(landingUrl, {width:512, margin:1}).then(qrDataUrl => {
    drawCard('Quét mã để mở thiệp 20/10', qrDataUrl, template.value);
    qrStatus.textContent = '';
    qrPayloadEl.textContent = landingUrl;
    openPayloadBtn.disabled = false;
    openPayloadBtn.onclick = () => window.open(landingUrl, '_blank');
    // remember last QR
    lastQrDataUrl = qrDataUrl;
    lastQrPayload = landingUrl;
  }).catch(err => {console.error(err); alert('Không thể tạo QR: '+err)});
});

// enable custom input when user selects custom
greetingTargetSelect.addEventListener('change', () => {
  customTargetInput.disabled = greetingTargetSelect.value !== 'custom';
});

// Download QR-only at selected resolution
downloadQRBtn.addEventListener('click', async () => {
  // download the last displayed QR so the saved image matches the preview
  if (!lastQrDataUrl) {
    alert('Chưa có QR hiển thị để tải. Vui lòng nhấn "Tạo QR" trước.');
    return;
  }
  downloadQRBtn.disabled = true;
  try {
    // If user selected a larger size, regenerate from last payload to increase resolution
    const size = parseInt(qrSizeSelect.value, 10) || 1024;
    if (size > 512 && lastQrPayload) {
      if (typeof QRCode === 'undefined' || !QRCode.toDataURL) throw new Error('QR library chưa nạp (QRCode undefined)');
      const large = await QRCode.toDataURL(lastQrPayload, {width: size, margin:1, color:{dark:'#000000', light:'#FFFFFF'}});
      const a = document.createElement('a');
      a.href = large;
      a.download = 'QR-20-10.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      const a = document.createElement('a');
      a.href = lastQrDataUrl;
      a.download = 'QR-20-10.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  } catch (err) {
    console.error(err);
    alert('Không thể tạo/tải QR: ' + err);
  } finally {
    downloadQRBtn.disabled = false;
  }
});

downloadBtn.addEventListener('click', () => {
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'thiệp-20-10.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
});

// initial auto-generate once
window.addEventListener('load', () => {
  generateBtn.click();
});
