require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
  calculateRisk
} = require("./analysis/riskEngine");

const app = express();

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

    const riskAnalysis = calculateRisk({reputation: domainInfo});

    res.json({
      reputation: domainInfo,
      risk: riskAnalysis
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
