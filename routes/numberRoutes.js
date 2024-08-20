import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createNumber,
  getNumbers,
  getApiNumber,
  getTariffs,
} from "../controllers/numberController.js";
import {
  tariffPrices,
  getVsbPrices,
  getWhisperPrices,
  getPartialNumbers,
  listVoicemails,
  createVoicemail,
  getHuntGroup,
  createHuntGroup,
  listGreetings,
  createGreeting,
  listBlacklist,
  addToBlacklist,
  getHolidaySettings,
  createHolidaySetting,
} from "../services/tamarApi.js";

const router = express.Router();

router.post("/", authenticate, createNumber);
router.get("/", authenticate, getNumbers);
router.get("/api", authenticate, getApiNumber);

router.get("/tariffs", authenticate, getTariffs);
router.get("/tariffs/prices", tariffPrices);

router.get("/whisper/prices", getWhisperPrices);
router.get("/vsb/prices", getVsbPrices);

router.get("/partial/:partialnumber", getPartialNumbers);

router.get("/voicemails", listVoicemails);
router.get("/voicemail/config/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const config = await getVoicemailConfig(id);
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch voicemail config" });
  }
});
router.post("/voicemail/update", async (req, res) => {
  const configData = req.body;

  try {
    const updatedConfig = await updateVoicemailConfig(configData);
    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ error: "Failed to update voicemail config" });
  }
});
router.post("/voicemails/new", createVoicemail);

router.get("/hunt-groups", getHuntGroup);
router.post("/hunt-groups/new", createHuntGroup);

router.get("/greetings", listGreetings);
router.post("/greetings/new", createGreeting);

router.get("/holiday", getHolidaySettings);
router.post("/holiday/new", createHolidaySetting);

router.get("/blacklist", listBlacklist);
router.post("/blacklist/new", addToBlacklist);

// router.get('/search', searchNumbers);
// router.post('/purchase/initiate', authenticate, validateNumberPurchase, initiateNumberPurchase);
// router.post('/purchase/complete', authenticate, validateNumberPurchase, completeNumberPurchase);
// router.put('/:numberId', authenticate, updateNumberDestination);
// router.delete('/:numberId', authenticate, cancelNumber);
// router.post('/:numberId/usage', authenticate, addNumberUsage);
// router.get('/:numberId/usage', authenticate, getNumberUsage);

export default router;
