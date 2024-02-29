const glazingPrices = {
	"Keep original" : 0.0,
	"Sugar milk" : 0.0,
	"Vanilla milk" : 0.50,
	"Double chocolate" : 1.50
};

const packPrices = {
	"1" : 1, "3" : 3, "6" : 5, "12" : 10
};

let glazingOption = "Keep original";
let packOption = 1;
let basePrice = 0;
let rollType = NaN;
let cart = [];

populateCinnamonData();
populateSelectOptions();

function populateCinnamonData() {
	const params = new URLSearchParams(window.location.search);
	rollType = params.get("roll");
	const imagePath = "images/products/" + rolls[rollType]["imageFile"];
	const price = rolls[rollType]["basePrice"];

	const bannerElement = document.querySelector("#banner");
	bannerElement.innerText = rollType + " Cinnamon Roll";

	const imageElement = document.querySelector("img.product-image");
	imageElement.src = imagePath;

	basePrice = parseFloat(price);
	updateTotalPrice();
}

function populateSelectOptions() {
	// Populate glazing options with corresponding price adaptation values
	const glazingSelect = document.querySelector("select#glazing-options");

	for (const [glazing, price] of Object.entries(glazingPrices)) {
		const option = document.createElement("option");
		option.textContent = glazing;
		option.value = price;
		glazingSelect.appendChild(option);
	}

	// Populate pack options with corresponding price adaptation values
	const packSelect = document.querySelector("select#pack-options");

	for (const [pack, price] of Object.entries(packPrices)) {
		const option = document.createElement("option");
		option.textContent = pack;
		option.value = price;
		packSelect.appendChild(option);
	}
}


/* Record the current glazing option and update the total price */
function glazingChange(element) {
	glazingOption = element.options[element.selectedIndex].text;
	updateTotalPrice();
}

/* Record the current pack option and update the total price */
function packChange(element) {
	packOption = element.options[element.selectedIndex].text;
	updateTotalPrice();
}

function updateTotalPrice() {
	const glazingPrice = glazingPrices[glazingOption];
	const packPrice = packPrices[packOption];
	const totalPrice = (basePrice + glazingPrice) * packPrice;
	const totalPriceField = document.querySelector("#add-cart span");
	totalPriceField.textContent = "$" + totalPrice.toFixed(2);
}

class Roll {
    constructor(rollType, rollGlazing, packSize, basePrice) {
        this.type = rollType;
        this.glazing =  rollGlazing;
        this.size = packSize;
        this.basePrice = basePrice;

		this.element = null;
    }
}

function printCart() {
	const roll = new Roll(rollType, glazingOption, packOption, basePrice);
	cart.push(roll);
	console.log(cart);
}

// Adds a roll to the cart, and creates an element for it 
function addToCart(newRoll) { 
	cart.push(newRoll);
	createRollElement(newRoll);
}

function getPrice(roll) {
	const glazingPrice = glazingPrices[roll.rollGlazing];
	const packPrice = packPrices[roll.packSize];
	return (roll.basePrice + glazingPrice) * packPrice;
}

function updateTotalPrice() {
	const totalPriceElement = document.querySelector('.total-price');
	let totalPriceTemp = 0;
	for (const roll in cart) {
		totalPriceTemp += getPrice(roll);
	}
	totalPriceElement.innerHTML = "$ " + totalPriceTemp;
}

// Repurposed from createElement(notecard) from lab06
function createRollElement(newRoll) {
	// make a clone of the cart-item template
	const template = document.querySelector('.cart-item-template');
	const clone = template.content.cloneNode(true);
	newRoll.element = clone.querySelector('.cart-item');

	// update image, details, price of clone
	const newRollImage = newRoll.element.querySelector('.product-image');
	newRollImage.src = rolls[newRoll.rollType]["imageFile"];

	const newRollName = newRoll.element.querySelector('#detail-name');
	newRollName.innerText = newRoll.rollType + " Cinnamon Roll";
	const newRollGlaze = newRoll.element.querySelector('#detail-glaze');
	newRollGlaze.innerText = newRoll.rollGlazing;
	const newRollSize = newRoll.element.querySelector('#detail-size');
	newRollSize.innerText = newRoll.packSize;

	const newRollPrice = newRoll.element.querySelector('item-price');
	newRollPrice.innerText = getPrice(newRoll);
  
	// delete button implementation
	const btnDelete = notecard.element.querySelector('.remove');
	console.log(btnDelete);
	btnDelete.addEventListener('click', () => {
	  deleteRollElement(newRoll);
	});
	
	// add the notecard clone to the DOM
	// find the notecard parent (#notecard-list) and add our notecard as its child
	const cartElement = document.querySelector('.cart-wrapper');
	cartElement.prepend(newRoll.element);
	
	// UNUSED - populate the notecard clone with the actual notecard content
	//updateElement(notecard);
	updateTotalPrice();
}

  // // Repurposed from deleteNote(notecard) from lab06
function deleteRollElement(delRoll) {
	// remove the Roll DOM object from the UI
	delRoll.element.remove();
  
	// remove the actual Roll object from cart
	const index = cart.indexOf(delRoll);
	if (index > -1) { // don't remove anything if nothing is found
		cart.splice(index, 1); 
	}

	updateTotalPrice();
}

const roll1 = new Roll("Original", "Sugar milk", 1, rolls["Original"]["basePrice"]);
addToCart(roll1);
console.log("roll1");
addToCart(new Roll("Walnut", "Vanilla milk", 12, rolls["Walnut"]["basePrice"]));
addToCart(new Roll("Raisin", "Sugar milk", 3, rolls["Raisin"]["basePrice"]));
addToCart(new Roll("Apple", "Original", 3, rolls["Apple"]["basePrice"]));
console.log("Cart: " + cart);
