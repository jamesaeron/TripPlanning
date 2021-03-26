/* globals localStorage */

// Feature 13 - Provide Default Values
const STORAGE_KEY = 'CyclistRecording'

// Feature 2 - Add a Trip
class Trip{	// eslint-disable-line no-unused-vars
	constructor(newRecordID, newTrip, date, terrain, distance, targetTimeFinished, estimatedSpeed){
		this.id = newRecordID
		this.tripName = newTrip
		this.date = date
		this.terrain = terrain
		this.distance = distance
		this.targetTimeFinished = targetTimeFinished
		this.estimatedSpeed = Math.round(estimatedSpeed,2)
		this.done = false // FEATURE 13. Provide default values
	}
	
}


// FEATURE 1 - Create a whole which acts as a Facade for parts
class Cyclist{// eslint-disable-line no-unused-vars
	constructor(){
		this.recorded_trip = []
		// these 5 attibutes are used to support editing a trip
		this.updateTrip = null
		this.beforeUpdateTripCache = ''
		this.beforeUpdateDistanceCache = ''
		this.beforeUpdateTimeCache = ''
		this.estimatedSpeed = 0 // FEATURE 13. Provide default values
	}

	// Feature 2 - Add a Trip
	addTrip(newTrip, date, terrain, distance, targetTimeFinished){
		newTrip = newTrip.trim()
		// Feature 10 -	Validate inputs
		if (!newTrip || !date || !terrain || !distance || !targetTimeFinished){
			return
		}
		else{
			// FEATURE 13 - Provide default values
			const newRecordID = this.recorded_trip.length + 1
			// FEATURE 11 - A calculation within a part
			this.estimatedSpeed = distance/targetTimeFinished
			const aNewRecord = new Trip(newRecordID, newTrip, date, terrain, distance, targetTimeFinished, this.estimatedSpeed)
			this.recorded_trip.push(aNewRecord)
		}
	}
	// FEATURE 15 - Get all trips
	getAllTrips(){
		return this.recorded_trip
	}
	// FEATURE 12. A calculation across many trips	
	getDistanceSum(){
		// FEATURE 13 - Provide default values
		var sum = 0
		for(var listlength = 0; listlength < this.recorded_trip.length; listlength++){
			sum += Number(this.recorded_trip[listlength].distance)
		}
		return sum
	}
	// Returns the number of trips whether active or inactive
	getSum(){
		return this.recorded_trip.length
	}
	//  FEATURE 6. Save all trips to LocalStorage
	saveTrip(){
		const savingRecord = localStorage.setItem(STORAGE_KEY, JSON.stringify(this.recorded_trip))
		return savingRecord
	}
	// FEATURE 7. Load all trips from LocalStorage
	unloadTrip(){
		// FEATURE 13. Provide default values
		const loadingJSON = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		this.recorded_trip = loadingJSON
	}
	// FEATURE 3. Sort trips
    sortTrip () {
        this.recorded_trip.sort(function (x, y) {
          if (x.distance < y.distance) {
            return 1 // sorts each trip from highest(y) to lowest(x)
          }
          if (x.distance > y.distance) {
            return -1 // sorts each trip from highest(x) to lowest(y)
          } // x must equal to y
          return 0 // trip order will remain the same
        })
      }
	// FEATURE 5. Delete a selected part	  
	removeTrip(selectedRecordedTrip){
		const recordIndex = this.recorded_trip.findIndex((trip) => trip.id == selectedRecordedTrip)
		this.recorded_trip.splice(recordIndex, 1)
	}
	// FEATURE 12. A calculation across many parts!
	// FEATURE 4. Filter parts	
	getTripsTBD(){
		return this.recorded_trip.filter(trip => trip.done == false)
	}
	// FEATURE 12. A calculation across many parts
	getTripsRemaining(){
		return this.getTripsTBD().length
	}
	
	// FEATURE 12. A calculation across many parts!
	// FEATURE 4. Filter parts
	getTripsDone(){
		return this.recorded_trip.filter(trip => trip.done == true)
	}
	// FEATURE 12. A calculation across many parts
	getAllTripsDone(){
		return this.getTripsRemaining() === 0
	}
	// Set all active trips to be done
	tripAllDone(){
		this.recorded_trip.forEach(function(trip){
			trip.done = true
		})
	}
	// FEATURE 8. Update/edit a part
	// copies the trip, tripname, distance, targetTimeFinished 
	updateTripRecord(trip){
		this.beforeUpdateTripCache = trip.tripName
		this.beforeUpdateDistanceCache = trip.distance
		this.beforeUpdateTimeCache = trip.targetTimeFinished
		this.updateTrip = trip
	}
	// FEATURE 8. Update/edit a part
	endTripUpdate(trip){
		// FEATURE 10 - Validate inputs
		if (!trip){
			return
		}
		this.updateTrip = null
		trip.tripName = trip.tripName.trim()
		if (!trip.tripName || !trip.distance || !trip.targetTimeFinished){
			this.removeRecord(trip)
		}
	}
	// Feature 9 - Discard/revert edits to a part
	discardTripUpdate(trip){
		this.updateTrip = null
		trip.tripName = this.beforeUpdateTripCache
		trip.distance = this.beforeUpdateDistanceCache
		trip.targetTimeFinished = this.beforeUpdateTimeCache
	}
	// Feature 14 - Find a part given a search criterion
	findTrip(trip){
		// if using in controller use filter instead of find
		return this.recorded_trip.filter((plannedTrip) =>{return plannedTrip.tripName.startsWith(trip)})
	}
	// FEATURE 5 - Delete a selected part
	deleteDone(){
		this.recorded_trip = this.getTripsTBD()
	}
}