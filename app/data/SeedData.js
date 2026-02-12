Ext.define('StreetEditor.data.SeedData', {
  singleton: true,

  cities: [
    { id: 1, name: 'Москва', region: 'Центральный' },
    { id: 2, name: 'Санкт-Петербург', region: 'Северо-Западный' },
    { id: 3, name: 'Казань', region: 'Приволжский' },
    { id: 4, name: 'Екатеринбург', region: 'Уральский' },
    { id: 5, name: 'Новосибирск', region: 'Сибирский' },
    { id: 6, name: 'Ростов-на-Дону', region: 'Южный' },
    { id: 7, name: 'Нижний Новгород', region: 'Приволжский' },
    { id: 8, name: 'Краснодар', region: 'Южный' }
  ],

  companies: [
    { id: 1, name: 'ГородСервис' },
    { id: 2, name: 'Чистый Дом' },
    { id: 3, name: 'Комфорт Плюс' },
    { id: 4, name: 'РегионУправление' },
    { id: 5, name: 'СеверКом' },
    { id: 6, name: 'ДомЭксперт' }
  ],

  streets: [
    { id: 1, name: 'Тверская улица', company: 'ГородСервис', houses: 24, cityId: 1 },
    { id: 2, name: 'Арбат', company: 'Комфорт Плюс', houses: 18, cityId: 1 },
    { id: 3, name: 'Невский проспект', company: 'СеверКом', houses: 31, cityId: 2 },
    { id: 4, name: 'Лиговский проспект', company: 'Чистый Дом', houses: 20, cityId: 2 },
    { id: 5, name: 'Баумана', company: 'ДомЭксперт', houses: 17, cityId: 3 },
    { id: 6, name: 'Чистопольская', company: 'РегионУправление', houses: 22, cityId: 3 },
    { id: 7, name: 'Малышева', company: 'ГородСервис', houses: 19, cityId: 4 },
    { id: 8, name: 'Ленина', company: 'ДомЭксперт', houses: 26, cityId: 4 },
    { id: 9, name: 'Красный проспект', company: 'Комфорт Плюс', houses: 29, cityId: 5 },
    { id: 10, name: 'Советская', company: 'Чистый Дом', houses: 14, cityId: 5 },
    { id: 11, name: 'Большая Садовая', company: 'РегионУправление', houses: 21, cityId: 6 },
    { id: 12, name: 'Пушкинская', company: 'ГородСервис', houses: 16, cityId: 6 },
    { id: 13, name: 'Рождественская', company: 'СеверКом', houses: 13, cityId: 7 },
    { id: 14, name: 'Покровская', company: 'Чистый Дом', houses: 11, cityId: 7 },
    { id: 15, name: 'Красная', company: 'Комфорт Плюс', houses: 23, cityId: 8 }
  ],

  getCitiesData: function () {
    return Ext.clone(this.cities);
  },

  getCompaniesData: function () {
    return Ext.clone(this.companies);
  },

  getStreetsData: function () {
    return Ext.clone(this.streets);
  },

  getRegionData: function () {
    const regions = Ext.Array.unique(Ext.Array.pluck(this.cities, 'region'));
    return Ext.Array.map(regions, function (region) {
      return { name: region };
    });
  }
});
