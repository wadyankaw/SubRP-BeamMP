﻿let currentLicenseType = '';
let currentQuestionIndex = 0;
let testAnswers = [];
let testTimer = null;
let testTimeLeft = 300; 
let theoryTestPassed = false;
let drivingExamActive = false;
let drivingErrors = 0;
let drivingTimer = null;
let drivingTimeElapsed = 0;
let confirmCallback = null;
let cancelCallback = null;
let draggedItem = null;
let selectedRoute = null;

let busJobActive = false;
let busJobTimer = null;
let busJobTimeElapsed = 0;

const licenseDescriptions = {
    'A': 'Категория A позволяет управлять мотоциклами, включая мотоциклы с боковым прицепом. Для получения этой категории необходимо пройти теоретический и практический экзамены. Вы научитесь безопасно управлять мотоциклом в различных дорожных условиях.',
    'B': 'Категория B позволяет управлять автомобилями, разрешенная максимальная масса которых не превышает 3500 кг, и число сидячих мест которых, помимо сиденья водителя, не превышает восьми. Это самая популярная категория прав.',
    'C': 'Категория C позволяет управлять автомобилями, предназначенными для перевозки грузов, разрешенная максимальная масса которых превышает 3500 кг. Для работы водителем грузовика необходимо получить эту категорию.',
    'D': 'Категория D позволяет управлять автомобилями, предназначенными для перевозки пассажиров и имеющими более 8 сидячих мест, помимо сиденья водителя. Эта категория необходима для работы водителем автобуса.'
};
const licensePrices = {
    'A': { theory: 1500, practice: 3000 },
    'B': { theory: 2000, practice: 4000 },
    'C': { theory: 2500, practice: 5000 },
    'D': { theory: 3000, practice: 6000 }
};
const testQuestions = [
    {
        question: 'Какой знак предупреждает о приближении к железнодорожному переезду без шлагбаума?',
        options: [
            'Треугольный с красной каймой и черным паровозом',
            'Круглый с красной каймой',
            'Прямоугольный синий',
            'Треугольный с красной каймой и восклицательным знаком'
        ],
        correctAnswer: 0
    },
    {
        question: 'При каком уровне алкоголя в крови запрещено управлять транспортным средством?',
        options: [
            '0.16 промилле',
            '0.3 промилле',
            '0.5 промилле',
            '0.8 промилле',
        ],
        correctAnswer: 0
    },
    {
        question: 'Какое расстояние должно быть между автомобилями при движении в плотном потоке?',
        options: [
            'Не менее 1 метра',
            'Достаточное для остановки при экстренном торможении впереди идущего автомобиля',
            'Не менее 5 метров',
            'Не имеет значения'
        ],
        correctAnswer: 1
    },
    {
        question: 'Что означает сплошная белая линия на дороге?',
        options: [
            'Разделение полос движения в одном направлении',
            'Край проезжей части',
            'Запрет пересечения',
            'Полосу для общественного транспорта'
        ],
        correctAnswer: 2
    },
    {
        question: 'Какой должна быть максимальная скорость в жилой зоне?',
        options: [
            '20 км/ч',
            '40 км/ч',
            '60 км/ч',
            '80 км/ч'
        ],
        correctAnswer: 0
    },
    {
        question: 'Кто имеет преимущество при одновременном перестроении в одну полосу?',
        options: [
            'Автомобиль справа',
            'Автомобиль слева',
            'Кто первый начал маневр',
            'Никто, необходимо уступить дорогу'
        ],
        correctAnswer: 0
    },
    {
        question: 'Что означает зеленый мигающий сигнал светофора?',
        options: [
            'Движение запрещено',
            'Предупреждает о скорой смене сигнала',
            'Разрешает движение только прямо',
            'Разрешает движение только направо'
        ],
        correctAnswer: 1
    },
    {
        question: 'Как правильно расположить руки на руле?',
        options: [
            'В положении "10 и 2 часа"',
            'В положении "9 и 3 часа"',
            'В положении "8 и 4 часа"',
            'Не имеет значения'
        ],
        correctAnswer: 1
    },
    {
        question: 'Какое минимальное расстояние должно быть между автомобилем и велосипедистом при обгоне?',
        options: [
            '0.5 метра',
            '1 метр',
            '1.5 метра',
            '2 метра'
        ],
        correctAnswer: 2
    },
    {
        question: 'Что означает знак "Уступи дорогу"?',
        options: [
            'Необходимо остановиться в любом случае',
            'Необходимо уступить дорогу транспортным средствам, движущимся по пересекаемой дороге',
            'Запрещает движение',
            'Предупреждает о приближении к перекрестку'
        ],
        correctAnswer: 1
    },
    {
        question: 'Какой интервал необходимо соблюдать при движении в дождь?',
        options: [
            'Такой же, как в сухую погоду',
            'Уменьшенный',
            'Увеличенный',
            'Не имеет значения'
        ],
        correctAnswer: 2
    },
    {
        question: 'Что делать, если автомобиль заносит на скользкой дороге?',
        options: [
            'Резко нажать на тормоз',
            'Повернуть руль в сторону заноса',
            'Повернуть руль в сторону, противоположную заносу',
            'Увеличить скорость'
        ],
        correctAnswer: 2
    },
    {
        question: 'Какое минимальное расстояние должно быть до впереди идущего автомобиля при скорости 90 км/ч?',
        options: [
            '10 метров',
            '45 метров',
            '90 метров',
            '100 метров'
        ],
        correctAnswer: 2
    },
    {
        question: 'Что означает термин "слепая зона"?',
        options: [
            'Участок дороги, не просматриваемый из-за поворота',
            'Зона, не просматриваемая в зеркала заднего вида',
            'Участок дороги в темное время суток',
            'Участок дороги с ограниченной видимостью из-за тумана'
        ],
        correctAnswer: 1
    }
];
const data = {PayPDD_info: [{"reason":"Привышение скорости - Южная площадь Плаза","amount":2000},
    {"reason":"Привышение скорости - Северная площадь Плаза","amount":2000}], 

    vehicle:[model='etk',typeFuel='gasoline',currentFuel=50.11, fuelCapacity=55.11], 

    inventory: [{"id":"skibidi",'name': 'Туалет', "count": 5,"weight": 10, "position": 1},
    {"id": "skibidi2",'name': 'Ванна', "count": 2,"weight": 10, "position": 2}, max_weight= 100 ]
    

};






var selectedCar = null;
var selectedColor = null;

/***************************************
 * Angular Приложение и Контроллер
 ***************************************/


var app = angular.module('beamng.apps', []);

app.directive('roleplayhud', [function () {
	return {
		templateUrl: '/ui/modules/apps/HudRP/app.html',
		replace: true,
		restrict: 'EA',
		scope: true,
		controllerAs: 'ctrl'	
	}
}]);

app.controller('RolePlayHudInit', function($rootScope) {
    $rootScope.$on('setPing', function(event, ping) {
        const sessionPing = document.getElementById("Session-Ping");
        if(sessionPing) {
            sessionPing.innerHTML = ping;
        }
    });
});

app.controller("RolePlayHudInit", ['$scope', function ($scope) {
	$scope.init = function() {
        bngApi.engineLua('SubRPHud.SubRPHudReload()');
        startNotificationCheck();
    };
	$scope.reset = function() {$scope.init();};
	$scope.select = function() {bngApi.engineLua('setCEFFocus(true)');};

    $scope.leaveServer = function() {
        bngApi.engineLua('MPCoreNetwork.leaveServer(true)');
    };
    $scope.$on('$destroy', function() {
        if (notificationCheckInterval) {
            clearInterval(notificationCheckInterval);
            console.log("Notification check stopped.");
        }
    });

	$scope.$on('run-RolePlayHud-notify', function (event, d) {
		showNotification(d.name, d.title, d.type, d.time);
	});

	$scope.$on('set-RolePlayHud-open-ui', function (event, data) {
		chpok(data)
	});

	$scope.$on('set-RolePlayHud-open-profile', function (event, data) {
		toggleCharacterStats()
	});
    
    

	$scope.$on('set-RolePlayHud-open-close-phone', function (event, data) {
		close_open_phone()
	});

    $scope.$on('set-RolePlayHud-play-sound', function (event, data) {
		playSound(data.soundName, data.volume)
	});

    $scope.$on('VehicleConfigSet', (event, config) => calcTree(config))
    
    window.pay_pdd_button = function(id) {
		bngApi.engineLua(`SubRPHud.lua_button_pay_pdd(${id})`);
        $scope.$apply();
    };


	window.ui_fast_use_button = function(buttonId) {
		console.log("Нажата кнопка fast use:", buttonId);
		bngApi.engineLua(`SubRPHud.fast_use_send_server(${buttonId})`);
		$scope.$apply();
	}


	$scope.button_send_trans = function() {
        const amount = parseFloat(document.getElementById('amount').value);
        const sendId = document.getElementById('send_id').value;
        
        if (isNaN(amount)) {
			showNotification('Банк', 'Введите корректную сумму перевода', 'warning', 7000);
            return;
        }
        
        if (amount <= 0) {
			showNotification('Банк', 'Сумма перевода должна быть больше нуля', 'warning', 7000);
            return;
        }
        
        if (!sendId || sendId.length < 6) {
			showNotification('Банк', 'Введите коректно номер получателя, он 8-ми значный', 'warning', 7000);
            return;
        }
        
        bngApi.engineLua(`SubRPHud.lua_button_send_trans(${amount}, '${sendId}')`);
        
        document.getElementById('transfer-form').reset();
    };


	$scope.$on('set-RolePlayHud-data', function (event, newData) {
        Object.assign(data, newData);
        console.log("Data updated globally:", newData);
		console.log("RolePlayHud-Sunc")
		for (const [key, value] of Object.entries(newData)) {
			console.log(key);
			console.log(value);
			const elements = document.querySelectorAll(`[id="${key}"]`);
			if (elements.length > 0) {
				elements.forEach(element => {
					element.innerHTML = value;
				});
			} else {
				console.log(`Элементы с id "${key}" не найдены.`);
			}
		}
        // updateInventory(newData.inventory);
		updateCharacterData(newData);
		renderAchievements(newData);
        updatePDDInfo();
        renderCarList(newData.diler_cars);
        loadworkstatus(newData.work_status)
		
        if (Object.keys(newData.buisnes).length === 0) {
            document.getElementById('business-menu-item').style.display = 'none';
        } else {
            document.getElementById('business-menu-item').style.display = 'block';
        }

		const pageListDiv = document.getElementById('ui-bank-page1-history-list');
		pageListDiv.innerHTML = '';

		const ul = document.createElement('ul');
		ul.style.listStyleType = "none";

		newData.transactions.forEach(transaction => {
			const li = document.createElement('li');
			li.style.paddingLeft = "5px";
			li.style.paddingRight = "5px";
			li.style.display = "flex";
			li.style.justifyContent = "space-between";
			li.style.alignItems = "center";
			li.style.marginBottom = "10px";
			li.style.padding = "10px";
			li.style.borderRadius = "5px";
			li.style.backgroundColor = "#343434";

			const nameDiv = document.createElement('div');
			nameDiv.textContent = transaction.name;
			nameDiv.style.fontWeight = "bold";
			nameDiv.style.flex = "2";

			const amountDiv = document.createElement('div');
			amountDiv.textContent = transaction.amount;
			amountDiv.style.color = transaction.color;
			amountDiv.style.fontWeight = "bold";
			amountDiv.style.flex = "1";
			amountDiv.style.textAlign = "right";


			li.appendChild(nameDiv);
			li.appendChild(amountDiv);


			ul.appendChild(li);
		});

		pageListDiv.appendChild(ul);

		

		document.getElementById('sort').addEventListener('change', function() {
			filterAndSortCars();
		});

		document.getElementById('type').addEventListener('change', function() {
			filterAndSortCars();
		});

		document.querySelector('.search-input').addEventListener('input', function() {
			filterAndSortCars();
		});

		document.querySelector('.explore-btn').addEventListener('click', function() {
			document.querySelector('.car-card').click();
		});
		
	});



}]);






