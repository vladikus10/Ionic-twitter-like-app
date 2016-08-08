app.factory('Tweets', function($http, $q) {
	var tweets = [];
	var foundTweets = [];
	var replies = [];
	return {
	fetch: function() {
		var deferred = $q.defer();
		$http.get('http://serene-badlands-9352.herokuapp.com/getTweets?userID=' + currentUser.username)
		.then(
		function(data) {
			tweets = data.data;
			deferred.resolve(tweets);
		});
		return deferred.promise;
	},
	find: function() {
		var deferred = $q.defer();
		$http.post('http://serene-badlands-9352.herokuapp.com/findTweets', currentUser)
		.then(
		function(data) {
			foundTweets = data.data;
			deferred.resolve(foundTweets);
		});
		return deferred.promise;
	},
	post: function() {
		var deferred = $q.defer();
		$http.post('http://serene-badlands-9352.herokuapp.com/tweet', currentUser)
		.then(
		function(data) {
			var newTweet = data.data[0];
			tweets.unshift(newTweet);
			deferred.resolve("Posted");
		});
		return deferred.promise;
	},
    get: function(tweetId) {
		return $http.get('http://serene-badlands-9352.herokuapp.com/getTweet?id=' + tweetId);
    },
	getReplies: function(tweetId) {
		var deferred = $q.defer();
		$http.get('http://serene-badlands-9352.herokuapp.com/getReplies?id=' + tweetId)
		.then(
		function(data) {
			replies = data.data;
			deferred.resolve(replies);
		});
		return deferred.promise;
	},
	postReply: function(tweetId) {
		var deferred = $q.defer();
		$http.post('http://serene-badlands-9352.herokuapp.com/reply?tweetid=' + tweetId, currentUser)
		.then(
		function(data) {
			var newReply = data.data[0];
			replies.push(newReply);
			deferred.resolve("Replied");
		});
		return deferred.promise;
	},
	removeTweet: function(tweetId) {
		var deferred = $q.defer();
		$http.post('http://serene-badlands-9352.herokuapp.com/removeTweet?tweetid=' + tweetId, currentUser)
		.then(
		function(response){
			for(var i = 0 ; i < tweets.length ; i++){
				//var obj = tweets[i];
				if(tweets[i].id && tweets[i].id == tweetId){
					tweets.splice(i,1);
					deferred.resolve("Removed");
					break;
				}
			}
		});
		return deferred.promise;
	}
  };
});

app.factory('Favorites', function($http, $q) {
	var favorites = [];
	var favoriteTweets = [];
  return {
	fetch: function() {
		var deferred = $q.defer();
		$http.get('http://serene-badlands-9352.herokuapp.com/getFavs?userID=' + currentUser.username)
		.then(
		function(data) {
			favorites = data.data;
			//console.log(favorites);
			deferred.resolve(favorites);
		});
		return deferred.promise;
	},
	fetchTweets: function() {
		var deferred = $q.defer();
		$http.get('http://serene-badlands-9352.herokuapp.com/getFavTweets?userID=' + currentUser.username)
		.then(
		function(data) {
			favoriteTweets = data.data;
			//console.log(favorites);
			deferred.resolve(favoriteTweets);
		});
		return deferred.promise;
	},
	check: function(tweetId) {
		//return $http.get("http://serene-badlands-9352.herokuapp.com/findFav/" + tweetId + "?as=" + currentUser.username);
		var favorited = false;
		for(var i = 0 ; i < favorites.length ; i++){
			if(favorites[i].userid == currentUser.username && favorites[i].tweetid == tweetId){
				favorited = true;
				break;
			}
		}
		return favorited;
	},
	add: function(tweetId, tweet) {
		var deferred = $q.defer();
		$http.post("http://serene-badlands-9352.herokuapp.com/fav/" + tweetId + "?as=" + currentUser.username)
		.then(
		function(data) {
			var newFav = data.data[0];
			console.log(data.data[0]);
			favorites.unshift(newFav);
			favoriteTweets.unshift(tweet);
			deferred.resolve("Favorited");
		});
		return deferred.promise;
	},
	remove: function(tweetId, tweet) {
		var deferred = $q.defer();
		$http.post("http://serene-badlands-9352.herokuapp.com/unfav/" + tweetId + "?as=" + currentUser.username)
		.then(
		function(response){
			for(var i = 0 ; i < favorites.length ; i++){
				//var obj = tweets[i];
				if(favorites[i].tweetid && favorites[i].tweetid == tweetId){
					favorites.splice(i,1);
					deferred.resolve("Unfavorited");
					break;
				}
			}
			for(var j = 0 ; j < favoriteTweets.length ; j++){
				//var obj = tweets[i];
				if(favoriteTweets[i].id && favoriteTweets[i].id == tweet.id){
					favoriteTweets.splice(j,1);
					deferred.resolve("Removed from list");
					break;
				}
			}
		});
		return deferred.promise;
	}
  };
});

