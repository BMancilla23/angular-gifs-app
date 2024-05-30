import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'd1uyWNYQQAC0JI52nr0vJSBJ13obUgNC';
  private serviceUrl: string = 'http://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    console.log('Gifs Service Body');
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);

    this._tagsHistory = this.tagsHistory.splice(0, 10);

    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;

    this.organizeHistory(tag);

    /*     this._tagsHistory.unshift(tag); */

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);

    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, {
        params,
      })
      .subscribe(resp => {
        /*  console.log(resp.data); */

        this.gifList = resp.data;
        /*  console.log({ gifs: this.gifList }); */
      });

    /*  const resp = await fetch(
      'http://api.giphy.com/v1/gifs/search?api_key=d1uyWNYQQAC0JI52nr0vJSBJ13obUgNC&q=valorant&limit=10'
    );

    const data = await resp.json();

    console.log(this.tagsHistory); */
  }

  removeTag(tag: string): void {
    this._tagsHistory = this._tagsHistory.filter(t => t !== tag);
    this.saveLocalStorage();
  }
}
