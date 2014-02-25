define('app', function() {

  /**
   * import all you need modules
   */
  var me = this;
  var language = {
    cn: me.need('lang.cn'),
    en: me.need('lang.en')
  };

  return function() {

    var scope = this;
    console.log(language.en.welcome);

    //just inject English lang object to this
    scope.inject(language.cn);

    this.switchLang = function(key) {
      //switch language
      scope.inject(language[key]);

      //console.clear();
      console.log(language[key].welcome);
    };
  };
});
