'use strict';

module.exports = function(app)
{
  var tesseract = require('node-tesseract');
  
  function ocr(req, res)
  {
    var image = req.image;

  }
  app.post('/ocr', ocr);
};