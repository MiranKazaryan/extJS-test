Ext.define('StreetEditor.model.Street', {
  extend: 'Ext.data.Model',

  fields: [
    { name: 'id', type: 'int' },
    { name: 'name', type: 'string' },
    { name: 'company', type: 'string' },
    { name: 'houses', type: 'int' },
    { name: 'cityId', type: 'int' },
    {
      name: 'population',
      type: 'int',
      persist: false,
      convert: function (_value, record) {
        return (record.get('houses') || 0) * 750;
      }
    }
  ]
});
