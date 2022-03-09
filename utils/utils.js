module.exports.validateUrl = (url) => {
  const regex = /^https?:\/\/(www\.)?[a-zA-Z\d]+\.[\w\-._~:\/?#[\]@!$&'()*+,;=]{2,}#?$/g;
  return regex.test(url);
};
