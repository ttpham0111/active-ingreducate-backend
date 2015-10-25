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

          // Drugs active ingredients list.
          if (text.indexOf('...') > -1)
          {
            var activeIngredients = text.match(/^.*\.\.\.+/gm);

            for (var i = 0; i < activeIngredients.length; ++i)
            {
              activeIngredients[i] = activeIngredients[i]
              .replace(/^(.*?)\.\.\.+/, '$1')
              .replace(/\n+/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();

              console.log(i + ' ' + activeIngredients[i] + '\n');
            }
            result = activeIngredients;
          }

          // Food ingredients list.
          else if (text.toLowerCase().indexOf('ingredient') > -1)
          {
            text = text.replace(/.*:(.*)/, '$1');

            var ingredients = text.split(',');
            if (!ingredients.length)
            {
              ingredients = text.split('/');
            }

            for (var j = 0; j < ingredients.length; ++j)
            {
              ingredients[j] = ingredients[j]
                .replace(/\n+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

              console.log(j + ' ' + ingredients[j] + '\n');
            }
            result = ingredients;
          }
          res.send(
          {
            code: 200,
            message: 'Here are all the ingredients.',
            result: result
          });
        });
      });
    });
  }

  app.get('/ocr', ocr);
};