/* globals describe it xdescribe xit beforeEach expect TodoList localStorage STORAGE_KEY */
describe('Cyclist', function(){
	var cycle
	
	function getTrips(allTrips){
		const allTripName = []
		for (const trip of allTrips){
			allTripName.push(trip.tripName)
		}
		return allTripName
	}
	
	beforeEach(function(){
		cycle = new Cyclist()
	})
	describe('planning a trip', function () {
		// FEATURE 1. Create a whole that acts as a Facade for parts
		// FEATURE 2. Add a part
		describe('when a single trip called "a new trip" is added', function () {
		  var theTrip
		  beforeEach(function () {
			cycle.addTrip('a new trip','29-09-2001','road',800, 24)
			theTrip = cycle.recorded_trip[0]
		  })
		  
		  describe('the added planned trip', function(){
			  it('should have an id equal of 1', function(){
				 expect(theTrip.id).toBe(1)
			  })
			  
		      it('should have a title of "a new trip"', function (){expect(theTrip.tripName).toEqual('a new trip')
			  })
			  
		      it('should have a date of "29-09-2001"', function (){expect(theTrip.date).toEqual('29-09-2001')
			  })
			  
		      it('should have a terrain of "road"', function (){expect(theTrip.terrain).toEqual('road')
			  })
			  
		      it('should have a distance of "800"', function (){expect(theTrip.distance).toEqual(800)
			  })
		      it('should have a target time speed of "24"', function (){expect(theTrip.targetTimeFinished).toEqual(24)
			  })
			  it('should not be done', function () {
				  expect(theTrip.done).toBe(false)
			  })
		 })
		 describe('the trip planner application', function(){
			 it('should have a single record of trip', function(){
				 expect(cycle.recorded_trip.length).toEqual(1)
			 })
			 it('should have single active remaining record of trip', function(){
				 expect(cycle.getTripsRemaining()).toEqual(1)
			 })
			 it('should not be "all done"', function(){
				 expect(cycle.getAllTripsDone()).toBe(false)
			 })
			 
		 })
		 describe('when three trips are planned', function () {
			 it('should have 3 planned trips', function () {
				 cycle.removeTrip('a new trip')
				// FEATURE 2. Add a part
				 cycle.addTrip('Burkes Pass','29-09-2001','road',800,45)
				 cycle.addTrip('Junction Road','29-09-2001','road',1800,135)
				 cycle.addTrip('Arthurs Pass','29-09-2001','road',800, 45)
				 expect(cycle.recorded_trip.length).toEqual(3)
			 })
			 
			 it('should return all 3 planned trips', function () {
				 cycle.removeTrip('a new trip')
				// FEATURE 15. Get all part
				var tripStartLength = 0
				const tripList = []
				 cycle.addTrip('Mountainview ','29-03-2021','road',100,2)
				 cycle.addTrip('Hills Road','29-03-2021','road',400,8)
				 cycle.addTrip('Arthurs Pass','29-09-2001','road',200,2)
				 const actualTrips = [ 'Mountainview', 'Hills Road', 'Arthurs Pass' ]
				 const incompleteTrips = [ 'Mountainview', 'Arthurs Pass' ]
				 const tripLength = cycle.recorded_trip.length
				 while (tripStartLength < tripLength){
					 tripList.push(cycle.recorded_trip[tripStartLength].tripName)
					 tripStartLength++
				 }
				 expect(actualTrips).toEqual(tripList)
				 expect(actualTrips).not.toEqual(incompleteTrips)
			 })
			 
		 })
	})
})

  // FEATURE 6. Save all parts to LocalStorage
  describe('save', function () {
	it('should have the correct JSON for the correct trip in localStorage', function () {
	  localStorage.clear()
	  cycle = new Cyclist()
	  cycle.addTrip('Burkes Pass','29-09-2001','road',800, 45)
	  cycle.saveTrip()
	  var itemJSON = localStorage.getItem(STORAGE_KEY)
	  expect(itemJSON).toEqual('[{"id":1,"tripName":"Burkes Pass","date":"29-09-2001","terrain":"road","distance":800,"targetTimeFinished":45,"estimatedSpeed":18,"done":false}]')
	})
	it('should save a trip in localStorage when it has a single trip item', function () {
	  localStorage.clear()
	  cycle = new Cyclist()
	  cycle.addTrip('Burkes Pass','29-09-2001','road',800,45)
	  cycle.saveTrip()
	  var itemJSON = localStorage.getItem(STORAGE_KEY)
	  expect(itemJSON).toContain(itemJSON)
	})
  })
  
  // FEATURE 7. Load all parts from LocalStorage
  describe('load', function () {
    it('should load a trip from localStorage when it has a single trip', function () {
      // save something
      localStorage.clear()
      cycle = new Cyclist()
      cycle.addTrip('Burough Pass','29-09-2001','mountain',150,36)
      cycle.saveTrip()
      // the start of the model again
      cycle = new Cyclist()
      // and load
      cycle.unloadTrip()
      var itemJSON = localStorage.getItem(STORAGE_KEY)
      expect(itemJSON).toEqual('[{"id":1,"tripName":"Burough Pass","date":"29-09-2001","terrain":"mountain","distance":150,"targetTimeFinished":36,"estimatedSpeed":4,"done":false}]')
    })

    it('should have the correct JSON for the loaded trip item', function () {
      // save something
      localStorage.clear()
      cycle = new Cyclist()
      cycle.addTrip('Burough Pass','29-09-2001','mountain',150, 36)
	  cycle.addTrip('Brougham Pass','29-10-2020','road',300, 72)
      cycle.saveTrip()
      // the start the model again
      cycle = new Cyclist()
      // and load
      cycle.unloadTrip()
      var itemJSON = localStorage.getItem(STORAGE_KEY)
      expect(itemJSON).toEqual('[{"id":1,"tripName":"Burough Pass","date":"29-09-2001","terrain":"mountain","distance":150,"targetTimeFinished":36,"estimatedSpeed":4,"done":false},{"id":2,"tripName":"Brougham Pass","date":"29-10-2020","terrain":"road","distance":300,"targetTimeFinished":72,"estimatedSpeed":4,"done":false}]')
    })
  })

  // FEATURE 3. Sort parts
  describe('sorting trips', function () {
    it('should put trips into an order of highest distance to lowest', function () {
      var cycle = new Cyclist()
	  let list1 = []
      cycle.addTrip('Burough Pass','29-09-2001','mountain',150,36)
	  cycle.addTrip('Magpie Road','29-09-2001','mountain',350,72.8)	  
	  list1.push(cycle.recorded_trip[1])
	  list1.push(cycle.recorded_trip[0])
      cycle.sortTrip()
      const actualOrderedTripTitles = cycle.getAllTrips()
      
      expect(list1).toEqual(actualOrderedTripTitles)
    })
  })
  
  // FEATURE 4. Filter parts
  describe('filtering trip', function () {
    var cycle = new Cyclist()
	var List2 = []
    cycle.addTrip('Burough Pass','29-09-2001','mountain',150, 36)
    cycle.addTrip('National Grid Reserves','29-09-2001','mountain',150, 36)
    cycle.addTrip('Magpie Road','29-09-2001','mountain',350, 76)
    cycle.recorded_trip[1].done = true

    it('should be able to return only active/remaining trips', function () {
      const expectedActiveCount = 2
      const title1 = cycle.getTripsTBD()[0]
	  const title2 = cycle.getTripsTBD()[1]
	  List2.push(title1)
	  List2.push(title2)
      const actualActiveTripList = cycle.getTripsTBD()
      const actualActiveTripCount = actualActiveTripList.length
      const actualActiveTripTitles = actualActiveTripList
      expect(actualActiveTripCount).toEqual(expectedActiveCount)
      expect(actualActiveTripTitles).toEqual(List2)
    })
    it('should correctly calculate the number of trips to be done', function () {
      const expectedRemainingTripCount = 2
      const actualRemainingTripCount = cycle.getTripsRemaining()
      expect(actualRemainingTripCount).toEqual(expectedRemainingTripCount)
    })
    it('should be able to return only trips that are done', function () {
      const expectedCompletedTripCount = 1
      const expectedCompletedTripTitles = cycle.getAllTripsDone()
      const actualCompletedTripList = cycle.getTripsDone()
	  const m = cycle.recorded_trip.filter(trip => trip.done == true)
      const actualCompletedTripCount = actualCompletedTripList.length
      const actualCompletedTripTitles = actualCompletedTripList
      expect(actualCompletedTripCount).toEqual(expectedCompletedTripCount)
	  expect(actualCompletedTripTitles).toEqual(m)
    })
  })

  // FEATURE 5. Delete a selected part
  describe('deleting a trip', function () {
    var cycle = new Cyclist()
    cycle.addTrip('Burough Pass','29-09-2001','mountain',150, 36)
    cycle.addTrip('National Grid Reserves','29-09-2001','mountain',150, 36)
    cycle.addTrip('Magpie Road','29-09-2001','mountain',300, 72)
	var m = cycle.recorded_trip[2]
	var c = cycle.recorded_trip[0]
    cycle.removeTrip(2) // id of row
    it('should remove that trip', function () {
      const expectedTripTitlesOne = m
	  const expectedTripTitlesTwo = c
      const actualTripTitlesTwo = cycle.recorded_trip[1]
	  const actualTripTitlesOne = cycle.recorded_trip[0]
      expect(actualTripTitlesOne).toEqual(expectedTripTitlesTwo)
	  expect(actualTripTitlesTwo).toEqual(expectedTripTitlesOne)
    })
    it('should reduce the trip count', function () {
      const expectedRemainingTripCount = 2
      const actualRemainingTripCount = cycle.recorded_trip.length
      expect(actualRemainingTripCount).toEqual(expectedRemainingTripCount)
    })
  })
  describe('removing all done trips', function () {
    var cycle = new Cyclist()
	var z = []
    cycle.addTrip('Burough Pass','29-09-2001','mountain',150, 36)
    cycle.addTrip('National Grid Reserves','29-09-2001','mountain',150, 36)
    cycle.addTrip('Magpie Road','29-09-2001','mountain',350, 77)
	var first_record = cycle.recorded_trip[0]
	z.push(first_record)
    cycle.recorded_trip[1].done = true
    cycle.recorded_trip[2].done = true
    cycle.deleteDone()
    it('should remove all the trips done', function () {
      const actualTripTitles = cycle.recorded_trip
      expect(actualTripTitles).toEqual(z)
    })

    it('should reduce the number of trips', function () {
      const expectedRemainingTripCount = 1
      const actualRemainingTripCount = cycle.recorded_trip.length
      expect(actualRemainingTripCount).toEqual(expectedRemainingTripCount)
    })
  })
  
  // FEATURE 8. Update/edit a part
  describe('editing a trip', function () {
    var cycle = new Cyclist()
    cycle.addTrip('Burough Pass','29-09-2001','mountain',150, 36)
    cycle.addTrip('National Grid Reserves','29-09-2001','mountain',150, 36)
    cycle.addTrip('Magpie Road','29-09-2001','mountain',350, 77)
    cycle.updateTripRecord(cycle.recorded_trip[2])
    cycle.recorded_trip[2].terrain = 'road'
	cycle.recorded_trip[2].targetTimeFinished = 76
	cycle.recorded_trip[2].distance = 800
    cycle.endTripUpdate(cycle.recorded_trip[2])
    it('should change the terrain of that trip', function () {
      expect(cycle.recorded_trip[2].terrain).toEqual('road')
    })
    it('should change the distance of that trip', function () {
      expect(cycle.recorded_trip[2].distance).toEqual(800)
    })
    it('should change the target time finished in hours of that trip', function () {
      expect(cycle.recorded_trip[2].targetTimeFinished).toEqual(76)
    })
  })
  
  // FEATURE 9. Discard /revert edits to a part
  describe('discarding edits of a trip', function () {
    it('should not change the title of that trip', function () {
    var cycle = new Cyclist()
    cycle.addTrip('Burough Pass','29-09-2001','mountain',150, 36)
    cycle.addTrip('National Grid Reserves','29-09-2001','mountain',150, 36)
    cycle.addTrip('Magpie Road','29-09-2001','mountain',350, 77)
    cycle.updateTripRecord(cycle.recorded_trip[2])
    cycle.recorded_trip[2].tripName = 'LNG Road'
	cycle.recorded_trip[2].targetTimeFinished = 60
	cycle.recorded_trip[2].distance = 250
    cycle.discardTripUpdate(cycle.recorded_trip[2])
    expect(cycle.recorded_trip[2].tripName).toEqual('Magpie Road')
	expect(cycle.recorded_trip[2].targetTimeFinished).toEqual(77)
	expect(cycle.recorded_trip[2].distance).toEqual(350)
    })
  })

  // FEATURE 10. Validate inputs
  describe('validating inputs to a trip', function () {
    it('should not allow empty trip titles', function () {
    var cycle = new Cyclist()
	var new_cycle = new Cyclist()
    cycle.addTrip('Burough Pass','29-09-2001','mountain',150, 36)
    cycle.addTrip('National Grid Reserves         ','29-09-2001','mountain',150, 36)
    cycle.addTrip('Magpie Road','29-09-2001','mountain',350, 77)
	cycle.addTrip('','01-01-2012','?',100,23)
	new_cycle.addTrip('Burough Pass','29-09-2001','mountain',150,36)
    new_cycle.addTrip('National Grid Reserves         ','29-09-2001','mountain',150,36)
    new_cycle.addTrip('Magpie Road','29-09-2001','mountain',350,77)
      const expectedTripTitles = new_cycle.getTripsTBD()
      const actualTripTitles = cycle.recorded_trip
      expect(actualTripTitles).toEqual(expectedTripTitles)
    })
  })
  
  // FEATURE 11. A calculation within a part
  describe('working out the estimated speed within a part', function(){
	  it('should return an estimated speed of "10"', function(){
		  var cycle = new Cyclist()
		  expectedEstimatedSpeed = 10
		  cycle.addTrip('National Reserves','29-09-2001','mountain',40,4)
		  const actualEstimatedSpeed = cycle.recorded_trip[0].estimatedSpeed
		  expect(actualEstimatedSpeed).toEqual(expectedEstimatedSpeed)
	  })
  })
  
  // FEATURE 12. A calculation across many parts
  describe('working out if all trips are done', function () {
    it('should return as zero for an empty list', function () {
      var cycle = new Cyclist()
      expect(cycle.getTripsRemaining()).toBe(0)
    })

    it('should return 2 active trips in the list', function () {
      var cycle = new Cyclist()
	  cycle.addTrip('National Grid Reserves','29-09-2001','mountain',150, 36)
      cycle.addTrip('Magpie Road','29-09-2001','mountain',350, 77)
      expect(cycle.getTripsRemaining()).toBe(2)
    })

    it('should return the number of planned trips left from the list', function () {
      var cycle = new Cyclist()
      cycle.addTrip('National Grid Reserves','29-09-2001','mountain',150, 36)
      cycle.addTrip('Magpie Road','29-09-2001','mountain',350, 77)
      cycle.recorded_trip[0].done = true
      cycle.recorded_trip[1].done = true
      expect(cycle.getTripsRemaining()).toBe(0)
    })
  })
  
  
  describe('counting Trips to be done', function () {
    it('should return the correct number of trips to be done as trips are added or completed', function () {
      var cycle = new Cyclist()
      expect(cycle.getTripsRemaining()).toEqual(0)
      cycle.addTrip('National Grid Reserves','29-09-2001','mountain',150, 36)
	  expect(cycle.getTripsRemaining()).toEqual(1)
      cycle.addTrip('Magpie Road','29-09-2001','mountain',350, 78)
	  expect(cycle.getTripsRemaining()).toEqual(2)
	  cycle.recorded_trip[0].done = true
      expect(cycle.getTripsRemaining()).toEqual(1)
    })
  })
  
  // FEATURE 13. Provide default values
  describe('the default value for new trips', function () {
    it('should allocate a sequentially incrementing id to all new tasks', function () {
		var cycle = new Cyclist()
		let id = 0
		while (id < 5){
			id++
			cycle.addTrip('Magpie Road','29-09-2001','mountain',350, 78)
			var realID = cycle.recorded_trip[Number(cycle.getSum()) - 1].id
			expect(realID).toEqual(id)
		}
    })

    it('should make all new trips not completed', function () {
      var cycle = new Cyclist()
      cycle.addTrip('Magpie Road','29-09-2001','mountain',350, 78)
      const realdone = cycle.recorded_trip[0].done
      expect(realdone).toBe(false)
    })
  })
  
  // 12.	A calculation across many parts
  describe('a calculation of all trip distance', function(){
	  it('should calculate the sum of planned trip distance', function(){
		cycle = new Cyclist()
		cycle.addTrip('National Grid Reserves','29-09-2001','mountain',150, 36)
		cycle.addTrip('Magpie Road','29-09-2001','mountain',350, 78)
		cycle.addTrip('Bretham Pass','29-09-2001','jungle',750, 240)
		expectedDistanceSum = 1250
		actualDistanceSum = cycle.getDistanceSum()
		expect(actualDistanceSum).toEqual(expectedDistanceSum)
	  })
  })
  
  
  
  
  // FEATURE 14. Find a part given a search criterion
  describe('finding a trip', function () {
    it('should find nothing with an empty trip list', function () {
      var cycle = new Cyclist()
	  const expectedTrip = cycle.recorded_trip
      const actualFoundTrip = cycle.findTrip('Magpie Road')
      expect(actualFoundTrip).toEqual(expectedTrip)
    })

    it('should find the only trip with a title when that title is unique', function () {
      var cycle = new Cyclist()
	  cycle.addTrip('Burough Pass','29-09-2001','mountain',150, 36)
	  cycle.addTrip('National Grid Reserves','29-09-2001','road',150, 36)
	  cycle.addTrip('Magpie Road','29-09-2001','mountain',350, 77)
      const actualFoundTrip = cycle.findTrip('Magpie Road')
      expect(actualFoundTrip).toExist
      const expectedFoundTripTitle = 'Magpie Road'
      const actualFoundTripTitle = actualFoundTrip[0].tripName
      expect(actualFoundTripTitle).toEqual(expectedFoundTripTitle)
    })

    it('should find the first trip with that title when there is more than one trip with the same title', function () {
      var cycle = new Cyclist()
	  cycle.addTrip('Burough Pass','29-09-2001','mountain',150, 36)
	  cycle.addTrip('National Grid Reserves','29-09-2001','road',150, 36)
	  cycle.addTrip('Magpie Road','29-09-2001','mountain',350, 77)
      const actualFoundTrip = cycle.findTrip('Burough Pass')
	  const expectedFoundTripTitle = 'Burough Pass'
      const actualFoundTripTitle = actualFoundTrip[0].tripName
      expect(actualFoundTrip).toExist
      expect(actualFoundTripTitle).toEqual(expectedFoundTripTitle)
      const expectedFoundTripId = 1
      const actualFoundTripId = actualFoundTrip[0].id
      expect(actualFoundTripId).toEqual(expectedFoundTripId)
    })
  })
})