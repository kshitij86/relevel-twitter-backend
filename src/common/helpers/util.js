const checkIfValid = (params) => {
  params.forEach((key) => {
    if (key === null || key === undefined) return false;
  });
  return true;
};

const formatResponse = (message, data) => {
  let formattedResponse = { message: message, data: data };
  return formattedResponse;
};

module.exports = {
  checkIfValid: checkIfValid,
  formatResponse: formatResponse,
};
