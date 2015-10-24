'use strict';

module.exports = function(app)
{
  var tesseract = require('node-tesseract');
  var fs = require('fs');

  function ocr(req, res)
  {
    var image = req.image;

    // TODO: Validate.

    // Obtain the request data.
    fs.readFile(image.path, function(err, data)
    {
      if (err)
      {
        res.send(err);
        return;
      }
      var ext = image.type.split('/').pop();
      var path = '../images/temp.' + ext;

      // Write the data so that tesseract has access to it.
      fs.writeFile(path, data, function(err)
      {
        if (err)
        {
          res.send(err);
          return;
        }

        // Convert image to text.
        tesseract.process(path, function(err, text)
        {
          if (err)
          {
            res.send(err);
            return;
          }

          // Parse the text.
          // Assume that the text is accurate.
          console.log('Begin parsing text:\n' + text + '\n*~*~*~*~*~*~*~*');

          var result = 'No ingredients found';

          // Food ingredients list.
          if (text.toLowerCase().indexOf('ingredients') > -1)
          {
            text = text.replace('/.*:(.*)/', '$1');
            var ingredients = text.split(',');
            for (var ingredient in ingredients)
            {
              ingredient = ingredient.trim();
            }
            result = ingredients;
          }
          // Drugs active ingredients list.
          else if (text.indexOf('...') > -1)
          {
            var activeIngredients = text.replace('/^\s*(.*)\.\.+/mg', '$1');
            for (var activeIngredient in activeIngredients)
            {
              activeIngredient = activeIngredient.trim();
            }
            result = activeIngredients;
          }
          res.send(null, result);
        });
      });
    });
  }

  app.get('/ocr', ocr);
};