(() => {
  // TODO: inputs
  const APIKEY = "00000000-0000-4000-a000-000000000001";
  const USERKEY = "00000000-0000-4000-a000-000000000002";

  // wrapper to call SpikeApi
  let toggle = true;
  async function pdf(buffer, pass) {
    toggle = !toggle;
    if (toggle) {
      throw new Error("problem");
    }
    return {
      requestId: "00000000-0000-4000-a000-000000000001",
      code: "pdf/success/bank-statement-normal",
      type: 2,
      data: {
        file: "1.pdf",
        statement: {
          bank: "ABS.0",
          accountNumber: "9017446437",
          dates: {
            issuedOn: "2018-09-02T00:00:00",
            from: "2018-08-01T00:00:00",
            to: "2018-08-31T00:00:00",
          },
          nameAddress: ["Mr. J Smith", "10 Main Road", "Cape Town", "8001"],
        },
        transactions: [
          {
            id: 1,
            date: "2017-09-12T00:00:00.000Z",
            description: ["Deposit"],
            amount: 1600.01,
            balance: 1600.01,
          },
          {
            id: 2,
            date: "2017-09-12T00:00:00.000Z",
            description: ["#Monthly Account Fee"],
            amount: -100,
            balance: 1000.01,
          },
          {
            id: 3,
            date: "2017-09-12T00:00:00.000Z",
            description: ["Woolworths"],
            amount: -500,
            balance: 1100.01,
          },
        ],
        valid: true,
      },
    };
  }

  async function pdf2(buffer, pass) {
    try {
      // request
      console.log("requesting /pdf ...");
      let spikeResponse = await window.SpikeApi.pdf(APIKEY, USERKEY, buffer, pass);

      // process response
      if (spikeResponse.type === window.SpikeApi.enums.TYPES.SUCCESS) {
        console.log("JSON", JSON.stringify(spikeResponse, null, 2));
        console.log("SUCCESS");
      } else {
        console.error(
          "ERROR:",
          window.SpikeApi.enums.TYPES.toString(spikeResponse.type) + ":" + spikeResponse.code
        );
      }
    } catch (e) {
      // There are 3 types of exception for you to handle:
      // 1. invalid inputs
      // 2. net connection error (e.g. down, timeout) or > axios maxBodyLength limit
      // 3. http status error (e.g. 500 internal server error, 413 too big)
      if (e instanceof window.SpikeApi.InputValidationError) {
        // 1. invalid inputs
        console.error("EXCEPTION: invalid inputs:\n ", e.validationErrors.join("\n "));
        return;
      } else if (!e.response) {
        // 2. net connection error (e.g. down, timeout) or > axios maxBodyLength limit
        // e : AxiosResponse
        console.error("EXCEPTION: net connection error:", e.code || e.message);
      } else {
        // 3. http status error (e.g. 500 internal server error, 413 too big)
        // e : AxiosResponse
        console.error("EXCEPTION: http status error:", e.response.status, e.response.statusText);
      }
    }
  }

  function init() {
    new DropArea("drop-area", onDrop);

    document.getElementById("fileElem").addEventListener("change", onChoosePdfs, false);
  }

  function onDrop(files) {
    shared(files);
  }

  function onChoosePdfs(e) {
    shared(e.target.files);
  }

  function shared(files) {
    files = [...files];
    files.forEach(async (file, i) => {
      await readFile(i, file);
    });
  }

  function readFile(i, file) {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.onloadend = async function(event) {
        let base64Txt = event.target.result.replace(/^data:application\/pdf;base64,/, "");
        let ok = await uploadPdf(i, file, base64Txt);
        resolve(); // don't bother with reject() - errors already handled by uploadPdf()
      };
      reader.readAsDataURL(file);
    });
  }

  async function uploadPdf(i, file, base64Txt) {
    console.log(`${i} ${file.name}`);
    try {
      let res = await pdf(base64Txt);
      output(res);
      return true;
    } catch (e) {
      console.error(e);
      alert("failed - see console");
      return false;
    }
  }

  function output(val) {
    document.getElementById("json-output").innerText = JSON.stringify(val, null, 2);
  }

  init();
})();
