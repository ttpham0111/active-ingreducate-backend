'use strict';

module.exports = function(app)
{
  var tesseract = require('node-tesseract');

  function test(req, res)
  {
    var img = 'images/sample6.jpg';

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
  }

  // function query(array)
  // {
  //   if (typeof(array) == 'object' && !array.length)
  //   {
  //     return;
  //   }

  //   for (var i = 0; i < array.length; ++i)
  //   {

  //   }
  // }

  app.get('/test', test);
};