import MyError from "../../utils/error.js";
import axios from "./axios.js"
async function sendSms(payload) {
  try {
    const req = await axios.post("/TransmitSMS", {
      ...{
        service: {
          service: 1
        },
        message: {
          smsid: 101,
          phone: "998990134034",
          text: "Sizning telefoningiz hack bo'lish arafasida"
        }
      }, ...payload,
    })
    return req.data;
  } catch (error) {
    throw new MyError("Something went wrong while sending sms", 500)
  }
}

export default sendSms;