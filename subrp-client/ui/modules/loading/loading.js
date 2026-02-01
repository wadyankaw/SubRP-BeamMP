angular.module('beamng.stuff')

.directive('animatedIcon', [function () {
  return {
    template: '<div class="icon" layout-align="center center"><div class="icon-img"></div></div>',
    replace: true,
    restrict: 'EA',
    link: function (scope, element, attrs) {
      scope.$watch('data', function() {
        element[0].getElementsByClassName("icon-img")[0].style.backgroundImage = `url("/ui/modules/loading/icon_${attrs.icon}.svg")`;
        if(scope.data !== undefined) {
          let percent = (scope.data.iconState && scope.data.iconState[attrs.icon.toUpperCase()]) || 0
          element[0].style.backgroundPosition = '0 ' + (percent)  + '%'
          if (percent >= 100) {
            element[0].classList.add('loaded');
          }
        }
      })
    }
  }
}])


.directive('animatedProgressBar', [function () {
  return {
    template: '<div class="progressBarBackground"><div class="progressBarParticles"></div><div class="progressBarForeground"></div><div class="progressBarPercentText">{{totalProgress}}%</div></div>',
    replace: true,
    restrict: 'E',
    link: function (scope, element, attrs) {
      scope.$watch('totalProgress', function (newVal) {
        if (newVal !== undefined) {
          let foreground = element[0].querySelector('.progressBarForeground');
          let leftPos = -100 + newVal;
          foreground.style.left = leftPos + '%';
          
          if (newVal > 50) {
            let particles = element[0].querySelector('.progressBarParticles');
            if (particles.children.length < 5) {
              for (let i = 0; i < 5; i++) {
                let particle = document.createElement('div');
                particle.className = 'progressParticle';
                particle.style.top = Math.random() * 8 + 'px';
                particle.style.animationDelay = Math.random() * 3 + 's';
                particles.appendChild(particle);
              }
            }
          }
        }
      });
    }
  };
}])



.directive('animatedProgressStatus', [function () {
  return {
    template: '<div class="progressStatus">{{loadingStatus}}</div>',
    replace: true,
    restrict: 'E'
  };
}])


.directive('animatedProgressStatusHistory', [function () {
  return {
    template: '<div class="progressStatusHistory" layout-align="center center"><div ng-repeat="item in data.historyEntriesDisplay">{{item.message}}</div></div>',
    replace: true,
    restrict: 'EA',
    link: function (scope, element, attrs) {
    }
  }
}])

.directive('tipsBar', [function () {
  return {
    template: '<div class="tipsBar"><div class="tipsBarTitle">Совет:</div><div class="tipsBarTip">{{hintTranslationKey}}</div></div>',
    replace: true,
    restrict: 'EA',
    link: function (scope, element, attrs) {
      setTimeout(function() {
        let tipContainer = document.getElementById('subrp-tips-container');
        if (tipContainer) {
          tipContainer.style.display = 'block';
        }
      }, 100);
    }
  };
}])


