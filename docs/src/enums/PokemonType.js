import AttackType from "./AttackType.js"

class DefenseType{
    
    constructor(name, weaknesses, resistances, immunities){
        this.weaknesses = weaknesses;
        this.resistances = resistances;
        this.immunities = immunities;
        this.name = name;
    }

    weakTo(type){
        return this.weaknesses.includes(type);
    }

    resistantTo(type){
        return this.resistances.includes(type);
    }

    immuneTo(type){
        return this.immunities.includes(type);
    }
}

const PokemonType = {
    Normal: new DefenseType("Normal", [AttackType.Fighting], [], [AttackType.Ghost]),
    Fighting: new DefenseType("Fighting", [AttackType.Flying, AttackType.Psychic, AttackType.Fairy], [AttackType.Rock, AttackType.Bug, AttackType.Dark], []),
    Flying: new DefenseType("Flying", [AttackType.Rock, AttackType.Electric, AttackType.Ice], [AttackType.Fighting, AttackType.Bug, AttackType.Grass], [AttackType.Ground]),
    Poison: new DefenseType("Poison", [AttackType.Ground, AttackType.Psychic], [AttackType.Fighting, AttackType.Poison, AttackType.Bug, AttackType.Grass, AttackType.Fairy], []),
    Ground: new DefenseType("Ground", [AttackType.Water, AttackType.Grass, AttackType.Ice], [AttackType.Poison, AttackType.Rock], [AttackType.Electric]),
    Rock: new DefenseType("Rock", [AttackType.Fighting, AttackType.Ground, AttackType.Steel, AttackType.Water, AttackType.Grass], [AttackType.Normal, AttackType.Flying, AttackType.Poison, AttackType.Fighting], []),
    Bug: new DefenseType("Bug", [AttackType.Flying, AttackType.Rock, AttackType.Fire], [AttackType.Fighting, AttackType.Ground, AttackType.Grass], []),
    Ghost: new DefenseType("Ghost", [AttackType.Ghost, AttackType.Dark], [AttackType.Poison, AttackType.Bug], [AttackType.Normal, AttackType.Fighting]),
    Steel: new DefenseType("Steel", [AttackType.Fighting, AttackType.Ground, AttackType.Fire], [AttackType.Normal, AttackType.Flying, AttackType.Rock, AttackType.Bug, AttackType.Ghost, AttackType.Steel, AttackType.Grass, AttackType.Psychic, AttackType.Ice, AttackType.Dragon, AttackType.Dark, AttackType.Fairy], [AttackType.Poison]),
    Fire: new DefenseType("Fire", [AttackType.Ground, AttackType.Rock, AttackType.Water], [AttackType.Bug, AttackType.Steel, AttackType.Fire, AttackType.Grass, AttackType.Ice, AttackType.Fairy]),
    Water: new DefenseType("Water", [AttackType.Grass, AttackType.Electric], [AttackType.Steel, AttackType.Fire, AttackType.Water, AttackType.Ice], [AttackType.Grass, AttackType.Electric]),
    Grass: new DefenseType("Grass", [AttackType.Flying, AttackType.Poison, AttackType.Bug, AttackType.Fire, AttackType.Ice], [AttackType.Ground, AttackType.Grass, AttackType.Electric, AttackType.Water], []),
    Electric: new DefenseType("Electric", [AttackType.Ground], [AttackType.Flying, AttackType.Steel, AttackType.Electric], []),
    Psychic: new DefenseType("Psychic", [AttackType.Bug, AttackType.Ghost, AttackType.Psychic], [AttackType.Fighting, AttackType.Psychic], []),
    Ice: new DefenseType("Ice", [AttackType.Fighting, AttackType.Rock, AttackType.Steel, AttackType.Fire], [AttackType.Ice], []),
    Dragon: new DefenseType("Dragon", [AttackType.Ice, AttackType.Dragon, AttackType.Fairy], [AttackType.Fighting, AttackType.Water, AttackType.Grass, AttackType.Electric], []),
    Dark: new DefenseType("Dark", [AttackType.Fighting, AttackType.Bug, AttackType.Fairy], [AttackType.Ghost, AttackType.Dark], [AttackType.Psychic]),
    Fairy: new DefenseType("Fairy", [AttackType.Poison, AttackType.Steel], [AttackType.Fighting, AttackType.Bug, AttackType.Dark], [AttackType.Dragon]),
};

export default PokemonType;
