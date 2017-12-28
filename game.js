{
  init: function(elevators, floors) {
    const demandedFloors = new Set()
    const selectNextFloor = {
      UP: 1,
      DOWN: -1
    }

    elevators.forEach(elevator => {
      this.setupElevator(elevator, demandedFloors, selectNextFloor, floors)
    })

    floors.forEach(floor => {
      floor.on('up_button_pressed', () => {
        addFloorToQueue(floor.floorNum())
      })

      floor.on('down_button_pressed', () => {
        addFloorToQueue(floor.floorNum())
      })
    })

    function addFloorToQueue(floorNum) {
      demandedFloors.add(floorNum)
    }
  },
  setupElevator: function(gameElevator, floorsSelected, selectNextFloor, floors) {
    const elevator = gameElevator
    const elevatorButtonsPressed = new Set()
    let direction = "UP"

    elevator.on('idle', goToNextFloor)
    elevator.on('stopped_at_floor', function() {
      modifyDirectionIfNecessary()
      goToNextFloor()
    })
    elevator.on('floor_button_pressed', addFloorToQueue)

    function goToNextFloor() {
      var floorsOnDemand = new Set([...elevatorButtonsPressed, ...floorsSelected])

      if (floorsOnDemand.size == 0) return elevator.goToFloor(0)

      let nextFloor = (elevator.currentFloor() + selectNextFloor[direction]) % floors.length

      while(!floorsOnDemand.has(nextFloor)) {
        nextFloor = Math.abs((nextFloor + selectNextFloor[direction]) % floors.length)
      }

      elevatorButtonsPressed.delete(nextFloor)
      floorsSelected.delete(nextFloor)

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
      elevatorButtonsPressed.add(floorNum)
    }
  },
  update: function(dt, elevators, floors) {}
}
