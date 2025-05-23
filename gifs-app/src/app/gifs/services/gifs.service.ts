import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@enviroments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class GifService {
    private http = inject(HttpClient);

    trendingGifs = signal <Gif[]>([]);
    trendingGifsLoading = signal(true);

    constructor(){
        this.loadTrendingGifs();
    }
    
    loadTrendingGifs() {

      this.http.get<GiphyResponse>(`${environment.giphyURL}/gifs/trending`,{
        params:{
            api_key: environment.giphyApiKey,
            limit: 20,
        }

      }).subscribe((resp) =>{
        const gifs = GifMapper.mapGiphyItemstoGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
        console.log({gifs});

        
      });
    
    }
      searchGifs (query: string) {

        return this.http.get<GiphyResponse>(`${environment.giphyURL}/gifs/search`,{
          params:{
              api_key: environment.giphyApiKey,
              limit: 20,
              q: query,
          }
  
        }).pipe(
          map (({data})=> data),
          map((items)=> GifMapper.mapGiphyItemstoGifArray(items)),

        );
        /* .subscribe((resp) =>{
          const gifs = GifMapper.mapGiphyItemstoGifArray(resp.data);
          
          console.log({search: gifs});
  
          
        }); */


      }
    
}