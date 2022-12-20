import { didSucceedPercentChance, getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";
import Vector from "../../lib/Vector.js";
import RareCandy from "../entities/RareCandy.js";
import Colour from "../enums/Colour.js";
import ImageName from "../enums/ImageName.js";
import PokedexNumber from "../enums/PokedexNumber.js";
import SoundName from "../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, playBackgroundMusic, pokemonFactory, sounds, stateStack, stopBackgroundMusic } from "../globals.js";
import CutScenePerson from "../objects/CutScenePerson.js";
import Inventory from "../objects/Inventory.js";
import Level from "../objects/Level.js";
import CutSceneState from "../states/game/CutSceneState.js";
import DialogueBoxState from "../states/game/DialogBoxState.js";
import TransitionState from "../states/game/TransitionState.js";
import TweeningState from "../states/game/TweeningState.js";
import Background from "../user-interface/Background.js";
import Panel from "../user-interface/Panel.js";
import Map from "./Map.js";
import PokemonFactory from "./PokemonFactory.js";
import Tile from "./Tile.js";

export default class LevelFactory
{

    /**
     * Creates a level
     * @param {Number} level The level number
     * @param {Inventory} inventory  The inventory
     * @returns A promise which resolves to a level.
     */
    static async createLevel(level, inventory)
    {

        switch (level)
        {
            case 1:
                return LevelFactory.oaksLab(inventory, level);
            case 2:
                return LevelFactory.veridianForest(inventory, level);
            case 3:
                return LevelFactory.veridianPond(inventory, level);
            case 4:
                return LevelFactory.pewterCityEntrance(inventory, level);
            case 5:
                return LevelFactory.brockGym(inventory, level);
            default:
                return null;
        }
    }

    // Chapter 1 Section
    static async oaksLab(inventory, levelNumber)
    {

        const mapDefinition = await fetch('./assets/tiled/oaksLab.json').then((response) => response.json());
        const pokemonChances = [
            { num: PokedexNumber.Rattata, chance: 1, levelRange: [3, 7] },
        ];
        const pokemonCount = 25;
        const wildPokemonQueue = this.createPokemonQueue(pokemonChances, pokemonCount);

        const successCutscene = new CutSceneState([
            (callback) => { stateStack.push(new DialogueBoxState("Well that sure was crazy!", Panel.BOTTOM_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("You seem to have a strong bond with your new pokemon. I have a very important task for you.", Panel.BOTTOM_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("I'd like you to travel through Viridian Forest to Pewter City. I owe the Gym trainer Brock some rare candies. Please deliver them to him. By the time you get there, you may even be able to challenge him.", Panel.BOTTOM_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("Thank you for your help. These rattata certainly did not come for the rare candies on their own.\nOn your adventure, be sure to keep an eye out for who, or what might be responsible for this.", Panel.BOTTOM_DIALOGUE, callback)); },
        ]);
        const lossCutscene = new CutSceneState([
            (callback) => { stateStack.push(new DialogueBoxState("That's very bad.", Panel.BOTTOM_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("I can't believe the pokemon I gave you was not strong enough to stop them.", Panel.BOTTOM_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("Hopefully they'll become strong enough to stop this if it ever happens again.", Panel.BOTTOM_DIALOGUE, callback)); },
        ]);

        // Intro cutscene
        const oak = new CutScenePerson(new Vector(CANVAS_WIDTH / 2 - Tile.SIZE / 1.75, 7 * Tile.SIZE), new Vector(98 / 5, 152 / 5), ImageName.OakSmall);
        const introCutscene = new CutSceneState([
            (callback) => { stopBackgroundMusic(); sounds.play(SoundName.WallSmash); callback(); },
            (callback) => { stateStack.push(new DialogueBoxState("Woah! What was that?", Panel.BOTTOM_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new TweeningState([oak], [oak.position], [['y']], [[Tile.SIZE * 9]], [1], "Uh oh! Those rattata look like they're eyeing my rare candies.\nPlease stop them with your new pokemon!", callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("The pokemon will move towards the rare candies and steal them.", Panel.MIDDLE_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("Place your pokemon on one of the grey spots so they can attack the wild pokemon.", Panel.MIDDLE_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("If you want to see your pokemon's stats or moves, click on their party box while they're placed.", Panel.MIDDLE_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("The party box is the list of pokemon in boxes at the bottom of the screen. They will fill up as you catch more pokemon!", Panel.MIDDLE_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("When a pokemon's health gets low, it will turn red. When that happens, you can catch them by picking up the pokeball, hovering over them and letting go of it!", Panel.MIDDLE_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("Now go stop those rattata!", Panel.MIDDLE_DIALOGUE, callback)); },
        ]);

        return new Level(wildPokemonQueue, 20, new Map(mapDefinition, ImageName.Oak),
            inventory,
            Colour.Grey,
            "Oak's Lab",
            ImageName.Level1,
            levelNumber,
            2,
            successCutscene,
            lossCutscene,
            introCutscene,
            1.5,
            [oak]
        );

    }

    static async veridianForest(inventory, levelNumber)
    {
        const mapDefinition = await fetch('./assets/tiled/viridianForest.json').then((response) => response.json());
        const pokemonChances = [
            { num: PokedexNumber.Caterpie, chance: 0.325, levelRange: [5, 7] },
            { num: PokedexNumber.Oddish, chance: 0.1, levelRange: [5, 7] },
            { num: PokedexNumber.Weedle, chance: 0.325, levelRange: [5, 7] },
            { num: PokedexNumber.Pidgey, chance: 0.15, levelRange: [6, 9] },
            { num: PokedexNumber.Pikachu, chance: 0.05, levelRange: [7, 10] },
            { num: PokedexNumber.Jigglypuff, chance: 0.05, levelRange: [9, 10] },
        ];
        const pokemonCount = 75;
        let wildPokemonQueue = this.createPokemonQueue(pokemonChances, pokemonCount);

        // Middle boss wave
        wildPokemonQueue = LevelFactory.addBossPokemon(wildPokemonQueue,
            [
                PokemonFactory.createWildPokemon(PokedexNumber.Pikachu, getRandomPositiveInteger(25, 30), null, true),
                PokemonFactory.createWildPokemon(PokedexNumber.Pikachu, getRandomPositiveInteger(25, 30), null, true),
            ],
            [
                PokemonFactory.createWildPokemon(PokedexNumber.Pikachu, getRandomPositiveInteger(30, 35), null, true),
                PokemonFactory.createWildPokemon(PokedexNumber.Pikachu, getRandomPositiveInteger(30, 35), null, true),
            ]);

        const successCutscene = new CutSceneState([
            (callback) => { stateStack.push(new DialogueBoxState("Woohoo! One step closer to brock.", Panel.BOTTOM_DIALOGUE, callback)); }
        ]);
        const lossCutscene = new CutSceneState([
            (callback) => { stateStack.push(new DialogueBoxState("Oh man! What am I going to tell professor oak?", Panel.BOTTOM_DIALOGUE, callback)); }
        ]);

        // Intro cutscene
        const beedrill = new CutScenePerson(new Vector(0 * Tile.SIZE, 3 * Tile.SIZE), new Vector(Tile.SIZE * 2, Tile.SIZE * 2), ImageName.Beedrill);
        const beedrill2 = new CutScenePerson(new Vector(2 * Tile.SIZE, 7 * Tile.SIZE), new Vector(Tile.SIZE * 2, Tile.SIZE * 2), ImageName.Beedrill);
        const beedrill3 = new CutScenePerson(new Vector(4 * Tile.SIZE, 0 * Tile.SIZE), new Vector(Tile.SIZE * 2, Tile.SIZE * 2), ImageName.Beedrill);
        const background = new Background(Colour.Black);
        const introCutscene = new CutSceneState([
            (callback) => { stateStack.push(new DialogueBoxState("Oh man, I hope this forest isn't as bad as mum said it was.", Panel.BOTTOM_DIALOGUE, callback)); },
            (callback) => { playBackgroundMusic(SoundName.Buzzing); callback(); },
            (callback) => { stateStack.push(new TweeningState([beedrill, beedrill2, beedrill3], [beedrill.dimensions, beedrill2.dimensions, beedrill3.dimensions], [['y', 'x'], ['y', 'x'], ['y', 'x']], [[Tile.SIZE * 9, Tile.SIZE * 9], [Tile.SIZE * 9, Tile.SIZE * 9], [Tile.SIZE * 9, Tile.SIZE * 9]], [1, 1, 1], "Oh no! Those beedrill are coming right at me!", callback)); },
            (callback) => { stateStack.push(new TweeningState([beedrill, beedrill2, beedrill3], [beedrill.dimensions, beedrill2.dimensions, beedrill3.dimensions], [['y', 'x'], ['y', 'x'], ['y', 'x']], [[Tile.SIZE * 15, Tile.SIZE * 15], [Tile.SIZE * 15, Tile.SIZE * 15], [Tile.SIZE * 15, Tile.SIZE * 15]], [1, 1, 1], "AHHHHHHHHHHH!!!", callback)); },
            (callback) => { sounds.play(SoundName.Beatup); setTimeout(callback, 2000); },
            (callback) => { stateStack.push(new TweeningState([background], [background], [['opacity']], [[0]], [1], "Well that sure wasn't fun.", callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("I dropped all my candy when they attacked me!", Panel.BOTTOM_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("There are too many pokemon coming for them, I'll have to stop them before I can continue down the path.", Panel.BOTTOM_DIALOGUE, callback)); }
        ]);

        return new Level(wildPokemonQueue, 20, new Map(mapDefinition, ImageName.Tiles),
            inventory,
            Colour.DarkGreen,
            "Viridian Forest",
            ImageName.Level2,
            levelNumber,
            3,
            successCutscene,
            lossCutscene,
            introCutscene,
            0.75,
            [background]
        );
    }

    static async veridianPond(inventory, levelNumber)
    {
        const mapDefinition = await fetch('./assets/tiled/viridianPond.json').then((response) => response.json());
        const pokemonChances = [
            { num: PokedexNumber.Psyduck, chance: 0.175, levelRange: [9, 12] },
            { num: PokedexNumber.Poliwag, chance: 0.175, levelRange: [9, 12] },
            { num: PokedexNumber.Caterpie, chance: 0.25, levelRange: [8, 12] },
            { num: PokedexNumber.Weedle, chance: 0.25, levelRange: [6, 10] },
            { num: PokedexNumber.Paras, chance: 0.05, levelRange: [10, 12] },
            { num: PokedexNumber.Eevee, chance: 0.1, levelRange: [8, 12] },
        ];
        const pokemonCount = 75;
        let wildPokemonQueue = this.createPokemonQueue(pokemonChances, pokemonCount);
        wildPokemonQueue = LevelFactory.addBossPokemon(wildPokemonQueue,
            [
                PokemonFactory.createWildPokemon(PokedexNumber.Parasect, getRandomPositiveInteger(30, 35), null, true),
                PokemonFactory.createWildPokemon(PokedexNumber.Psyduck, getRandomPositiveInteger(30, 35), null, true),
            ],
            [
                PokemonFactory.createWildPokemon(PokedexNumber.Golduck, getRandomPositiveInteger(30, 35), null, true),
                PokemonFactory.createWildPokemon(PokedexNumber.Poliwhirl, getRandomPositiveInteger(30, 35), null, true),
                PokemonFactory.createWildPokemon(PokedexNumber.Golduck, getRandomPositiveInteger(30, 35), null, true),
            ]);


        const successCutscene = new CutSceneState([
            (callback) => { stateStack.push(new DialogueBoxState("That was absolutely terrifying.", Panel.BOTTOM_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("Refreshing, but terrifying....", Panel.BOTTOM_DIALOGUE, callback)); }
        ]);
        const lossCutscene = new CutSceneState([
            (callback) => { stateStack.push(new DialogueBoxState("I take one break...", Panel.BOTTOM_DIALOGUE, callback)); }
        ]);

        // Intro cutscene
        const background = new Background("rgba(139, 0, 0, 0.25)");
        const introCutscene = new CutSceneState([
            (callback) => { stateStack.push(new DialogueBoxState("How can a forest be so hot??", Panel.BOTTOM_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("I can't handle it. I think I'll take a dip in the pond for a bit.", Panel.BOTTOM_DIALOGUE, callback)); },
            (callback) => { stateStack.push(new TweeningState([background], [background], [['opacity']], [[0]], [2], "Much better...", callback)); sounds.play(SoundName.Splash); },
            (callback) => { stateStack.push(new DialogueBoxState("Uh oh! I think I hear some pokemon coming my way!!", Panel.BOTTOM_DIALOGUE, callback)); }
        ]);

        return new Level(wildPokemonQueue, 20, new Map(mapDefinition, ImageName.Tiles),
            inventory,
            Colour.DodgerBlue,
            "Viridian Pond",
            ImageName.Level3,
            levelNumber,
            4,
            successCutscene,
            lossCutscene,
            introCutscene,
            0.75,
            [background]
        );
    }

    static async pewterCityEntrance(inventory, levelNumber)
    {
        const mapDefinition = await fetch('./assets/tiled/pewterCityEntrance.json').then((response) => response.json());
        const pokemonChances = [
            { num: PokedexNumber.Meowth, chance: 0.15, levelRange: [10, 12] },
            { num: PokedexNumber.Ekans, chance: 0.2, levelRange: [10, 12] },
            { num: PokedexNumber.Grimer, chance: 0.15, levelRange: [13, 15] },
            { num: PokedexNumber.Koffing, chance: 0.2, levelRange: [12, 14] },
            { num: PokedexNumber.Rattata, chance: 0.25, levelRange: [10, 12] },
            { num: PokedexNumber.Drowzee, chance: 0.05, levelRange: [13, 15] },
        ];
        const pokemonCount = 60;
        let wildPokemonQueue = this.createPokemonQueue(pokemonChances, pokemonCount);

        // Add the bosses
        wildPokemonQueue = LevelFactory.addBossPokemon(wildPokemonQueue,
            [
                PokemonFactory.createWildPokemon(PokedexNumber.Persian, getRandomPositiveInteger(30, 35), null, true),
                PokemonFactory.createWildPokemon(PokedexNumber.Arbok, getRandomPositiveInteger(30, 35), null, true),
            ],
            [
                PokemonFactory.createWildPokemon(PokedexNumber.Muk, getRandomPositiveInteger(32, 37), null, true),
                PokemonFactory.createWildPokemon(PokedexNumber.Raticate, getRandomPositiveInteger(32, 37), null, true),
                PokemonFactory.createWildPokemon(PokedexNumber.Weezing, getRandomPositiveInteger(32, 37), null, true),
            ]);

        const rocketGruntsOutro = new CutScenePerson(new Vector(((21 / 2) - (12 / 2)) * Tile.SIZE, (17 / 2 - 12 / 2) * Tile.SIZE), new Vector(12 * Tile.SIZE, 12 * Tile.SIZE), ImageName.RocketGrunts);

        const successCutscene = new CutSceneState([
            (callback) => { playBackgroundMusic(SoundName.BlastingOff); callback(); },
            (callback) => { stateStack.push(new TweeningState([rocketGruntsOutro, rocketGruntsOutro], [rocketGruntsOutro.dimensions, rocketGruntsOutro], [['x', 'y'], ['rotation']], [[0, 0], [180]], [2, 2], "See ya!", callback)); },
            (callback) => { stateStack.push(new DialogueBoxState("I don't know what I'm getting paid but it sure as hell isn't enough. I'm so close I have to keep going.", Panel.BOTTOM_DIALOGUE, callback)); }
        ]);
        const lossCutscene = new CutSceneState([
            (callback) => { playBackgroundMusic(SoundName.BuzzOff); callback(); },
            (callback) => { stateStack.push(new DialogueBoxState("Damn you team Rocket!! I'll be back!", Panel.BOTTOM_DIALOGUE, callback)); }
        ]);

        //Intro CutScene
        const rocketGrunts = new CutScenePerson(new Vector(((21 / 2) - (12 / 2)) * Tile.SIZE, (17 / 2 - 12 / 2) * Tile.SIZE), new Vector(0, 0), ImageName.RocketGrunts);
        const meowth = new CutScenePerson(new Vector(500, 500), new Vector(6 * Tile.SIZE, 6 * Tile.SIZE), ImageName.Meowth);

        const introCutscene = new CutSceneState([
            (callback) => { stateStack.push(new DialogueBoxState("Finally, out of that darned Forest!", Panel.BOTTOM_DIALOGUE, callback)); },
            (callback) => { playBackgroundMusic(SoundName.RocketMotto); callback(); },
            (callback) => { stateStack.push(new TweeningState([rocketGrunts], [rocketGrunts.dimensions], [['x', 'y']], [[Tile.SIZE * 12, Tile.SIZE * 12]], [1], "What you got there little man?! You think you're able to come to Pewter City with all those rare candies and not pay the ROCKET TAX?! Oh boy do we have news for you, prepare for trouble... And make it double...", () => { sounds.play("Pokemon52"); callback(); })); },
            (callback) => { stateStack.push(new TweeningState([rocketGrunts, meowth], [rocketGrunts.dimensions, meowth.position], [['x', 'y'], ['x', 'y']], [[rocketGrunts.dimensions.x, rocketGrunts.dimensions.y], [(21 / 2 - 6 / 2) * Tile.SIZE, (17 / 2 - 6 / 2) * Tile.SIZE]], [1, 1], "DON'T FORGET MEOWTH!!!", callback)); }
        ]);

        return new Level(wildPokemonQueue, 20, new Map(mapDefinition, ImageName.Tiles),
            inventory,
            Colour.Grey,
            "Pewter City Entrance",
            ImageName.Level4,
            levelNumber,
            5,
            successCutscene,
            lossCutscene,
            introCutscene,
            1.15,
            []
        );
    }

    static async brockGym(inventory, levelNumber)
    {
        const mapDefinition = await fetch('./assets/tiled/brock.json').then((response) => response.json());
        const pokemonChances = [
            { num: PokedexNumber.Geodude, chance: 0.35, levelRange: [10, 12] },
            { num: PokedexNumber.Onix, chance: 0.35, levelRange: [10, 12] },
            { num: PokedexNumber.Diglett, chance: 0.2, levelRange: [11, 13] },
            { num: PokedexNumber.Dugtrio, chance: 0.05, levelRange: [13, 15] },
            { num: PokedexNumber.Graveler, chance: 0.05, levelRange: [13, 15] },
        ];
        const pokemonCount = 150;
        let wildPokemonQueue = this.createPokemonQueue(pokemonChances, pokemonCount);

        // Add the bosses
        wildPokemonQueue = LevelFactory.addBossPokemon(wildPokemonQueue,
            [
                PokemonFactory.createWildPokemon(PokedexNumber.Rhydon, getRandomPositiveInteger(30, 35), null, true),
                PokemonFactory.createWildPokemon(PokedexNumber.Graveler, getRandomPositiveInteger(30, 35), null, true),
            ],
            [
                PokemonFactory.createWildPokemon(PokedexNumber.Dugtrio, getRandomPositiveInteger(32, 37), null, true),
                PokemonFactory.createWildPokemon(PokedexNumber.Onix, getRandomPositiveInteger(32, 37), null, true),
                PokemonFactory.createWildPokemon(PokedexNumber.Golem, getRandomPositiveInteger(32, 37), null, true),
            ]);

        const brockOutro = new CutScenePerson(new Vector((21 / 2 * Tile.SIZE) - 150 / 2, 500), new Vector(150, 370), ImageName.Brock);

        const successCutscene = new CutSceneState([
            (callback) => { playBackgroundMusic(SoundName.BoulderBadgeCongratulations); callback(); },
            (callback) => { stateStack.push(new TweeningState([brockOutro], [brockOutro.position], [['x', 'y']], [[brockOutro.position.x, (17 / 2) * Tile.SIZE - brock.dimensions.y / 3]], [1], "Nicely Done!", callback)); },
            (callback) => { stateStack.push(new TweeningState([brockOutro], [brockOutro.position], [['x', 'y']], [[brockOutro.position.x, brockOutro.position.y]], [1], "Oh you brought these rare candies for me?! Thank you so much! But Ummm actually can you bring these to Misty over in Cerulean City?", callback)); },
        ]);
        const lossCutscene = new CutSceneState([
            (callback) => { playBackgroundMusic(SoundName.TakeTheL); callback(); },
            (callback) => { stateStack.push(new DialogueBoxState("Guess I thought too much of you...", Panel.BOTTOM_DIALOGUE, callback)); }
        ]);

        //Intro CutScene
        const brock = new CutScenePerson(new Vector((21 / 2 * Tile.SIZE) - 150 / 2, 500), new Vector(150, 370), ImageName.Brock);
        const onix = new CutScenePerson(new Vector(-120, 17 / 2 * Tile.SIZE - 4 * Tile.SIZE), new Vector(8 * Tile.SIZE, 8 * Tile.SIZE), ImageName.Onix);
        const geodude = new CutScenePerson(new Vector(500, 21 / 2 * Tile.SIZE), new Vector(8 * Tile.SIZE, 8 * Tile.SIZE), ImageName.Geodude);

        const introCutscene = new CutSceneState([
            (callback) => { stateStack.push(new DialogueBoxState("Hello?! I'm looking for Brock, is anyone there?", Panel.BOTTOM_DIALOGUE, callback)); },
            (callback) => { playBackgroundMusic(SoundName.BrockGym); callback(); },
            (callback) => { stateStack.push(new TweeningState([brock], [brock.position], [['x', 'y']], [[brock.position.x, (17 / 2) * Tile.SIZE - brock.dimensions.y / 3]], [1], "Oh you want a challenge don't you? I heard about your run in with Team Rocket and I have to say, I'm impressed!", () => { sounds.play("Pokemon95"); callback(); })); },
            (callback) => { stateStack.push(new TweeningState([brock, onix], [brock.dimensions, onix.position], [['x', 'y'], ['x', 'y']], [[brock.dimensions.x, brock.dimensions.y], [(21 - 8) * Tile.SIZE, (17 / 2 - 6 / 2) * Tile.SIZE]], [1, 1], "I am a master of Rock-Type Pokémon.", () => { sounds.play("Pokemon74"); callback(); })); },
            (callback) => { stateStack.push(new TweeningState([geodude, onix, brock], [geodude.position, onix.position, brock.dimensions], [['x', 'y'], ['x', 'y'], ['x', 'y']], [[0, (17 / 2 - 6 / 2) * Tile.SIZE], [onix.position.x, onix.position.y], [brock.dimensions.x, brock.dimensions.y]], [1, 1, 1], "Let's see what you can do against my ROCK HARD Pokémon!", callback)); },
            (callback) => { stateStack.push(new TweeningState([geodude, onix, brock], [geodude.position, onix.position, brock.dimensions], [['x', 'y'], ['x', 'y'], ['x', 'y']], [[geodude.position.x, geodude.position.y], [onix.position.x, onix.position.y], [brock.dimensions.x, brock.dimensions.y]], [0.1, 0.1, 0.1], "Oh and by the way, you can catch as many Pokémon as you're able to!", callback)); }
        ]);
        return new Level(wildPokemonQueue, 20, new Map(mapDefinition, ImageName.Tiles),
            inventory,
            Colour.Brown,
            "Brock's Gym",
            ImageName.Level5,
            levelNumber,
            5,
            successCutscene,
            lossCutscene,
            introCutscene,
            1,
            []
        );
    }

    static createPokemonQueue(pokemonChances, count)
    {
        const wildPokemonQueue = [];
        for (let i = 0; i < count; i++)
        {
            let pokemonMade = false;
            pokemonChances.forEach((chance, index) =>
            {

                // Don't spawn another pokemon if one was made
                if (pokemonMade)
                    return;

                // If this is the last pokemon chance, spawn it guarunteed
                if (index == pokemonChances.length - 1)
                {
                    wildPokemonQueue.push(
                        PokemonFactory.createWildPokemon(
                            chance.num,
                            getRandomPositiveInteger(chance.levelRange[0], chance.levelRange[1])
                        )
                    );
                }
                else
                {

                    // Calculate the new chance of this pokemon spawning.
                    // If originally the chances are 50%, 25%, 25%, then after the first one fails to spawn
                    // Then the chances for the last 2 become 50% and 50%. This solves that problem
                    const newChance = chance.chance / pokemonChances.slice(index).map(chance => chance.chance).reduce((current, next) => current + next);

                    if (didSucceedPercentChance(newChance))
                    {
                        wildPokemonQueue.push(
                            PokemonFactory.createWildPokemon(
                                chance.num,
                                getRandomPositiveInteger(chance.levelRange[0], chance.levelRange[1])));
                        pokemonMade = true;
                    }
                }
            }
            );
        }

        return wildPokemonQueue;
    }

    static addBossPokemon(regularPokemon, midWave, finalWave)
    {
        return regularPokemon
            .slice(0, regularPokemon.length / 2)
            .concat(midWave)
            .concat(regularPokemon.slice(regularPokemon.length / 2))
            .concat(finalWave);
    }
}