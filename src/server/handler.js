const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const { storeData, getData } = require('../services/storeData')
 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
 
  const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
 
  const data = {
    "id": id,
    "result": label,
    "explanation": explanation,
    "suggestion": suggestion,
    "confidenceScore": confidenceScore,
    "createdAt": createdAt
  }

  await storeData(id, data);

  const response = h.response({
    status: 'success',
    message: confidenceScore > 99 ? 'Model is predicted successfully' : 'Model is predicted successfully but under threshold. Please use the correct picture',
    data
  })
  response.code(201);
  return response;
}

async function getPredictHandler(request, h){
    try {
        const data = await getData();

        return h.response({
            status: 'success',
            data
        });
    } catch (error) {
        console.error("Error:", error);
        return h.response({
            status: 'error',
            message: 'Failed to retrieve data'
        }).code(500); // Return 500 status code for internal server error
    }
}
 
module.exports = { postPredictHandler, getPredictHandler };