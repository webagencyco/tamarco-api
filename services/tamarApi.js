import axios from "axios";

const tamarApi = axios.create({
  baseURL: process.env.TAMAR_API_URL,
  auth: {
    username: process.env.TAMAR_API_LOGIN,
    password: process.env.TAMAR_API_TOKEN,
  },
});
export const listNumbers = async () => {
  const response = await tamarApi.get(`/list/numbers`);
  return response.data;
};

export const listTariffs = async () => {
  const response = await tamarApi.get(`/list/tariffs/`);
  return response.data;
};

export const tariffPrices = async (req, res) => {
  try {
    const response = await tamarApi.get(`/list/prices/tariff/`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const purchaseNumber = async (tariff, number, destination) => {
  try {
    const response = await tamarApi.post("/purchase/number/", {
      tariff,
      number,
      destination,
    });
    return response.data;
  } catch (error) {
    console.error("Error purchasing number:", error.message);
    throw new Error("Failed to purchase number");
  }
};

export const getWhisperPrices = async (req, res) => {
  try {
    const response = await tamarApi.get("/list/prices/whisper/");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVsbPrices = async (req, res) => {
  try {
    const response = await tamarApi.get("/list/prices/vsb/");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPartialNumbers = async (req, res) => {
  try {
    const partialNumber = req.params.partialnumber;
    let combinedResults = {};

    const fetchNumbers = async (partial) => {
      const response = await tamarApi.get(`/list/available/${partial}`);
      return response.data;
    };

    combinedResults = await fetchNumbers(partialNumber);

    if (partialNumber === "01") {
      const results02 = await fetchNumbers("02");
      combinedResults = { ...combinedResults, ...results02 };
    }

    res.json(combinedResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const purchaseCallWhisper = async (req, res, number) => {
  try {
    const response = await tamarApi.post("/purchase/callwhisper/", { number });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const purchaseSwitchboard = async (req, res) => {
  try {
    const response = await tamarApi.get("/purchase/switchboard/");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listVoicemails = async (req, res) => {
  try {
    const response = await tamarApi.get("/voicemail/");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to list voicemails" })
  }
};

export const getVoicemailConfig = async (id) => {
  try {
    const response = await tamarApi.get(`/voicemail/config/?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching voicemail config:", error.message);
    throw new Error("Failed to fetch voicemail config");
  }
};
export const updateVoicemailConfig = async (configData) => {
  const {
    id,
    description,
    voicemail,
    email,
    push,
    emailAddresses,
    pin,
    greetingId,
  } = configData;

  try {
    const response = await tamarApi.post('/voicemail/update/', {
      id,
      description,
      voicemail,
      email,
      push,
      emailAddresses,
      pin,
      greetingId,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating voicemail config:", error.message);
    throw new Error("Failed to update voicemail config");
  }
};
export const createVoicemail = async (req, res) => {
  try {
    const { description } = req.body;
    const response = await tamarApi.post('/voicemail/new/', {
      description
    });
    console.log(response.data);
    return res.json(response.data);
  } catch (error) {
    console.error("Error creating voicemail:", error.message);
  }
};

export const getHuntGroup = async (huntid) => {
  try {
    const response = await tamarApi.get(`/ntshunt/?huntid=${huntid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching hunt group details:", error.message);
    throw new Error("Failed to fetch hunt group details");
  }
};

export const createHuntGroup = async (description, type, huntid) => {
  try {
    const response = await tamarApi.post('/ntshunt/new/', {
      description,
      type,
      huntid,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating hunt group:", error.message);
    throw new Error("Failed to create hunt group");
  }
};

export const listGreetings = async () => {
  try {
    const response = await tamarApi.get('/greetings/');
    return response.data;
  } catch (error) {
    console.error("Error listing greetings:", error.message);
    throw new Error("Failed to list greetings");
  }
};

export const createGreeting = async (description) => {
  try {
    const response = await tamarApi.post('/greetings/new/', {
      description,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating greeting:", error.message);
    throw new Error("Failed to create greeting");
  }
};

export const listBlacklist = async () => {
  try {
    const response = await tamarApi.get('/blacklist/');
    return response.data;
  } catch (error) {
    console.error("Error listing blacklist:", error.message);
    throw new Error("Failed to list blacklist");
  }
};

export const addToBlacklist = async (number, action, blockinternational, description) => {
  try {
    const response = await tamarApi.post('/blacklist/', {
      number,
      action,
      blockinternational,
      description,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to blacklist:", error.message);
    throw new Error("Failed to add to blacklist");
  }
};

export const getHolidaySettings = async (id) => {
  try {
    const response = await tamarApi.get(`/holiday/?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching holiday settings:", error.message);
    throw new Error("Failed to fetch holiday settings");
  }
};

export const createHolidaySetting = async (description) => {
  try {
    const response = await tamarApi.post('/holiday/new/', {
      description,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating holiday setting:", error.message);
    throw new Error("Failed to create holiday setting");
  }
};
