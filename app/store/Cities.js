Ext.define('StreetEditor.store.Cities', {
  extend: 'Ext.data.Store',
  alias: 'store.cities',
  model: 'StreetEditor.model.City',
  pageSize: 5,

  proxy: {
    type: 'memory',
    enablePaging: true,
    reader: {
      type: 'json'
    }
  },

  data: StreetEditor.data.SeedData.getCitiesData()
});
