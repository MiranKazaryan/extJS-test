Ext.define('StreetEditor.view.main.Main', {
  extend: 'Ext.panel.Panel',
  xtype: 'mainview',

  controller: 'main',
  viewModel: {
    type: 'main'
  },

  layout: {
    type: 'hbox',
    align: 'stretch'
  },

  bodyPadding: 8,
  defaults: {
    margin: '0 8 0 0'
  },

  items: [
    {
      xtype: 'grid',
      reference: 'cityGrid',
      title: 'Города',
      flex: 1,
      bind: {
        store: '{cities}'
      },
      listeners: {
        selectionchange: 'onCitySelectionChange'
      },
      columns: [
        { text: 'Город', dataIndex: 'name', flex: 1.2 },
        { text: 'Регион', dataIndex: 'region', flex: 1.2 },
        {
          text: 'Население',
          dataIndex: 'population',
          flex: 1,
          renderer: 'onPopulationRenderer'
        }
      ],
      dockedItems: [
        {
          xtype: 'toolbar',
          dock: 'top',
          items: [
            {
              xtype: 'textfield',
              reference: 'cityNameFilter',
              emptyText: 'По городу',
              flex: 1,
              checkChangeBuffer: 300,
              listeners: {
                change: 'onCityFiltersChanged'
              },
              triggers: {
                clear: {
                  cls: 'x-form-clear-trigger',
                  hidden: true,
                  handler: function (field) {
                    field.up('mainview').getController().clearFieldValue(field);
                  }
                }
              }
            },
            {
              xtype: 'combobox',
              reference: 'cityRegionFilter',
              emptyText: 'По региону',
              displayField: 'name',
              valueField: 'name',
              editable: false,
              queryMode: 'local',
              forceSelection: true,
              flex: 1,
              store: {
                fields: ['name'],
                data: StreetEditor.data.SeedData.getRegionData()
              },
              listeners: {
                change: 'onCityFiltersChanged'
              },
              triggers: {
                clear: {
                  cls: 'x-form-clear-trigger',
                  hidden: true,
                  handler: function (field) {
                    field.up('mainview').getController().clearFieldValue(field);
                  }
                }
              }
            },
            {
              xtype: 'numberfield',
              reference: 'cityPopulationFilter',
              emptyText: 'Население от',
              hideTrigger: true,
              minValue: 0,
              flex: 1,
              checkChangeBuffer: 300,
              listeners: {
                change: 'onCityFiltersChanged'
              },
              triggers: {
                clear: {
                  cls: 'x-form-clear-trigger',
                  hidden: true,
                  handler: function (field) {
                    field.up('mainview').getController().clearFieldValue(field);
                  }
                }
              }
            }
          ]
        },
        {
          xtype: 'pagingtoolbar',
          dock: 'bottom',
          displayInfo: true,
          bind: {
            store: '{cities}'
          }
        }
      ]
    },
    {
      xtype: 'grid',
      reference: 'streetGrid',
      title: 'Улицы',
      flex: 3,
      margin: 0,
      selModel: {
        type: 'rowmodel'
      },
      listeners: {
        cellclick: 'onStreetGridCellClick'
      },
      plugins: [
        {
          ptype: 'rowediting',
          clicksToEdit: 2,
          pluginId: 'streetRowEditor',
          listeners: {
            edit: 'onStreetEdit'
          }
        }
      ],
      bind: {
        store: '{streets}'
      },
      columns: [
        {
          text: 'Название улицы',
          dataIndex: 'name',
          flex: 1.4,
          editor: {
            xtype: 'textfield',
            allowBlank: false
          }
        },
        {
          text: 'Ответственная компания',
          dataIndex: 'company',
          flex: 1.2,
          editor: {
            xtype: 'combobox',
            displayField: 'name',
            valueField: 'name',
            forceSelection: true,
            queryMode: 'local',
            editable: true,
            anyMatch: true,
            bind: {
              store: '{companies}'
            }
          }
        },
        {
          text: 'Количество домов',
          dataIndex: 'houses',
          flex: 0.8,
          editor: {
            xtype: 'numberfield',
            allowBlank: false,
            minValue: 1,
            allowDecimals: false,
            hideTrigger: true
          }
        },
        {
          text: 'Примерное население',
          dataIndex: 'population',
          flex: 1,
          renderer: 'onStreetPopulationRenderer'
        },
        {
          text: 'Действие',
          itemId: 'streetDeleteColumn',
          width: 120,
          align: 'center',
          sortable: false,
          menuDisabled: true,
          renderer: function () {
            return '<span class="street-delete-link">Удалить</span>';
          }
        }
      ],
      dockedItems: [
        {
          xtype: 'toolbar',
          dock: 'top',
          items: [
            {
              xtype: 'textfield',
              reference: 'streetNameFilter',
              emptyText: 'По названию',
              flex: 1,
              checkChangeBuffer: 300,
              listeners: {
                change: 'onStreetFiltersChanged'
              },
              triggers: {
                clear: {
                  cls: 'x-form-clear-trigger',
                  hidden: true,
                  handler: function (field) {
                    field.up('mainview').getController().clearFieldValue(field);
                  }
                }
              }
            },
            {
              xtype: 'combobox',
              reference: 'streetCompanyFilter',
              emptyText: 'По компании',
              displayField: 'name',
              valueField: 'name',
              forceSelection: false,
              queryMode: 'local',
              editable: true,
              anyMatch: true,
              flex: 1,
              bind: {
                store: '{companies}'
              },
              listeners: {
                change: 'onStreetFiltersChanged',
                keyup: 'onStreetFiltersChanged'
              },
              triggers: {
                clear: {
                  cls: 'x-form-clear-trigger',
                  hidden: true,
                  handler: function (field) {
                    field.up('mainview').getController().clearFieldValue(field);
                  }
                }
              }
            },
            {
              xtype: 'numberfield',
              reference: 'streetHousesFilter',
              emptyText: 'Домов (точно)',
              hideTrigger: true,
              minValue: 0,
              flex: 0.8,
              checkChangeBuffer: 300,
              listeners: {
                change: 'onStreetFiltersChanged'
              },
              triggers: {
                clear: {
                  cls: 'x-form-clear-trigger',
                  hidden: true,
                  handler: function (field) {
                    field.up('mainview').getController().clearFieldValue(field);
                  }
                }
              }
            },
            {
              xtype: 'numberfield',
              reference: 'streetPopulationMinFilter',
              emptyText: 'Население от',
              hideTrigger: true,
              minValue: 0,
              flex: 0.8,
              checkChangeBuffer: 300,
              listeners: {
                change: 'onStreetFiltersChanged'
              },
              triggers: {
                clear: {
                  cls: 'x-form-clear-trigger',
                  hidden: true,
                  handler: function (field) {
                    field.up('mainview').getController().clearFieldValue(field);
                  }
                }
              }
            },
            {
              xtype: 'numberfield',
              reference: 'streetPopulationMaxFilter',
              emptyText: 'Население до',
              hideTrigger: true,
              minValue: 0,
              flex: 0.8,
              checkChangeBuffer: 300,
              listeners: {
                change: 'onStreetFiltersChanged'
              },
              triggers: {
                clear: {
                  cls: 'x-form-clear-trigger',
                  hidden: true,
                  handler: function (field) {
                    field.up('mainview').getController().clearFieldValue(field);
                  }
                }
              }
            },
            '->',
            {
              xtype: 'button',
              text: 'Добавить улицу',
              handler: 'onAddStreetClick'
            }
          ]
        },
        {
          xtype: 'pagingtoolbar',
          dock: 'bottom',
          displayInfo: true,
          bind: {
            store: '{streets}'
          }
        }
      ]
    }
  ]
});
