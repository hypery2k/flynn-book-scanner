var cordova;

//load the app module
beforeEach(module('flynnBookScannerApp'));

beforeEach(function() {
  module(function($provide) {
    $provide.constant('APP_CONFIG', {
      timeout: 1000,
      dev: false,
      debug: false
    });
  });
});

describe("inventoryService", function() {

  var service,
    rootScope,
    httpBackend,
    config,
    mockedSettingsService;

  beforeEach(function() {
    config = {
      activeProfile: function() {
        return {
          remotesync: false,
          dbName: 'test_' + new Date().getMilliseconds(),
          timeout: 1000
        };
      }
    };
    module(function($provide) {
      $provide.value('settingsService', {
        load: function() {
          return config;
        }
      });
    });
    inject(function(inventoryService, $httpBackend, $rootScope) {
      service = inventoryService;
      rootScope = $rootScope;
      httpBackend = $httpBackend;
      // mock views, see https://github.com/driftyco/ionic/issues/2927
      httpBackend.when('GET', new RegExp('views/.*')).respond({});
    });
  });

  it('Use Authentication for Sync', function(done) {

    httpBackend.when('GET', 'http://M%C3%BCller:P%40assword!@remote_test/couchdb').respond({
      status: 400
    });
    config = {
      activeProfile: function() {
        return {
          remotesync: true,
          couchdb: 'http://remote_test/couchdb',
          dbName: 'test',
          user: 'Müller',
          password: 'P@assword!'
        }
      }
    };
    service.syncRemote(true).then(function(response) {
      fail();
    }, function(error) {
      done();
    });
    rootScope.$apply();
    httpBackend.flush();
  });


  it('Read empty inventory', function(done) {
    service.read().then(function(response) {
      expect(response.books).toBeUndefined();
      done();
    });
  });

  it('Save inventory', function(done) {
    var books = null,
      validBookEntry = {
        "kind": "books#volume",
        "id": "lwz8ZwEACAAJ",
        "etag": "b3Rk7DgfRR8",
        "selfLink": "https://www.googleapis.com/books/v1/volumes/lwz8ZwEACAAJ",
        "volumeInfo": {
          "title": "EJB 3.1 professionell",
          "subtitle": "Grundlagen- und Expertenwissen zu Enterprise JavaBeans 3.1 - inkl. JPA 2.0",
          "publishedDate": "2011",
          "industryIdentifiers": [{
            "type": "ISBN_10",
            "identifier": "3898646122"
          }, {
            "type": "ISBN_13",
            "identifier": "9783898646123"
          }],
          "readingModes": {
            "text": false,
            "image": false
          },
          "pageCount": 592,
          "printType": "BOOK",
          "contentVersion": "preview-1.0.0",
          "language": "de",
          "previewLink": "http://books.google.de/books?id=lwz8ZwEACAAJ&dq=:isbn%3D3898646122&hl=&cd=1&source=gbs_api",
          "infoLink": "http://books.google.de/books?id=lwz8ZwEACAAJ&dq=:isbn%3D3898646122&hl=&source=gbs_api",
          "canonicalVolumeLink": "http://books.google.de/books/about/EJB_3_1_professionell.html?hl=&id=lwz8ZwEACAAJ"
        }
      };
    var bookToSave = {
      value: validBookEntry
    };
    service.save(bookToSave).then(function(response) {
      expect(response.books.length).toEqual(1);
      done();
    });
    rootScope.$apply();
  });

  it('remove book in inventory', function(done) {
    var books = null,
      validBookEntry = {
        "kind": "books#volume",
        "id": "lwz8ZwEACAAJ",
        "etag": "b3Rk7DgfRR8",
        "selfLink": "https://www.googleapis.com/books/v1/volumes/lwz8ZwEACAAJ",
        "volumeInfo": {
          "title": "EJB 3.1 professionell",
          "subtitle": "Grundlagen- und Expertenwissen zu Enterprise JavaBeans 3.1 - inkl. JPA 2.0",
          "publishedDate": "2011",
          "industryIdentifiers": [{
            "type": "ISBN_10",
            "identifier": "3898646122"
          }, {
            "type": "ISBN_13",
            "identifier": "9783898646123"
          }],
          "readingModes": {
            "text": false,
            "image": false
          },
          "pageCount": 592,
          "printType": "BOOK",
          "contentVersion": "preview-1.0.0",
          "language": "de",
          "previewLink": "http://books.google.de/books?id=lwz8ZwEACAAJ&dq=:isbn%3D3898646122&hl=&cd=1&source=gbs_api",
          "infoLink": "http://books.google.de/books?id=lwz8ZwEACAAJ&dq=:isbn%3D3898646122&hl=&source=gbs_api",
          "canonicalVolumeLink": "http://books.google.de/books/about/EJB_3_1_professionell.html?hl=&id=lwz8ZwEACAAJ"
        }
      };
    var bookToSave = {
      value: validBookEntry
    };
    service.save(bookToSave).then(function(response) {
      expect(response.books.length).toEqual(1);
      service.remove(bookToSave).then(function(response) {
        service.read().then(function(readResponse) {
          expect(readResponse.books.length).toEqual(0);
          done();
        });
        rootScope.$apply();
      });
      rootScope.$apply();
    });
    rootScope.$apply();
  });

  it('increase amount in inventory', function(done) {
    var books = null,
      validBookEntry = {
        "kind": "books#volume",
        "id": "lwz8ZwEACAAJ",
        "etag": "b3Rk7DgfRR8",
        "selfLink": "https://www.googleapis.com/books/v1/volumes/lwz8ZwEACAAJ",
        "volumeInfo": {
          "title": "EJB 3.1 professionell",
          "subtitle": "Grundlagen- und Expertenwissen zu Enterprise JavaBeans 3.1 - inkl. JPA 2.0",
          "publishedDate": "2011",
          "industryIdentifiers": [{
            "type": "ISBN_10",
            "identifier": "3898646122"
          }, {
            "type": "ISBN_13",
            "identifier": "9783898646123"
          }],
          "readingModes": {
            "text": false,
            "image": false
          },
          "pageCount": 592,
          "printType": "BOOK",
          "contentVersion": "preview-1.0.0",
          "language": "de",
          "previewLink": "http://books.google.de/books?id=lwz8ZwEACAAJ&dq=:isbn%3D3898646122&hl=&cd=1&source=gbs_api",
          "infoLink": "http://books.google.de/books?id=lwz8ZwEACAAJ&dq=:isbn%3D3898646122&hl=&source=gbs_api",
          "canonicalVolumeLink": "http://books.google.de/books/about/EJB_3_1_professionell.html?hl=&id=lwz8ZwEACAAJ"
        }
      };
    var bookToSave = {
      value: validBookEntry
    };
    service.save(bookToSave).then(function(response) {
      books = response.books;
      expect(books.length).toEqual(1);
      var updatedEntry = {
        count: 4,
        value: validBookEntry
      };
      service.save(updatedEntry).then(function(saveResponse) {
        service.read().then(function(readResponse) {
          expect(readResponse.books.length).toEqual(4);
          service.remove(updatedEntry).then(function(response) {
            done();
          });
          rootScope.$apply();
        });
        rootScope.$apply();
      });
      rootScope.$apply();
    });
    rootScope.$apply();
  });


  it('Reduce amount in inventory', function(done) {
    var books = null,
      validBookEntry = {
        "kind": "books#volume",
        "id": "lwz8ZwEACAAJ",
        "etag": "b3Rk7DgfRR8",
        "selfLink": "https://www.googleapis.com/books/v1/volumes/lwz8ZwEACAAJ",
        "volumeInfo": {
          "title": "EJB 3.1 professionell",
          "subtitle": "Grundlagen- und Expertenwissen zu Enterprise JavaBeans 3.1 - inkl. JPA 2.0",
          "publishedDate": "2011",
          "industryIdentifiers": [{
            "type": "ISBN_10",
            "identifier": "3898646122"
          }, {
            "type": "ISBN_13",
            "identifier": "9783898646123"
          }],
          "readingModes": {
            "text": false,
            "image": false
          },
          "pageCount": 592,
          "printType": "BOOK",
          "contentVersion": "preview-1.0.0",
          "language": "de",
          "previewLink": "http://books.google.de/books?id=lwz8ZwEACAAJ&dq=:isbn%3D3898646122&hl=&cd=1&source=gbs_api",
          "infoLink": "http://books.google.de/books?id=lwz8ZwEACAAJ&dq=:isbn%3D3898646122&hl=&source=gbs_api",
          "canonicalVolumeLink": "http://books.google.de/books/about/EJB_3_1_professionell.html?hl=&id=lwz8ZwEACAAJ"
        }
      };
    var bookToSave = {
      count: 4,
      value: validBookEntry
    }
    service.save(bookToSave).then(function(response) {
      books = response.books;
      expect(books.length).toEqual(4);
      var updatedEntry = {
        count: 1,
        value: validBookEntry
      }
      service.save(updatedEntry).then(function(saveResponse) {
        service.read().then(function(readResponse) {
          expect(readResponse.books.length).toEqual(1);
          done();
        });
      });
    });
    rootScope.$apply();
  });
});
