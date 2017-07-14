(function() {
"use strict";

angular.module('autograder')
.component('checkBox', {
  templateUrl:'src/components/check-box/check-box.html',
  controller:'checkBoxController',
  // controllerAs:'$ctrl',
  bindings:{
  	 headTitle:'<',
  	 columnTitle:'<',
     rowContent:'<',
     checkClicked:'&'
  }
})
.controller('checkBoxController',checkBoxController);

checkBoxController.$inject=['filterFilter'];
function checkBoxController(filterFilter) {
	var $ctrl = this;
	$ctrl.master = false;
	$ctrl.begin = 0;
	$ctrl.pages = [];
	$ctrl.checkboxList = {};
	$ctrl.currentPage = 1;
	$ctrl.searchKey = "";
	$ctrl.filteredContent = "";
	$ctrl.quantityToShow = 10;
	$ctrl.anySelect = false;
	var previous_searchKey="";

	var initNavigator = function(){
		if($ctrl.rowContent){
				if($ctrl.pages.length===0){
					for(var i = 0;i<$ctrl.rowContent.length/$ctrl.quantityToShow;i++){
						$ctrl.pages.push(i+1);
					}
				}
		}
	}

	var resetNavigator = function(){
		$ctrl.pages = [];
		if($ctrl.filteredContent){
			for(var i = 0;i<$ctrl.filteredContent.length/$ctrl.quantityToShow;i++){
				$ctrl.pages.push(i+1);
			}
		}
	}

	var initCheckbox = function(){
		if($ctrl.rowContent){
			for(var i = 0;i<$ctrl.rowContent.length;i++){
				$ctrl.checkboxList[$ctrl.rowContent[i]["matric_number"]]= false;
			}
		}
	}

	var clearCheck = function(){
		for(var student in $ctrl.checkboxList){
			$ctrl.checkboxList[student] = false;
			$ctrl.checkClicked({
                matric_number:  student,
                is_selected:    false
            });
		}
	}

	$ctrl.resetMaster = function(){
		if($ctrl.master){
			$ctrl.master = false;
		}
	}

	$ctrl.$onChanges = function(changeObj){
		initNavigator();
		// console.log('row content:',$ctrl.rowContent);
		initCheckbox();
	};

	var anySelect = function(){
		for (var key in $ctrl.checkboxList){
			if($ctrl.checkboxList[key]){
				return true;
			}
		}
		return false;
	}

	$ctrl.$doCheck = function(){
		if(previous_searchKey !== $ctrl.searchKey){
			$ctrl.filteredContent = filterFilter($ctrl.rowContent,$ctrl.searchKey);
			previous_searchKey = $ctrl.searchKey;
			resetNavigator();
			// console.log('checked elements:',$ctrl.checkboxList);
		}
		$ctrl.anySelect = anySelect();
	}

	$ctrl.next =function(){
	  if($ctrl.currentPage<$ctrl.pages.length){
	  	 $ctrl.begin +=$ctrl.quantityToShow;
	  	 return $ctrl.currentPage++;
	  }
	}
	$ctrl.previous = function(){
	  if($ctrl.currentPage>1){
	  	 $ctrl.begin -=$ctrl.quantityToShow;
	  	 return $ctrl.currentPage--;
	  }
	}

	$ctrl.goToPage = function(index){
		$ctrl.currentPage = index+1;
		return $ctrl.begin = $ctrl.quantityToShow * ($ctrl.currentPage-1);
	}

	$ctrl.first = function(){
		$ctrl.currentPage = 1;
		$ctrl.begin = 0;
		return true;
	}
	$ctrl.last = function(){
		$ctrl.currentPage = $ctrl.pages.length;
		return $ctrl.begin = ($ctrl.pages.length-1)*$ctrl.quantityToShow;
	}

	$ctrl.checkAll = function(){
		if($ctrl.master){
			clearCheck();

			for(var student in $ctrl.rowContent){
				$ctrl.checkboxList[$ctrl.rowContent[student].matric_number] = true;
				$ctrl.checkClicked({matric_number:$ctrl.rowContent[student].matric_number,is_selected:true});
			}
		}else{
			clearCheck();
		}
	}
}

})();
