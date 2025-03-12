import KEY from "../../config/APIKey.js";
import { google } from "googleapis";

const DISCOVERY_URL = "https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1";

const perspectiveAPI = async (comment) => {
  try {
    const client = await google.discoverAPI(DISCOVERY_URL);

    const analyzeRequest = {
      comment: { text: comment },
      requestedAttributes: {
        TOXICITY: {},
        INSULT: {},
        THREAT: {},
        SEXUALLY_EXPLICIT: {},
        IDENTITY_ATTACK: {},
      },
    };

    return new Promise((resolve, reject) => {
      client.comments.analyze(
        {
          key: KEY,
          resource: analyzeRequest,
        },
        (err, response) => {
          if (err) {
            reject(err);
          } else {
            console.log(JSON.stringify(response.data, null, 2));
            let flag = false;
            for (const attribute in response.data.attributeScores) {
              if (response.data.attributeScores[attribute].summaryScore.value > 0.4) {
                flag = true;
                break;
              }
            }
            resolve(flag);
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

export default perspectiveAPI;
