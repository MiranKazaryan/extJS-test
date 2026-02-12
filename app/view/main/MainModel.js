Ext.define('StreetEditor.view.main.MainModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.main',

  stores: {
    cities: {
      type: 'cities'
    },
    streets: {
      type: 'streets'
    },
    companies: {
      type: 'companies'
    }
  }
});
