
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVDnw-8NR-zuZAQR_0BsUMP2i2xUbTJUhCNMDSYlt5NvEjEMlQ_kY6vDOEVFKuVNr8u4gea2hGu0ag/pub?gid=0&single=true&output=csv";
let students = [];

fetch(sheetUrl)
  .then(response => response.text())
  .then(csv => {
    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        students = results.data;
        document.getElementById("loading").remove();
      }
    });
  });

function showCheck() {
  document.getElementById("welcome").classList.remove("show");
  setTimeout(() => {
    document.getElementById("welcome").classList.add("hidden");
    document.getElementById("check").classList.remove("hidden");
    document.getElementById("check").classList.add("show");
  }, 300);
}

function goBack() {
  document.getElementById("check").classList.remove("show");
  setTimeout(() => {
    document.getElementById("check").classList.add("hidden");
    document.getElementById("welcome").classList.remove("hidden");
    document.getElementById("welcome").classList.add("show");
    document.getElementById("nisn").value = "";
    document.getElementById("result").innerHTML = "";
  }, 300);
}

function launchConfetti() {
  confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
}

function searchStudent() {
  const nisnInput = document.getElementById("nisn").value.trim();
  const resultBox = document.getElementById("result");

  if (!/^\d{10}$/.test(nisnInput)) {
    resultBox.innerHTML = '<p class="text-red-600 font-medium">Format NISN tidak valid. Harus 10 digit angka.</p>';
    return;
  }

  resultBox.innerHTML = `
    <div class="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-xl text-left animate-fade-in">
      <h3 class="font-bold mb-2">Himbauan!</h3>
      <p class="text-sm mb-3">
        Demi menjaga ketertiban dan keselamatan bersama, siswa/i <strong>dilarang melakukan konvoi di jalanan</strong> dan <strong>tidak diperkenankan merayakan kelulusan secara berlebihan</strong>. Rayakan dengan cara yang positif dan membanggakan.
      </p>
      <label class="inline-flex items-center">
        <input type="checkbox" id="agreeBox" class="form-checkbox h-5 w-5 text-green-600">
        <span class="ml-2 text-sm">Saya telah membaca dan setuju dengan himbauan di atas</span>
      </label>
      <button onclick="confirmSearchStudent('${nisnInput}')" class="mt-4 block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl">Lanjutkan</button>
    </div>
  `;
}

function confirmSearchStudent(nisnInput) {
  const agree = document.getElementById("agreeBox").checked;
  const resultBox = document.getElementById("result");

  if (!agree) {
    alert("Silakan setujui himbauan terlebih dahulu untuk melanjutkan.");
    return;
  }

  const student = students.find(s => s["NISN"].trim() === nisnInput);

  if (student) {
    const isLulus = student["Status"].toUpperCase() === "LULUS";
    if (isLulus) launchConfetti();

    resultBox.innerHTML = `
      <div class="${isLulus ? 'bg-green-100' : 'bg-red-100'} p-6 rounded-xl shadow-lg text-gray-800 animate-fade-in relative">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Hasil Pengumuman Kelulusan</h2>
          <div class="${isLulus ? 'text-green-600' : 'text-red-600'} text-2xl font-bold">${isLulus ? '✔️' : '❌'}</div>
        </div>
        <div class="text-left space-y-2">
          <p><span class="text-sm text-gray-600">Nama Lengkap</span><br><span class="font-semibold">${student["Nama"]}</span></p>
          <p><span class="text-sm text-gray-600">NISN</span><br><span class="font-semibold">${student["NISN"]}</span></p>
          <p><span class="text-sm text-gray-600">Kelas</span><br><span class="font-semibold">${student["Kelas"]}</span></p>
          <p><span class="text-sm text-gray-600">Tempat, Tanggal Lahir</span><br><span class="font-semibold">${student["TTL"]}</span></p>
        </div>
        <div class="mt-4 text-center text-lg font-bold ${isLulus ? 'text-green-700' : 'text-red-700'}">${student["Status"]}</div>
        <div class="mt-4 p-4 rounded-lg text-sm">
          <div class="mb-2 font-semibold text-gray-700">Pesan Motivasi:</div>
          <div class="italic text-gray-600">${isLulus ? 'Selamat! Tetap semangat untuk melanjutkan pendidikan ke jenjang berikutnya.' : 'Jangan menyerah, teruslah belajar dan berusaha untuk meraih masa depan yang lebih baik.'}</div>
        </div>
        <div class="mt-2 p-4 rounded-lg bg-white shadow-sm text-sm">
          <div class="mb-1 font-semibold text-gray-700">Informasi Tambahan:</div>
          <div>${isLulus ? 'Untuk pengambilan SKL dapat dilayani pada tanggal 4 Juni 2025. Silakan berhubungan dengan Ibu Marni, S.Pust selaku Operator Madrasah.' : 'Silakan hubungi walikelas untuk info lebih lanjut.'}</div>
        </div>
        ${isLulus ? '<button onclick="window.print()" class="mt-4 text-sm text-green-600 underline">Cetak Bukti Kelulusan</button>' : ''}
        <button onclick="goBack()" class="mt-6 ${isLulus ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white px-6 py-2 rounded-xl w-full">Kembali ke Halaman Awal</button>
      </div>
    `;
  } else {
    resultBox.innerHTML = '<p class="text-red-600 font-medium">Data tidak ditemukan. Periksa kembali NISN Anda.</p>';
  }
}