app.factory('Users', function($http, $q) {
	var foundUsers = [];
	var userTweets = [];
	var follows = [];
	var users = [];
	var following = false;
	return {
		find: function() {
			var deferred = $q.defer();
			$http.post('http://serene-badlands-9352.herokuapp.com/findUsers', currentUser)
			.then(
			function(data) {
				foundUsers = data.data;
				deferred.resolve(foundUsers);
			});
			return deferred.promise;
		},
		get: function(userId) {
			for(var i = 0 ; i < foundUsers.length ; i++)
			{
				if(foundUsers[i].username == userId){
					return foundUsers[i];
					break;
				}
			}
			for(var i = 0 ; i < users.length ; i++)
			{
				if(users[i].username == userId){
					return users[i];
					break;
				}
			}
		},
		tweets: function(userId) {
			var deferred = $q.defer();
			$http.get('http://serene-badlands-9352.herokuapp.com/getUserTweets?userID=' + userId)
			.then(
			function(data) {
				userTweets = data.data;
				deferred.resolve(userTweets);
			});
			return deferred.promise;
		},
		getFollows: function() {
			var deferred = $q.defer();
			$http.get('http://serene-badlands-9352.herokuapp.com/getFollowers?userID=' + currentUser.username)
			.then(
			function(data) {
				follows = data.data;
				deferred.resolve(follows);
			});
			return deferred.promise;
		},
		getUsers: function() {
			var deferred = $q.defer();
			$http.get('http://serene-badlands-9352.herokuapp.com/getUsers?userID=' + currentUser.username)
			.then(
			function(data) {
				users = data.data;
				deferred.resolve(users);
			});
			return deferred.promise;
		},
		check: function(userId){
			console.log(follows);
			following = false;
			for(var i = 0 ; i < follows.length ; i++){
				if(follows[i].followerid == userId){		
					following = true;
					break;
				}
			}
			return(following);
		},
		follow: function(userId){
			var deferred = $q.defer();
			$http.post("http://serene-badlands-9352.herokuapp.com/follow/" + userId + "?as=" + currentUser.username)
			.then(
			function(data) {
				follows.unshift(data.data[0]);
				users.unshift(data.data[0]);
				deferred.resolve("Following");
			});
			return deferred.promise;
		},
		unfollow: function(userId){
			var deferred = $q.defer();
			$http.post("http://serene-badlands-9352.herokuapp.com/unfollow/" + userId + "?as=" + currentUser.username)
			.then(
			function(data) {
				for(var i = 0 ; i < follows.length ; i++){
					if(follows[i].followerid && follows[i].followerid == userId){
						follows.splice(i,1);
						deferred.resolve("Unfollowing");
						break;
					}
				}
				for(var i = 0 ; i < users.length ; i++){
					if(users[i].username && users[i].username == userId){
						users.splice(i,1);
						break;
					}
				}
			});
			return deferred.promise;
		}
	}}
);

app.factory('Profile', function($http, $q) {
	return {
		changepsw: function() {
			var deferred = $q.defer();
			$http.post('http://serene-badlands-9352.herokuapp.com/changepsw', currentUser)
			.then(
			function(data) {
				currentUser = data.data[0];
				deferred.resolve("changed");
			});
			return deferred.promise;
		},
		login: function() {
			var deferred = $q.defer();
			$http.post('http://serene-badlands-9352.herokuapp.com/login', currentUser)
			.then(
			function(data) {
				//console.log(data);
				deferred.resolve(data.data);
			});
			return deferred.promise;
		},
		register: function() {
			var deferred = $q.defer();
			$http.post('http://serene-badlands-9352.herokuapp.com/register', currentUser)
			.then(
			function(data) {
				//console.log(data);
				deferred.resolve(data.data);
			});
			return deferred.promise;
		}
	}
});