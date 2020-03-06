const SpikeApi = require("@spikedata/api");

// TODO: keys
const APIKEY = "00000000-0000-4000-a000-000000000001";
const USERKEY = "00000000-0000-4000-a000-000000000002";

module.exports = async (req, res) => {
  let { file, pass, buffer } = req.body; // body = SpikeApi.shape["client-gw/pdf"]
  let proxyResponse = await pdfProxy(APIKEY, USERKEY, file, pass, buffer);
  return res.json(proxyResponse);
};

async function pdfProxy(APIKEY, USERKEY, fileName, pass, buffer) {
  try {
    // request
    console.log("requesting /pdf ...");
    let spikeResponse = await SpikeApi.pdf(APIKEY, USERKEY, fileName, pass, buffer);

    // process response
    if (spikeResponse.type === SpikeApi.enums.TYPES.SUCCESS) {
      console.log("SUCCESS");
    } else {
      console.error(
        "ERROR:",
        SpikeApi.enums.TYPES.toString(spikeResponse.type) + ":" + spikeResponse.code
      );
    }
    return spikeResponse;
  } catch (e) {
    // There are 3 types of exception for you to handle:
    // 1. invalid inputs
    // 2. server -> spike : net connection error or http status error
    // 3. ux -> server : net connection or http status error
    if (e instanceof SpikeApi.InputValidationError) {
      // 1. invalid inputs
      console.error("EXCEPTION: invalid inputs:\n ", e.validationErrors.join("\n "));
      return e;
    } else if (!e.response) {
      // 2. net connection error (e.g. down, timeout) or > axios maxBodyLength limit
      // e : AxiosResponse
      console.error("EXCEPTION: ux -> server : net connection error:", e);
      return { serverToSpikeError: e };
    } else {
      // 3. http status error (e.g. 500 internal server error, 413 too big)
      // e : AxiosResponse
      console.error(
        "EXCEPTION: ux -> server : http status error:",
        e.response.status,
        e.response.statusText
      );
      return { serverToSpikeError: e };
    }
  }
}
