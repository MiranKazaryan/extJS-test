Ext.define('StreetEditor.store.Companies', {
  extend: 'Ext.data.Store',
  alias: 'store.companies',
  model: 'StreetEditor.model.Company',

  data: StreetEditor.data.SeedData.getCompaniesData()
});
