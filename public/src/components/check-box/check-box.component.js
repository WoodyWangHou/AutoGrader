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
     // checkboxList:'='
  }
})
.controller('checkBoxController',checkBoxController);

checkBoxController.$inject=['filterFilter'];
function checkBoxController(filterFilter) {
	var $ctrl = this;
	$ctrl.master = false;
	$ctrl.quantityToShow = 3;
	$ctrl.begin = 0;
	$ctrl.pages = [];
	$ctrl.checkboxList = {};
	$ctrl.currentPage = 1;
	$ctrl.searchKey = "";
	$ctrl.filteredContent = "";

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
		}

		// for(var i = 0;i<$ctrl.checkboxList.length;i++){
		// 		$ctrl.checkboxList[i].is_selected = false;
		// 		$ctrl.checkClicked({matric_number:$ctrl.checkboxList[i].matric_number,is_selected:false});
		// }
	}

	$ctrl.resetMaster = function(){
		if($ctrl.master){
			$ctrl.master = false;
		}
		console.log('reset triggered:',$ctrl.master);
	}

	$ctrl.$onChanges = function(changeObj){
		initNavigator();
		// console.log('row content:',$ctrl.rowContent);
		initCheckbox();
	};

	$ctrl.$doCheck = function(){
		if(previous_searchKey !== $ctrl.searchKey){
			$ctrl.filteredContent = filterFilter($ctrl.rowContent,$ctrl.searchKey);
			previous_searchKey = $ctrl.searchKey;
			resetNavigator();
			// console.log('checked elements:',$ctrl.checkboxList);
		}
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

			for(var student in $ctrl.checkboxList){
				$ctrl.checkboxList[student] = true;
				$ctrl.checkClicked({matric_number:student,is_selected:true});
			}
		}else{
			clearCheck();
		}
	}
}

})();