.controller('LoadingController', ['$scope', 'ControlsUtils', 'Hints', 'Utils',
  function ($scope, ControlsUtils, Hints, Utils) {

  let vm = this
  const customHints = [
    "Не забывайте соблюдать правила сервера во время игры",
    "Используйте /report для сообщения о нарушениях",
    "Общайтесь с другими игроками вежливо и уважительно",
    "Следите за новостями сервера в нашем Discord",
    "Не забывайте пристегивать ремень безопасности",
    "Соблюдайте скоростной режим в городе",
    "Используйте поворотники при маневрах",
    "Паркуйтесь только в разрешенных местах",
    "Не забывайте заправлять автомобиль",
    "Используйте /me для описания действий вашего персонажа"
  ];
  
  $scope.hintTranslationKey = customHints[Math.floor(Math.random() * customHints.length)];
  

  $scope.totalProgress = 0;
  $scope.loadingStatus = "Инициализация...";
  $scope.loadedModules = {
    TERRAIN: false,
    ENVIRONMENT: false,
    FOREST: false,
    MESHES: false,
    ROADS: false,
    BEAMNG: false
  };

  function updateData(data) {
    if (!data) return;
    
    $scope.data = {};
    $scope.data.historyEntries = data.historyEntries || [];
    $scope.data.historyEntriesDisplay = $scope.data.historyEntries.slice(Math.max($scope.data.historyEntries.length - 3, 0));
    $scope.data.currentEntries = data.currentEntries || []; 
    $scope.data.iconState = {};

    let totalModules = 0;
    let completedModules = 0;
    

    for(let i = 0; i < $scope.data.currentEntries.length; i++) {
      const moduleName = $scope.data.currentEntries[i].name.toUpperCase();
      const progress = $scope.data.currentEntries[i].progress || 0;
      
      $scope.data.iconState[moduleName] = progress;
      
      totalModules++;
      if (progress >= 100) {
        completedModules++;
        $scope.loadedModules[moduleName] = true;
      }
    }
    

    for(let i = 0; i < $scope.data.historyEntries.length; i++) {
      const moduleName = $scope.data.historyEntries[i].name.toUpperCase();
      $scope.data.iconState[moduleName] = 100;
      $scope.loadedModules[moduleName] = true;
      

      if (!$scope.data.currentEntries.some(entry => entry.name.toUpperCase() === moduleName)) {
        totalModules++;
        completedModules++;
      }
    }

    if (totalModules > 0) {
      $scope.totalProgress = Math.floor((completedModules / totalModules) * 100);
    } else {
      $scope.totalProgress = 0;
    }

    if ($scope.totalProgress < 20) {
      $scope.loadingStatus = "Инициализация...";
    } else if ($scope.totalProgress < 40) {
      $scope.loadingStatus = "Загрузка мира...";
    } else if ($scope.totalProgress < 60) {
      $scope.loadingStatus = "Подготовка объектов...";
    } else if ($scope.totalProgress < 80) {
      $scope.loadingStatus = "Финальные штрихи...";
    } else {
      $scope.loadingStatus = "Почти готово...";
    }
    

    setTimeout(function() {
      const icons = document.querySelectorAll('.icon');
      icons.forEach(function(icon) {
        const iconType = icon.getAttribute('icon');
        if (iconType && $scope.loadedModules[iconType.toUpperCase()]) {
          icon.classList.add('loaded');
        }
      });
    }, 50);
  }


  $scope.$on('UpdateLoadingProgressV2', function (event, data) {
    if (!data) return;
    
    try {
      window.requestAnimationFrame(function () {
        $scope.$apply(function () {
          updateData(data);
        });
      });
    } catch (e) {
      console.error('Error updating loading progress:', e);
    }
  });


  bngApi.engineLua('sailingTheHighSeas', (val) => {
    $scope.sailingTheHighSeas = val;
  });

  let file = "/ui/modules/loading/phone.jpg";
  if ($scope.sailingTheHighSeas === true) {
    file = "/ui/modules/mainmenu/unofficial_version.jpg";
  }


  function ensureTopMostDisplay() {
    document.body.style.overflow = 'hidden';

    let loadingScreen = document.querySelector('.loading-screen') || document.querySelector('.subrp-loading-screen');
    if (loadingScreen) {
      loadingScreen.style.zIndex = '2147483647';
      loadingScreen.style.position = 'fixed';
      
      let tipsContainer = document.getElementById('tips-container') || document.getElementById('subrp-tips-container');
      if (tipsContainer) {
        tipsContainer.style.position = 'fixed';
        tipsContainer.style.right = '30px';
        tipsContainer.style.top = '50%';
        tipsContainer.style.transform = 'translateY(-50%)';
        tipsContainer.style.zIndex = '2147483647';
      }
      
      let tipElement = document.querySelector('.tipsBarTip');
      if (tipElement) {
        tipElement.textContent = $scope.hintTranslationKey;
      }
    }
  }

  let timeout = setTimeout(() => {
    bngApi.engineLua('core_gamestate.loadingScreenActive()');
    ensureTopMostDisplay();
  }, 3000);
  $scope.$parent.app.stickyPlayState = null;

  $scope.$evalAsync(() => {
    vm.img = file;
    setTimeout(function () {
      ensureTopMostDisplay();
      
      Utils.waitForCefAndAngular(() => {
        bngApi.engineLua('core_gamestate.loadingScreenActive()');
        clearTimeout(timeout);
      });
    }, 300);
  });

  window.addEventListener('resize', function() {
    let tipsContainer = document.getElementById('tips-container') || document.getElementById('subrp-tips-container');
    if (tipsContainer) {
      tipsContainer.style.position = 'fixed';
      tipsContainer.style.right = '30px';
      tipsContainer.style.top = '50%';
      tipsContainer.style.transform = 'translateY(-50%)';
      tipsContainer.style.zIndex = '2147483647';
    }
  });

  $scope.$on('$destroy', function () {
    clearTimeout(timeout);
    document.body.style.overflow = '';
    window.removeEventListener('resize', null);
  });
}]);