document.addEventListener('DOMContentLoaded', function() {
    const uiParts = document.getElementById('ui-parts');
    uiParts.classList.add('fade-in');
    
    const partHeaders = document.querySelectorAll('.part-header');
    partHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const options = this.nextElementSibling;
            options.classList.toggle('active');
            const arrow = this.querySelector('span:last-child');
            arrow.textContent = options.classList.contains('active') ? '▼' : '▶';
        });
    });
    
    const optionItems = document.querySelectorAll('.option-item');
    optionItems.forEach(item => {
        item.addEventListener('click', function() {
            this.parentElement.querySelectorAll('.option-item').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
});



const carPartsData = [
    {
        id: 'engine',
        name: 'Двигатель',
        options: [
            { id: 'engine-1', name: '2.0L Турбо (250 л.с.)', price: 120000, selected: true },
            { id: 'engine-2', name: '3.0L V6 (350 л.с.)', price: 180000, selected: false },
            { id: 'engine-3', name: 'Электрический (400 л.с.)', price: 250000, selected: false }
        ]
    },
    {
        id: 'transmission',
        name: 'Трансмиссия',
        options: [
            { id: 'transmission-1', name: '6-ступ. механическая', price: 50000, selected: true },
            { id: 'transmission-2', name: '8-ступ. автоматическая', price: 80000, selected: false },
            { id: 'transmission-3', name: 'DSG 7-ступ.', price: 95000, selected: false }
        ]
    },
    {
        id: 'suspension',
        name: 'Подвеска',
        options: [
            { id: 'suspension-1', name: 'Стандартная', price: 30000, selected: true },
            { id: 'suspension-2', name: 'Спортивная', price: 50000, selected: false },
            { id: 'suspension-3', name: 'Гоночная', price: 80000, selected: false },
            { id: 'suspension-4', name: 'Пневматическая', price: 120000, selected: false }
        ]
    },
    {
        id: 'wheels',
        name: 'Колёса',
        options: [
            { id: 'wheels-1', name: '17" Стальные', price: 20000, selected: true },
            { id: 'wheels-2', name: '18" Легкосплавные', price: 40000, selected: false },
            { id: 'wheels-3', name: '19" Премиум', price: 60000, selected: false },
            { id: 'wheels-4', name: '20" Спортивные', price: 80000, selected: false }
        ]
    }
];

const state = {
    parts: JSON.parse(JSON.stringify(carPartsData)),
    searchQuery: '',
    totalPrice: 0
};


function render_parts() {
    renderPartsTree();
    calculateTotalPrice();
    setupEventListeners();
}


function renderPartsTree() {
    const partsTreeContainer = document.querySelector('.parts-tree');
    partsTreeContainer.innerHTML = '';

    state.parts.forEach(part => {
        if (state.searchQuery && 
            !part.name.toLowerCase().includes(state.searchQuery.toLowerCase()) &&
            !part.options.some(opt => opt.name.toLowerCase().includes(state.searchQuery.toLowerCase()))) {
            return;
        }

        const partItem = document.createElement('div');
        partItem.className = 'part-item';
        partItem.dataset.partId = part.id;

        const partHeader = document.createElement('div');
        partHeader.className = 'part-header';
        partHeader.innerHTML = `
            <span class="part-name">${part.name}</span>
            <span>▼</span>
        `;

        const partOptions = document.createElement('div');
        partOptions.className = 'part-options';
        
        part.options.forEach(option => {
            const optionItem = document.createElement('div');
            optionItem.className = `option-item ${option.selected ? 'selected' : ''}`;
            optionItem.dataset.optionId = option.id;
            optionItem.textContent = option.name;
            
            if (option.price > 0) {
                const priceSpan = document.createElement('span');
                priceSpan.className = 'option-price';
                priceSpan.textContent = ` (+${formatPrice(option.price)})`;
                optionItem.appendChild(priceSpan);
            }
            
            partOptions.appendChild(optionItem);
        });

        partItem.appendChild(partHeader);
        partItem.appendChild(partOptions);
        partsTreeContainer.appendChild(partItem);
    });

    document.querySelectorAll('.part-header').forEach(header => {
        header.addEventListener('click', function() {
            const options = this.nextElementSibling;
            options.classList.toggle('active');
            this.querySelector('span:last-child').textContent = 
                options.classList.contains('active') ? '▼' : '▶';
        });
    });


    document.querySelectorAll('.option-item').forEach(option => {
        option.addEventListener('click', function() {
            const partId = this.closest('.part-item').dataset.partId;
            const optionId = this.dataset.optionId;
            

            state.parts.find(p => p.id === partId).options.forEach(opt => {
                opt.selected = false;
            });

            const selectedOption = state.parts.find(p => p.id === partId)
                .options.find(opt => opt.id === optionId);
            selectedOption.selected = true;
            

            renderPartsTree();
            calculateTotalPrice();
        });
    });
}


function calculateTotalPrice() {
    state.totalPrice = 0;
    
    state.parts.forEach(part => {
        const selectedOption = part.options.find(opt => opt.selected);
        if (selectedOption) {
            state.totalPrice += selectedOption.price;
        }
    });
    

    console.log('Общая стоимость:', state.totalPrice);
}


function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(price);
}


function setupEventListeners() {
    document.querySelector('.search-input').addEventListener('input', function(e) {
        state.searchQuery = e.target.value.trim();
        renderPartsTree();
    });
    
    document.querySelector('.btn-secondary').addEventListener('click', function() {
        state.parts = JSON.parse(JSON.stringify(carPartsData));
        state.searchQuery = '';
        document.querySelector('.search-input').value = '';
        renderPartsTree();
        calculateTotalPrice();
    });
    

    document.querySelector('.btn-primary').addEventListener('click', function() {
        const selectedOptions = {};
        
        state.parts.forEach(part => {
            const selectedOption = part.options.find(opt => opt.selected);
            if (selectedOption) {
                selectedOptions[part.id] = {
                    name: selectedOption.name,
                    price: selectedOption.price
                };
            }
        });
        
        console.log('Выбранные опции:', selectedOptions);
        console.log('Общая стоимость:', formatPrice(state.totalPrice));
        
        alert(`Конфигурация сохранена!\nОбщая стоимость: ${formatPrice(state.totalPrice)}`);
    });
}





function filterTreeNode(searchResults, treeNode, queryArgs) {

    let matched = false
    if(queryArgs['mode'] == 'or') matched = false
    else if(queryArgs['mode'] == 'and') matched = true

    if(queryArgs['name'] && treeNode.name !== undefined) matched = queryModes[queryArgs['mode']](matched, treeNode.name.toLowerCase().indexOf(queryArgs['name']) != -1)
    if(queryArgs['description'] && treeNode.description !== undefined) matched = queryModes[queryArgs['mode']](matched, treeNode.description.toLowerCase().indexOf(queryArgs['description']) != -1)
    if(queryArgs['slot'] && treeNode.name !== undefined) matched = queryModes[queryArgs['mode']](matched, treeNode.name.toLowerCase().indexOf(queryArgs['slot']) != -1)
    if(!matched) {
      for (var optIdx in treeNode.options) {
        let option = treeNode.options[optIdx]
        if (option.isAuxiliary && !vm.showAuxiliary) continue;
        if (queryArgs['name'] && option.name !== undefined) matched = queryModes[queryArgs['mode']](matched, option.name.toLowerCase().indexOf(queryArgs['name']) != -1)
        if (!matched && queryArgs['description'] && option.description !== undefined) matched = queryModes[queryArgs['mode']](matched, option.description.toLowerCase().indexOf(queryArgs['description']) != -1)
        if (!matched && queryArgs['partname'] && option.val !== undefined) matched = queryModes[queryArgs['mode']](matched, option.val.toLowerCase().indexOf(queryArgs['partname']) != -1)
        if (matched) break;
      }
    }

    if(queryArgs['mod'] || queryArgs['author']) {
      filterPartByName(treeNode.val, queryArgs)
      for (var optIdx in treeNode.options) {
        let option = treeNode.options[optIdx]
        if (option.isAuxiliary && !vm.showAuxiliary) continue;
        if(option.val !== undefined) {
          matched = queryModes[queryArgs['mode']](matched,
            filterPartByName(option.val, queryArgs)
          )
        }
      }
    }

    if(matched) searchResults.push(treeNode)

    for (var partIdx in treeNode.parts) {
      filterTreeNode(searchResults, treeNode.parts[partIdx], queryArgs)
    }
  }

function calcTree (config) {

    $scope.$evalAsync(function () {
        calcTreesync(config)
        filterTree()
    })
}


function calcTreesync(config) {
    let tree = []

    function treeSort(a, b) {
      if (a.parts && !b.parts) return 1
      if (b.parts && !a.parts) return -1
      return a.name.localeCompare(b.name)
    }

    function children2parts(dest, children) {
      for (const [name, data] of Object.entries(children)) {
        const node = {
          ...data,
          name,
          description: name,
          val: data.chosenPartName,
          options: [],
        }
        if (Array.isArray(data.suitablePartNames)) {
          node.options = data.suitablePartNames
            .map(name => ({
              name,
              description: name,
              val: name,
            }))
          node.options.unshift({
            name: "Empty",
            description: "Empty",
            val: "",
          })
        }
        delete node.children
        if (typeof data.children === "object" && Object.keys(data.children).length > 0) {
          node.parts = []
          children2parts(node.parts, data.children)
        }
        dest.push(node)
      }
      dest.sort(treeSort)
    }
    children2parts(tree, config.chosenPartsTree.children)

    console.log({ config: config.chosenPartsTree, tree })

    vm.d.data = tree
  }


function filterTree() {
    let queryString = vm.partSearchString.toLowerCase()
    let queryArgs = {}
    queryArgs['mode'] = 'or'
    vm.searchResString = ''

    // default: search all
    if (queryString.indexOf(':') == -1) {
      queryArgs['description'] = queryString
    } else {
      let parsedargs = 0
      let args = queryString.split(/[ ,]+/)
      for(i = 0; i < args.length; i++) {
        if (args[i].indexOf(':') != -1) {
          let args2 = args[i].split(/:/)
          if(args2.length == 2 && args2[1].trim() != '') {
            queryArgs[args2[0]] = args2[1]
            parsedargs++
          } else {
            vm.searchResString += 'invalid search format: ' + args[i] + '\n'
          }
        } else {
          vm.searchResString += 'unknown search argument: ' + args[i] + '\n'
        }
      }
      if(parsedargs > 1) queryArgs['mode'] = 'and'
    }

    vm.searchResults = []
    if(queryString != '' && queryString.length < 3) {
      vm.searchResString = "Search term too short"
      return
    }
    vm.partSearchQuery = {
      ...queryArgs,
      highlight: queryArgs.description || queryArgs.name || null,
    }

    if (queryString.trim() !== '' && !vm.searchHistoryBrowsing) {
      let lastHistory = vm.searchHistory[vm.searchHistory.length - 1] || ""
      if(queryString.indexOf(lastHistory) != -1) {
        vm.searchHistory[vm.searchHistory.length - 1] = queryString
      } else if(lastHistory.indexOf(queryString) != -1) {
      } else {
        vm.searchHistory.push(queryString)
      }
      saveSearchHistory()
    }



    for (var partIdx in vm.d.data) {
      let part = vm.d.data[partIdx]
      filterTreeNode(vm.searchResults, part, queryArgs)
    }
    if(vm.searchResults.length == 0) {
      vm.searchResString = "No results found"
    }
  }











function renderBusinessList() {
    document.getElementById('business-list-section').style.display = 'block';
    document.getElementById('business-section').style.display = 'none';
    const businessListSection = document.getElementById('business-list-section');
    businessListSection.innerHTML = `
        <div class="header">
            <h1 class="page-title">Ваши бизнесы</h1>
        </div>
        <div class="character-card">
            <div class="business-grid" id="business-grid"></div>
        </div>
    `;

    const businessGrid = document.getElementById('business-grid');
    businessGrid.innerHTML = '';

    for (const [id, business] of Object.entries(data.buisnes)) {
        const businessCard = document.createElement('div');
        businessCard.className = 'business-card';
        businessCard.innerHTML = `
            <div class="business-icon">
                <i class="fas ${business.buisnes_name.includes('Заправка') ? 'fa-gas-pump' : 'fa-car'}"></i>
            </div>
            <div class="business-info">
                <h3>${business.name}</h3>
                <p>${business.buisnes_name}</p>
                <div class="business-status ${business.open ? 'open' : 'closed'}">
                    ${business.open ? 'Открыт' : 'Закрыт'}
                </div>
                <div class="business-ratio">
                Коэффициент -
                    <i class="fas fa-percentage"></i>${business.ratio.toFixed(2)}
                </div>
            </div>
            <div class="business-balance" style="color: white;">
                <span>Баланс:</span>
                <span class="money">$${business.balance.toLocaleString()}</span>
            </div>
        `;
        businessCard.addEventListener('click', () => openBusinessDetail(id));
        businessGrid.appendChild(businessCard);
    }
}

function openBusinessDetail(businessId) {
    const business = data.buisnes[businessId];
    
    document.getElementById('business-list-section').style.display = 'none';
    document.getElementById('business-section').style.display = 'block';
    
    const businessSection = document.getElementById('business-section');
    businessSection.innerHTML = `
        <div class="header">
            <div class="header-actions">
                <button class="back-btn" onclick="renderBusinessList()">
                    <i class="fas fa-arrow-left"></i> Назад
                </button>
                <h1 class="page-title" style="color: white;">Управление бизнесом</h1>
            </div>
        </div>
        <div class="character-card">
            <div class="business-detail-header">
                <div class="business-icon large">
                    <i class="fas ${business.buisnes_name.includes('Заправка') ? 'fa-gas-pump' : 'fa-car'}"></i>
                </div>
                <div class="business-info" style="color: white;">
                    <h2>${business.name}</h2>
                    <p>${business.buisnes_name}</p>
                    <div class="business-status ${business.open ? 'open' : 'closed'}">
                        ${business.open ? 'Открыт' : 'Закрыт'}
                    </div>
                </div>
            </div>
            
            <div class="business-stats">
                <div class="stat-card">
                    <div class="stat-title">Баланс</div>
                    <div class="stat-value money" style="color: white">$${business.balance.toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Ежедневное списание</div>
                    <div class="stat-value">$${business.pay_day.toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Коэффициент цен</div>
                    <div class="ratio-control">
                        <button class="ratio-btn minus" onclick="changeRatio('${businessId}', -0.01)">
                            <i class="fas fa-minus">-</i>
                        </button>
                        <span class="ratio-value">${business.ratio.toFixed(2)}</span>
                        <button class="ratio-btn plus" onclick="changeRatio('${businessId}', 0.01)">
                            <i class="fas fa-plus">+</i>
                        </button>
                    </div>
                    <div class="ratio-hint">
                        ${getRatioHint(business.ratio)}
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Материалы</div>
                    <div class="stat-value">${business.mat}/${business.mat_max}</div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${(business.mat / business.mat_max) * 100}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="business-actions">
                <button class="action-btn ${business.open ? 'close-btn' : 'open-btn'}" 
                        onclick="toggleBusinessStatus('${businessId}')">
                    ${business.open ? 'Закрыть бизнес' : 'Открыть бизнес'}
                </button>
                <button class="action-btn withdraw-btn" onclick="withdrawMoney('${businessId}')">
                    Снять деньги
                </button>
                <button class="action-btn invest-btn" onclick="investMoney('${businessId}')">
                    + 1.000 $
                </button>
            </div>
            
            <div class="business-profit-chart" style="color: white;">
                <h3>Доходность за неделю</h3>
                <div class="chart-container">
                    ${renderProfitChart(business.last_days_profit)}
                </div>
            </div>
        </div>
    `;
}



function changeRatio(businessId, delta) {
    const business = data.buisnes[businessId];
    let newRatio = business.ratio + delta;

    newRatio = Math.max(0.50, Math.min(2.00, newRatio));
    newRatio = parseFloat(newRatio.toFixed(2));
    
    business.ratio = newRatio;
    
    const ratioElement = document.querySelector('.ratio-value');
    if (ratioElement) {
        ratioElement.textContent = newRatio.toFixed(2);
        
        const hintElement = document.querySelector('.ratio-hint');
        if (hintElement) {
            hintElement.textContent = getRatioHint(newRatio);
        }
    }
    

    bngApi.engineLua(`SubRPCore.lua_buisnes_change_ratio('${businessId}', ${newRatio})`);
    console.log(`Коэффициент для бизнеса ${businessId} изменен на ${newRatio}`);
}

function renderProfitChart(profitData) {
    const days = {
        'Monday': 'Пн',
        'Tuesday': 'Вт',
        'Wednesday': 'Ср',
        'Thursday': 'Чт',
        'Friday': 'Пт',
        'Saturday': 'Сб',
        'Sunday': 'Вс'
    };
    
    let maxProfit = 0;
    
    Object.keys(days).forEach(day => {
        if (profitData[day].profit > maxProfit) {
            maxProfit = profitData[day].profit;
        }
    });
    
    if (maxProfit === 0) maxProfit = 1;
    
    return Object.entries(days).map(([engDay, rusDay]) => `
        <div class="chart-day">
            <div class="chart-bar-container">
                <div class="chart-bar" style="height: ${(profitData[engDay].profit / maxProfit) * 100}%"></div>
            </div>
            <span class="chart-day-label">${rusDay.substring(0, 3)}</span>
            <span class="chart-day-profit">$${profitData[engDay].profit}</span>
        </div>
    `).join('');
}

function toggleBusinessStatus(businessId) {
    const business = data.buisnes[businessId];
    business.open = !business.open;
    
    if (document.getElementById('business-list-section').style.display !== 'none') {
        renderBusinessList();
    } else {
        openBusinessDetail(businessId);
    }
    bngApi.engineLua(`SubRPCore.lua_buisnes_change_status('${businessId}', ${business.open})`);
    console.log(`Бизнес ${businessId} теперь ${business.open ? 'открыт' : 'закрыт'}`);
}

function withdrawMoney(businessId) {
    const business = data.buisnes[businessId];
    if (business.balance <= 0) {
        showNotification('Бизнес', 'На балансе бизнеса нет средств', 'warning', 7000);
        return;
    }
    
    business.balance = 0;
    
    openBusinessDetail(businessId);
    bngApi.engineLua(`SubRPCore.lua_buisnes_rem_bal('${businessId}')`);
}

function investMoney(businessId) {
    const business = data.buisnes[businessId];
    business.balance = business.balance + 1000;
    openBusinessDetail(businessId);
    bngApi.engineLua(`SubRPCore.lua_buisnes_add_bal('${businessId}')`);
}



function createAchievementCard(achievement) {
    const statusClass = achievement.unlocked ? 'unlocked' : 'locked';
    const goldClass = achievement.isGold ? ' gold' : '';
    
    let rewardHTML = '';
    
    if (achievement.reward.money > 0) {
        rewardHTML += `<span class="reward-money">+$${achievement.reward.money.toLocaleString()}</span>`;
    }
    if (achievement.reward.exp > 0) {
        rewardHTML += `<span class="reward-exp">+${achievement.reward.exp} XP</span>`;
    }
    if (achievement.reward.badge) {
        rewardHTML += `<span class="reward-badge">${achievement.reward.badge}</span>`;
    }
    
    let statusHTML = '';
    if (achievement.unlocked) {
        statusHTML = `<span class="unlocked-text">Получено: ${achievement.unlockDate}</span>`;
    } else {
        const progress = achievement.progress || {};
        const current = progress.current || 0;
        const total = progress.total || 1;
        const progressPercent = Math.min(100, (current / total) * 100);
        
        statusHTML = `
            <span class="progress-text">Прогресс: ${current}/${total}</span>
            <div class="progress-bar">
                <div class="progress" style="width: ${progressPercent}%"></div>
            </div>
        `;
    }
    
    return `
        <div class="achievement-card ${statusClass}${goldClass}">
            <div class="achievement-icon">
                <i class="fas ${achievement.icon || 'fa-trophy'}"></i>
            </div>
            <div class="achievement-info">
                <h3>${achievement.title || 'Без названия'}</h3>
                <p>${achievement.description || ''}</p>
                ${rewardHTML ? `<div class="achievement-reward">${rewardHTML}</div>` : ''}
            </div>
            <div class="achievement-status">
                ${statusHTML}
            </div>
        </div>
    `;
}

function renderAchievements(data) {
    const achievementsGrid = document.querySelector('.achievements-grid');
    
    if (!achievementsGrid) {
        console.error('Элемент .achievements-grid не найден на странице');
        return;
    }
    
    achievementsGrid.innerHTML = '';
    
    data.achievements.forEach(achievement => {
        const achievementHTML = createAchievementCard(achievement);
        achievementsGrid.insertAdjacentHTML('beforeend', achievementHTML);
    });
}




function toggleCharacterStats() {
    const statsPanel = document.getElementById('ui-character-stats');
    const uiToggleShow = document.getElementById('ui_toggle_show');
    
    if (statsPanel.style.display === 'none' || !statsPanel.style.display) {
        const uiElements = ["ui-bank","ui-parts", "ui-car_diler", "ui-inventory", "ui-fast_use", "ui-auto_school"];
        uiElements.forEach(id => {
            const elem = document.getElementById(id);
            if (elem) elem.style.display = 'none';
        });
        
        statsPanel.style.display = 'block';
        uiToggleShow.style.display = 'none';
    } else {
        statsPanel.style.display = 'none';
		
        uiToggleShow.style.display = 'block';
    }
}

function OpenPageProfile(section) {
    const allSections = document.querySelectorAll('.main-content > div');
    allSections.forEach(sec => {
        sec.style.display = 'none';
    });
    
    switch(section) {
        case 'profile':
            allSections[0].style.display = 'block';
            break;
        case 'bonus':
            document.getElementById('achievements-section').style.display = 'block';
            break;
        case 'cases':
            document.getElementById('cases-section').style.display = 'block';
            break;
        case 'setting':
            document.getElementById('settings-section').style.display = 'block';
            break;
        case 'business':
            document.getElementById('business-list-section').style.display = 'block';
            document.getElementById('business-section').style.display = 'none';
            renderBusinessList();
            break;
        default:
            allSections[0].style.display = 'block';
    }
    
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeItem = document.querySelector(`.menu-item span[onclick="OpenPageProfile('${section}')"]`);
    if (activeItem) {
        activeItem.parentElement.classList.add('active');
    }
}

function getRatioHint(ratio) {
    if (ratio < 0.80) return "Большая скидка для клиентов";
    if (ratio < 1.00) return "Небольшая скидка";
    if (ratio === 1.00) return "Стандартная цена";
    if (ratio <= 1.30) return "Небольшая наценка";
    return "Высокая наценка";
}



function updateCharacterData(data) {    
    document.querySelector('.avatar').textContent = data.name.split(' ').map(n => n[0]).join('');
    document.querySelector('.character-info h2').textContent = data.name;
    document.querySelector('.character-info p').textContent = `@${data.nick}`;
    document.querySelector('.stat-value.money').textContent = `${data.InfoPlayerBankMoney.toLocaleString()}`;
    document.querySelector('.stat-value.cash').textContent = `$ ${data.InfoPlayerMoney.toLocaleString()}`;
    document.querySelector('.stat-value.level').textContent = data.user_level;
    document.querySelector('.progress').style.width = `${data.levelProgress}%`;

    
    const statValues = document.querySelectorAll('.stat-value');
    const minutes = data.playTime;
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
    statValues[3].textContent = `${hours} ч ${mins} мин`;

	const date = new Date(data.registrationDate);
	
	statValues[4].textContent = data.fraction_name;
  
	if (isNaN(date.getTime())) {
		return "Invalid Date";
	}
	
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	
    statValues[5].textContent = `${day}.${month}.${year}`;
}




function toggleUIPanel(id) {
	const panel = document.getElementById(id);
	if (panel.style.display === 'block') {
	  panel.style.display = 'none';
	} else {
	  panel.style.display = 'block';
	}
  }


function updatePDDInfo() {
	const container = document.getElementById('pdd-fines-list');
	const payAllBtn = document.getElementById('pdd-pay-all-btn');
	
	container.innerHTML = '';
	
	if (!data.PayPDD_info || Object.keys(data.PayPDD_info).length === 0) { 
        container.innerHTML = '<div class="pdd-no-fines">Вы законопослушный гражданин</div>';
        if (payAllBtn) payAllBtn.style.display = 'none';
        return;
    }
	
	let totalAmount = 0;
	data.PayPDD_info.forEach((fine, index) => {
	totalAmount += parseInt(fine.amount);
	  
	const fineElement = document.createElement('div');
	fineElement.className = 'pdd-item';
	fineElement.innerHTML = `
		<div>
		  <div class="pdd-reason">${fine.reason}</div>
		  <div class="pdd-amount">${fine.amount} $.</div>
		</div>
		<button class="pdd-pay-btn" onclick="pay_pdd_button(${index})">Оплатить</button>
	  `;
	  
	  container.appendChild(fineElement);
	});
	
	payAllBtn.style.display = 'block';
	payAllBtn.textContent = `Оплатить все штрафы (${totalAmount} $.)`;
  }
  



/***************************************
 * Вспомогательные функции
 ***************************************/
function createCarCard(car) {
const card = document.createElement('div');
card.className = 'card';

const img = document.createElement('img');
img.src = car.image;
img.alt = car.name;

const title = document.createElement('h2');
title.textContent = car.name;

const title_car = document.createElement('h4');
title_car.textContent = `Масса: ${car.mass}, Л.с.: ${car.power}`;

const buyButton = document.createElement('button');
buyButton.textContent = `Цена: ${car.price}`;
buyButton.className = 'buy-button';
buyButton.onclick = function() {
	alert(`Вы купили ${car.name}`);
};

card.appendChild(img);
card.appendChild(title);
card.appendChild(title_car);
card.appendChild(buyButton);

return card;
}

function bank_pages_open_modal(id) {
    const pages = ["ui-bank-page2-pay-pdd", "ui-bank-page2-pay-home", "ui-bank-page2-pay-buisnes"];
    pages.forEach(page => {
        const elem = document.getElementById(page);
        if (elem) {
        elem.style.display = (page === id) ? '' : 'none';
        }
    });
}
    
    
function bank_pages_open(pageId) {
    document.querySelectorAll('.bank-page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none'; 
    });
    
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        selectedPage.style.display = 'block';
    }
    
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    let menuSelector = '';
    if (pageId === 'ui-bank-page1') {
        menuSelector = '.sidebar-item[onclick="bank_load_page1()"]';
    } else if (pageId === 'ui-bank-page2-pay-pdd') {
        menuSelector = '.sidebar-item[onclick="bank_pages_open(\'ui-bank-page2-pay-pdd\');"]';
    } else if (pageId === 'ui-bank-transfer') {
        menuSelector = '.sidebar-item[onclick="bank_pages_open(\'ui-bank-transfer\');"]';
    } else if (pageId === 'ui-bank-page3-history') {
        menuSelector = '.sidebar-item[onclick="bank_pages_open(\'ui-bank-page3-history\');"]';
    } else if (pageId === 'ui-bank-page4-services') {
        menuSelector = '.sidebar-item[onclick="bank_pages_open(\'ui-bank-page4-services\');"]';
    }
    
    if (menuSelector) {
        const menuItem = document.querySelector(menuSelector);
        if (menuItem) {
            menuItem.classList.add('active');
        }
    }
    
    // Load specific page data
    if (pageId === 'ui-bank-page2-pay-pdd') {
        updatePDDInfo();
    } else if (pageId === 'ui-bank-page3-history') {
        loadFullHistory();
    }
}


