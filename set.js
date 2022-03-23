"use strict";
function Shape(shape, substence, count, color){
	this.count = count
	this.substence = substence
	this.shape = shape
	this.color = color
}
Shape.prototype.getClassName = function (names){return `${names} ${this.count} ${this.substence} ${this.shape} ${this.color}`}
function EmptyShape(){}
EmptyShape.prototype.getClassName = function (names){return names + ' set-empty'}
function Game(){
	this.deck = [];
	this.topdeck = 0;
	this.extraCardsDrawn = false;
}
Game.attrs = ['circular', 'diamond', 'wave', 'filled', 'empty', 'dashed', 'single', 'double', 'triple', 'red', 'green', 'blue']
Game.prototype.drawCard = function(){return this.deck[this.topdeck++] || new EmptyShape()}
Game.prototype.addScore = function(){const score = document.getElementById('score');score.title = ++ score.value;}
Game.prototype.resetScore = function(){const score = document.getElementById('score');score.title = score.value = 0;}
function *genDeck(){
	for (const shape of ['circular', 'diamond', 'wave'])
	for (const substence of ['filled', 'empty', 'dashed'])
	for (const count of ['single', 'double', 'triple'])
	for (const color of ['red', 'green', 'blue'])
	yield new Shape(shape, substence, count, color);
}
function initGame(){
	if (game.extraCardsDrawn){
		game.extraCardsDrawn = false;
		for (const card of Array.from(document.getElementsByClassName('set-optional')))card.className = 'set-optional';
	}
	game.deck = Array.from(genDeck()).sort(() => 0.5 - Math.random())
	game.topdeck = 0
	game.resetScore()
	for (const card of Array.from(document.getElementsByClassName('set-card')))card.className = game.drawCard().getClassName('set-card');
}
function addCards() {
	const extra = Array.from(document.getElementsByClassName('set-optional'))
	if (game.extraCardsDrawn)return alert("You drew already. You can't draw more");
	game.extraCardsDrawn = true;
	for (const card of extra) card.className = game.drawCard().getClassName('set-optional set-card');
}
function cardSelected() {
	this.classList.toggle('selected')
	const selected = Array.from(document.getElementsByClassName('selected'))
	if (selected.length === 3){
		if (checkElementValidity(selected)){
			game.addScore()
			if (game.extraCardsDrawn){
				game.extraCardsDrawn = false
				const optional = Array.from(document.getElementsByClassName('set-optional'))
				const from = optional.filter(el => !el.classList.contains('selected'))
				for (const card of selected) card.classList.remove('selected');
				const refill = selected.filter(el => !el.classList.contains('set-optional'))
				for (let index = 0; index < refill.length; index++){
					const element = refill[index]
					element.className = 'set-card'
					from[index].classList.forEach(v => {if (v != 'set-optional') element.classList.add(v)})
				}
				for (const card of optional) card.className = 'set-optional';
			} else for (const card of selected) card.className = game.drawCard().getClassName('set-card');
		} else for (const card of selected) card.classList.remove('selected');
	}
}
function checkElementValidity(els) {
	return Game.attrs.every(attr => els.filter(el => el.classList.contains(attr)).length != 2)
}
var game = new Game();
document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('new-game-btn').addEventListener("click", initGame);
	document.getElementById('add-cards-btn').addEventListener("click", addCards);
	for (const card of document.querySelectorAll('.set-card,.set-optional')) card.addEventListener("click", cardSelected);
	initGame();
})