Ext.application({
  name: 'StreetEditor',

  launch: function () {
    Ext.create('Ext.container.Viewport', {
      layout: 'fit',
      items: [
        {
          xtype: 'mainview'
        }
      ]
    });
  }
});
