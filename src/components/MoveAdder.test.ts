import { IMove } from "battlemovr";
import { expect } from "chai";
import { stubBlankGame } from "../fakes.test";
import { IPokemon } from "./Battles";
import { MoveAdder } from "./MoveAdder";

describe("MoveAdder", () => {

    it("adds a new move to a Pokemon's moveset when the move index is valid", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
            moves: [
                {title: "Bide", remaining: 10, uses: 10}],
        });
        const peck: IMove = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        //Act
        fsp.moveadder.addMove(pokemon, peck, 1);

        //Assert
        expect(pokemon.moves[1].title).to.be.equal(peck.title);
    });

    it("replaces an old move with a new one in a Pokemon's moveset when the move index is valid", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
            moves: [
                {title: "Bide", remaining: 10, uses: 10}],
        });
        const peck: IMove = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        //Act
        fsp.moveadder.addMove(pokemon, peck, 0);

        //Assert
        expect(pokemon.moves[0].title).to.be.equal(peck.title);
    });

    it("does not add a move when a negative move index is given", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
        });
        const peck: IMove = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        //Act
        const action = () => fsp.moveadder.addMove(pokemon, peck, -1);

        //Assert
        expect(action).to.throw("Invalid move parameters.");
    });

    it("does not add a move when given move index is larger than the 4 allotted moveslots per Pokemon", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
        });
        const peck: IMove = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        //Act
        const action = () => fsp.moveadder.addMove(pokemon, peck, 4);

        //Assert
        expect(action).to.throw("Invalid move parameters.");
    });

    it("does not add a move when the Pokemon already knows the move in another moveslot", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
        });
        const peck: IMove = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };
        const bite: IMove = {
            title: "Bite",
            remaining: 10,
            uses: 10,
        };
        fsp.moveadder.addMove(pokemon, peck, 1);
        fsp.moveadder.addMove(pokemon, bite, 2);

        //Act
        const action = () => fsp.moveadder.addMove(pokemon, peck, 2);

        //Assert
        expect(action).to.throw("This Pokemon already knows this move.");
    });

    it("dialog menu opens when pokemon tries to learn move", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
        });
        const peck: IMove = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        //Act
        fsp.moveadder.startDialog(pokemon, peck);

        //Assert
        expect(fsp.menuGrapher.getActiveMenuName()).to.be.equal("GeneralText");
    });

    it("teaches you a move when you have an open move slot and begin move dialog", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
            moves: [
                {title: "Bide", remaining: 10, uses: 10}],
        });
        const peck: IMove = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        //Act
        fsp.moveadder.startDialog(pokemon, peck);

        //Assert
        expect(pokemon.moves[1]).to.be.equal(undefined);
    });

    it("does not teach you a move when you have four moves and refuse to learn more", (): void => {
        //Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "SQUIRTLE".split(""),
            moves: [
                {title: "Bide", remaining: 10, uses: 10},
                {title: "Bite", remaining: 10, uses: 10},
                {title: "Bubble", remaining: 10, uses: 10},
                {title: "Roar", remaining: 10, uses: 10}],
        });
        const peck: IMove = {
            title: "Peck",
            remaining: 10,
            uses: 10,
        };

        //Act
        fsp.moveadder.startDialog(pokemon, peck);

        //Assert
        expect(pokemon.moves[1]).to.be.equal(undefined);
    });
});
