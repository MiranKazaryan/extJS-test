Ext.define('StreetEditor.view.main.MainController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.main',

  init: function () {
    this.streetData = StreetEditor.data.SeedData.getStreetsData();
    this.recalculateCityPopulation();
    this.applyCityFilters();
    this.applyStreetFilters();
  },

  getAllRecords: function (store) {
    const data = store.getData();
    const source = data && data.getSource ? data.getSource() : data;
    return source && source.items ? source.items : store.getRange();
  },

  formatEstimated: function (value) {
    return '~' + Ext.util.Format.number(value || 0, '0,000');
  },

  onPopulationRenderer: function (value) {
    return this.formatEstimated(value);
  },

  onStreetPopulationRenderer: function (_value, _meta, record) {
    return this.formatEstimated(record.get('houses') * 750);
  },

  onFilterFieldChange: function (field) {
    this.toggleClearTrigger(field);
  },

  toggleClearTrigger: function (field) {
    const clearTrigger = field.getTrigger && field.getTrigger('clear');
    if (!clearTrigger) {
      return;
    }

    const hasValue = !Ext.isEmpty(field.getValue()) || !Ext.isEmpty(field.getRawValue());
    clearTrigger.setHidden(!hasValue);
  },

  clearFieldValue: function (field) {
    field.setValue(null);
    field.focus();
  },

  onCityFiltersChanged: function (field) {
    this.onFilterFieldChange(field);
    this.applyCityFilters();
  },

  onStreetFiltersChanged: function (field) {
    this.onFilterFieldChange(field);
    this.applyStreetFilters();
  },

  onCitySelectionChange: function () {
    this.applyStreetFilters();
  },

  applyCityFilters: function () {
    const cityStore = this.getViewModel().getStore('cities');
    const cityGrid = this.lookupReference('cityGrid');
    const selectedCity = cityGrid.getSelectionModel().getSelection()[0];

    const cityNameField = this.lookupReference('cityNameFilter');
    const regionField = this.lookupReference('cityRegionFilter');
    const minPopulationField = this.lookupReference('cityPopulationFilter');

    const cityText = Ext.String.trim(cityNameField.getValue() || '').toLowerCase();
    const region = regionField.getValue();
    const minPopulation = minPopulationField.getValue();

    cityStore.clearFilter(true);
    cityStore.filterBy(function (record) {
      const byName = !cityText || record.get('name').toLowerCase().indexOf(cityText) !== -1;
      const byRegion = !region || record.get('region') === region;
      const byPopulation = Ext.isEmpty(minPopulation) || record.get('population') >= Number(minPopulation);
      return byName && byRegion && byPopulation;
    });

    cityStore.loadPage(1);

    if (selectedCity && !cityStore.getById(selectedCity.getId())) {
      cityGrid.getSelectionModel().deselectAll();
    }
  },

  applyStreetFilters: function () {
    const streetStore = this.getViewModel().getStore('streets');
    const cityGrid = this.lookupReference('cityGrid');
    const selectedCity = cityGrid.getSelectionModel().getSelection()[0];

    const nameField = this.lookupReference('streetNameFilter');
    const companyField = this.lookupReference('streetCompanyFilter');
    const housesField = this.lookupReference('streetHousesFilter');
    const populationMinField = this.lookupReference('streetPopulationMinFilter');
    const populationMaxField = this.lookupReference('streetPopulationMaxFilter');

    const nameText = Ext.String.trim(nameField.getValue() || '').toLowerCase();
    const companyText = Ext.String.trim(companyField.getRawValue() || companyField.getValue() || '').toLowerCase();
    const houses = housesField.getValue();
    const minPopulation = populationMinField.getValue();
    const maxPopulation = populationMaxField.getValue();

    const filteredData = Ext.Array.filter(this.streetData, function (street) {
      const streetPopulation = (street.houses || 0) * 750;

      const byCity = !selectedCity || street.cityId === selectedCity.get('id');
      const byName = !nameText || street.name.toLowerCase().indexOf(nameText) !== -1;
      const byCompany = !companyText || street.company.toLowerCase().indexOf(companyText) !== -1;
      const byHouses = Ext.isEmpty(houses) || street.houses === Number(houses);
      const byMinPopulation = Ext.isEmpty(minPopulation) || streetPopulation >= Number(minPopulation);
      const byMaxPopulation = Ext.isEmpty(maxPopulation) || streetPopulation <= Number(maxPopulation);

      return byCity && byName && byCompany && byHouses && byMinPopulation && byMaxPopulation;
    });

    streetStore.getProxy().setData(filteredData);
    streetStore.loadPage(1);
  },

  recalculateCityPopulation: function () {
    const cityStore = this.getViewModel().getStore('cities');
    const populationByCityId = {};

    Ext.Array.each(this.streetData, function (street) {
      const cityId = street.cityId;
      const houses = Number(street.houses || 0);
      populationByCityId[cityId] = (populationByCityId[cityId] || 0) + houses * 750;
    });

    Ext.Array.each(this.getAllRecords(cityStore), function (cityRecord) {
      cityRecord.set('population', populationByCityId[cityRecord.get('id')] || 0);
      cityRecord.commit();
    });
  },

  findStreetById: function (id) {
    let result = null;
    Ext.Array.each(this.streetData, function (street) {
      if (street.id === id) {
        result = street;
        return false;
      }
      return true;
    });
    return result;
  },

  removeStreetById: function (id) {
    let removeIndex = -1;
    Ext.Array.each(this.streetData, function (street, index) {
      if (street.id === id) {
        removeIndex = index;
        return false;
      }
      return true;
    });

    if (removeIndex > -1) {
      this.streetData.splice(removeIndex, 1);
    }
  },

  onStreetDeleteClick: function (_grid, _rowIndex, _colIndex, _item, _event, record) {
    if (!record) {
      return;
    }

    const me = this;
    Ext.Msg.confirm('Удаление', 'Удалить улицу "' + record.get('name') + '"?', function (button) {
      if (button !== 'yes') {
        return;
      }

      const streetGrid = me.lookupReference('streetGrid');
      const rowEditor = streetGrid.findPlugin('streetRowEditor');

      if (rowEditor && rowEditor.editing) {
        rowEditor.cancelEdit();
      }

      me.removeStreetById(record.get('id'));
      me.recalculateCityPopulation();
      me.applyCityFilters();
      me.applyStreetFilters();
    });
  },

  onStreetGridCellClick: function (grid, _td, cellIndex, record, _tr, rowIndex, event) {
    const column = grid.getColumnManager().getColumns()[cellIndex];
    if (!column || column.itemId !== 'streetDeleteColumn') {
      return;
    }

    if (!event.getTarget('.street-delete-link')) {
      return;
    }

    this.onStreetDeleteClick(grid, rowIndex, cellIndex, null, event, record);
  },

  onStreetEdit: function (_editor, context) {
    const me = this;
    const record = context.record;
    const originalValues = context.originalValues;

    Ext.Msg.confirm('Подтверждение', 'Сохранить изменения?', function (button) {
      if (button === 'yes') {
        const street = me.findStreetById(record.get('id'));
        if (street) {
          street.name = record.get('name');
          street.company = record.get('company');
          street.houses = record.get('houses');
        }
        record.commit();
      } else {
        record.set(originalValues);
        record.commit();
      }

      me.recalculateCityPopulation();
      me.applyCityFilters();
      me.applyStreetFilters();
    });
  },

  onAddStreetClick: function () {
    const window = Ext.create('StreetEditor.view.street.AddStreetWindow', {
      mainController: this
    });
    const vm = this.getViewModel();
    const companiesData = Ext.Array.map(this.getAllRecords(vm.getStore('companies')), function (record) {
      return {
        id: record.get('id'),
        name: record.get('name')
      };
    });
    const citiesData = Ext.Array.map(this.getAllRecords(vm.getStore('cities')), function (record) {
      return {
        id: record.get('id'),
        name: record.get('name')
      };
    });

    window.down('combobox[name=company]').setStore(
      Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: companiesData
      })
    );

    window.down('combobox[name=cityId]').setStore(
      Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: citiesData
      })
    );

    window.show();
  },

  onCreateStreet: function (button) {
    const window = button.up('window');
    const form = window.down('form').getForm();

    if (!form.isValid()) {
      return;
    }

    const values = form.getValues();
    const maxId = Ext.Array.reduce(
      this.streetData,
      function (acc, street) {
        return Math.max(acc, Number(street.id));
      },
      0
    );

    this.streetData.push({
      id: maxId + 1,
      name: values.name,
      company: values.company,
      houses: Number(values.houses),
      cityId: Number(values.cityId)
    });

    this.recalculateCityPopulation();
    this.applyCityFilters();
    this.applyStreetFilters();

    window.close();
  }
});
