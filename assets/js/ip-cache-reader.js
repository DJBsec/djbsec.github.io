async function lookupIP() {
  const ip = document.getElementById("ipInput").value.trim();
  const resultBox = document.getElementById("ipResult");
  resultBox.textContent = "🔎 Checking...";

  if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    resultBox.textContent = "❌ Invalid IP format.";
    return;
  }

  try {
    const res = await fetch(`/assets/data/ipcache/${ip}.json`);
    if (!res.ok) throw new Error("Not found");

    const data = await res.json();
    const d = data.data;

    resultBox.textContent = `
✅ IP: ${d.ipAddress}
🌍 Country: ${d.countryCode}
🏷️ ISP: ${d.isp}
🕒 Last Reported: ${d.lastReportedAt || "Never"}
🛡️ Abuse Score: ${d.abuseConfidenceScore}
📊 Total Reports: ${d.totalReports}
🔗 https://www.abuseipdb.com/check/${ip}
    `.trim();
  } catch (e) {
    resultBox.textContent = `❌ No cached data found for ${ip}. Use GitHub Actions to query it securely.`;
  }
}
