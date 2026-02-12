Ext.define('StreetEditor.view.street.AddStreetWindow', {
  extend: 'Ext.window.Window',
  xtype: 'addstreetwindow',

  title: 'Добавить улицу',
  width: 420,
  modal: true,
  layout: 'fit',
  resizable: false,

  items: [
    {
      xtype: 'form',
      reference: 'addStreetForm',
      bodyPadding: 12,
      defaults: {
        anchor: '100%',
        labelWidth: 170,
        msgTarget: 'side'
      },
      items: [
        {
          xtype: 'textfield',
          name: 'name',
          fieldLabel: 'Название',
          allowBlank: false,
          minLength: 5,
          minLengthText: 'Название должно содержать более 4 символов'
        },
        {
          xtype: 'combobox',
          name: 'company',
          fieldLabel: 'Отвечающая компания',
          displayField: 'name',
          valueField: 'name',
          forceSelection: true,
          anyMatch: true,
          queryMode: 'local',
          editable: true,
          allowBlank: false
        },
        {
          xtype: 'numberfield',
          name: 'houses',
          fieldLabel: 'Дома',
          allowBlank: false,
          allowDecimals: false,
          minValue: 1,
          hideTrigger: true
        },
        {
          xtype: 'combobox',
          name: 'cityId',
          fieldLabel: 'Город',
          displayField: 'name',
          valueField: 'id',
          forceSelection: true,
          anyMatch: true,
          queryMode: 'local',
          editable: true,
          allowBlank: false
        }
      ],
      buttons: [
        {
          text: 'Создать',
          formBind: true,
          disabled: true,
          handler: function (button) {
            const window = button.up('window');
            if (window.mainController) {
              window.mainController.onCreateStreet(button);
            }
          }
        },
        {
          text: 'Закрыть',
          handler: function (button) {
            button.up('window').close();
          }
        }
      ]
    }
  ]
});