function bank_load_page1() {
    document.querySelectorAll('.bank-page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none'; 
    });
    
    // Show main page
    const mainPage = document.getElementById('ui-bank-page1');
    if (mainPage) {
        mainPage.classList.add('active');
        mainPage.style.display = 'block'; 
    }
    
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const mainMenuItem = document.querySelector('.sidebar-item[onclick="bank_load_page1()"]');
    if (mainMenuItem) {
        mainMenuItem.classList.add('active');
    }
    

    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateElement = document.getElementById('bank-current-date');
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('ru-RU', options);
    }
    
    loadRecentTransactions();
}

function loadRecentTransactions() {
    const transactionList = document.getElementById('ui-bank-page1-history-list');
    
    transactionList.innerHTML = '';
    
    if (window.bankTransactions && window.bankTransactions.length > 0) {
        const recentTransactions = window.bankTransactions.slice(0, 5);
        
        recentTransactions.forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            
            const isPositive = transaction.type === 'in';
            
            transactionItem.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-title">${transaction.description}</div>
                    <div class="transaction-date">${transaction.date}</div>
                </div>
                <div class="transaction-amount ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '+' : '-'}$${Math.abs(transaction.amount).toLocaleString()}
                </div>
            `;
            
            transactionList.appendChild(transactionItem);
        });
    } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'transaction-item placeholder';
        placeholder.textContent = 'Нет недавних транзакций';
        transactionList.appendChild(placeholder);
    }
}
function loadFullHistory() {
    const historyList = document.getElementById('ui-bank-page2-history');
    

    historyList.innerHTML = '';
    
    if (window.bankTransactions && window.bankTransactions.length > 0) {
        window.bankTransactions.forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            
            const isPositive = transaction.type === 'in';
            
            transactionItem.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-title">${transaction.description}</div>
                    <div class="transaction-date">${transaction.date}</div>
                </div>
                <div class="transaction-amount ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '+' : '-'}$${Math.abs(transaction.amount).toLocaleString()}
                </div>
            `;
            
            historyList.appendChild(transactionItem);
        });
    } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'transaction-item placeholder';
        placeholder.textContent = 'История транзакций пуста';
        historyList.appendChild(placeholder);
    }
}
    
function loadFines() {
    const finesList = document.getElementById('pdd-fines-list');
    const payAllBtn = document.getElementById('pdd-pay-all-btn');
    finesList.innerHTML = '';
    if (window.playerFines && window.playerFines.length > 0) {
        payAllBtn.style.display = 'block';
            
        window.playerFines.forEach((fine, index) => {
            const fineItem = document.createElement('div');
            fineItem.className = 'fine-item';
                
            fineItem.innerHTML = `
                    <div class="fine-info">
                        <div class="fine-title">${fine.description}</div>
                        <div class="fine-date">${fine.date}</div>
                    </div>
                    <div class="fine-amount">$${fine.amount.toLocaleString()}</div>
                    <button class="fine-pay-btn" onclick="pay_pdd_button(${index})">Оплатить</button>
                `;
                
            finesList.appendChild(fineItem);
        });
    } else {
        payAllBtn.style.display = 'none';
            
        const placeholder = document.createElement('div');
        placeholder.className = 'fine-item placeholder';
        placeholder.textContent = 'Нет неоплаченных штрафов';
        finesList.appendChild(placeholder);
    }
}
function bank_load_page2() {
    bank_pages_open('ui-bank-page2');
}


/***************************************
 * Fast Use: создание радиального меню
 ***************************************/
function ui_fast_use_load() {
    const container = document.getElementById("ui-fast_use");
    if (!container) return;

    container.style.display = "block";

    // Удаляем ранее созданные кнопки, если они есть
    const existingButtons = container.querySelectorAll(".fast_use_button");
    existingButtons.forEach(btn => btn.remove());

    const buttons = data.fast_use;
    const numButtons = data.fast_use_count;
    if (numButtons === 0) return;

    const radius = 80;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    for (let i = 0; i < numButtons; i++) {
        const angle = (2 * Math.PI / numButtons) * i - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle) - 40;
        const y = centerY + radius * Math.sin(angle);

        const btn = document.createElement("div");
        btn.className = "fast_use_button";
        btn.style.left = x + "px";
        btn.style.top = y + "px";
        btn.setAttribute("data-id", buttons[i].id);
        btn.textContent = buttons[i].text;

        btn.addEventListener("click", function(e) {
        e.stopPropagation();
        ui_fast_use_button(buttons[i].id);
        });

        container.appendChild(btn);
    }
}
/***************************************
 * Управление видимостью UI 
 ***************************************/
function chpok(id) {
const uiElements = ["ui-bank", "ui-car_diler", "ui-inventory", "ui-casino","ui-jobs-bus", "ui-fast_use", "ui-auto_school","ui-buy_biz", "ui-jobs-taxi","ui-jobs-delivery", "close_hud"];
const elem = document.getElementById(id);

if (id == "close_hud") {
	uiElements.forEach(pageId => {
	const pageElem = document.getElementById(pageId);
	if (pageElem) {
		pageElem.style.display = 'none';
	}
	});

	return
}

if (elem) {
	const isOpen = elem.style.display === '' || elem.style.display === 'block';

	uiElements.forEach(pageId => {
	const pageElem = document.getElementById(pageId);
	if (pageElem) {
		pageElem.style.display = 'none';
	}
	});

	elem.style.display = isOpen ? 'none' : '';

	if (id === "ui-bank" && !isOpen) {
	    bank_load_page1();
	}
	if (id === "ui-fast_use" && !isOpen) {
	    ui_fast_use_load();
	}
    if (id == "ui-gas-station") {
		updateGasStationUI();
	}

    if (id == "ui-jobs-bus") {
		loadBusRoutes();
	}
    if (id=="ui-buy_biz") {
        loadbuissnesino(data.buy_biz);
    }
    if (id=="ui-jobs-taxi") {
        rendertaximenu(data);
    }
    if (id=="ui-jobs-delivery") {
        deliveryinitInterface();
    }
}
}

/***************************************
 * Автосалон
 ***************************************/





function filterAndSortCars() {
	const sortValue = document.getElementById('sort').value;
	const typeValue = document.getElementById('type').value;
	const searchValue = document.querySelector('.search-input').value.toLowerCase();

	let filteredCars = [...data.diler_cars];

	if (typeValue !== 'all') {
		filteredCars = filteredCars.filter(car => car.type === typeValue);
	}

	if (searchValue) {
		filteredCars = filteredCars.filter(car => 
			car.name.toLowerCase().includes(searchValue) ||
			car.description.toLowerCase().includes(searchValue) ||
			car.engine.toLowerCase().includes(searchValue)
		);
	}

	if (sortValue === 'price-asc') {
		filteredCars.sort((a, b) => a.price - b.price);
	} else if (sortValue === 'price-desc') {
		filteredCars.sort((a, b) => b.price - a.price);
	}

	renderCarList(filteredCars);

	if (selectedCar && !filteredCars.some(car => car.id === selectedCar.id)) {
		hideCarDetail();
	} else if (selectedCar) {
		highlightSelectedCar();
	}
}
function getTypeBadge(type) {
	switch(type) {
		case 'sport':
			return '<span class="badge badge-sport">SPORT</span>';
		case 'suv':
			return '<span class="badge badge-suv">SUV</span>';
		case 'sedan':
			return '<span class="badge badge-sedan">SEDAN</span>';
		case 'luxury':
			return '<span class="badge badge-luxury">LUXURY</span>';
		case 'electric':
			return '<span class="badge badge-electric">ELECTRIC</span>';
		default:
			return '';
	}
}

function renderCarList(carsToRender) {
	const carListElement = document.getElementById('carList');
	carListElement.innerHTML = '';

	if (carsToRender.length === 0) {
		carListElement.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 20px;">Ничего не найдено</div>';
		return;
	}

	carsToRender.forEach(car => {
		const carCard = document.createElement('div');
		carCard.className = 'car-card';

		if (selectedCar && selectedCar.id === car.id) {
			carCard.classList.add('active');
		}
		const badge = getTypeBadge(car.type);
		
		
		carCard.innerHTML = `
			<img class="car-image" src="/ui/modules/apps/HudRP/images/${car.image}" alt="${car.name}">
			<div class="car-info">
				<h3>${car.name} ${badge}</h3>
				<div style="color:#ffffff" class="car-meta">
					<span>${car.year}</span>
					<span>${car.engine.split(',')[0]}</span>
				</div>
				<div class="price">${formatPrice(car.price)} $</div>
			</div>
		`;
		
		carCard.addEventListener('click', () => showCarDetail(car));
		carListElement.appendChild(carCard);
	});
}

