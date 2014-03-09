'use strict';

angular.module('sortinghatApp')
  .controller('MainCtrl', function ($timeout, StSession, StLogin, mySession, StProgress, LdsConnect) {
    var $scope = this
      , shuffle = window.knuthShuffle
      ;

    $scope.progress = StProgress.scope;
    $scope.session = mySession;
    $scope.guess = '';

    function update(session) {
      mySession = session;
      $scope.session = session;
      run();
    }

    $scope.makeGuess = function (item, model, str) {
      if (str) {
        $scope.guess = str;
      }

      $scope.guess = $scope.guess || '';

      console.log('guess', $scope.guess);

      if ($scope.guess.toLowerCase() === $scope.card.name.toLowerCase()) {
        $scope.cards.shift();
        nextCard();
      } else {
        $scope.hint = $scope.card.name.substr(0, $scope.hint.length + 1);
        $scope.guess = $scope.hint;
      }
    };

    $scope.sortByName = function () {
      // TODO sort by first name
      return 0.5 - Math.random();
    };

    function nextCard() {
      $scope.card = $scope.cards[0];
      $scope.hint = '';
      $scope.guess = '';
      if (!$scope.card) {
        // do something
        $scope.finished = true;
      }
    }

    $scope.playAgain = function () {
      $scope.finished = false;
      $scope.cards = $scope.allCards.slice(0);
      shuffle($scope.cards);
      nextCard();
    };

    function run() {
      StProgress.start();
      LdsConnect.init().then(function (me) {
        console.log('me');
        console.log(me);
        LdsConnect.ward().then(function (info) {
          console.log('info');
          console.log(info);
        });
        LdsConnect.photos().then(function (roster) {
          StProgress.stop();
          console.log('roster');
          console.log(roster);
          $scope.cards = roster.map(function (card) {
            return {
              photo: card.headOfHousehold.imageData || card.householdInfo.imageData
            , name: card.headOfHousehold.name.split(', ').reverse().join(' ')
            , attempts: 0
            };
          }).filter(function (card) {
            return card.photo;
          });
          shuffle($scope.cards);
          $scope.allCards = $scope.cards.slice(0);
          nextCard();
        });
      });
    }

    $scope.loginWithLds = function () {
      if (mySession && mySession.accounts) {
        StSession.update(mySession);
        return;
      }

      StProgress.scope.progress = 0;
      StProgress.scope.message = 'Logging you in...';
      StProgress.start();

      console.log('M.loginWithLds happening...');
      $scope.loginScope.loginWithLds();

      $scope.loginTimeout = $timeout(function () {
        $scope.alertMsg = "Hmm... this is taking much longer than expected. "
          + "Perhaps it would be best to refresh the page and try again.";
      }, 45 * 1000);
    };

    $scope.loginScope = {};
    StLogin.makeLogin($scope.loginScope, 'lds', '/auth/ldsconnect', function (err, session) {
      StProgress.stop();
      $timeout.cancel($scope.loginTimeout);
      console.log('M.loginWithLds happened!');
      if (err) {
        console.error(err);
        if (/Access Denied/.test(err)) {
          // prevent bug caused by alert where $scope.message doesn't update
          $timeout(function () {
            window.alert("You denied us? Ouch... well, see ya later... (or try again if it was an accident)");
          });
        } else {
          window.alert("Login failed. Sorry about that. You probably used the wrong username / password");
        }
        return;
      }
      StSession.update(session);
    });

    StSession.subscribe(update);

    if (mySession && mySession.currentLoginId) {
      run();
    }
  });
