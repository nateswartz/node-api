'use strict';

class CollectionResponse {
    constructor(collection) {
      this.count = collection.length;
      this.collection = collection;
    }
};

module.exports = CollectionResponse; 