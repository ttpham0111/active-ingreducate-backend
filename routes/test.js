'use strict';

module.exports = function(app)
{
  var tesseract = require('node-tesseract');

  function test(req, res)
  {
    var img = 'images/sample1.png';

    tesseract.process(img, function(err, text)
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
      if (text.toLowerCase().indexOf('ingredient') > -1)
      {
        text = text.replace(/.*:(.*)/, '$1');
        var ingredients = text.split(',');
        for (var i = 0; i < ingredients.length; ++i)
        {
          ingredients[i] = ingredients[i]
            .replace(/\n*/g, '')
            .replace(/\s+/g, '')
            .trim();
          console.log(i + ' ' + ingredients[i] + '\n');
        }
        result = ingredients;
      }
      // Drugs active ingredients list.
      else if (text.indexOf('...') > -1)
      {
        var activeIngredients = text.replace(/^\s*(.*)\.\.+/mg, '$1');
        for (var activeIngredient in activeIngredients)
        {
          activeIngredient = activeIngredient.replace(/\n*/, '').trim();
        }
        result = activeIngredients;
      }
      res.send(
      {
        code: 200,
        message: 'Here are all the ingredients.',
        result: result
      });
    });

  }

  app.get('/test', test);
};