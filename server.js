require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const {
  calculateRisk
} = require("./analysis/riskEngine");

const{
  checkOpenPhish
}=require("./services/openPhiService")

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "CyberGuard Backend Online",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const { getDomainInfo } = require("./services/whoisService");

app.get("/api/analyze/:domain", async (req, res) => {
  try {
    const domainInfo = await getDomainInfo(req.params.domain);
    const openPhiData= await checkOpenPhish(req.params.domain);

    const riskAnalysis = calculateRisk({
      reputation: domainInfo,
      threatIntel: openPhiData
    });

    res.json({
      analyzedAt: new Date().toISOString(),
      reputation: domainInfo,
      risk: riskAnalysis
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
