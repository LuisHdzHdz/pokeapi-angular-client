import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ClientHttpService } from './client-http.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'pokeapi-angular-client'; 
  pokemons : any;
  results : any;
  columnas: string[] = [];
  loadData = false;
  idEvChain: any;
  evolutionChain: any;
  chain: any;
  evolvesTo: any;
  species: any;
  evolDetails : any[] = [];
  numberOfEvolutions : any;
  loadChain = false;
  pokemonSprite: any;
  detailsFinal : any[] = [];
  idPokemon : any;

  constructor(private httpService: ClientHttpService) {}
  
  @ViewChild(MatPaginator)  paginator! : MatPaginator;

  getAll() {
    this.columnas =["name"];
    this.httpService.getAll().subscribe(
    (response) => { 
      this.pokemons = response;
      this.results = this.pokemons.results.slice(0, 20);
      this.loadData = true;
    },
    (error) => { console.log(error); });
  }

  getEvolutionChain() {
    this.columnas =["species_name", "sprite"];
    this.loadChain = false;
    this.httpService.getEvolutionChain(this.idEvChain).subscribe(    
     (response) => { 
      this.evolutionChain = response;
      this.chain = this.evolutionChain.chain;
      this.evolvesTo = this.chain.evolves_to;
      this.species = this.chain.evolves_to.species;
      this.evolDetails.splice(0,this.evolDetails.length);
      do{
      this.numberOfEvolutions = this.chain['evolves_to'].length;
      this.evolDetails.push({
        "species_name": this.chain.species.name
      });

      if(this.numberOfEvolutions > 1) {
        for (let i = 1;i < this.numberOfEvolutions; i++) {
          this.evolDetails.push({
            "species_name": this.chain.evolves_to[i].species.name
         });
        }
      }

      this.chain = this.chain['evolves_to'][0];
    }while(!!this.chain && this.chain.hasOwnProperty('evolves_to'));
      
    this.addSprites(this.evolDetails);

    },
    (error) => { console.log(error); });
  }

  addSprites(evolDetails: any){
    this.detailsFinal.splice(0,this.detailsFinal.length);
    evolDetails.forEach((element: any, index: number) => this.getSprite(element.species_name, index, element));
    
  }
  getSprite(pokemon: any, index: number, element: any ){
    let image;
    let idPokemon : any;
    this.httpService.getSprite(pokemon).subscribe(
      async (response) => { 
        this.pokemonSprite =  response;
        image = this.pokemonSprite.sprites.front_default;
        this.detailsFinal.push({"species_name":pokemon, "sprite":image});
        index+1 === this.evolDetails.length  ? this.loadChain = true : this.loadChain = false;

        if (index === 0){
          this.idPokemon = this.pokemonSprite.id;
          let pokemonToSave = {"idpokemons":this.idPokemon, 
            "name":this.pokemonSprite.name, 
            "base_experience":this.pokemonSprite.base_experience,
            "hieght":this.pokemonSprite.height,
            "is_default":this.pokemonSprite.is_default,
            "id_evolution_chain":this.idEvChain,
            "weight":this.pokemonSprite.weight
           };
          this.savePokemon(pokemonToSave);
        }else{
          let specieToSave = {"pokemon_id": this.idPokemon, 
            "url":this.pokemonSprite.species.url, 
            "name":this.pokemonSprite.name,
            "speciesid": this.pokemonSprite.id
           };
          this.saveSpecie(specieToSave);
        }
        
        
      },
      (error) => { console.log(error); });
  }

  savePokemon(pokemon: any){
    this.httpService.savePokemon(pokemon).subscribe(
      async (response) => { 
        console.log("Response: "+response);        
      },
      (error) => { console.log(error); });
  }

  saveSpecie(specie: any){
    this.httpService.saveSpecie(specie).subscribe(
      async (response) => { 
        console.log("Response: "+response);        
      },
      (error) => { console.log(error); });
  }

}

