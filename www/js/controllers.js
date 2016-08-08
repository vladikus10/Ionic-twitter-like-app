app.controller('SearchCtrl', function($scope, $stateParams, Tweets, Users) {
	$scope.tweets = [];
	$scope.users = [];
	Users.getFollows();
	$scope.findTweets = function(){
		console.log("TWEETS!");
		currentUser.message = document.getElementById("searchText").value;
		var promise = Tweets.find();
		promise.then(
			function(payload) { 
			  $scope.tweets = payload;
			  //document.getElementById("searchText").value = "";
			},
			function(errorPayload) {
			  console.log('failure loading tweets', errorPayload);
			});
	};
	$scope.findUsers = function(){
		console.log("users!");
		currentUser.message = document.getElementById("searchText").value;
		var promise = Users.find();
		promise.then(
			function(payload) { 
			  $scope.users = payload;
			  //document.getElementById("searchText").value = "";
			},
			function(errorPayload) {
			  console.log('failure loading tweets', errorPayload);
			});
	};
	
	$scope.searchClick = function(){
		$scope.tweets = [];
		$scope.users = [];
		var e = document.getElementById("searchSelect");
		var selected = e.options[e.selectedIndex].value;
		if(selected === "1")
			$scope.findTweets();
		else if(selected === "2")
			$scope.findUsers();
	};
	
	if($stateParams.hashtag != ""){
		document.getElementById("searchText").value = "#" + $stateParams.hashtag;
		$scope.findTweets();
	}
});

app.controller('TweetsCtrl', function($scope, $log, $ionicPopup, Tweets, Favorites, Profile) {
	var loginPopup = $ionicPopup;
	$scope.login = function(text){
		loginPopup.show({
			template: '<input type="text" placeholder="Username" id="username"><input type="password" placeholder="Password" id="password">',
			title: 'Login',
			subTitle: text,
			scope: $scope,
			buttons: [
			  {
				text: '<b>Login</b>',
				type: 'button-positive',
				onTap: function(e) {
					currentUser.username = document.getElementById('username').value;
					currentUser.password = document.getElementById('password').value;
					console.log(currentUser);
					var promise = Profile.login();
					promise.then(
						function(payload) {							
						  if(payload == "0"){
							  //loginPopup.close();
							  $scope.login("Invalid username or password");
						  }
						  else{
							  //loginPopup.close();
							  $scope.getTweets();
						  }
						},
						function(errorPayload) {
						  console.log('failed to login', errorPayload);
						}
					);
				}
			  },
			  {
				text: '<b>Registrate</b>',
				type: 'button-assertive',
				onTap: function(e) {
					currentUser.username = document.getElementById('username').value;
					currentUser.password = document.getElementById('password').value;
					console.log(currentUser);
					var promise = Profile.register();
					promise.then(
						function(payload) {							
						  if(payload == "0"){
							  //loginPopup.close();
							  $scope.login("Username already exists");
						  }
						  else{
							  //loginPopup.close();
							  $scope.login("User created!");
						  }
						},
						function(errorPayload) {
						  console.log('failed to registrate', errorPayload);
						}
					);
				}
			  }
			]
	    });
	};
	
	$scope.showAlert = function(error, info) {
	   var alertPopup = $ionicPopup.alert({
		 title: error,
		 template: info
		});
	 };
	$scope.tweets = [];
	$scope.getTweets = function(){
		var promise = Tweets.fetch();
		promise.then(
			function(payload) { 
			  $scope.tweets = payload;
			},
			function(errorPayload) {
			  console.log('failure loading tweets', errorPayload);
			  $scope.showAlert("Error", "Server not responding");
			});
	};
	$scope.updateTweets = function() {
		$scope.getTweets();
		$scope.$broadcast('scroll.refreshComplete');
		$scope.$apply();
	};
	$scope.postTweet = function(){
		var clock = new Date();
		var limit = 5000;
		if(document.getElementById('tweetMessage').value == "")
			$scope.showAlert("Warning!", "Please type  message first.");
		else if(clock.getTime() - lastAction < limit)
			$scope.showAlert("Woah woah woah!", "Wait for another " + Math.round((limit - (clock.getTime() - lastAction))/1000) + " seconds!");
		else{
			lastAction = clock.getTime();
			currentUser.message = document.getElementById('tweetMessage').value;
			var promise = Tweets.post();
			promise.then(
			function(payload){
				//console.log(payload);
				document.getElementById('tweetMessage').value = "";
				//$scope.getTweets();
			},
			function(errorPayload) {
				console.log('Error', errorPayload);
				$scope.showAlert("Error", "Server not responding");
			});
		};
	};
	if(currentUser.username == '')
		$scope.login("Enter your username and password");
	else
		$scope.getTweets();
	Favorites.fetch();
})

