const configs = {
  DEFAULT_PAGE_SIZE: 10,
  FILE_UPLOAD_DOMAIN: process.env.NODE_ENV === 'development' ? "fea7-213-230-112-97.ngrok.i" : "files.mycenter.uz",
  FRONT_END_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.mycenter.uz',
  BACK_END_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:8001' : 'https://api.mycenter.uz',
  BACK_END_FILE_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:8002' : 'https://files.mycenter.uz',
  BACK_END_PAYMENT_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:8003' : 'https://payments.mycenter.uz',
  BACK_END_PARENT_PAYMENT_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:8004' : 'https://parents.mycenter.uz',
};

export default configs;