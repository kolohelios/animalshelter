// set the strict mode so the browser will throw errors instead of silencing them
'use strict';

// Angular app called "animalshelter" being created
angular.module('animalshelter', [])
// a constant to allow us to shorten the REST API URL we are using in the model
.constant('nodeUrl', 'http://localhost:8000/api')
// our factory serves as the model for this app (and we only have one);  we inject $http which
// we will use to make the RESTful API calls as well as the constant created above
.factory('Pets', ['$http', 'nodeUrl', function($http, nodeUrl){
  // new singleton to contain the methods associated with this factory model
  function Pets(){}

  // each of these functions will return a promise to the controller when called
  Pets.fetch = function(){
    return $http.get(nodeUrl + '/pets');
  };

  Pets.create = function(pet){
    return $http.post(nodeUrl + '/pets', pet);
  };

  Pets.update = function(petId, pet){
    return $http.put(nodeUrl + '/pets/' + petId, pet);
  };

  Pets.remove = function(petId){
    return $http.delete(nodeUrl + '/pets/' + petId);
  };

  // returning this object (Pets) allows us to inject and use it in the controller
  return Pets;
}])
// controller for the view: Pets is our factory, $scope is our controller scope, and
// we need $window so that we can present a delete confirmation
.controller('HomeCtrl', ['Pets', '$scope', '$window', function(Pets, $scope, $window){
  // $scope.editMode and $scope.createMode establish the state of our view on load; I could have made a good
  // case to change from the set of Booleans to a single string value to manage the view state
  $scope.editMode = false;
  $scope.createMode = false;
  // empty object $scope.pet we can use for the create and edit form
  $scope.pet = {};
  // gets a promise from the factory so we can display Pets in the table in our view when the promise is returned
  Pets.fetch()
  .then(function(response){
    $scope.pets = response.data;
  });

  // load the pet that was edit icon was clicked on into the edit form and set the view state
  $scope.edit = function(pet){
    $scope.editMode = true;
    $scope.pet = pet;
  };

  // we get a promise from the factory that either returns the new record created to add it to the table
  // or returns an error; it also resets the state and clears the form when POST is successful
  $scope.create = function(pet){
    Pets.create(pet)
    .then(function(response){
      $scope.pets.push(response.data);
      $scope.pet = {};
      $scope.createMode = false;
    })
    .catch(function(error){
      // I don't like using alert(); ordinarily I would use the SweetAlerts library
      // also, the error messages need to be cleaned up because they aren't very user-friendly
      alert(error.data.message);
    });
  };

  $scope.save = function(pet){
    var petId = pet._id;
    delete pet._id;
    delete pet.__v;
    Pets.update(petId, pet)
    .then(function(response){
      $scope.pets.forEach(function(updatedPet, i){
        if(response.data._id === updatedPet._id){
          $scope.pets[i] = response.data;
        }
      });
      $scope.pet = {};
      $scope.editMode = false;
    })
    .catch(function(error){
      console.log(error);
      alert(error.message);
      // even though we had an error, we've got to clear the form because we striped off the _id (subsequent puts won't work)
      $scope.pet = {};
    });
  };

  // first we confirm that the use wants to delete the record and then we get a promise from the factory
  // we only remove the pet from our array when we get the removed record back from the API (or we display the error)
  $scope.remove = function(petId){
    var confirm = $window.confirm('Are you sure you would like to delete this record?');
    if(confirm){
      Pets.remove(petId)
      .then(function(response){
        $scope.pets.forEach(function(pet, i){
          if(response.data._id === pet._id){
            $scope.pets.splice(i, 1);
          }
        });
      })
      .catch(function(error){
        alert(error.message);
      });
    }
  };

  // this function simply handles when users click on the 'Cancel' button within the form and resets the form and the view state
  $scope.cancel = function(){
    $scope.editMode = false;
    $scope.createMode = false;
    $scope.pet = {};
  };
}]);