app.controller('TweetDetailCtrl', function($scope, $stateParams, $ionicPopup, $ionicHistory, Tweets, Favorites) {
	//console.log("detail crtl");
	$scope.showConfirm = function(item, id) {
	   var confirmPopup = $ionicPopup.confirm({
		 title: 'Deleting a ' + item,
		 template: 'Are you sure about deleting it?'
	   });
	   confirmPopup.then(function(res) {
		 if(res) {	
		    var promise = Tweets.removeTweet($stateParams.tweetId);
			promise.then(
			function(payload) { 
			  console.log(payload);
			  //updateTweets = true;
			  $ionicHistory.goBack(-1);
			},
			function(errorPayload) {
			  console.log('failure removing tweets', errorPayload);
			});
		 } else {
			console.log('You are not sure');
		 }
	   });
	 };
	 $scope.showAlert = function(error, info) {
	   var alertPopup = $ionicPopup.alert({
		 title: error,
		 template: info
		});
	 };
	var favorited;
	$scope.tweet;
	$scope.replies = [];
	$scope.repliesNum;
	$scope.getTweet = function(){
		var promise = Tweets.get($stateParams.tweetId);
		promise.then(
			function(payload) { 
			  $scope.tweet = payload.data[0];
			  $scope.formatTweet();
			},
			function(errorPayload) {
			  console.log('failure loading tweets', errorPayload);
			  $scope.showAlert("Error", "Server not responding");
			  $ionicHistory.goBack(-1);
			});
	};
	$scope.formatTweet = function(){
		var splitMessage = $scope.tweet.message.split(' ');
		$scope.tweet.message = "";
		for(var i = 0 ; i < splitMessage.length ; i++){
			if(splitMessage[i].indexOf('#') == 0)
				$scope.tweet.message += '<a href="#/tab/search/' + splitMessage[i].substr(1) + '">' + splitMessage[i] + '</a> ';
			else
				$scope.tweet.message += splitMessage[i] + ' ';
			//console.log($scope.message);
		}
	};
	$scope.getReplies = function(){
		var promise = Tweets.getReplies($stateParams.tweetId);
		promise.then(
			function(payload) { 
			  $scope.replies = payload;
			  $scope.repliesNum = $scope.replies.length;
			},
			function(errorPayload) {
			  console.log('failure loading replies', errorPayload);
			  $scope.showAlert("Error", "Server not responding");
			});
	};
	$scope.postReply = function(){
		var clock = new Date();
		var limit = 20000;
		if(document.getElementById('replyMessage').value == "")
			$scope.showAlert("Warning!", "Please type  message first.");
		else if(clock.getTime() - lastAction < limit)
			$scope.showAlert("Woah woah woah!", "Wait for another " + Math.round((limit - (clock.getTime() - lastAction))/1000) + " seconds!");
		else{
			lastAction = clock.getTime();
			currentUser.message = document.getElementById('replyMessage').value;
			var promise = Tweets.postReply($stateParams.tweetId);
			promise.then(
			function(payload){
				//console.log(payload);
				document.getElementById('replyMessage').value = "";
				$scope.repliesNum = $scope.replies.length;
				//$scope.getTweet();
			},
			function(errorPayload) {
				console.log('Error', errorPayload);
				$scope.showAlert("Error", "Server not responding");
			});
		};
	};
	$scope.checkName = function(){
		if($scope.tweet !== undefined){
			if(currentUser.username === $scope.tweet.userid)
				return true;
			else
				return false;
		}
	};
	$scope.checkFavorite = function(){
		favorited = Favorites.check($stateParams.tweetId);
		if(favorited == true){
			document.getElementById('favButton').innerHTML = " Unfavorite";
		}
		else{
			document.getElementById('favButton').innerHTML = " Favorite";
		}
		//console.log(Favorites.check($stateParams.tweetId));
	};
	$scope.favClick = function() {
		if(favorited == false)
			$scope.favorite();
		else
			$scope.unfavorite();
	};
	$scope.favorite = function(){
		var promise = Favorites.add($stateParams.tweetId, $scope.tweet);
			promise.then(
			function(payload) { 
				console.log(payload);
				$scope.checkFavorite();
			},
			function(errorPayload) {
			  console.log('failure removing tweets', errorPayload);
			});
	};
	$scope.unfavorite = function(){
		var promise = Favorites.remove($stateParams.tweetId, $scope.tweet);
			promise.then(
			function(payload) { 
				console.log(payload);
				$scope.checkFavorite();
			},
			function(errorPayload) {
			  console.log('failure removing tweets', errorPayload);
			});
	};
	$scope.remove = function(item){
		$scope.showConfirm(item, $stateParams.tweetId);
	}
	$scope.checkFavorite();
	$scope.getTweet();
	$scope.getReplies();
});