function highlightSelectedCar() {
	const carCards = document.querySelectorAll('.car-card');
	carCards.forEach(card => {
		card.classList.remove('active');
		const carName = card.querySelector('h3').textContent.replace(' SPORT', '').trim();
		if (selectedCar && carName === selectedCar.name) {
			card.classList.add('active');
			
			card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	});
	}

function showCarDetail(car) {
	selectedCar = car;
	selectedColor = car.colors[0];

	document.getElementById('welcomeMessage').style.display = 'none';

	const carDetailElement = document.getElementById('carDetail');
	carDetailElement.innerHTML = `
		<div class="detail-header">
			<button class="back-btn" onclick="hideCarDetail()">
				← Все автомобили
			</button>
		</div>
		
		<div class="detail-content">
			<h1 style="color:#ffffff" class="car-title">${car.name}</h1>
			<div class="car-year">${car.year} год</div>
			
			<div class="car-gallery">
				<img class="main-image" src="/ui/modules/apps/HudRP/images/${car.image}" alt="${car.name}">
			</div>
			
			<div class="color-selection">
				<div style="color:#ffffff" class="section-title">Доступные цвета</div>
				<div class="color-options">
					${car.colors.map(color => `
						<div class="color-option ${color === selectedColor ? 'selected' : ''}" 
								style="background-color: ${color};"
								onclick="selectColor('${color}')"></div>
					`).join('')}
				</div>
			</div>
			
			<div style="color:#ffffff" class="section-title">Характеристики</div>
			<div style="color:#ffffff" class="specs-grid">
				<div class="spec-item">
					<div class="spec-label">Двигатель</div>
					<div class="spec-value">${car.engine}</div>
				</div>
				<div class="spec-item">
					<div class="spec-label">Коробка передач</div>
					<div class="spec-value">${car.transmission}</div>
				</div>
				<div class="spec-item">
					<div class="spec-label">Привод</div>
					<div class="spec-value">${car.drive}</div>
				</div>
				<div class="spec-item">
					<div class="spec-label">Топливо</div>
					<div class="spec-value">${car.fuel}</div>
				</div>
				<div class="spec-item">
					<div class="spec-label">Расход</div>
					<div class="spec-value">${car.consumption}</div>
				</div>
			</div>
			
			<div style="color:#ffffff" class="section-title">Описание</div>
			<div class="car-description">
				${car.description}
			</div>
			
			<div class="action-bar">
				<div class="price-container">
					<div class="price-label">Итоговая цена</div>
					<div style="color:#ffffff" class="final-price">${formatPrice(car.price)} $</div>
				</div>
				<button class="buy-btn" onclick="buyCar()">
					🚀 Заказать сейчас
				</button>
			</div>
		</div>
	`;

	carDetailElement.classList.add('active');
	highlightSelectedCar();

}

function hideCarDetail() {
	document.getElementById('carDetail').classList.remove('active');
	document.getElementById('welcomeMessage').style.display = 'flex';
	selectedCar = null;
	selectedColor = null;

	const carCards = document.querySelectorAll('.car-card');
	carCards.forEach(card => {
		card.classList.remove('active');
	});
}

function selectColor(color) {
	selectedColor = color;
	const colorOptions = document.querySelectorAll('.color-option');
	colorOptions.forEach(option => {
		option.classList.remove('selected');
		if (option.style.backgroundColor === color) {
			option.classList.add('selected');
		}
	});
}

function buyCar() {
    if (!selectedCar) return;

    bngApi.engineLua(`SubRPHud.buy_car_diler('${selectedCar.jbeam_id}', '${selectedColor}')`);
    
    hideCarDetail();
}

function formatPrice(price) {
return new Intl.NumberFormat('ru-RU').format(price);
}

/*ИНВЕНТАРЬ*/ 
function updateInventory(inventoryData) {
    const container = document.getElementById('inventory-items-container');
    if (!container) return;

    container.innerHTML = '';

    const maxSlots = 20;
    const items = Array.isArray(inventoryData) ? inventoryData : [];
    const maxWeight = inventoryData.max_weight || 100;

    let currentWeight = 0;
    items.forEach(item => {
        if (item.weight && item.count) {
            currentWeight += (item.weight * item.count);
        }
    });

    const sortedItems = items.filter(item => typeof item === 'object' && item !== null)
                            .sort((a, b) => a.position - b.position);

    // Создаем контейнер для контекстного меню
    const contextMenu = document.createElement('div');
    contextMenu.id = 'inventory-context-menu';
    contextMenu.style.display = 'none';
    contextMenu.innerHTML = `
        <div class="context-menu-item" data-action="use">Использовать</div>
        <div class="context-menu-item" data-action="drop">Выбросить</div>
    `;
    document.body.appendChild(contextMenu);

    // Закрываем меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target)) {
            contextMenu.style.display = 'none';
        }
    });

    for (let i = 1; i <= maxSlots; i++) {
        const slotElement = document.createElement('div');
        slotElement.className = 'inventory-slot';
        slotElement.dataset.position = i;

        const itemAtPosition = sortedItems.find(item => item.position === i);
        
        if (itemAtPosition) {
            const itemElement = createItemElement(itemAtPosition, i, contextMenu);
            slotElement.appendChild(itemElement);
        } else {
            slotElement.classList.add('empty-slot');
        }

        addSlotEventListeners(slotElement);
        container.appendChild(slotElement);
    }

    updateWeightDisplay(currentWeight, maxWeight);
}

// Создает элемент предмета со всей структурой
function createItemElement(itemData, position, contextMenu) {
    const itemElement = document.createElement('div');
    itemElement.className = 'inventory-item';
    itemElement.draggable = true;
    itemElement.dataset.itemId = itemData.id;
    itemElement.dataset.position = position;

    // Структура элемента
    const iconDiv = document.createElement('div');
    iconDiv.className = 'item-icon';
    const img = document.createElement('img');
    img.src = `images/items/${itemData.id}.png`;
    img.alt = itemData.name;
    iconDiv.appendChild(img);

    const nameDiv = document.createElement('div');
    nameDiv.className = 'item-name';
    nameDiv.textContent = itemData.name;

    const countDiv = document.createElement('div');
    countDiv.className = 'item-count';
    countDiv.textContent = itemData.count;

    const weightDiv = document.createElement('div');
    weightDiv.className = 'item-weight';
    weightDiv.textContent = `${itemData.weight * itemData.count} кг`;

    itemElement.appendChild(iconDiv);
    itemElement.appendChild(nameDiv);
    itemElement.appendChild(countDiv);
    itemElement.appendChild(weightDiv);

    // Обработчик перетаскивания
    itemElement.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', itemData.id);
        e.dataTransfer.effectAllowed = 'move';
        draggedItem = itemElement;
        itemElement.classList.add('dragging');
    });

    // Обработчик клика для контекстного меню
    itemElement.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Позиционируем меню рядом с курсором
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
        
        // Запоминаем выбранный предмет
        contextMenu.dataset.selectedItemId = itemData.id;
        contextMenu.dataset.selectedPosition = position;
    });

    return itemElement;
}

// Добавляет обработчики событий для слота
function addSlotEventListeners(slotElement) {
    slotElement.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        slotElement.classList.add('drag-over');
    });

    slotElement.addEventListener('dragenter', (e) => {
        e.preventDefault();
        slotElement.classList.add('drag-over');
    });

    slotElement.addEventListener('dragleave', () => {
        slotElement.classList.remove('drag-over');
    });

    slotElement.addEventListener('drop', (e) => {
        e.preventDefault();
        slotElement.classList.remove('drag-over');

        if (draggedItem) {
            const targetPosition = slotElement.dataset.position;
            const sourcePosition = draggedItem.dataset.position;
            const sourceSlot = document.querySelector(`.inventory-slot[data-position="${sourcePosition}"]`);

            // Если в целевом слоте уже есть предмет - меняем их местами
            if (slotElement.firstChild && slotElement.firstChild !== draggedItem) {
                const existingItem = slotElement.firstChild;
                sourceSlot.appendChild(existingItem);
                existingItem.dataset.position = sourcePosition;
            } else {
                sourceSlot.innerHTML = '<div class="inventory-slot empty-slot"></div>';
            }

            // Перемещаем перетаскиваемый предмет
            slotElement.innerHTML = '';
            slotElement.appendChild(draggedItem);
            draggedItem.dataset.position = targetPosition;
            draggedItem.classList.remove('dragging');
            
            // Обновляем данные на сервере
            updateItemPositionOnServer(draggedItem.dataset.itemId, sourcePosition, targetPosition);
        }
    });
}

// Обновляет отображение веса
function updateWeightDisplay(currentWeight, maxWeight) {
    const usedElement = document.getElementById('Inventory_use');
    const maxElement = document.getElementById('Inventory_use_max');

    if (usedElement && maxElement) {
        usedElement.textContent = currentWeight.toFixed(1);
        maxElement.textContent = maxWeight.toFixed(1);
    }
}

// Отправляет данные о перемещении на сервер
function updateItemPositionOnServer(itemId, fromPosition, toPosition) {
    console.log(`Moving item ${itemId} from ${fromPosition} to ${toPosition}`);
}

function handleItemAction(action, itemId, position) {
    console.log(`${action} item ${itemId} at position ${position}`);
    
    switch(action) {
        case 'use':
            // Логика использования предмета
            alert(`Используем предмет ${itemId}`);
            // fetch('/api/inventory/use', { method: 'POST', body: JSON.stringify({ itemId }) });
            break;
        case 'drop':
            // Логика выбрасывания предмета
            if (confirm(`Вы уверены, что хотите выбросить предмет ${itemId}?`)) {
                alert(`Предмет ${itemId} выброшен`);
                // fetch('/api/inventory/drop', { method: 'POST', body: JSON.stringify({ itemId }) });
            }
            break;
    }
}







/***************************************
 * Телефон
 ***************************************/


function openPhone() {
    updateStatusBarBackground('screen')
    const phone = document.getElementById('ui-phone');
    phone.style.display = 'block';
    
    phone.classList.remove('hide');
    
    phone.classList.add('show');
}

function closePhone() {
    const phone = document.getElementById('ui-phone');
    phone.classList.remove('show');
    phone.classList.add('hide');
    setTimeout(() => {
        phone.style.display = 'none';
        phone.classList.remove('hide');
    }, 400);
}

function close_open_phone(){
    const phone = document.getElementById('ui-phone');
    const homeButtonContainer = document.querySelector('.phone-footer');

    if (phone.style.display === 'none' || !phone.style.display) {
        openPhone();
        const phoneContent = document.querySelector('.phone-content');
        if (phoneContent) {
            phoneContent.classList.add('show');
            phoneContent.classList.remove('hide');
            phoneContent.style.display = 'block';
        }
        const activeApp = document.querySelector('.phone-app-screen > .app-visible');
        if (activeApp) {
            activeApp.classList.remove('app-visible');
            activeApp.style.display = 'none';
        }
        if (homeButtonContainer) {
            homeButtonContainer.style.display = 'none';
        }
    } else {
        closePhone();
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const homeIndicator = document.querySelector('.phone-home-button');
    if (homeIndicator) {
        homeIndicator.addEventListener('click', function(event) {
            event.stopPropagation();
            openPhoneApp('close_app');
        });
    }
    const phone = document.getElementById('ui-phone');
    const homeButtonContainer = document.querySelector('.phone-footer');
    if (homeButtonContainer && (phone.style.display === 'none' || !phone.style.display)) {
         homeButtonContainer.style.display = 'none';
    }
    updateScaleFactor();
    updateNotificationBell();
    startNotificationCheck();
    initPhoneSettings();
});

window.addEventListener('resize', function() {
    updateScaleFactor();
});


function openPhoneApp(id) {
    const uiElements = ["bank", "messages", "contacts", "camera", "gps", "settings", "help", "towtruck"];
    const phoneContent = document.querySelector('.phone-content');
    const homeButtonContainer = document.querySelector('.phone-footer'); 

    console.log("Processing app action:", id);

    // --- Close App / Go Home ---
    if (id === "close_app") {
        updateStatusBarBackground('home')
        const activeApp = document.querySelector('.phone-app-screen > .app-visible');
        if (activeApp) {
            activeApp.classList.add('app-exit');
            setTimeout(() => {
                activeApp.classList.remove('app-visible', 'app-exit');
                activeApp.style.display = 'none';
            }, 300);
        }
        if (phoneContent) {
            phoneContent.style.display = 'block';
            setTimeout(() => {
                phoneContent.classList.remove('hide');
                phoneContent.classList.add('show');
            }, 10);
        }
        if (homeButtonContainer) {
            homeButtonContainer.style.display = 'none';
        }
        return;
    }

    let appElement = document.getElementById(id);
    
    if (id === "bank" && !appElement) {
        appElement = document.getElementById("phone-bank-app");
    }
    
    if (!appElement) {
        console.error(`App element with id "${id}" not found!`);
        showNotification('Телефон', `Приложение "${id}" находится в разработке.`, 'warning', 3000);
        return;
    }
    
    if (phoneContent && phoneContent.style.display !== 'none') {
        phoneContent.classList.add('hide');
        phoneContent.classList.remove('show');
        setTimeout(() => {
            phoneContent.style.display = 'none';
            updateStatusBarBackground(id)
        }, 300);
    }

    const currentlyVisibleApp = document.querySelector('.phone-app-screen > .app-visible');
    if (currentlyVisibleApp && currentlyVisibleApp !== appElement) {
         currentlyVisibleApp.classList.add('app-exit');
         setTimeout(() => {
             currentlyVisibleApp.classList.remove('app-visible', 'app-exit');
             currentlyVisibleApp.style.display = 'none';
         }, 300);
    }
    
    appElement.style.display = 'block';
    setTimeout(() => {
        appElement.classList.add('app-visible', 'app-enter');
        setTimeout(() => {
            appElement.classList.remove('app-enter');
        }, 400);
    }, 10);

    if (homeButtonContainer) {
        homeButtonContainer.style.display = 'flex';
    }
    
    if (id === "bank") {
        updateBankData();
        updateBankTransactions();
        document.getElementById('phoneBankUsername').textContent = data.name || 'Андрей Лобанов';
    }
    if (id === "jobs") {
        loadJobVacancies();
    }
    
}
function updateBankTransactions() {
    if (!window.bankTransactions) {
        window.bankTransactions = [
            {
                id: 1,
                type: 'in',
                amount: 1500,
                description: 'Зарплата',
                date: '15.05.2023'
            },
            {
                id: 2,
                type: 'out',
                amount: 350,
                description: 'Покупка в магазине',
                date: '16.05.2023'
            },
            {
                id: 3,
                type: 'in',
                amount: 200,
                description: 'Перевод от Алекса',
                date: '17.05.2023'
            },
            {
                id: 4,
                type: 'out',
                amount: 120,
                description: 'Заправка',
                date: '18.05.2023'
            }
        ];
    }
    
    if (data && data.bankTransactions) {
        window.bankTransactions = data.bankTransactions;
    }
    
    loadPhoneRecentTransactions();
}

function openPhoneAppBank() {
    const phone = document.querySelector('.phone-content');
    phone.style.display = 'none';
	const phoneBank = document.querySelector('.phone-app-bank');
    phoneBank.style.display = 'block';
}

function updateStatusBarBackground(appName) {
    const statusBar = document.querySelector('.phone-status-bar');
    
    statusBar.classList.remove(
        'status-bar-bank',
        'status-bar-messages',
        'status-bar-contacts',
        'status-bar-camera',
        'status-bar-gps',
        'status-bar-settings',
        'status-bar-help',
        'status-bar-jobs',
        'status-bar-towtruck'
    );
    
    if (!appName || appName === 'home') return;
    
    statusBar.classList.add(`status-bar-${appName}`);
}


function playNotificationSound() {
    const soundPath = '/ui/modules/apps/HudRP/sounds/notification.mp3';
    const audio = new Audio(soundPath);
    audio.volume = 0.4; 
    audio.play().catch(error => {
        console.error("Error playing notification sound:", error);
    });
}

