Ext.define('StreetEditor.store.Streets', {
  extend: 'Ext.data.Store',
  alias: 'store.streets',
  model: 'StreetEditor.model.Street',
  pageSize: 8,

  proxy: {
    type: 'memory',
    enablePaging: true,
    reader: {
      type: 'json'
    }
  },

  data: StreetEditor.data.SeedData.getStreetsData()
});
