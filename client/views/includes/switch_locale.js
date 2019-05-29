if (Meteor.isClient) {

  Meteor.startup(function () {
    Session.set('i18-tag', 'pt');
    Session.setDefault('showLoadingIndicator', false);
  });

  TAPi18n.setLanguage('pt')
    .done(function() {
      Session.set("showLoadingIndicator", false);
    })
    .fail(function(error_message) {
      // Handle the situation
      console.log(error_message);
    });

  Template.SwitchLanguage.events({
    "click a.language-tag": function(event, tpl) {
      var locale = null;
      $this = $(event.target);
      locale = $this.data("lang");
      Session.set('i18nTag', locale);
    }
  });

  Template.SwitchLanguage.helpers({
    languages: function() {
      return _.map(TAPi18n.getLanguages(), function(lang, tag) {
        return {
          tag: tag,
          name: lang.name
        };
      });
    },
    isCurrentLanguage: function() {
      return this.tag === TAPi18n.getLanguage();
    }
  });

// Here is the magic of
  i18nSwitch = function(tag) {
    // Setting up
    var i18nTag = Session.get('i18nTag') || TAPi18n.getLanguages();
    if (TAPi18n.getLanguage() == i18nTag) {} else {
      TAPi18n.setLanguage(i18nTag);
    }
    return;
  };
  Deps.autorun(function() {
    var i18nTag = Session.get('i18nTag');
    i18nSwitch(i18nTag);
    return;
  });
}