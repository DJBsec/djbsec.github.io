async function checkIP() {
  const ip = document.getElementById("ipInput").value.trim();
  const resultBox = document.getElementById("resultBox");
  resultBox.textContent = "🔎 Checking...";

  // Validate IP address (basic regex)
  if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    resultBox.textContent = "❌ Invalid IP address format.";
    return;
  }

  const apiKey = "YOU2958731145c55075a8cb064fe363b509d7e13b22ff2f4f52e6361cae5467cf8c7d67baa05e07c70b";  // Replace this with your real key

  try {
    const res = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&maxAgeInDays=90`, {
      headers: {
        Accept: "application/json",
        Key: apiKey,
      }
    });

    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();

    const d = data.data;
    resultBox.textContent = `
✅ IP Address: ${d.ipAddress}
🌍 Country: ${d.countryCode}
🏷️ ISP: ${d.isp}
🕒 Last Reported: ${d.lastReportedAt || "Never"}
🚨 Abuse Confidence Score: ${d.abuseConfidenceScore}
📊 Total Reports: ${d.totalReports}
🧾 Usage Type: ${d.usageType || "N/A"}
🔗 [View on AbuseIPDB](https://www.abuseipdb.com/check/${ip})
    `.trim();
  } catch (e) {
    resultBox.textContent = `❌ API Error: ${e.message}`;
  }
}
