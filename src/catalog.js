angular.module('gettext').factory('gettextCatalog', [
  'gettextPlurals',
  '$http',
  '$cacheFactory',
  function (gettextPlurals, $http, $cacheFactory) {
    var catalog;
    var prefixDebug = function (string) {
      if (catalog.debug && catalog.currentLanguage !== catalog.baseLanguage) {
        return '[MISSING]: ' + string;
      } else {
        return string;
      }
    };
    catalog = {
      debug: false,
      strings: {},
      baseLanguage: 'en',
      currentLanguage: 'en',
      cache: $cacheFactory('strings'),
      setStrings: function (language, strings) {
        var key, val, _results;
        if (!this.strings[language]) {
          this.strings[language] = {};
        }
        for (key in strings) {
          val = strings[key];
          if (typeof val === 'string') {
            this.strings[language][key] = [val];
          } else {
            this.strings[language][key] = val;
          }
        }
      },
      getStringForm: function (string, n) {
        var stringTable = this.strings[this.currentLanguage] || {};
        var plurals = stringTable[string] || [];
        return plurals[n];
      },
      getString: function (string,arr) {
           if(!arr || !(arr instanceof Array) || arr.length == 0) {
               return this.getStringForm(string, 0) || prefixDebug(string);
           }else{
                var str = this.getStringForm(string, 0) || prefixDebug(string);
               var replaceArr = str.match(/\[[/\d\]]/g);
               if(replaceArr && replaceArr.length > 0){
                   angular.forEach(replaceArr,function(value){
                      var index = value.match(/\d+/g)[0];
                      if(index < arr.length){
                          str = str.replace(new RegExp("\\[(["+index+"])]","g"), arr[index]);
                      }
                   });
               }
               return str;
           }
      },
      getPlural: function (n, string, stringPlural) {
        var form = gettextPlurals(this.currentLanguage, n);
        return this.getStringForm(string, form) || prefixDebug(n === 1 ? string : stringPlural);
      },
      loadRemote: function (url) {
        return $http({
          method: 'GET',
          url: url,
          cache: catalog.cache
        }).success(function (data) {
          for (var lang in data) {
            catalog.setStrings(lang, data[lang]);
          }
        });
      }
    };
    return catalog;
  }
]);