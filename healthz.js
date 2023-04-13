const healthzCheck = (app) => app.get('/healthz', (req, res) => {
    res.status(200).send();
  });
  
  module.exports=healthzCheck;