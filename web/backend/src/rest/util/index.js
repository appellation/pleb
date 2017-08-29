exports.closeWindow = (res) => {
  res.header('content-type', 'text/html');
  res.sendRaw(200, '<script>window.close()</script>');
};
