import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientHttpService {
  private allUrl = 'http://localhost:8080/pokemon';
  private volutionUrl = 'http://localhost:8080/pokemon/evolution-chain?id=';
  private spriteURl = "http://localhost:8080/pokemon/get-sprite?pokemon=";
  private savePokemonUrl = "http://localhost:8080/pokemon/save-pokemon";
  private saveSpecieUrl = "http://localhost:8080/pokemon/save-species";
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get(this.allUrl);
  }

  getEvolutionChain(id : any) {
    return this.http.get(this.volutionUrl+id);
  }

  getSprite(pokemon : any){
    return this.http.get(this.spriteURl+pokemon);
  }

  savePokemon(pokemon : any){
    return this.http.post(this.savePokemonUrl, pokemon);
  }

  saveSpecie(specie : any){
    return this.http.post(this.saveSpecieUrl, specie);
  }
}
