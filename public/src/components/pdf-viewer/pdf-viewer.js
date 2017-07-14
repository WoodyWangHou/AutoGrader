/**
 * @preserve AngularJS PDF viewer component using pdf.js.
 *
 * Original: https://github.com/akrennmair/ng-pdfviewer 
 * Author: Woody Wang Hou
 * GNU License
 */
(function(){
"use strict";

angular.module('PDFViewer', [])
.service("PDFViewerService", [ '$rootScope', function($rootScope) {

	var svc = { };
	svc.nextPage = function() {
		$rootScope.$broadcast('pdfviewer.nextPage');
	};

	svc.prevPage = function() {
		$rootScope.$broadcast('pdfviewer.prevPage');
	};

	svc.Instance = function(id) {
		var instance_id = id;

		return {
			prevPage: function() {
				$rootScope.$broadcast('pdfviewer.prevPage', instance_id);
			},
			nextPage: function() {
				$rootScope.$broadcast('pdfviewer.nextPage', instance_id);
			},
			gotoPage: function(page) {
				$rootScope.$broadcast('pdfviewer.gotoPage', instance_id, page);
			}
		};
	};

	return svc;
}])
.component('pdfViewer', {
	templateUrl:'src/components/pdf-viewer/pdf-viewer.html',
	bindings:{
		onPageLoad: '&',
		loadProgress: '&',
		src: '<',
		height:'<',
		instanceId: '<'
	},
	controller:'pdfController'
})
.controller('pdfController',pdfController);

pdfController.$inject = ['$parse','$rootScope','$element'];
function pdfController($parse,$rootScope,$element){
	var $ctrl = this;
	$ctrl.canvas = null;
	$ctrl.instance_id = null;

	$ctrl.pageNum = 1;
	$ctrl.goPage = 1;
	$ctrl.pdfDoc = null;
	$ctrl.scale = 0.95;
	$ctrl.pageLoading = true;
	$ctrl.small = false;
	$ctrl.medium = false;
	$ctrl.error = "";

	$ctrl.pageLoaded = function(page , total){
		$ctrl.currentPage = page;
		$ctrl.totalPages = total;
		$ctrl.pageLoading = false;
	}

	$ctrl.documentProgress = function(progressData) {
		if ($ctrl.loadProgress) {
			$ctrl.loadProgress({state: "loading", loaded: progressData.loaded, total: progressData.total});
		}
	};

	$ctrl.loadPDF = function(path) {
		PDFJS.getDocument(path, null, null, $ctrl.documentProgress).then(function(_pdfDoc) {
			$ctrl.pdfDoc = _pdfDoc;
			$ctrl.renderPage($ctrl.pageNum, function(success) {
				if ($ctrl.loadProgress) {
					$ctrl.loadProgress({state: "finished", loaded: 0, total: 0});
				}
			});
		}, function(message, exception) {
			$rootScope.$apply(function(){
				$ctrl.error = message;
			});
			console.log("PDF load error: " + message);
			if ($ctrl.loadProgress) {
				$ctrl.loadProgress({state: "error", loaded: 0, total: 0});
			}

		});
			};

	$ctrl.renderPage = function(num, callback) {
		num = parseInt(num);
		$ctrl.pageLoading = true;
		$ctrl.pdfDoc.getPage(num).then(function(page) {
			var ctx = $ctrl.canvas.getContext('2d')
			var viewport = page.getViewport($ctrl.scale);

			$ctrl.canvas.height = viewport.height;
			$ctrl.canvas.width = viewport.width

			page.render({ canvasContext: ctx, viewport: viewport }).promise.then(
				function() { 
					if (callback) {
						callback(true,page);
					}
					$rootScope.$apply(function(){
						$ctrl.onPageLoad({ page: $ctrl.pageNum, total: $ctrl.pdfDoc.numPages });
						$ctrl.pageLoaded($ctrl.pageNum,$ctrl.pdfDoc.numPages);});
				}, 
				function() {
					if (callback) {
						callback(false,page);
					}
					console.log('page.render failed');
				}
			);
		});
	};

	$ctrl.zoomIn = function(){
		$ctrl.scale = parseFloat($ctrl.scale) + 0.1;
        $ctrl.renderPage($ctrl.pageNum,function(success){
        	if(success){

        	}else{
        		console.log('render failed');
        	}
        });
        return $ctrl.scale;
	}

	$ctrl.zoomOut = function(){
		$ctrl.scale = parseFloat($ctrl.scale) - 0.1;
        $ctrl.renderPage($ctrl.pageNum,function(success){
        	if(success){

        	}else{
        		console.log('render failed');
        	}
        });
        return $ctrl.scale;
	}

	$ctrl.fit = function(){
		$ctrl.scale = 1;
        $ctrl.renderPage($ctrl.pageNum,function(success){
        	if(success){

        	}else{
        		console.log('render failed');
        	}
        });
        return $ctrl.scale;
	}

	$ctrl.prevPage = function() {
		if($ctrl.pageNum > 1){
			$ctrl.pageNum --;
			$ctrl.renderPage($ctrl.pageNum);
		}
	}
	
	$ctrl.nextPage = function() {
		if ($ctrl.pageNum < $ctrl.pdfDoc.numPages) {
			$ctrl.pageNum++;
			$ctrl.renderPage($ctrl.pageNum);
		}
	}
	$ctrl.gotoPage = function(page) {
		if (page >= 1 && page <= $ctrl.pdfDoc.numPages) {
		    $ctrl.pageNum = page;
			$ctrl.renderPage($ctrl.pageNum);
		}
	}

	$rootScope.$on('pdfviewer.nextPage', function(evt, id) {
		if (id !== $ctrl.instance_id) {
			return;
		}

		if ($ctrl.pageNum < $ctrl.pdfDoc.numPages) {
			$ctrl.pageNum++;
			$ctrl.renderPage($ctrl.pageNum);
		}
	});

	$rootScope.$on('pdfviewer.prevPage', function(evt, id) {
		if (id !== $ctrl.instance_id) {
			return;
		}

		if ($ctrl.pageNum > 1) {
			$ctrl.pageNum--;
			$ctrl.renderPage($ctrl.pageNum);
		}
	});

	$rootScope.$on('pdfviewer.gotoPage', function(evt, id, page) {
		if (id !== $ctrl.instance_id) {
			return;
		}

		if (page >= 1 && page <= $ctrl.pdfDoc.numPages) {
		    // $ctrl.pageNum = page;
			$ctrl.renderPage($ctrl.pageNum);
		}
	});

	$ctrl.$postLink = function(){
		$ctrl.canvas = $element.find('canvas')[0];
		fitToContainer($ctrl.canvas);
	}

	$ctrl.$onChanges = function(change){
		$ctrl.instance_id = $ctrl.instanceId;

		if(change.src.currentValue){
			$ctrl.pageNum = 1;
			$ctrl.loadPDF($ctrl.src);
		}

		if(change.height.currentValue){
			switch($ctrl.height){
				case 'small':
					$ctrl.small = true;
				break;
				case 'medium':
					$ctrl.medium = true;
				break;
			}
		}
	}

	$ctrl.$onInit = function(){

	}

	$ctrl.$doCheck = function(){
		if($ctrl.pageNum && $ctrl.currentPage){
			if($ctrl.currentPage !== $ctrl.pageNum){
					$ctrl.gotoPage($ctrl.pageNum);
			}
		}
	}

	var fitToContainer = function(canvas){
  		canvas.style.display = "block";
  		canvas.style.margin = "auto";
  		canvas.style.padding = "10px 0px 0px 0px";
  		canvas.width  = canvas.offsetWidth;
  		canvas.height = canvas.offsetHeight;
	}
}

})();
