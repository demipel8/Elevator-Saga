{
  init: function(elevators, floors) {
    const elevator = elevators[0]
    const demandedFloors = new Set()
    let direction = "UP"
    const selectNextFloor = {
      UP: 1,
      DOWN: -1
    }

    elevator.on('idle', goToNextFloor)
    elevator.on('stopped_at_floor', function() {
      modifyDirectionIfNecessary()
      goToNextFloor()
    })
    elevator.on('floor_button_pressed', addFloorToQueue)

    function goToNextFloor() {
      if (demandedFloors.size == 0) return elevator.goToFloor(0)

      let nextFloor = (elevator.currentFloor() + selectNextFloor[direction]) % floors.length

      while(!demandedFloors.has(nextFloor)) {
        nextFloor = Math.abs((nextFloor + selectNextFloor[direction]) % floors.length)
      }

      demandedFloors.delete(nextFloor)

      elevator.goToFloor(nextFloor)
    }

    function modifyDirectionIfNecessary() {
      if(isInTopFloor()) {
        direction = "DOWN"
      } else if (isInGroundFloor()) {
        direction = "UP"
      }
    }

    function isInTopFloor() {
      return elevator.currentFloor() == (floors.length - 1)
    }

    function isInGroundFloor() {
      return elevator.currentFloor() == 0
    }

    function addFloorToQueue(floorNum) {
      demandedFloors.add(floorNum)
    }

    floors.forEach(floor => {
      floor.on('up_button_pressed', () => {
        addFloorToQueue(floor.floorNum())
      })

      floor.on('down_button_pressed', () => {
        addFloorToQueue(floor.floorNum())
      })
    })
  },
  update: function(dt, elevators, floors) {}
}