app.controller('UserDetailCtrl', function($scope, $stateParams, Users) {
	$scope.user = Users.get($stateParams.userId);
	$scope.tweets = [];
	$scope.me = currentUser.username;
	var following;
	var promise = Users.tweets($stateParams.userId);
	promise.then(
	function(payload) { 
	  $scope.tweets = payload;
	},
	function(errorPayload) {
	  console.log('failure getting tweets', errorPayload);
	});
	$scope.checkFollow = function(){
		following = Users.check($stateParams.userId);
		console.log(Users.check($stateParams.userId));
		if(following == true){
			document.getElementById('followButton').innerHTML = " Unfollow";
		}
		else{
			document.getElementById('followButton').innerHTML = " Follow";
		}
	};
	$scope.follow = function(){
		var promise = Users.follow($stateParams.userId);
		promise.then(
		function(payload) { 
		  console.log(payload);
		  $scope.checkFollow();
		},
		function(errorPayload) {
		  console.log('failure following user', errorPayload);
		});
	};
	$scope.unfollow = function(){
		var promise = Users.unfollow($stateParams.userId);
		promise.then(
		function(payload) { 
		  console.log(payload);
		  $scope.checkFollow();
		},
		function(errorPayload) {
		  console.log('failure unfollowing user', errorPayload);
		});
	};
	$scope.followClick = function(){
		if(following == true)
			$scope.unfollow();
		else
			$scope.follow();
	};
	$scope.checkFollow();
});

app.controller('ProfileCtrl', function($scope, $ionicPopup, Profile) {
	$scope.user = currentUser;
	$scope.showAlert = function(error, info) {
	   var alertPopup = $ionicPopup.alert({
		 title: error,
		 template: info
		});
	 };
	$scope.changePassword = function(){
		if(currentUser.password == document.getElementById('cPassword').value){
			currentUser.newpassword = document.getElementById('nPassword').value;
			var promise = Profile.changepsw();
			promise.then(
			function(payload) { 
			  $scope.showAlert("!", "Password changed");
			  document.getElementById('nPassword').value = '';
			  document.getElementById('cPassword').value = '';
			  console.log(currentUser);
			},
			function(errorPayload) {
			  console.log('failure loading tweets', errorPayload);
			});
		}
		else
			$scope.showAlert("Password missmatch", "Your current password does not match what you netered");
	};
	
});

app.controller('FavoritesCtrl', function($scope, Favorites) {
	$scope.favoriteTweets = [];
	$scope.getFavorites = function(){
		var promise = Favorites.fetchTweets();
		promise.then(
			function(payload) { 
			  $scope.favoriteTweets = payload;
			  //console.log(payload);
			},
			function(errorPayload) {
			  console.log('failure loading favorites', errorPayload);
			});
	};
	$scope.getFavorites();
});

app.controller('FollowingCtrl', function($scope, $stateParams, Users) {
	Users.getFollows();
	$scope.users = [];
	$scope.getFollows = function(){
		var promise = Users.getUsers();
		promise.then(
			function(payload) { 
			  $scope.users = payload;
			  //console.log(payload);
			},
			function(errorPayload) {
			  console.log('failure loading favorites', errorPayload);
			});
	};
	$scope.getFollows();
});

app.controller('LoginCtrl', function($scope, $ionicPopup, Profile) {
	
});