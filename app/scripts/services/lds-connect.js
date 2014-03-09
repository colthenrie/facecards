'use strict';

angular.module('sortinghatApp')
  .service('LdsConnect', function LdsConnect($timeout, $http, $q) {
    var meta
      , rosterPromises = {}
      , infoPromises = {}
      , stakePromises = {}
      ;

    function init(_meta) {
      var d = $q.defer()
        , p = d.promise
        ;

      meta = _meta;
      if (!meta) {
        p = $http.get('/api/ldsorg/me');
        p.then(function (resp) {
          meta = resp.data;
          d.resolve(resp.data);
        });
      }

      return p;
    }

    function getWardInfo(stakeId, wardId) {
      stakeId = stakeId || meta.currentUnits.stakeUnitNo;
      wardId = wardId || meta.currentUnits.wardUnitNo;

      var url = '/api/ldsorg/stakes/' + stakeId + '/wards/' + wardId + '/info'
        , d = $q.defer()
        , p
        ;

      p = infoPromises[wardId];
      if (!p) {
        p = infoPromises[wardId] = d.promise;
        $http.get(url).then(function (resp) {
          d.resolve(resp.data);
        });
      }

      return p;
    }

    function getWardRoster(stakeId, wardId) {
      stakeId = stakeId || meta.currentUnits.stakeUnitNo;
      wardId = wardId || meta.currentUnits.wardUnitNo;

      var url = '/api/ldsorg/stakes/' + stakeId + '/wards/' + wardId + '/roster'
        , d = $q.defer()
        , p
        ;

      p = rosterPromises[wardId];
      if (!p) {
        p = rosterPromises[wardId] = d.promise;
        $http.get(url).then(function (resp) {
          d.resolve(resp.data);
        });
      }
      
      return p;
    }

    function getStake(stakeId) {
      stakeId = stakeId || meta.currentUnits.stakeUnitNo;

      var url = '/api/ldsorg/stakes/' + stakeId
        , d = $q.defer()
        , p
        ;

      p = stakePromises[stakeId];
      if (p) {
        p = stakePromises[stakeId] = d.promise;
        $http.get(url).then(function (resp) {
          d.resolve(resp.data);
        });
      }
      
      return p;
    }

    function getHousehold(stakeId, wardId, householdId) {
      stakeId = stakeId || meta.currentUnits.stakeUnitNo;
      wardId = wardId || meta.currentUnits.wardUnitNo;
      householdId = householdId || meta.currentUserId;

      var url = '/api/ldsorg/stakes/' + stakeId
            + '/wards/' + wardId
            + '/households/' + householdId
        , d = $q.defer()
        ;

      $http.get(url).then(function (resp) {
        d.resolve(resp.data);
      });

      return d.promise;
    }

    /*
    // i.e. a Bishop serving outside his homeward
    // this may not even be available.
    // It may be only in the callings section
    function getBorrowedHousehold(householdId) {
    }
    */

    function getMe() {
      var d = $q.defer
        ;

      $timeout(function () {
        d.resolve(meta);
      }, 0);
      
      return d.promise;
    }

    
    function homeStake() {
      return getStake();
    }

    function homeWard() {
      return getWardInfo(meta.currentUnits.stakeUnitNo, meta.currentUnits.wardUnitNo);
    }
    function wardPhotos() {
      return getWardRoster(meta.currentUnits.stakeUnitNo, meta.currentUnits.wardUnitNo);
    }

    // LDS Connect API draft
    // set resources apart by permission or make fields query params ???
    // /api/ldsconnect/area/id/stake/id/ward/id/household/id
    // /api/ldsconnect/area/id/stake/leadership
    // /api/ldsconnect/area/id/stake/callings
    //
    // Like this
    // /api/ldsconnect/area/id/stake/members?fields=names,photos,phones,emails,addresses&wards=321432,98765
    // /api/ldsconnect/area/id/stake/members?fields=photos&wards=321432,98765
    //
    // OR this
    // /api/ldsconnect/area/id/stake/members
    // /api/ldsconnect/area/id/stake/names
    // /api/ldsconnect/area/id/stake/photos
    // /api/ldsconnect/area/id/stake/phones
    // /api/ldsconnect/area/id/stake/emails
    // /api/ldsconnect/area/id/stake/addresses

    // POST Executables
    // each resource will check permissions on each id passed
    // there must be a token for each email and phone, probably an md5 hash, as a person may have many
    // but the primary should be established as the 'individual' on lds.org
    // /api/ldsconnect/call
    // /api/ldsconnect/text
    // /api/ldsconnect/email
    // /api/ldsconnect/mail

    return {
      homeWard: homeWard
    , wardPhotos: wardPhotos
    , homeStake: homeStake
    , me: getMe
    , ward: getWardInfo
    , photos: getWardRoster
    , emails: getWardRoster
    , stake: getStake
    , init: init
    , household: getHousehold
    };
  });