function showDynamicIslandNotification(app, title, message, icon, duration = 5000, position = 'bottom') {
    playNotificationSound();
    const statusBar = document.querySelector('.phone-status-bar');
    if (!statusBar) return;

    const dynamicIsland = document.querySelector('.dynamic-island');
    if (dynamicIsland) {
        dynamicIsland.classList.add('active');
        setTimeout(() => {
            dynamicIsland.classList.remove('active');
        }, 1000);
    }

    const existingNotif = document.getElementById('island-notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    let islandNotif = document.createElement('div');
    islandNotif.id = 'island-notification';
    islandNotif.className = `island-notification position-${position}`;
    statusBar.appendChild(islandNotif);


    if (app) {
        islandNotif.classList.add(`app-${app}`);
    }

    islandNotif.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${icon || '•'}</div>
            <div class="notification-text">
                <div class="notification-title">${title || 'Notification'}</div>
                <div class="notification-message">${message || ''}</div>
            </div>
            <div class="notification-close-btn">×</div>
        </div>
    `;

    islandNotif.addEventListener('click', (event) => {
        if (event.target.classList.contains('notification-close-btn')) {
            hideIslandNotification();
        } else if (app && app !== 'home') {
            openPhoneApp(app); 
            hideIslandNotification(); 
        }
        event.stopPropagation(); 
    });


    requestAnimationFrame(() => {
        islandNotif.classList.add('show');
        islandNotif.classList.remove('hide');
    });


    if (duration > 0) {
        setTimeout(() => {
            hideIslandNotification();
        }, duration);
    }
}
function updateNotificationBell() {
    const bellContainer = document.getElementById('notificationBellContainer');
    const notificationBadge = document.getElementById('notificationBadge');
    
    if (!bellContainer || !notificationBadge) return;
    
    const hasNotifications = data && data.notifi_phone && Array.isArray(data.notifi_phone) && data.notifi_phone.length > 0;
    
    notificationBadge.textContent = hasNotifications ? data.notifi_phone.length : '0';
    
    if (hasNotifications) {
        bellContainer.classList.add('has-notifications');
    } else {
        bellContainer.classList.remove('has-notifications');
    }
}


function toggleNotifications() {
    console.log("Notifications toggled");
    processPendingNotifications();
}

function processPendingNotifications() {
    updateNotificationBell();
    
    if (data && data.notifi_phone && Array.isArray(data.notifi_phone) && data.notifi_phone.length > 0) {
        if (document.getElementById('island-notification')) {
            console.log("Notification already showing, waiting...");
            return;
        }
        
        const notification = data.notifi_phone[0];
        
        if (notification) {
            console.log("Showing notification:", notification.title);
            
            if (typeof showDynamicIslandNotification === 'function') {
                showDynamicIslandNotification(
                    notification.id,
                    notification.title,
                    notification.text,
                    notification.icon,
                    notification.duration,
                    notification.position
                );
                
                data.notifi_phone.shift(); 
                console.log("Notification removed from queue, remaining:", data.notifi_phone.length);
                
                updateNotificationBell();
            } else {
                console.error("showDynamicIslandNotification function not found!");
                data.notifi_phone.shift();
            }
        }
    }
}

function startNotificationCheck() {
    if (notificationCheckInterval) {
        clearInterval(notificationCheckInterval);
    }
    updateNotificationBell();
    notificationCheckInterval = setInterval(processPendingNotifications, 1500);
    processPendingNotifications();
    console.log("Notification check started.");
}


function hideIslandNotification() {
    const islandNotif = document.getElementById('island-notification');
    if (!islandNotif || islandNotif.classList.contains('hide')) return;

    islandNotif.classList.remove('show');
    islandNotif.classList.add('hide');

    setTimeout(() => {
        if (islandNotif && islandNotif.parentNode) {
            islandNotif.parentNode.removeChild(islandNotif);
        }
        updateNotificationBell();
        processPendingNotifications();
    }, 300);
}


function processPendingNotifications() {
    if (data && data.notifi_phone && Array.isArray(data.notifi_phone) && data.notifi_phone.length > 0) {
        if (document.getElementById('island-notification')) {
            console.log("Notification already showing, waiting...");
            return;
        }
        
        const notification = data.notifi_phone[0];
        
        if (notification) {
            console.log("Showing notification:", notification.title);
            
            if (typeof showDynamicIslandNotification === 'function') {
                showDynamicIslandNotification(
                    notification.id,
                    notification.title,
                    notification.text,
                    notification.icon,
                    notification.duration,
                    notification.position
                );
                
                data.notifi_phone.shift(); 
                console.log("Notification removed from queue, remaining:", data.notifi_phone.length);
            } else {
                console.error("showDynamicIslandNotification function not found!");
                data.notifi_phone.shift();
            }
        }
    }
}

var notificationCheckInterval = null;

function startNotificationCheck() {
    if (notificationCheckInterval) {
        clearInterval(notificationCheckInterval);
    }
    
    notificationCheckInterval = setInterval(processPendingNotifications, 1500);
    
    processPendingNotifications();
    
    console.log("Notification check started.");
}


function demoNotifications() {
    showDynamicIslandNotification(
        'messages', 
        'Сообщения', 
        'Новое сообщение от Джона', 
        '💬',
        4000,
        'bottom'
    );
    
    setTimeout(() => {
        showDynamicIslandNotification(
            'bank', 
            'Банк', 
            'Получен платеж: $500', 
            '💰',
            4000,
            'bottom'
        );
    }, 5000);
    
    setTimeout(() => {
        showDynamicIslandNotification(
            'maps', 
            'Карта', 
            'Вы прибыли в пункт назначения', 
            '📍',
            4000,
            'bottom'
        );
    }, 10000);
}

function phoneBankShowPage(pageType) {
    const pageElement = document.getElementById(`phone-bank-${pageType}-page`);
    if (pageElement) {
        pageElement.classList.add('active');
    }
    
    if (pageType === 'history') {
        loadPhoneFullHistory();
    } else if (pageType === 'fines') {
        loadPhoneFines();
    }
}

function phoneBankHidePage(pageType) {
    document.querySelector('.phone-bank-main').style.display = 'flex';
    const pageElement = document.getElementById(`phone-bank-${pageType}-page`);
    if (pageElement) {
        pageElement.classList.remove('active');
    }
}
function loadPhoneBankData() {
    const balanceElement = document.getElementById('phoneBankBalance');
    if (balanceElement && window.playerMoney) {
        balanceElement.textContent = `$ ${window.playerMoney.toLocaleString()}`;
    }
    
    const cardElement = document.getElementById('phoneBankCardNumber');
    if (cardElement) {
        cardElement.textContent = '**** **** **** 1234';
    }
    loadPhoneRecentTransactions();
}

function submitPhoneTransfer() {
    const recipient = document.getElementById('phone-transfer-recipient').value;
    const amount = document.getElementById('phone-transfer-amount').value;
    const comment = document.getElementById('phone-transfer-comment').value;
    
    if (!recipient || !amount) {
        return;
    }
    
    console.log('Transfer:', { recipient, amount, comment });
    
    document.getElementById('phone-transfer-recipient').value = '';
    document.getElementById('phone-transfer-amount').value = '';
    document.getElementById('phone-transfer-comment').value = '';
    
    phoneBankHidePage('transfer');
}

function loadPhoneFines() {
    const finesList = document.getElementById('phone-bank-fines-list');
    if (!finesList) return;
    
    finesList.innerHTML = '';
    
    if (window.playerFines && window.playerFines.length > 0) {
        window.playerFines.forEach((fine, index) => {
            const fineItem = document.createElement('div');
            fineItem.className = 'transaction-item fine-item';
            
            fineItem.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-title">${fine.reason || 'Штраф'}</div>
                    <div class="transaction-date">${fine.date || 'Сегодня'}</div>
                </div>
                <div class="transaction-amount negative">
                    $${fine.amount.toLocaleString()}
                </div>
            `;
            
            finesList.appendChild(fineItem);
        });
    } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'transaction-item placeholder';
        placeholder.textContent = 'Нет неоплаченных штрафов';
        finesList.appendChild(placeholder);
    }
}
function updateBankData() {
    const balanceElement = document.getElementById('phoneBankBalance');
    if (balanceElement && data && data.InfoPlayerBankMoney !== undefined) {
        balanceElement.textContent = `$ ${data.InfoPlayerBankMoney.toLocaleString()}`;
    }
    
    const cardNumberElement = document.getElementById('phoneBankCardNumber');
    if (cardNumberElement && data && data.cardNumber) {
        cardNumberElement.textContent = `${data.cardNumber}`;
    } else if (cardNumberElement) {
        const lastFour = Math.floor(1000 + Math.random() * 9000);
        cardNumberElement.textContent = `**** **** **** ${lastFour}`;
    }
}

function loadPhoneRecentTransactions() {
    const transactionList = document.getElementById('phoneBankRecentTransactions');
    if (!transactionList) return;
    
    transactionList.innerHTML = '';
    
    if (window.bankTransactions && window.bankTransactions.length > 0) {
        const recentTransactions = window.bankTransactions.slice(0, 3);
        
        recentTransactions.forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.className = `transaction-item ${transaction.type === 'in' ? 'income' : 'expense'}`;
            
            const isPositive = transaction.type === 'in';
            
            transactionItem.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-title">${transaction.description}</div>
                    <div class="transaction-date">${transaction.date}</div>
                </div>
                <div class="transaction-amount ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '+' : '-'}$${Math.abs(transaction.amount).toLocaleString()}
                </div>
            `;
            
            transactionList.appendChild(transactionItem);
        });
    } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'transaction-item placeholder';
        placeholder.textContent = 'Нет недавних транзакций';
        transactionList.appendChild(placeholder);
    }
}
function loadPhoneFullHistory() {
    const historyList = document.getElementById('phone-bank-history-list');
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    if (window.bankTransactions && window.bankTransactions.length > 0) {
        window.bankTransactions.forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.className = `transaction-item ${transaction.type === 'in' ? 'income' : 'expense'}`;
            
            const isPositive = transaction.type === 'in';
            
            transactionItem.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-title">${transaction.description}</div>
                    <div class="transaction-date">${transaction.date}</div>
                </div>
                <div class="transaction-amount ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '+' : '-'}$${Math.abs(transaction.amount).toLocaleString()}
                </div>
            `;
            
            historyList.appendChild(transactionItem);
        });
    } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'transaction-item placeholder';
        placeholder.textContent = 'История транзакций пуста';
        historyList.appendChild(placeholder);
    }
}

function setupPhoneBankEventListeners() {
    const transferBtn = document.querySelector('.phone-bank-modern .action-btn[data-action="transfer"]');
    const historyBtn = document.querySelector('.phone-bank-modern .action-btn[data-action="history"]');
    const finesBtn = document.querySelector('.phone-bank-modern .action-btn[data-action="fines"]');
    const infoBtn = document.querySelector('.phone-bank-modern .action-btn[data-action="info"]');
    
    const backButtons = document.querySelectorAll('.phone-bank-page .back-btn');
    
    if (transferBtn) {
        transferBtn.addEventListener('click', () => phoneBankShowPage('transfer'));
    }
    
    if (historyBtn) {
        historyBtn.addEventListener('click', () => phoneBankShowPage('history'));
    }
    
    if (finesBtn) {
        finesBtn.addEventListener('click', () => phoneBankShowPage('fines'));
    }
    
    if (infoBtn) {
        infoBtn.addEventListener('click', () => phoneBankShowPage('info'));
    }
    
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentPage = button.closest('.phone-bank-page');
            if (parentPage) {
                const pageType = parentPage.id.replace('phone-bank-', '').replace('-page', '');
                phoneBankHidePage(pageType);
            }
        });
    });
    
    const transferForm = document.getElementById('phone-transfer-form');
    if (transferForm) {
        transferForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitPhoneTransfer();
        });
    }
}
function initPhoneBankApp() {
    loadPhoneBankData();
    setupPhoneBankEventListeners();
}
function showNotification(title, message, type = 'success', duration = 5000) {
	const NOTIFICATION_ICONS = {
		success: '✓',
		warning: '⚠',
		error: '✕'
	};
	

    const container = document.getElementById('notificationContainer');
    const notificationId = 'notification-' + Date.now();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.id = notificationId;
    
    notification.innerHTML = `
        <div class="notification-icon">${NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS.success}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">&times;</button>
        <div class="notification-progress">
            <div class="notification-progress-bar" style="animation-duration: ${duration}ms"></div>
        </div>
    `;

    container.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notificationId);
    });
    
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notificationId);
        }, duration);
    }
    
    return () => closeNotification(notificationId);
}

function closeNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
        notification.style.animation = 'slideOut 0.5s forwards';
        notification.addEventListener('animationend', () => {
            notification.remove();
        });
    }
}






function openSettingsApp() {
    document.getElementById('phone-settings-app').style.display = 'flex';

    const userName = data.name || 'John Doe';
    const userId = data.playerId || '12345678';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
    
    document.getElementById('settings-user-name').textContent = userName;
    document.getElementById('settings-user-id').textContent = 'ID: ' + userId;
    document.getElementById('settings-avatar').textContent = userInitials;
    
    if (data.phoneNumber) {
        document.getElementById('phone-number-display').textContent = data.phoneNumber;
    }
}

function closeSettingsApp() {
    document.getElementById('phone-settings-app').style.display = 'none';
    
    // Close any open subpages
    const subpages = document.querySelectorAll('.settings-subpage');
    subpages.forEach(page => {
        page.classList.remove('active');
    });
}

function openSettingsSubpage(pageId) {
    const subpage = document.getElementById(pageId + '-settings');
    if (subpage) {
        subpage.classList.add('active');
    }
}

function closeSettingsSubpage(pageId) {
    const subpage = document.getElementById(pageId + '-settings');
    if (subpage) {
        subpage.classList.remove('active');
    }
}

function toggleSetting(element) {
    element.classList.toggle('active');
    
    const settingId = element.id;
    const isActive = element.classList.contains('active');
    
    console.log(`Setting ${settingId} is now ${isActive ? 'active' : 'inactive'}`);
    
    if (settingId === 'vibration-toggle') {
    } else if (settingId === 'screen-lock-toggle') {
    }
}

function selectTheme(element, themeName) {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.classList.remove('active');
    });
    
    element.classList.add('active');
    
    console.log(`Theme ${themeName} selected`);
}

function selectWallpaper(element, wallpaperId) {
    const wallpaperOptions = document.querySelectorAll('.wallpaper-option');
    wallpaperOptions.forEach(option => {
        option.classList.remove('active');
    });
    
    element.classList.add('active');
    
    console.log(`Wallpaper ${wallpaperId} selected`);

}

