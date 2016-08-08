var app = angular.module('tweeter', ['ionic', 'angularMoment']);
var currentUser = {
	username:'',
	password:'',
	newpassword:' ',
	message:' '
}
var lastAction = 0;
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
	
	
  .state('tab.search', {
    url: '/search/:hashtag',
	cache: false,
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  })
  
  .state('tab.search-tweet-detail', {
      url: '/search/tweet/:tweetId',
	  cache: false,
      views: {
        'tab-search': {
          templateUrl: 'templates/tweet-detail.html',
          controller: 'TweetDetailCtrl'
        }
      }
    })
	
	.state('tab.search-user-detail', {
      url: '/search/user/:userId',
	  cache: false,
      views: {
        'tab-search': {
          templateUrl: 'templates/user-detail.html',
          controller: 'UserDetailCtrl'
        }
      }
    })
  
  .state('tab.following', {
      url: '/following',
	  cache: false,
      views: {
        'tab-following': {
          templateUrl: 'templates/tab-following.html',
          controller: 'FollowingCtrl'
        }
      }
    })
	
	.state('tab.following-user-detail', {
      url: '/following/:userId',
	  cache: false,
      views: {
        'tab-following': {
          templateUrl: 'templates/user-detail.html',
          controller: 'UserDetailCtrl'
        }
      }
    })
	
	.state('tab.favorites', {
      url: '/favorites',
	  cache: false,
      views: {
        'tab-favorites': {
          templateUrl: 'templates/tab-favorites.html',
          controller: 'FavoritesCtrl'
        }
      }
    })
	
	.state('tab.favorite-detail', {
      url: '/favorites/:tweetId',
	  cache: false,
      views: {
        'tab-favorites': {
          templateUrl: 'templates/tweet-detail.html',
          controller: 'TweetDetailCtrl'
        }
      }
    })

    .state('tab.tweets', {
      url: '/tweets',
	  cache: false,
      views: {
        'tab-tweets': {
          templateUrl: 'templates/tab-tweets.html',
          controller: 'TweetsCtrl'
        }
      }
    })
	
    .state('tab.tweet-detail', {
      url: '/tweets/:tweetId',
	  cache: false,
      views: {
        'tab-tweets': {
          templateUrl: 'templates/tweet-detail.html',
          controller: 'TweetDetailCtrl'
        }
      }
    })

	  .state('tab.profile', {
		url: '/profile',
		cache: false,
		views: {
		  'tab-profile': {
			templateUrl: 'templates/tab-profile.html',
			controller: 'ProfileCtrl'
		  }
		}
	  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/tweets');

});


