import { Injectable } from '@angular/core';

@Injectable()
export class Usersettings {

  category: any;
  limit: any;
  hasChanged: boolean;

  constructor() {
    this.hasChanged = false;
  }

  setUserSettings(category, limit) {
    this.category = category;
    this.limit = limit;
    localStorage.setItem('category', this.category);
    localStorage.setItem('limit', this.limit);
  }

  getCategory() {
    if (localStorage.getItem('category') != null) {
      this.category = localStorage.getItem('category');
    } else {
      this.category = 'sports';
    }
    return this.category;
  }

  getLimit() {
    if (localStorage.getItem('limit') != null) {
      this.limit = localStorage.getItem('limit');
    } else {
      this.limit = 10;
    }
    return this.limit;
  }

  setHasChanged()
  {
    this.hasChanged = true;
  }

  resetHasChanged()
  {
    this.hasChanged = false;
  }

  getHasChanged() {
    return this.hasChanged;
  }
}