function initializeSliders() {
    const sliders = document.querySelectorAll('.settings-slider');
    
    sliders.forEach(slider => {
        const thumb = slider.querySelector('.settings-slider-thumb');
        const fill = slider.querySelector('.settings-slider-fill');
        
        if (!thumb || !fill) return;
        
        let isDragging = false;
        
        // Set initial position from inline style
        const initialWidth = fill.style.width || '50%';
        const initialLeft = thumb.style.left || initialWidth;
        
        // Handle mouse events
        thumb.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        // Handle touch events for mobile
        thumb.addEventListener('touchstart', startDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', endDrag);
        
        // Click on slider to set position
        slider.addEventListener('click', setPosition);
        
        function startDrag(e) {
            e.preventDefault();
            isDragging = true;
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            const rect = slider.getBoundingClientRect();
            let x;
            
            if (e.type.includes('touch')) {
                x = e.touches[0].clientX - rect.left;
            } else {
                x = e.clientX - rect.left;
            }
            
            x = Math.max(0, Math.min(x, rect.width));
            
            const percent = (x / rect.width) * 100;
            
            thumb.style.left = `${percent}%`;
            fill.style.width = `${percent}%`;
            
            const sliderId = slider.id;
            if (sliderId === 'media-volume-slider') {
            } else if (sliderId === 'notification-volume-slider') {
            } else if (sliderId === 'font-size-slider') {
            }
        }
        
        function endDrag() {
            isDragging = false;
        }
        
        function setPosition(e) {
            const rect = slider.getBoundingClientRect();
            const x = e.clientX - rect.left;
            
            const percent = (x / rect.width) * 100;
            

            thumb.style.left = `${percent}%`;
            fill.style.width = `${percent}%`;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeSliders();
    

    const phoneDock = document.querySelector('.phone-dock');
    if (phoneDock) {
        const settingsAppExists = phoneDock.querySelector('.phone-dock-app.settings');
        
        if (!settingsAppExists) {
            const settingsApp = document.createElement('div');
            settingsApp.className = 'phone-dock-app settings';
            settingsApp.innerHTML = '<i class="fas fa-cog"></i>';
            settingsApp.onclick = openSettingsApp;
            phoneDock.appendChild(settingsApp);
        }
    }
});


function loadJobVacancies() {
    const jobCardsContainer = document.getElementById('job-cards-container');
    jobCardsContainer.innerHTML = '';
    
    for (const [jobKey, jobData] of Object.entries(jobs)) {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.setAttribute('data-job-id', jobKey);
        jobCard.onclick = function() {
            showJobDetail(jobKey);
        };
        
        jobCard.innerHTML = `
            <img src="${jobData.img}" class="job-card-image" alt="${jobKey}">
            <div class="job-card-content">
                <div class="job-card-title">${capitalizeFirstLetter(jobKey)}</div>
                <div class="job-card-salary">$${formatNumber(jobData.salary)}</div>
            </div>
        `;
        
        jobCardsContainer.appendChild(jobCard);
    }
}


function showJobDetail(jobKey) {
    const jobData = jobs[jobKey];
    const jobDetailView = document.getElementById('job-detail-view');
    const jobListView = document.getElementById('job-list-view');
    
    const imgPath = jobData.img;
    const mapImgPath = imgPath.replace('.png', '_map.png');
    
    jobDetailView.innerHTML = `
        <div class="job-detail-header-container">
            <img src="${jobData.img}" class="job-detail-image" alt="${jobKey}">
            <div class="job-detail-overlay">
                <div class="job-detail-title-container">
                    <div class="job-detail-title">${capitalizeFirstLetter(jobKey)}</div>
                    <div class="job-detail-salary">$${formatNumber(jobData.salary)}</div>
                </div>
            </div>
            <button class="job-back-btn" onclick="showJobListView()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 18l-6-6 6-6"></path>
                </svg>
            </button>
        </div>
        
        <div class="job-detail-content">
            <div class="job-detail-section">
                <div class="job-detail-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Описание
                </div>
                <div class="job-detail-description">${jobData.description}</div>
            </div>
            
            <div class="job-detail-section">
                <div class="job-detail-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Местоположение
                </div>
                <div class="job-detail-location">
                    <div class="job-detail-location-text">Чтобы устроиться на работу, подойдите к ${jobData.locate}</div>
                    <img src="${mapImgPath}" class="job-detail-map" alt="Карта местоположения">
                </div>
            </div>
            
            <button class="job-apply-btn" onclick="setRouteToJobLocation('${jobKey}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                </svg>
                Построить маршрут до точки
            </button>
        </div>
    `;
    
    jobListView.style.display = 'none';
    jobDetailView.style.display = 'block';
}

function setRouteToJobLocation(jobKey) {
    const jobData = jobs[jobKey];
    showNotification('Маршрут построен', `Маршрут до ${jobData.locate} отмечен на карте.`);
}

function showJobListView() {
    const jobDetailView = document.getElementById('job-detail-view');
    const jobListView = document.getElementById('job-list-view');
    
    jobDetailView.style.display = 'none';
    jobListView.style.display = 'block';
}


function showJobListView() {
    const jobDetailView = document.getElementById('job-detail-view');
    const jobListView = document.getElementById('job-list-view');
    
    jobDetailView.style.display = 'none';
    jobListView.style.display = 'block';
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function playevaSound() {
    const soundPath = 'sounds/eva.mp3';
    const audio = new Audio(soundPath);
    audio.volume = 0.4; 
    audio.play().catch(error => {
        console.error("Error playing notification sound:", error);
    });
}


function startTowTruckAnimation() {
    const towTruck = document.querySelector('.tow-truck-image');
    const roadLine = document.querySelector('.road-line');
    const optionsContainer = document.querySelector('.tow-truck-options');
    const confirmationContainer = document.querySelector('.tow-truck-confirmation');
    const completionOverlay = document.querySelector('.tow-completion-overlay');
    

    optionsContainer.style.display = 'none';
    confirmationContainer.style.display = 'none';
    completionOverlay.style.display = 'none';
    towTruck.classList.remove('with-boxes');
    roadLine.classList.remove('road-fast');
    

    towTruck.style.display = 'block';
    

    towTruck.style.transition = 'none';
    towTruck.style.left = '-160px';
    

    void towTruck.offsetWidth;
    

    towTruck.style.transition = 'all 2.5s cubic-bezier(0.22, 1, 0.36, 1)';
    

    setTimeout(() => {
        towTruck.style.left = '50%';
        towTruck.style.transform = 'translateX(-50%)';
    }, 50);
}



function selectTowOption(option) {
    const confirmationPanel = document.querySelector('.tow-truck-confirmation');
    const destinationElement = document.getElementById('tow-destination');
    const priceElement = document.getElementById('tow-price');
    
    if (option === 'gas') {
        destinationElement.textContent = 'на заправку';
        priceElement.textContent = '500$';
    } else if (option === 'repair') {
        destinationElement.textContent = 'в автосервис';
        priceElement.textContent = '800$';
    }else if (option === 'flip') {
        destinationElement.textContent = 'на ближайшую дорогу';
        priceElement.textContent = '300$';
    }else if (option === 'road') {
        destinationElement.textContent = 'на ближайшую дорогу';
        priceElement.textContent = '100$';
    }
    

    confirmationPanel.style.display = 'flex';
}


function cancelTowService() {
    startTowTruckAnimation();
}



function confirmTowService() {
    playevaSound()
    const confirmationPanel = document.querySelector('.tow-truck-confirmation');
    const completionOverlay = document.querySelector('.tow-completion-overlay');
    const roadMarkings = document.querySelector('.road-markings');
    

    if (roadMarkings) {
        roadMarkings.style.animationDuration = '0.5s';
    }
    

    confirmationPanel.style.display = 'none';
    
    completionOverlay.style.display = 'flex';
    completionOverlay.style.opacity = '1';
    
    setTimeout(() => {
        completionOverlay.style.display = 'none';
        closePhone();
    }, 1500);
}

function closeTowConfirmation() {
    const confirmationPanel = document.querySelector('.tow-truck-confirmation');
    confirmationPanel.style.display = 'none';
}

function startRoadAnimation() {
    const roadMarkings = document.querySelector('.road-markings');
    if (roadMarkings) {
        roadMarkings.style.animationDuration = '1s';
    }
}




// РАЗРЕШЕНИЕ ЭКРАНА

function updateScaleFactor() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let scaleFactor = 1;
    

    if (width <= 1024) {
        scaleFactor = 0.85;
    } else if (width <= 1366) {
        scaleFactor = 1;
    } else if (width >= 1920 && width < 2560) {
        scaleFactor = 1.5;
    } else if (width >= 2560) {
        scaleFactor = 2;
    }
    
    const aspectRatio = width / height;
    if (aspectRatio > 2.1) { 
        scaleFactor *= 0.9;
    } else if (aspectRatio < 1.3) { 
        scaleFactor *= 0.95;
    }
    
    document.documentElement.style.setProperty('--scale-factor', scaleFactor);
    
    console.log(`Screen resolution: ${width}x${height}, Scale factor: ${scaleFactor}`);
}



// ЗАПРАВКА

function updateGasStationUI() {
    updateFuelSlider()
    document.getElementById('gas-vehicle-model').textContent = data.vehicle.model || "skibidi";
    if (data.vehicle.typeFuel == "gasoline") {
        document.getElementById('gas-fuel-type').textContent = "Бензин";
    } else if (data.vehicle.typeFuel == "diesel") {
        document.getElementById('gas-fuel-type').textContent = "Дизель";
    } else if (data.vehicle.typeFuel == "electric") {
        document.getElementById('gas-fuel-type').textContent = "Электричество";
    } else {
        document.getElementById('gas-fuel-type').textContent = "Неизвестно";
    }
    document.getElementById('gas-current-fuel').textContent = data.vehicle.currentFuel.toFixed(1) || "0";
    document.getElementById('gas-fuel-capacity').textContent = data.vehicle.fuelCapacity.toFixed(1);
    document.getElementById('gas-station-name').textContent = data.fuel_station_name;
    
    
    const fuelType = data.vehicle.typeFuel;
    document.getElementById('fuel-price-value').textContent = data.fuelPricePerLiter[fuelType].toFixed(1);
    
    const maxFuel = data.vehicle.fuelCapacity - data.vehicle.currentFuel;
    const slider = document.getElementById('fuel-amount-slider');
    const input = document.getElementById('fuel-amount-input');
    
    slider.max = maxFuel.toFixed(1);
    input.max = maxFuel.toFixed(1);
    
    const defaultAmount = Math.min(10, maxFuel);
    slider.value = defaultAmount.toFixed(1);
    input.value = defaultAmount.toFixed(1);

    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector('.payment-option[data-method="bank"]').classList.add('active');
    document.getElementById('discount-row').style.display = 'none';
    
    updateSummary(defaultAmount, 'bank');
}

function selectFuelAmount(amount) {
    const slider = document.getElementById('fuel-amount-slider');
    const input = document.getElementById('fuel-amount-input');
    const maxFuel = parseFloat(slider.max);
    
    let value;
    if (amount === 'full') {
        value = maxFuel;
    } else {
        value = Math.min(parseFloat(amount), maxFuel);
    }
    
    slider.value = value.toFixed(1);
    input.value = value.toFixed(1);
    
    const percent = value / maxFuel * 100;
    slider.style.setProperty('--slider-percent', percent + '%');
    
    updateSummary();
}

function updateFuelSlider() {
    const slider = document.getElementById('fuel-amount-slider');
    const input = document.getElementById('fuel-amount-input');
    const maxFuel = parseFloat(slider.max);
    
    input.value = parseFloat(slider.value).toFixed(1);
    

    const percent = parseFloat(slider.value) / maxFuel * 100;
    slider.style.setProperty('--slider-percent', percent + '%');
    
    updateSummary();
}

function updateFuelInput() {
    const slider = document.getElementById('fuel-amount-slider');
    const input = document.getElementById('fuel-amount-input');
    const maxFuel = parseFloat(slider.max);
    
    let value = parseFloat(input.value) || 0;
    value = Math.min(Math.max(value, 0), maxFuel);
    input.value = value.toFixed(1);
    slider.value = value.toFixed(1);
    
    const percent = value / maxFuel * 100;
    slider.style.setProperty('--slider-percent', percent + '%');
    
    updateSummary();
}

function selectPaymentMethod(method) {
    const options = document.querySelectorAll('.payment-option');
    options.forEach(option => {
        option.classList.remove('active');
    });
    
    document.querySelector(`.payment-option[data-method="${method}"]`).classList.add('active');
    
    const discountRow = document.getElementById('discount-row');
    if (method === 'cash') {
        discountRow.style.display = 'flex';
    } else {
        discountRow.style.display = 'none';
    }
    
    updateSummary();
}

function updateSummary() {
    const fuelAmount = parseFloat(document.getElementById('fuel-amount-input').value) || 0;
    const pricePerLiter = parseFloat(document.getElementById('fuel-price-value').textContent) || 0;
    const paymentMethod = document.querySelector('.payment-option.active').getAttribute('data-method');
    
    document.getElementById('summary-amount').textContent = fuelAmount.toFixed(1);
    
    let totalCost = fuelAmount * pricePerLiter;
    
    if (paymentMethod === 'cash') {
        const discount = totalCost * 0.06;
        document.getElementById('summary-discount').textContent = '-' + discount.toFixed(1);
        totalCost -= discount;
    }
    
    document.getElementById('summary-total').textContent = totalCost.toFixed(1);
}

function payForFuel() {
    const fuelAmount = parseFloat(document.getElementById('fuel-amount-input').value) || 0;
    const totalCost = parseFloat(document.getElementById('summary-total').textContent) || 0;
    const paymentMethod = document.querySelector('.payment-option.active').getAttribute('data-method');
    
    console.log(`Оплачено ${fuelAmount.toFixed(1)} л топлива на сумму ${totalCost.toFixed(1)}$ через ${paymentMethod}`);
    bngApi.engineLua(`SubRPCore.lua_payForFuel(${fuelAmount.toFixed(1)}, '${totalCost.toFixed(1)}', '${paymentMethod}')`);
    
    closeGasStation();
}
function closeGasStation() {
    document.getElementById('ui-gas-station').style.display = 'none';
}


var achievementUnlocked = false;
var gasStationClicks = 0;

function incrementGasStationClicks(event) {
    if (event) {
        event.stopPropagation();
    }
    
    try {
        const achievements = JSON.parse(localStorage.getItem('subrp-achievements') || '{}');
        if (achievements.gasStationMaster) {
            achievementUnlocked = true;
            return;
        }
    } catch (e) {
        console.log("Could not check achievement status:", e);
    }
    
    try {
        const savedClicks = parseInt(localStorage.getItem('gasStationClicks') || '0');
        gasStationClicks = isNaN(savedClicks) ? 0 : savedClicks;
    } catch (e) {
        gasStationClicks = 0;
    }
    
    // Increment and save
    gasStationClicks += 1; 
    try {
        localStorage.setItem('gasStationClicks', gasStationClicks.toString());
    } catch (e) {
        console.log("Could not save clicks:", e);
    }
    
    console.log('Gas station clicks:', gasStationClicks);
    
    if (gasStationClicks >= 10) {
        achievementUnlocked = true;
        showGasStationAchievement();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        const achievements = JSON.parse(localStorage.getItem('subrp-achievements') || '{}');
        if (achievements.gasStationMaster) {
            achievementUnlocked = true;
        }
    } catch (e) {
        console.log("Could not check achievement status:", e);
    }
    try {
        const savedClicks = parseInt(localStorage.getItem('gasStationClicks') || '0');
        gasStationClicks = isNaN(savedClicks) ? 0 : savedClicks;
        console.log('Loaded gas station clicks:', gasStationClicks);
    } catch (e) {
        console.log("Could not load clicks:", e);
    }
    
});

function showGasStationAchievement() {
    const achievementPopup = document.createElement('div');
    achievementPopup.id = 'gas-station-achievement';
    achievementPopup.className = 'achievement-popup';
    
    // Create achievement content with improved design
    achievementPopup.innerHTML = `
        <div class="achievement-content">
            <div class="achievement-glow"></div>
            <div class="achievement-header">
                <div class="achievement-star-container">
                    <div class="achievement-star"></div>
                </div>
                <h3>Достижение разблокировано!</h3>
            </div>
            <div class="achievement-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="150" height="150">
                    <!-- Основной блок -->
                    <rect x="25" y="20" width="50" height="55" rx="5" fill="#FFD700" stroke="#000" stroke-width="2"/>
                    
                    <!-- Верхний шип LEGO -->
                    <circle cx="50" cy="15" r="8" fill="#FF4444" stroke="#000" stroke-width="1.5"/>
                    
                    <!-- Глаза -->
                    <rect x="38" y="30" width="6" height="12" rx="2" fill="#fff"/>
                    <rect x="56" y="30" width="6" height="12" rx="2" fill="#fff"/>
                    <circle cx="41" cy="36" r="2" fill="#000"/>
                    <circle cx="59" cy="36" r="2" fill="#000"/>
                    
                    <!-- Улыбка -->
                    <path d="M40 50 L45 58 L55 58 L60 50" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round"/>
                    
                    <!-- Шланг из LEGO-сегментов -->
                    <rect x="30" y="60" width="40" height="8" fill="#666" rx="2"/>
                    <rect x="20" y="68" width="60" height="8" fill="#888" rx="2"/>
                    <rect x="10" y="76" width="80" height="8" fill="#AAA" rx="2"/>
                    
                    <!-- Основание с шипами -->
                    <rect x="15" y="80" width="70" height="12" fill="#FF4444" rx="3"/>
                    <circle cx="30" cy="80" r="4" fill="#FFD700"/>
                    <circle cx="70" cy="80" r="4" fill="#FFD700"/>
                </svg>
            </div>
            <div class="achievement-info">
                <div class="achievement-title">Мастер заправки</div>
                <div class="achievement-desc">Лучший запах утра — не кофе, а свежего бензина на заправке.</div>
                <div class="achievement-xp">+100 XP</div>
            </div>
            <div class="achievement-confetti"></div>
        </div>
    `;
    
    // Add CSS styles dynamically with improved styling
    const achievementStyles = document.createElement('style');
    achievementStyles.textContent = `
        @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.8); }
            70% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes glowPulse {
            0% { opacity: 0.4; }
            50% { opacity: 0.8; }
            100% { opacity: 0.4; }
        }
        
        @keyframes starRotate {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.2); }
            100% { transform: rotate(360deg) scale(1); }
        }
        
        @keyframes confettiFall {
            0% { transform: translateY(-50px); opacity: 1; }
            100% { transform: translateY(200px); opacity: 0; }
        }
        
        .achievement-popup {
            position: absolute;
            top: 30px;
            left: 30px;
            background: linear-gradient(135deg, #2a2a3a, #1a1a2a);
            border-radius: 16px;
            padding: 0;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 215, 0, 0.2);
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            max-width: 400px;
            overflow: hidden;
            transform: scale(0.8);
            transform-origin: top left;
            animation: fadeInScale 0.6s forwards;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .achievement-popup.show {
            opacity: 1;
            visibility: visible;
        }
        
        .achievement-content {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        
        .achievement-glow {
            position: absolute;
            top: -100px;
            left: -100px;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(255, 215, 0, 0) 70%);
            border-radius: 50%;
            animation: glowPulse 3s infinite;
            pointer-events: none;
            z-index: -1;
        }
        
        .achievement-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            width: 100%;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .achievement-star-container {
            width: 30px;
            height: 30px;
            margin-right: 10px;
            position: relative;
        }
        
        .achievement-star {
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            animation: starRotate 4s infinite linear;
        }
        
        .achievement-header h3 {
            margin: 0;
            font-size: 18px;
            color: #FFD700;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        
        .achievement-icon {
            position: relative;
            margin: 10px 0;
            filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
            transform: scale(0.9);
            z-index: 2;
        }
        
        .achievement-icon::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0) 70%);
            border-radius: 50%;
            filter: blur(10px);
            z-index: -1;
        }
        
        .achievement-info {
            width: 100%;
            text-align: center;
            padding: 15px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            margin-top: 10px;
        }
        
        .achievement-title {
            font-size: 22px;
            font-weight: bold;
            color: #ffffff;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .achievement-desc {
            font-size: 14px;
            color: #b8b8d4;
            margin-bottom: 12px;
            line-height: 1.4;
        }
        
        .achievement-xp {
            display: inline-block;
            padding: 5px 15px;
            background: linear-gradient(135deg, #4CAF50, #2E7D32);
            color: white;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .achievement-confetti {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            overflow: hidden;
            z-index: 1;
        }
        
        .achievement-confetti::before,
        .achievement-confetti::after {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 2px;
            animation: confettiFall 2s forwards;
        }
        
        .achievement-confetti::before {
            top: -10px;
            left: 30%;
            background: #FFD700;
            animation-delay: 0.3s;
        }
        
        .achievement-confetti::after {
            top: -10px;
            right: 30%;
            background: #FF4444;
            animation-delay: 0.6s;
        }
    `;
    
    document.head.appendChild(achievementStyles);
    
    const gasStationUI = document.getElementById('ui-gas-station');
    if (gasStationUI) {
        gasStationUI.appendChild(achievementPopup);
    } else {
        document.body.appendChild(achievementPopup);
    }
    
    setTimeout(() => {
        const confettiContainer = achievementPopup.querySelector('.achievement-confetti');
        if (confettiContainer) {
            const colors = ['#FFD700', '#FF4444', '#4CAF50', '#2196F3', '#9C27B0'];
            for (let i = 0; i < 20; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 8 + 5}px;
                    height: ${Math.random() * 8 + 5}px;
                    background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: -10px;
                    left: ${Math.random() * 100}%;
                    opacity: ${Math.random() * 0.5 + 0.5};
                    transform: rotate(${Math.random() * 360}deg);
                    border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                    animation: confettiFall ${Math.random() * 2 + 1}s forwards linear;
                    animation-delay: ${Math.random() * 1.5}s;
                `;
                confettiContainer.appendChild(confetti);
            }
        }
    }, 100);
    
    setTimeout(() => {
        achievementPopup.classList.add('show');
        
        try {
            const achievementSound = new Audio('sounds/gasstateexp.mp3');
            achievementSound.volume = 0.5;
            achievementSound.play().catch(e => console.log("Audio play failed:", e));
        } catch (e) {
            console.log("Sound playback error:", e);
        }
        
        setTimeout(() => {
            achievementPopup.classList.remove('show');
            
            setTimeout(() => {
                achievementPopup.remove();
            }, 500);
        }, 7000);
    }, 100);
    
    try {
        const achievements = JSON.parse(localStorage.getItem('subrp-achievements') || '{}');
        achievements.gasStationMaster = true;
        localStorage.setItem('subrp-achievements', JSON.stringify(achievements));
    } catch (e) {
        console.log("Could not save achievement:", e);
    }
}




















function loadBusRoutes() {
    const routesContainer = document.getElementById('bus-routes');
    routesContainer.innerHTML = '';
    
    const routes = data.jobs.bus;
    
    routes.forEach(route => {
        const routeCard = document.createElement('div');
        routeCard.className = 'route-card';
        routeCard.innerHTML = `
            <div class="route-header">${route.name}</div>
            <div class="route-details">
                <div class="detail-item">
                    <i>📏</i> Длина: ${route.distance}
                </div>
                <div class="detail-item">
                    <i>🕒</i> Время: ${route.time}
                </div>
                <div class="detail-item">
                    <i>🚏</i> Остановки: ${route.stops}
                </div>
                <div class="detail-item">
                    <i>💰</i> Оплата: $${route.payment}
                </div>
            </div>
        `;
        
        routeCard.addEventListener('click', () => {
            chpok('ui-jobs-bus')
            bngApi.engineLua(`SubRPHud.start_job_bus(${route.id})`);
        });
        
        routesContainer.appendChild(routeCard);
    });
}




function renderBusinessList() {
    document.getElementById('business-list-section').style.display = 'block';
    document.getElementById('business-section').style.display = 'none';
    const businessListSection = document.getElementById('business-list-section');
    businessListSection.innerHTML = `
        <div class="header">
            <h1 class="page-title">Ваши бизнесы</h1>
        </div>
        <div class="character-card">
            <div class="business-grid" id="business-grid"></div>
        </div>
    `;

    const businessGrid = document.getElementById('business-grid');
    businessGrid.innerHTML = '';

    for (const [id, business] of Object.entries(data.buisnes)) {
        const businessCard = document.createElement('div');
        businessCard.className = 'business-card';
        businessCard.innerHTML = `
            <div class="business-icon">
                <i class="fas ${business.buisnes_name.includes('Заправка') ? 'fa-gas-pump' : 'fa-car'}"></i>
            </div>
            <div class="business-info">
                <h3>${business.name}</h3>
                <p>${business.buisnes_name}</p>
                <div class="business-status ${business.open ? 'open' : 'closed'}">
                    ${business.open ? 'Открыт' : 'Закрыт'}
                </div>
                <div class="business-ratio">
                Коэффициент -
                    <i class="fas fa-percentage"></i>${business.ratio.toFixed(2)}
                </div>
            </div>
            <div class="business-balance" style="color: white;">
                <span>Баланс:</span>
                <span class="money">$${business.balance.toLocaleString()}</span>
            </div>
        `;
        businessCard.addEventListener('click', () => openBusinessDetail(id));
        businessGrid.appendChild(businessCard);
    }
}

function openBusinessDetail(businessId) {
    const business = data.buisnes[businessId];
    
    document.getElementById('business-list-section').style.display = 'none';
    document.getElementById('business-section').style.display = 'block';
    
    const businessSection = document.getElementById('business-section');
    businessSection.innerHTML = `
        <div class="header">
            <div class="header-actions">
                <button class="back-btn" onclick="renderBusinessList()">
                    <i class="fas fa-arrow-left"></i> Назад
                </button>
                <h1 class="page-title" style="color: white;">Управление бизнесом</h1>
            </div>
        </div>
        <div class="character-card">
            <div class="business-detail-header">
                <div class="business-icon large">
                    <i class="fas ${business.buisnes_name.includes('Заправка') ? 'fa-gas-pump' : 'fa-car'}"></i>
                </div>
                <div class="business-info" style="color: white;">
                    <h2>${business.name}</h2>
                    <p>${business.buisnes_name}</p>
                    <div class="business-status ${business.open ? 'open' : 'closed'}">
                        ${business.open ? 'Открыт' : 'Закрыт'}
                    </div>
                </div>
            </div>
            
            <div class="business-stats">
                <div class="stat-card">
                    <div class="stat-title">Баланс</div>
                    <div class="stat-value money" style="color: white">$${business.balance.toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Ежедневное списание</div>
                    <div class="stat-value">$${business.pay_day.toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Коэффициент цен</div>
                    <div class="ratio-control">
                        <button class="ratio-btn minus" onclick="changeRatio('${businessId}', -0.01)">
                            <i class="fas fa-minus">-</i>
                        </button>
                        <span class="ratio-value">${business.ratio.toFixed(2)}</span>
                        <button class="ratio-btn plus" onclick="changeRatio('${businessId}', 0.01)">
                            <i class="fas fa-plus">+</i>
                        </button>
                    </div>
                    <div class="ratio-hint">
                        ${getRatioHint(business.ratio)}
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Материалы</div>
                    <div class="stat-value">${business.mat}/${business.mat_max}</div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${(business.mat / business.mat_max) * 100}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="business-actions">
                <button class="action-btn ${business.open ? 'close-btn' : 'open-btn'}" 
                        onclick="toggleBusinessStatus('${businessId}')">
                    ${business.open ? 'Закрыть бизнес' : 'Открыть бизнес'}
                </button>
                <button class="action-btn withdraw-btn" onclick="withdrawMoney('${businessId}')">
                    Снять деньги
                </button>
                <button class="action-btn invest-btn" onclick="investMoney('${businessId}')">
                    + 1.000 $
                </button>
            </div>
            
            <div class="business-profit-chart" style="color: white;">
                <h3>Доходность за неделю</h3>
                <div class="chart-container">
                    ${renderProfitChart(business.last_days_profit)}
                </div>
            </div>
        </div>
    `;
}














function showLicenseDetails(licenseType) {
    currentLicenseType = licenseType;
    document.getElementById('auto-school-main-menu').style.display = 'none';
    document.getElementById('auto-school-license-details').style.display = 'block';
    document.getElementById('auto-school-results').style.display = 'none';
    
    // Update license title and description
    document.getElementById('license-details-title').textContent = `Категория ${licenseType}`;
    document.getElementById('license-description').textContent = licenseDescriptions[licenseType];
    
    // Display prices
    const theoryPrice = document.getElementById('theory-price');
    const practicePrice = document.getElementById('practice-price');
    
    if (theoryPrice && practicePrice) {
        theoryPrice.textContent = `${licensePrices[licenseType].theory}$`;
        practicePrice.textContent = `${licensePrices[licenseType].practice}$`;
    }
    
    // Check if theory test is already passed
    if (theoryTestPassed) {
        document.getElementById('theory-test-status').textContent = 'Теоретический тест пройден';
        document.getElementById('theory-test-status').style.color = '#4CAF50';
        document.getElementById('start-theory-btn').style.display = 'none';
        document.getElementById('start-practice-btn').style.display = 'block';
    } else {
        document.getElementById('theory-test-status').textContent = 'Теоретический тест не пройден';
        document.getElementById('theory-test-status').style.color = '#bb86fc';
        document.getElementById('start-theory-btn').style.display = 'block';
        document.getElementById('start-practice-btn').style.display = 'none';
    }
}

function backToMainMenu() {
    document.getElementById('auto-school-license-details').style.display = 'none';
    
    // Properly hide or remove the theory test element
    const theoryTestElement = document.getElementById('auto-school-theory-test');
    if (theoryTestElement) {
        theoryTestElement.style.display = 'none';
    }
    
    document.getElementById('auto-school-results').style.display = 'none';
    document.getElementById('auto-school-main-menu').style.display = 'block';
}

function startTheoryTest() {
    // Charge for theory test
    // bngApi.engineLua(`SubRPHud.payForExam("theory", "${currentLicenseType}")`);
    
    // Hide license details
    document.getElementById('auto-school-license-details').style.display = 'none';
    
    // Make sure the theory test element exists
    let theoryTestElement = document.getElementById('auto-school-theory-test');
    if (!theoryTestElement) {
        // Create the theory test UI if it doesn't exist
        theoryTestElement = document.createElement('div');
        theoryTestElement.id = 'auto-school-theory-test';
        theoryTestElement.className = 'auto-school-content';
        theoryTestElement.style.display = 'none';
        
        theoryTestElement.innerHTML = `
            <div class="theory-test-header">
                <h2>Теоретический экзамен: Категория ${currentLicenseType}</h2>
                <div id="theory-test-timer" class="theory-test-timer">05:00</div>
            </div>
            
            <div id="question-container" class="question-container">
                <!-- Question content will be inserted here -->
            </div>
            
            <div class="theory-test-navigation">
                <button id="prev-question-btn" class="secondary-button" onclick="previousQuestion()">Предыдущий</button>
                <button id="cancel-test-btn" class="secondary-button" onclick="cancelTest()">Отмена</button>
                <button id="next-question-btn" class="primary-button" onclick="nextQuestion()">Следующий</button>
            </div>
        `;
        
        // Append to auto school container
        document.querySelector('.auto-school-container').appendChild(theoryTestElement);
    }
    
    // Show theory test
    theoryTestElement.style.display = 'block';
    
    // Reset test variables
    currentQuestionIndex = 0;
    testAnswers = Array(20).fill(null);
    testTimeLeft = 300; 
    
    // Generate random questions
    const randomQuestions = [];
    const availableIndices = Array.from({ length: testQuestions.length }, (_, i) => i);
    
    for (let i = 0; i < 20; i++) {
        if (availableIndices.length === 0) break;
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const questionIndex = availableIndices.splice(randomIndex, 1)[0];
        randomQuestions.push(testQuestions[questionIndex]);
    }
    
    // Fill with remaining questions if needed
    while (randomQuestions.length < 20) {
        const randomIndex = Math.floor(Math.random() * testQuestions.length);
        randomQuestions.push(testQuestions[randomIndex]);
    }
    
    window.testQuestions = randomQuestions;
    
    // Display first question
    displayQuestion(0);
    
    // Start timer
    startTestTimer();
}

// Fix for testimonial slider
function changeTestimonial(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    // Make sure we have slides
    if (!slides.length) return;
    
    // Validate index
    if (index < 0 || index >= slides.length) {
        index = 0;
    }
    
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

// Auto-rotate testimonials
let testimonialInterval;
function startTestimonialRotation() {
    let currentIndex = 0;
    const slides = document.querySelectorAll('.testimonial-slide');
    
    if (!slides.length) return;
    
    // Clear any existing interval
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
    
    testimonialInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        changeTestimonial(currentIndex);
    }, 5000); // Change every 5 seconds
}

// Initialize testimonial slider
document.addEventListener('DOMContentLoaded', function() {
    // Set first testimonial as active
    const firstSlide = document.querySelector('.testimonial-slide');
    const firstDot = document.querySelector('.testimonial-dot');
    
    if (firstSlide && firstDot) {
        firstSlide.classList.add('active');
        firstDot.classList.add('active');
        
        // Start auto-rotation
        startTestimonialRotation();
    }
    
    // Add event listeners to dots
    const dots = document.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            changeTestimonial(index);
            
            // Reset auto-rotation
            if (testimonialInterval) {
                clearInterval(testimonialInterval);
            }
            startTestimonialRotation();
        });
    });
});

function displayQuestion(index) {
    const question = window.testQuestions[index];
    const container = document.getElementById('question-container');
    
    container.innerHTML = `
        <div class="question-number">Вопрос ${index + 1} из 20</div>
        <div class="question-text">${question.question}</div>
        <div class="question-options">
            ${question.options.map((option, i) => `
                <div class="question-option ${testAnswers[index] === i ? 'selected' : ''}" onclick="selectAnswer(${i})">
                    <input type="radio" name="question" id="option-${i}" ${testAnswers[index] === i ? 'checked' : ''}>
                    <label for="option-${i}">${option}</label>
                </div>
            `).join('')}
        </div>
    `;
    
    // Update next button text if it's the last question
    const nextButton = document.getElementById('next-question-btn');
    if (index === 19) {
        nextButton.textContent = 'Завершить тест';
    } else {
        nextButton.textContent = 'Следующий';
    }
}

function selectAnswer(optionIndex) {
    testAnswers[currentQuestionIndex] = optionIndex;
    
    // Update UI to show selected option
    const options = document.querySelectorAll('.question-option');
    options.forEach((option, index) => {
        if (index === optionIndex) {
            option.classList.add('selected');
            option.querySelector('input').checked = true;
        } else {
            option.classList.remove('selected');
            option.querySelector('input').checked = false;
        }
    });
}

function nextQuestion() {
    if (currentQuestionIndex === 19) {
        // This is the last question, finish the test
        finishTest();
        return;
    }
    
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
}

function previousQuestion() {
    if (currentQuestionIndex === 0) return;
    
    currentQuestionIndex--;
    displayQuestion(currentQuestionIndex);
}

function cancelTest() {
    if (testTimer) {
        clearInterval(testTimer);
        testTimer = null;
    }
    
    // Properly hide the theory test element
    const theoryTestElement = document.getElementById('auto-school-theory-test');
    if (theoryTestElement) {
        theoryTestElement.style.display = 'none';
    }
    
    // Show license details again
    showLicenseDetails(currentLicenseType);
}

function startTestTimer() {
    if (testTimer) {
        clearInterval(testTimer);
    }
    
    const timerElement = document.getElementById('theory-test-timer');
    
    testTimer = setInterval(() => {
        testTimeLeft--;
        
        const minutes = Math.floor(testTimeLeft / 60);
        const seconds = testTimeLeft % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (testTimeLeft <= 0) {
            finishTest();
        }
    }, 1000);
}

function finishTest() {
    if (testTimer) {
        clearInterval(testTimer);
        testTimer = null;
    }
    
    let correctAnswers = 0;
    testAnswers.forEach((answer, index) => {
        if (answer === window.testQuestions[index].correctAnswer) {
            correctAnswers++;
        }
    });
    
    const isPassed = correctAnswers >= 1;   
    
    if (isPassed) {
        theoryTestPassed = true;
    }
    
    const theoryTestElement = document.getElementById('auto-school-theory-test');
    if (theoryTestElement) {
        theoryTestElement.style.display = 'none';
    }
    
    createResultsScreen();
    
    updateResultsScreen('theory', isPassed, correctAnswers);
    
    document.getElementById('auto-school-results').style.display = 'block';
}

function createResultsScreen() {
    const existingResultsScreen = document.getElementById('auto-school-results');
    if (existingResultsScreen) {
        existingResultsScreen.remove();
    }
    
    const resultsScreen = document.createElement('div');
    resultsScreen.id = 'auto-school-results';
    resultsScreen.className = 'auto-school-content';
    
    resultsScreen.innerHTML = `
        <div class="auto-school-header">
            <h2 id="results-title">Результаты экзамена</h2>
        </div>
        <div class="results-content">
            <div id="results-icon" class="results-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div id="results-message" class="results-message"></div>
            <div id="results-details" class="results-details"></div>
            <div class="results-actions">
                <button id="retry-exam-btn" class="auto-school-btn">Пересдать</button>
                <button id="back-to-menu-btn" class="auto-school-btn">В главное меню</button>
            </div>
        </div>
    `;
    
    document.querySelector('.auto-school-container').appendChild(resultsScreen);
    
    document.getElementById('retry-exam-btn').addEventListener('click', retryExam);
    document.getElementById('back-to-menu-btn').addEventListener('click', backToMainMenu);
}

function updateResultsScreen(examType, isPassed, score) {
    const resultsTitle = document.getElementById('results-title');
    const resultsIcon = document.getElementById('results-icon');
    const resultsMessage = document.getElementById('results-message');
    const resultsDetails = document.getElementById('results-details');
    const retryButton = document.getElementById('retry-exam-btn');
    const backButton = document.getElementById('back-to-menu-btn');
    
    resultsTitle.textContent = examType === 'theory' 
        ? 'Результаты теоретического экзамена' 
        : 'Результаты практического экзамена';
    
    resultsIcon.innerHTML = isPassed 
        ? '<i class="fas fa-check-circle" style="color: #4CAF50; font-size: 64px;"></i>' 
        : '<i class="fas fa-times-circle" style="color: #f44336; font-size: 64px;"></i>';
    
    resultsMessage.textContent = isPassed 
        ? 'Поздравляем! Вы успешно сдали экзамен! 🎉' 
        : 'К сожалению, вы не сдали экзамен. 😞';
    
    if (examType === 'theory') {
        resultsDetails.innerHTML = `
            <p><span style="font-size: 20px;">📝</span> Правильных ответов: <strong>${score} из 20</strong></p>
            <p><span style="font-size: 20px;">🎯</span> Минимальный проходной балл: <strong>16</strong></p>
            <p><span style="font-size: 20px;">💰</span> Стоимость пересдачи: <strong>${licensePrices[currentLicenseType].theory}$</strong></p>
        `;
        
        if (isPassed) {
            retryButton.textContent = "Начать практический экзамен";
            retryButton.onclick = () => {
                document.getElementById('auto-school-results').style.display = 'none';
                startPracticeExam();
            };
        } else {
            retryButton.textContent = `Пересдать (${licensePrices[currentLicenseType].theory}$)`;
            retryButton.onclick = () => {
                document.getElementById('auto-school-results').style.display = 'none';
                startTheoryTest();
            };
        }
    } else {
        resultsDetails.innerHTML = `
            <p><span style="font-size: 20px;">⚠️</span> Допущено ошибок: <strong>${score}</strong></p>
            <p><span style="font-size: 20px;">🚦</span> Максимально допустимое количество ошибок: <strong>3</strong></p>
            <p><span style="font-size: 20px;">💰</span> Стоимость пересдачи: <strong>${licensePrices[currentLicenseType].practice}$</strong></p>
        `;
        
        retryButton.textContent = `Пересдать (${licensePrices[currentLicenseType].practice}$)`;
        retryButton.onclick = () => {
            document.getElementById('auto-school-results').style.display = 'none';
            startPracticeExam();
        };
    }
    
    backButton.onclick = () => {
        document.getElementById('auto-school-results').style.display = 'none';
        backToMainMenu();
    };
}



function retryExam() {
    document.getElementById('auto-school-results').style.display = 'none';
                                               
    if (document.getElementById('results-title').textContent.includes('теоретического')) {
        const isPassed = document.getElementById('results-message').textContent.includes('успешно');
        
        if (isPassed) {
            startPracticeExam();
        } else {
            startTheoryTest();
        }
    } else {
        startPracticeExam();
    }
}
function startPracticeExam() {
    document.getElementById('ui-auto_school').style.display = 'none';
    
    showUniversalHud('driving-exam');
    
    drivingExamActive = true;
    drivingErrors = 0;
    drivingTimeElapsed = 0;
    
    document.getElementById('driving-exam-license').textContent = `Категория ${currentLicenseType}`;
    document.getElementById('driving-current-speed').textContent = '0 км/ч';
    document.getElementById('driving-errors').textContent = '0';
    
    let maxSpeed = 60;
    if (currentLicenseType === 'A') maxSpeed = 50;
    if (currentLicenseType === 'C') maxSpeed = 40;
    if (currentLicenseType === 'D') maxSpeed = 30;
    
    document.getElementById('driving-max-speed').textContent = `${maxSpeed} км/ч`;
    
    startDrivingTimer();
    
}

function startDrivingTimer() {
    if (drivingTimer) {
        clearInterval(drivingTimer);
    }
    
    const timerElement = document.getElementById('driving-exam-timer');
    
    drivingTimer = setInterval(() => {
        drivingTimeElapsed++;
        
        const minutes = Math.floor(drivingTimeElapsed / 60);
        const seconds = drivingTimeElapsed % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function startBusJobTimer() {
    if (busJobTimer) {
        clearInterval(busJobTimer);
    }
    
    const timerElement = document.getElementById('driving-bus-timer');
    
    busJobTimer = setInterval(() => {
        busJobTimeElapsed++;
        
        const minutes = Math.floor(busJobTimeElapsed / 60);
        const seconds = busJobTimeElapsed % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function getBusJobTime() {
    return busJobTimeElapsed;
}

function isBusJobActive() {
    return busJobActive;
}

function updateDrivingDirection(direction) {
    document.getElementById('driving-direction').textContent = direction;
}

function updateDrivingSpeed(speed) {
    document.getElementById('driving-current-speed').textContent = `${speed} км/ч`;
    
    const maxSpeedText = document.getElementById('driving-max-speed').textContent;
    const maxSpeed = parseInt(maxSpeedText);
    
    if (speed > maxSpeed) {
        addDrivingError('Превышение скорости');
    }
}

function addDrivingError(reason) {
    drivingErrors++;
    document.getElementById('driving-errors').textContent = drivingErrors;
    
    showNotification('Экзамен', `Ошибка: ${reason}`, 'warning', 3000);
}

function finishDrivingExam(success) {
    if (drivingTimer) {
        clearInterval(drivingTimer);
        drivingTimer = null;
    }
    
    document.getElementById('driving-exam-hud').style.display = 'none';
    
    document.getElementById('ui-auto_school').style.display = 'block';
    
    const resultsScreen = document.getElementById('auto-school-results');
    if (!resultsScreen) {
        createResultsScreen();
    }
    
    updateResultsScreen('practice', success, drivingErrors);
    
    document.getElementById('auto-school-results').style.display = 'block';
    drivingExamActive = false;
    
    bngApi.engineLua(`SubRPHud.completeDrivingExam("${currentLicenseType}", ${success})`);
}

function testFinishDrivingExam(success = true) {
    if (!drivingExamActive) return;
    finishDrivingExam(success);
}

function changeTestimonial(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function closeAutoSchool() {
    document.getElementById('ui-auto_school').style.display = 'none';
    
    const theoryTestElement = document.getElementById('auto-school-theory-test');
    if (theoryTestElement) {
        theoryTestElement.style.display = 'none';
    }
    
    document.getElementById('auto-school-license-details').style.display = 'none';
    document.getElementById('auto-school-results').style.display = 'none';
    document.getElementById('auto-school-main-menu').style.display = 'block';
    
    if (drivingExamActive) {
        if (drivingTimer) {
            clearInterval(drivingTimer);
            drivingTimer = null;
        }
        
        document.getElementById('driving-exam-hud').style.display = 'none';
        drivingExamActive = false;
        
        bngApi.engineLua(`SubRPHud.cancelDrivingExam()`);
    }
}



function showConfirmation(options) {
    // Set default options
    const defaults = {
        title: 'Подтверждение',
        message: 'Вы уверены, что хотите выполнить это действие?',
        confirmText: 'Подтвердить',
        cancelText: 'Отмена',
        icon: 'warning', 
        onConfirm: null,
        onCancel: null
    };
    

    const settings = {...defaults, ...options};
    

    document.getElementById('confirmation-title').textContent = settings.title;
    document.getElementById('confirmation-message').textContent = settings.message;
    document.getElementById('confirm-btn').textContent = settings.confirmText;
    document.getElementById('cancel-btn').textContent = settings.cancelText;
    

    let iconSvg = '';
    switch(settings.icon) {
        case 'warning':
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e72139" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>`;
            break;
        case 'success':
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4eff00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>`;
            break;
        case 'info':
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#19b9fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>`;
            break;
        case 'error':
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e72139" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>`;
            break;
    }
    document.getElementById('confirmation-icon').innerHTML = iconSvg;
    

    confirmCallback = settings.onConfirm;
    cancelCallback = settings.onCancel;
    

    const confirmBtn = document.getElementById('confirm-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    

    confirmBtn.replaceWith(confirmBtn.cloneNode(true));
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));
    

    document.getElementById('confirm-btn').addEventListener('click', handleConfirm);
    document.getElementById('cancel-btn').addEventListener('click', handleCancel);
    

    document.getElementById('universal-confirmation').style.display = 'flex';
}

function handleConfirm() {
    hideConfirmation();
    if (typeof confirmCallback === 'function') {
        confirmCallback();
    }
}


function handleCancel() {
    hideConfirmation();
    if (typeof cancelCallback === 'function') {
        cancelCallback();
    }
}

function hideConfirmation() {
    document.getElementById('universal-confirmation').style.display = 'none';
}

function terminateDrivingExam() {
    
    if (drivingTimer) {
        clearInterval(drivingTimer);
        drivingTimer = null;
    }
    
    hideUniversalHud();
    
    drivingExamActive = false;
    
    bngApi.engineLua(`SubRPHud.terminateDrivingExam()`);
    
    const resultsScreen = document.getElementById('auto-school-results');
    if (!resultsScreen) {
        createResultsScreen();
    }
    
    updateResultsScreen('practice', false, 'terminated');
    
    document.getElementById('ui-auto_school').style.display = 'block';
    document.getElementById('auto-school-results').style.display = 'block';
}

function showTerminateConfirmation() {
    showConfirmation({
        title: 'Завершить процесс?',
        message: 'Вы уверены, что хотите прервать экзамен? Это будет считаться автоматической не сдачей.',
        confirmText: 'Да, прервать',
        cancelText: 'Отмена',
        icon: 'warning',
        onConfirm: terminateDrivingExam,
        onCancel: null
    });
}




function loadworkstatus(data){
    if (data.activi == true){
        showUniversalHud('job-status')
        document.getElementById('work-name').textContent = data.name;
        document.getElementById('work-pay').textContent = data.pay;
        
        // Запускаем таймер для работы автобуса
        if (data.name && data.name.toLowerCase().includes('автобус')) {
            busJobActive = true;
            busJobTimeElapsed = 0;
            startBusJobTimer();
        }
    } else {
        if (busJobActive) {
            if (busJobTimer) {
                clearInterval(busJobTimer);
                busJobTimer = null;
            }
            busJobActive = false;
            busJobTimeElapsed = 0;
        }
    }
}


function StopWorkConfirm(){
    hideUniversalHud()
    
    if (busJobActive) {
        if (busJobTimer) {
            clearInterval(busJobTimer);
            busJobTimer = null;
        }
        busJobActive = false;
        busJobTimeElapsed = 0;
    }
    
    showNotification('Работа', `Приедте на последнюю точку`, 'warning', 3000);
    bngApi.engineLua('SubRPHud.stop_job()');
}

function StopWorkConfirmation() {
    showConfirmation({
        title: 'Завершить работу?',
        message: 'Вы уверены, что хотите прервать работу?',
        confirmText: 'Да, прервать',
        cancelText: 'Отмена',
        icon: 'warning',
        onConfirm: StopWorkConfirm,
        onCancel: null
    });
}







// ДООПОЛНИТЕЛЬНЫЕ HUD'ы
function showUniversalHud(contentType) {

    const contentElements = document.querySelectorAll('.hud-content');
    contentElements.forEach(element => {
        element.style.display = 'none';
    });
    

    document.getElementById('universal-hud').style.display = 'block';
    

    if (contentType) {
        const contentElement = document.getElementById(contentType + '-content');
        if (contentElement) {
            contentElement.style.display = 'block';
        }
    }
    

    const universalHud = document.getElementById('universal-hud');
    universalHud.className = 'universal-hud ' + contentType + '-hud';
}
function hideUniversalHud() {
    document.getElementById('universal-hud').style.display = 'none';
    
    // Останавливаем таймер работы автобуса при скрытии HUD
    if (busJobActive) {
        if (busJobTimer) {
            clearInterval(busJobTimer);
            busJobTimer = null;
        }
        busJobActive = false;
        busJobTimeElapsed = 0;
    }
}

function getBusJobTime() {
    return busJobTimeElapsed;
}

function isBusJobActive() {
    return busJobActive;
}

function resetBusJobTimer() {
    if (busJobTimer) {
        clearInterval(busJobTimer);
        busJobTimer = null;
    }
    busJobTimeElapsed = 0;
    busJobActive = false;
    
    const timerElement = document.getElementById('driving-exam-timer');
    if (timerElement) {
        timerElement.textContent = '00:00';
    }
}



function loadbuissnesino(business) {
    document.getElementById('bizName').textContent = business.name;
    document.getElementById('bizType').textContent = business.buisnes_name;
    document.getElementById('bizPrice').textContent = `$${business.price.toLocaleString()}`;
    document.getElementById('bizProfit').textContent = `$${business.pay_day.toLocaleString()}/час`;
}

function buybiz() {
    bngApi.engineLua(`SubRPHud.buybiz()`);
}


function rendertaximenu(data) {
    const driverNameEl = document.getElementById('taxi-car-driver-name');
    const carImageEl = document.getElementById('taxi-car-image');
    const taxiRankEl = document.getElementById('taxi-car-taxi-rank');
    const taxiClassEl = document.getElementById('taxi-car-taxi-class');
    const carModelEl = document.getElementById('taxi-car-model');
    const workCoefficientEl = document.getElementById('taxi-car-work-coefficient');
    driverNameEl.textContent = data.name;
    taxiRankEl.textContent = data.jobs.taxi.lvl;
    taxiClassEl.textContent = data.jobs.taxi.lvl_name;
    carModelEl.textContent = data.jobs.taxi.veh_name;
    workCoefficientEl.textContent = `x${data.jobs.taxi.ratio}`;
    carImageEl.src = `ui/modules/apps/HudRP/images/work/${data.jobs.taxi.veh_id}.png`;
}

function start_taxi() {
    bngApi.engineLua(`SubRPHud.startTaxi()`);
}





function deliveryinitInterface() {
    document.getElementById('delivery-driver-name').textContent = data.name;
    document.getElementById('delivery-rank').textContent = data.work_delivery.rank;
    document.getElementById('delivery-level').textContent = `Уровень ${data.work_delivery.level}`;
    
    const vehicle = data.work_delivery.currentVehicle;
    document.getElementById('delivery-vehicle-model').textContent = vehicle.model;
    document.getElementById('delivery-vehicle-capacity').textContent = `${vehicle.capacity} палет`;
    if (vehicle.image) {
        document.getElementById('delivery-vehicle-image').src = vehicle.image;
        document.getElementById('delivery-vehicle-image').style.display = 'block';
        document.getElementById('delivery-car-placeholder').style.display = 'none';
    }

    deliveryrenderRoutes();
}

function deliveryrenderRoutes() {
    const routesList = document.getElementById('delivery-routes-list');
    routesList.innerHTML = '';

    const sortedRoutes = [...data.work_delivery.routes].sort((a, b) => b.urgent - a.urgent); //

    sortedRoutes.forEach(route => { 
        const routeItem = document.createElement('div');
        routeItem.className = 'delivery-route-item';
        routeItem.onclick = () => deliveryselectRoute(route.id);
        const urgencyBadge = route.urgent
            ? `<span class="delivery-route-urgency urgent">Срочно</span>`
            : '';

        routeItem.innerHTML = `
            <div class="delivery-route-header">
                <div class="delivery-route-name">${route.name}</div>
                <div class="delivery-route-distance">${route.distance}</div>
            </div>
            <div class="delivery-route-info">
                <div class="delivery-route-details">
                    ${route.time}
                    ${urgencyBadge} </div>
                <div class="delivery-route-reward">$${route.reward.toLocaleString()}</div>
            </div>
        `;

        routesList.appendChild(routeItem);
    });
}

function deliveryselectRoute(routeId) {
    const route = data.work_delivery.routes.find(r => r.id === routeId);
    
    document.querySelectorAll('.delivery-route-item').forEach(item => {
        item.classList.remove('selected');
    });

    event.target.closest('.delivery-route-item').classList.add('selected');
    selectedRoute = routeId;
        
    deliveryupdateStartButton();
}

function deliveryupdateStartButton() {
    const startButton = document.getElementById('delivery-start-btn');
    
    if (selectedRoute) {
        const route = data.work_delivery.routes.find(r => r.id === selectedRoute);
        startButton.disabled = false;
        startButton.textContent = `Начать доставку - $${route.reward.toLocaleString()}`;
    } else {
        startButton.disabled = true;
        startButton.textContent = 'Выберите маршрут';
    }
}

function deliverystartDelivery() {
    bngApi.engineLua(`SubRPHud.startDelivery(${selectedRoute})`);
}




const gameData = {
    player: {
        name: "DarkDriver_2024",
        rank: "Опытный перевозчик",
        level: 3,
        completedJobs: 47,
        totalEarnings: 125750
    },
    currentVehicle: {
        name: "Mercedes Sprinter",
        model: "Sprinter 2021",
        capacity: 8,
        image: null // Здесь будет путь к изображению
    },
    routes: [
        {
            id: 1,
            name: "Центральный рынок → Торговый центр",
            distance: "2.5 км",
            urgent: false,
            reward: 850,
            time: "15 мин"
        },
        {
            id: 2,
            name: "Склад → Промышленная зона",
            distance: "8.1 км",
            urgent: true,
            reward: 1650,
            time: "25 мин"
        },
        {
            id: 3,
            name: "Порт → Автосалон центр",
            distance: "12.7 км",
            urgent: true,
            reward: 2800,
            time: "40 мин"
        },
        {
            id: 4,
            name: "Завод → Строительная база",
            distance: "15.3 км",
            urgent: false,
            reward: 3500,
            time: "50 мин"
        },
        {
            id: 5,
            name: "Аэропорт → Центр города",
            distance: "18.8 км",
            urgent: true,
            reward: 4200,
            time: "55 мин"
        },
        {
            id: 6,
            name: "Супермаркет → Жилой район",
            distance: "5.2 км",
            urgent: false,
            reward: 1200,
            time: "20 мин"
        }
    ]
};

