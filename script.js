'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// %%%%%%%%%%%%%%%%%%%%%%% Class Workout %%%%%%%%%%%%%%%%%%%%%%%

class Workout {
	date = new Date();
	id = (Date.now() + '').slice(-10);

	constructor(coords,distance,duration){
		this.coords = coords;		// [lat, lng]
		this.distance = distance;	// in km
		this.duration = duration;	// in min
	}
};

// ---------------- Class Running ----------------

class Running extends Workout {
	constructor(coords,distance,duration,cadence){
		super(coords,distance,duration);
		this.cadence = cadence;
		this.calcPace();
	}

	calcPace(){
		// min / km
		this.pace = this.duration / this.distance;
		return this.pace;
	}
};

// ---------------- Class Cycling ----------------

class Cycling extends Workout {
	constructor(coords,distance,duration,elevationGain){
		super(coords,distance,duration);
		this.elevationGain = elevationGain;
		this.calcSpeed();
	}

	calcSpeed(){
		// km / h
		this.speed = this.distance / (this.duration / 60);
		return this.speed;
	}
};

// const run = new Running([39,-12],5.2,24,178);
// const cycle = new Cycling([39,-12],27,95,523);
// console.log(run,cycle);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// %%%%%%%%%%%%%%%%%%%%%%% Application Architecture %%%%%%%%%%%%%%%%%%%%%%%

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
	#map;
	#mapEvent;

	constructor(){
		this._getPosition();

		form.addEventListener('submit',this._netWorkout.bind(this));
		inputType.addEventListener('change',this._toggleElevationField);
	}

	_getPosition(){
		if (navigator.geolocation) 
		navigator.geolocation.getCurrentPosition(
			this._loadMap.bind(this),
			function () {
			  alert('Could not get your position');
			});
	}

	_loadMap(position){
		// console.log(position);
		const {latitude} = position.coords;
		const {longitude} = position.coords;
		// console.log(latitude,longitude);
		// console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

		const coords = [10.8313974,78.6988092];
		// const coords = [latitude,longitude];

		// console.log(this)
		this.#map = L.map('map').setView(coords, 13);
		// console.log(map)

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(this.#map);

		// ----- ----- Handling Clicks On Maps ----- -----
		this.#map.on('click',this._showForm.bind(this));
	}

	_showForm(mapE){
		this.#mapEvent = mapE;
		form.classList.remove('hidden');
		inputDistance.focus();
	}

	_toggleElevationField(){
		inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
		inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
	}

	_netWorkout(e){
		e.preventDefault();
		const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
		const allPositive = (...inputs) => inputs.every(inp => inp > 0);

		// ----- ----- get data from form ----- ----- 
		const type = inputType.value;
		const distance = +inputDistance.value;
		const duration = +inputDuration.value;		

		// ----- ----- if workout running, create running object ----- ----- 
		if (type === 'running') {
			const cadence = +inputCadence.value;

			// Check if data is valid 
			if (
				// !Number.isFinite(distance) ||
				// !Number.isFinite(duration) ||
				// !Number.isFinite(cadence) 
				!validInputs(distance,duration,cadence) ||
				!allPositive(distance,duration,cadence)
				) {
				return alert('Inputs have to positive Numbers!')
			}
		}

		// ----- ----- if workout Cycling, create Cycling object ----- ----- 
		if (type === 'cycling') {
			const elevation = +inputElevation;

			// Check if data is valid 
			if (!validInputs(distance,duration,elevation) || !allPositive(distance,duration)) {
				return alert('Inputs have to positive Numbers!')
			}
		}

		// ----- ----- Add new object to workout Array ----- ----- 
		
		// ----- ----- Render Workout on map as marker ----- -----
		// console.log(this.#mapEvent);
		const {lat,lng} = this.#mapEvent.latlng;
		const curCoords = [lat,lng];

		L.marker(curCoords)
		.addTo(this.#map)
	    .bindPopup(L.popup({
	    	maxWidth : 250,
	    	minWidth : 100,
	    	autoClose : false,
	    	closeOnClick : false,
	    	className : 'running-popup',

	    	})
	    )
	    .setPopupContent('Workout')
	    .openPopup();

		// ----- ----- Hide form + clear input fields ----- -----
		inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =  '';		
	}
};

const app = new App();






















