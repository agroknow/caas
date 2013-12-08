/*
* @author Mathioudakis Theodore
* Agro-Know Technologies - 2013
*
*/

/*Define viewItemController controller in 'app' */
listing.controller("viewItemController", function($scope, $http, $location) {


	/*****************************************************************************************************************/
	/*							  	GENERAL												  						     */
	/*****************************************************************************************************************/

	var language_mapping=[], audience_mapping=[];
	language_mapping['en'] = "English";

	var classif_mapping_file = '../config/classification_mapping_min.json';
	$scope.classif_mapping = []; // contains all the code mappings

	$http.get(classif_mapping_file).success(function(data) {
		var classification = data['classification'];
    	for(j in classification) {
    		$scope.classif_mapping[classification[j].code] = classification[j].value;
    	}
    });

	/*AKIF URL*/
	$scope.akif = 'http://54.228.180.124:8080/search-api/v1/agrif/';
	//$scope.item_resource_id = '';
	$scope.item_resource_url = '';
	$scope.user_id = 23;
	$scope.domain = 'http://greenlearningnetwork.org';
	$scope.ip = '83.212.100.142';


	$scope.item_number_of_visitors = 0;
	$scope.item_average_rating = 'no rating available yet';
	$scope.item_tags = ['No tags available yet.'];
	$scope.enable_rating_1 = true;
	$scope.enable_rating_2 = true;
	$scope.enable_rating_3 = true;

	//Elements default values
	$scope.item_title = "No title available for this language";
	$scope.item_description = "No description available for this language";

	/*****************************************************************************************************************/
	/*							  	FUNCTIONS												  						 */
	/*****************************************************************************************************************/

	/************************************************** GET ITEM *****************************/
	$scope.getItem = function() {

		var item_identifier = $location.search().id; //SET_ID
		var item_set = $location.search().set;
		$scope.item_resource_url = '';


		var headers = {'Content-Type':'application/json','Accept':'application/json;charset=utf-8'};

		$http({
			method : 'GET',
			url : $scope.akif + item_set + '/' + item_identifier, //..akif/CAAS/asd56a4sa7fs4a5sf4
			type: 'json',
			headers : headers
		})
		.success(function(data) {
			//parse array and create an JS Object Array
			//every item is a JSON
			var thisJson = data.results[0];
			console.log(thisJson);
			//WE USE ONLY 'EN' FOR NOW
			if ( thisJson.languageBlocks.en !== undefined ) {

				languageBlock = thisJson.languageBlocks['en'];

				//TITLE
				languageBlock.title !== undefined ? $scope.item_title = languageBlock.title : $scope.item_title = '-';

				//ABSTRACT
				languageBlock.abstract !== undefined ? $scope.item_abstract = languageBlock.abstract : $scope.item_abstract ='-';

				//KEYWORDS
				if(languageBlock.keywords !== undefined) {
					var keywords = languageBlock.keywords[0].split(';');
					$scope.item_keywords = keywords;
				} else {
					$scope.item_keywords = '-';
				}

			}

			//CITATION
			if( thisJson.expressions[0] && thisJson.expressions[0].citation && thisJson.expressions[0].citation[0] ) {
				$scope.item_citation = '';
				console.log(thisJson.expressions[0].citation[0]);

				thisJson.expressions[0].citation[0].title ? $scope.item_citation += thisJson.expressions[0].citation[0].title[0]+', ' : $scope.item_citation +='';
				thisJson.expressions[0].citation[0].ISSN ? $scope.item_citation += thisJson.expressions[0].citation[0].ISSN[0]+', ' : $scope.item_citation +='';
				thisJson.expressions[0].citation[0].citationNumber ? $scope.item_citation += thisJson.expressions[0].citation[0].citationNumber[0]+', ' : $scope.item_citation +='';
				thisJson.expressions[0].citation[0].citationChronology ? $scope.item_citation += thisJson.expressions[0].citation[0].citationChronology[0] : $scope.item_citation +='';
				

			} else {
				$scope.item_citation = '-';
			}

			//LANGUAGE
			thisJson.expressions[0].language !== undefined ? $scope.item_language = language_mapping[thisJson.expressions[0].language] : $scope.item_language = '-';

			//PAGES
			thisJson.expressions[0].manifestations[0].size !== undefined ? $scope.item_pages = thisJson.expressions[0].manifestations[0].size : $scope.item_pages = '-';
			console.log(thisJson.expressions[0].manifestations[0]);
			//CREATOR
			if( thisJson.creators ) {
				$scope.item_creators = ''; 
				for( i in thisJson.creators) {
					$scope.item_creators += thisJson.creators[i].name;
					if(i != thisJson.creators.length-1) {
						$scope.item_creators += ', ';
					}
				}
			} else {
				$scope.item_creators = '-';
			}

			//CLASSIFICATION
			if(thisJson.controlled && thisJson.controlled.classification && thisJson.controlled.classification.CCL) {
				$scope.item_classification = thisJson.controlled.classification.CCL.split(',');
			} else {
				$scope.item_classification = '-';
			}

		})

	};

});


