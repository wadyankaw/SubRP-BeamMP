local base_folder = dir_server .. "Server/SubRPDate"
local subfolders = {"players", "vehicles", "jobs", "register", "config", "achievements", "buisnes", "fractions", "api"}



--------------------------------
DataManager = require('system.DataManager')
AchievementsManager = require('system.AchievementsManager')
ddos_protection = require("libs.ddos_protection")
Anticheat = require('anticheat.main')

require('system.DataPlayer')
require('system.HudManager')
require('system.DataFraction')
require('system.DataVehicle')
require('system.CameraTrap')
require('system.TriggerData')
require('system.DataWorking')
require('system.MapData')
require('system.Commands')
require('system.ApiEngine')


--------------------------------

function create_folders()
    local main_folder_exists = os.execute("test -d \"" .. base_folder .. "\"")
    
    if not main_folder_exists then
        os.execute("mkdir -p \"" .. base_folder .. "\"")
        log_success("Создана папка: " .. base_folder)
    end

    for _, folder in ipairs(subfolders) do
        local path = base_folder .. "/" .. folder
        local folder_exists = os.execute("test -d \"" .. path .. "\"")
        
        if not folder_exists then
            os.execute("mkdir -p \"" .. path .. "\"")
            log_success("Создана папка: /SubRPDate/" .. folder )
        end
    end

    if DataManager.load_data("config", "achievements_config.json") == nil then
        local data = {
            {
                id = "first_steps",
                title = "Первые шаги",
                description = "Проведите первые 10 часов в игре",
                icon = "fa-medal",
                reward = {
                    money = 5000,
                    exp = 100,
                    badge = nil
                },
                isGold = false,
                condition = {
                    type = "playtime",
                    target = 10
                }
            },
            {
                id = "case_master",
                title = "Мастер кейсов",
                description = "Откройте 50 кейсов",
                icon = "fa-box-open",
                reward = {
                    money = 25000,
                    exp = 500,
                    badge = nil
                },
                isGold = false,
                condition = {
                    type = "stat",
                    statName = "casesOpened",
                    target = 50
                }
            },
            {
                id = "server_legend",
                title = "Легенда сервера",
                description = "Достигните 50 уровня",
                icon = "fa-trophy",
                reward = {
                    money = 100000,
                    exp = 2000,
                    badge = "Эксклюзивный значок"
                },
                isGold = true,
                condition = {
                    type = "level",
                    target = 50
                }
            }
        }
        DataManager.save_data("config", "achievements_config.json", data)
    end

    if DataManager.load_data("config", "level_config.json") == nil then
        local data = {
            {
                lvl = 1,
                exp = 100,
                
            },
            {
                lvl = 2,
                exp = 180,
                
            },
            {
                lvl = 3,
                exp = 280,
                
            }
        }
        DataManager.save_data("config", "level_config.json", data)
    end

    if DataManager.load_data("api", "players.json") == nil then
        local data = {
            ip_verefy = {},
            user_online = {},
            cars = {}
        }
        DataManager.save_data("api", "players.json", data)
    end

    if DataManager.load_data("api", "message_discord.json") == nil then
        local data = {}
        DataManager.save_data("api", "message_discord.json", data)
    end

    if DataManager.load_data("api", "server_status.json") == nil then
        local data = {}
        DataManager.save_data("api", "server_status.json", data)
    end





    if DataManager.load_data("jobs", "bus.json") == nil then
        local data = {
            {
                id = 1,
                name = "Маршрут №1: Центр - Северный район",
                distance = "12.5 км",
                stops = 8,
                time = "5-7 мин",
                payment = 1200,
                stop_pos = {-382.604, 364.760, 102.152}, 
                checkpoints = {
                    {-382.604, 364.760, 102.152, 1, 0},
                    {-408.841, 243.480, 101.372, 1, 0},
                    {-727.240, -23.243, 102.373, 1, 0},
                    {-802.842, 12.132, 117.884, 0, 0},
                    {-675.760, 136.038,117.566, 1, 0},
                    {-502.926, 308.376, 97.980, 1, 0},
                    {-253.167, 499.399, 75.027, 1, 0},
                    {-42.063, 527.852, 74.931, 1, 0},
                    {-150.000, 665.923, 75.117, 0, 0},
                    {-348.234, 633.525, 75.176, 0, 0},
                    {-482.532, 348.383, 97.196, 1, 1200}
                }
            }
        }
        DataManager.save_data("jobs", "bus.json", data)
    end

    if DataManager.load_data("jobs", "taxi.json") == nil then
        local data = {
            payment = 1,
            stop_pos = {-689.598,28.858,102.887}, 
            pay_the_meters = 13,
            checkpoints = {
                {-382.604, 364.760, 102.152},
                {-408.841, 243.480, 101.372},
                {-727.240, -23.243, 102.373},
                {-802.842, 12.132, 117.884},
                {-675.760, 136.038, 117.56},
                {-502.926, 308.376, 97.980},
                {-641.974, 128.714, 117.045},
                {-538.020, 131.250, 100.532},
                {-417.450, 168.357, 100.346},
                {-410.425, 363.280, 101.916},
                {-348.146, 411.936, 98.085},
                {-290.709, 458.700, 83.517},
                {-424.774, 716.905, 74.878},
                {-873.383, 665.067, 110.619},
                {-925.296, 381.557, 155.542},
                {-725.910, 128.095, 120.121},
                {-809.011, -553.271, 100.306},
                {-577.979, -455.420, 114.367},
                {-358.641, -609.333, 126.851},
                {-225.018, -820.143, 136.666},
                {-585.170, -527.138, 116.319},
                {-1237.000, -695.668, 104.503},
                {873.356, -952.738, 170.368},
                {879.374, -542.776, 163.669},
                {834.828, -522.638, 165.312},
                {419.566, -303.311, 152.537},
                {271.158, -329.623, 145.829},
                {-181.451, -280.965, 118.925},
                {-758.470, 211.216, 137.427},
                {-727.358, 354.470, 139.629},
                {-833.594, 443.995, 145.511},
                {-885.660, 416.669, 151.519},
                {-566.807, 300.909, 104.396},
                {-527.965, 455.998, 103.387},
                {-508.191, 562.812, 92.329},
                {-502.333, 615.261, 85.927},
                {-257.823, 502.964, 74.860},
                {-229.993, 573.407, 74.979},
                {157.471, 771.982, 102.193},
                {375.357, 850.232, 128.715},
                {885.255, 740.223, 146.305},
                {-636.440, -952.992, 164.603},
                {-799.774, -917.551, 158.651},
                {-600.888, -627.216, 186.927}
            },
            lvl_xp = {
                {lvl = 1, xp = 65, ratio = 1, lvl_name = "Эконом", veh_id = "work_taxi1", veh_name = "Brukell LeGran"},
                {lvl = 2, xp = 140, ratio = 1.2, lvl_name = "Комфорт", veh_id = "work_taxi2", veh_name = "Ibishu Pessima"},
                {lvl = 3, xp = 200, ratio = 1.5, lvl_name = "Комфорт +", veh_id = "work_taxi3", veh_name = "Grand Marshal"},
                {lvl = 4, xp = 320, ratio = 2, lvl_name = "Бизнес", veh_id = "work_taxi4", veh_name = "Brukell Bastion"},
                {lvl = 5, xp = 0, ratio = 2.5, lvl_name = "Премиум", veh_id = "work_taxi5", veh_name = "ETK 900"},
            }
            
        }
        DataManager.save_data("jobs", "taxi.json", data)
    end


    if DataManager.load_data("jobs", "cargo.json") == nil then
        local data = {
            payment = 1,
            stop_pos = {-689.598,28.858,102.887}, 
            routes = {
                {   
                    id = 1,
                    pay = 1000,
                    bonus = true,
                    name = "Склад → Порт",
                    dist = 18.1,
                    start =  {-42.063, 527.852, 74.931, 1, 0},
                    stop =  {-42.063, 527.852, 74.931, 1, 0}
                },
                {   
                    id = 2,
                    pay = 1000,
                    bonus = false,
                    name = "Порт → 1 АЗС",
                    dist = 18.1,
                    start =  {-42.063, 527.852, 74.931, 1, 0},
                    stop =  {-42.063, 527.852, 74.931, 1, 0}
                }
            },
            lvl_xp = {
                {lvl = 1, xp = 65, ratio = 1, lvl_name = "Новичёк", veh_id = "work_cargo1", veh_name = "Gavril H-series", mass = 1},
                {lvl = 2, xp = 140, ratio = 1.2, lvl_name = "Знаток", veh_id = "work_cargo2", veh_name = "Gavril H-series", mass = 2},
                {lvl = 3, xp = 200, ratio = 1.5, lvl_name = "Мастер", veh_id = "work_cargo3", veh_name = "Gavril MD-series", mass = 4},
                {lvl = 4, xp = 320, ratio = 2, lvl_name = "Профи", veh_id = "work_cargo4", veh_name = "Gavril T-series", mass = 6}
            }
            
        }
        DataManager.save_data("jobs", "cargo.json", data)
    end

    
    if DataManager.load_data("buisnes", "station1.json") == nil then
        local data = {
            owner_id = -1,
            price = 1500000,
            open = true,
            ratio = 1,
            balance = 0,
            mat = 0,
            mat_max = 2000,
            name = "Элитная заправка",
            buisnes_name = "Заправочная станция",
            pay_day = 1000,
            price_fuel = {
                gasoline = 50.0,
                diesel = 35.0,
                electric = 10.0
            },
            last_days_profit = {
                Monday = {profit = 0},
                Tuesday = {profit = 0},
                Wednesday = {profit = 0},
                Thursday = {profit = 0},
                Friday = {profit = 0},
                Saturday = {profit = 0},
                Sunday = {profit = 0}
            }
        }
        DataManager.save_data("buisnes", "station1.json", data)
    end

    if DataManager.load_data("buisnes", "station2.json") == nil then
        local data = {
            owner_id = -1,
            price = 1500000,
            open = true,
            ratio = 1,
            balance = 0,
            mat = 0,
            mat_max = 2000,
            name = "Загородная заправка",
            buisnes_name = "Заправочная станция",
            pay_day = 1000,
            price_fuel = {
                gasoline = 45.0,
                diesel = 35.0,
                electric = 9.0
            },
            last_days_profit = {
                Monday = {profit = 0},
                Tuesday = {profit = 0},
                Wednesday = {profit = 0},
                Thursday = {profit = 0},
                Friday = {profit = 0},
                Saturday = {profit = 0},
                Sunday = {profit = 0}
            }
        }
        DataManager.save_data("buisnes", "station2.json", data)
    end

    if DataManager.load_data("buisnes", "cardealership1.json") == nil then
        local data = {
            owner_id = -1,
            price = 1500000,
            open = true,
            ratio = 1,
            balance = 0,
            mat = 0,
            mat_max = 2000,
            name = "ELITE MOTORS",
            buisnes_name = "Автосалон",
            pay_day = 1000,
            spawn_pos = {-415.567, 169.785,100.453},
            last_days_profit = {
                Monday = {profit = 0},
                Tuesday = {profit = 0},
                Wednesday = {profit = 0},
                Thursday = {profit = 0},
                Friday = {profit = 0},
                Saturday = {profit = 0},
                Sunday = {profit = 0}
            }
        }
        DataManager.save_data("buisnes", "cardealership1.json", data)
    end

    if DataManager.load_data("fractions", "police.json") == nil then
        local data = {
            owner_id = -1,
            name = "Полиция",
            rangs = {
                {
                    id = 1,
                    name = "Рядовой",
                    pay_day = 1000,
                    cars = {}
                },
                {
                    id = 2,
                    name = "Сержант",
                    pay_day = 2000,
                    cars = {}
                },
                {
                    id = 3,
                    name = "Лейтенант",
                    pay_day = 3000,
                    cars = {}
                },
                {
                    id = 4,
                    name = "Полковник",
                    pay_day = 4000,
                    cars = {}
                },
                {
                    id = 5,
                    name = "Генерал",
                    pay_day = 5000,
                    cars = {}
                }
            }
        }
        DataManager.save_data("fractions", "police.json", data)
    end



    if DataManager.load_data("", "online_api.json") == nil then
        local data = {
            online = {},
            cars = {}
        }
        DataManager.save_data("", "online_api.json", data)
    end

    if DataManager.load_data("", "folders_list.json") == nil then
        local data = {
            fractions = {"police.json"},
            buisnes = {"station1.json", "cardealership1.json"},
            players = {"Jastickon.json"}
        }
        DataManager.save_data("", "folders_list.json", data)
    end

    if DataManager.load_data("config", "sell_cars.json") == nil then
        local data = {
            {
                id = 1,
                jbeam_id = "BBMW212",
                name = "Mercedes-Benz E-Class (W212)",
                price = 50000,  
                image = "e_class_w212.png",
                colors = {"#000000", "#C0C0C0", "#2A4B7C"},  
                year = 2013,  
                engine = "1.8 л, 185 л.с.",  
                transmission = "7G-Tronic (автомат)",  
                drive = "Задний",  
                fuel = "Бензин",  
                consumption = "3.2 л/100км (бензин)",  
                type = "sedan",  
                description = "Mercedes-Benz W212 — это пятое поколение E-Class, сочетающее элегантный дизайн, надёжность и передовые технологии. Модель известна своей прочной конструкцией, комфортной подвеской и солидной репутацией среди бизнес-седанов.",  
                features = {"Адаптивный биксенон", "Динамическая подсветка поворотов", "Система Pre-Safe", "Деревянный декор интерьера"}  
            }
        }

        DataManager.save_data("config", "sell_cars.json", data)
    end
    if DataManager.load_data("config", "posts.json") == nil then
        local data = {
            buisnes_buy ={
                station1_buy = {
                    {location = {-481.786, 114.768, 100.518}}
                },
                station2_buy = {
                    {location = {935.867, -487.169, 162.654}}
                }
            },

            start_work = {
                work_bus = {location = {-397.294, 375.650, 100.996}},
                work_taxi = {location = {-701.559, 17.289, 101.798}}
            },

            fuelstations={
                
                station1 = {
                    { location = { -480.495, 134.616, 100.21 }, type = "any" },
                    { location = { -476.888, 133.500, 100.21 }, type = "any" },
                    { location = { -478.933, 126.744, 100.21 }, type = "any" },
                    { location = { -482.540, 127.860, 100.21 }, type = "any" },
                    { location = { -490.042, 130.875, 100.21 }, type = "any" },
                    { location = { -487.997, 137.631, 100.21 }, type = "any" },
                    { location = { -484.390, 136.515, 100.21 }, type = "any" },
                    { location = { -486.435, 129.759, 100.21 }, type = "any" },
                    { location = { -492.171, 138.235, 100.21 }, type = "any" },
                    { location = { -495.778, 139.350, 100.21 }, type = "any" },
                    { location = { -497.824, 132.595, 100.21 }, type = "any" },
                    { location = { -494.217, 131.479, 100.21 }, type = "any" }
                },
                station2 = {
                    { location = { 929.988, -489.284, 162.482 }, type = "any" },
                    { location = { 931.136, -483.216, 162.432 }, type = "any" },
                    { location = { 927.333, -482.523, 162.413 }, type = "any" },
                    { location = { 926.067, -488.252, 162.416 }, type = "any" },
                    { location = { 922.031, -487.645, 162.419 }, type = "any" },
                    { location = { 923.154, -482.015, 162.410 }, type = "any" },
                    { location = { 919.435, -481.039, 162.406 }, type = "any" },
                    { location = { 913.905, -486.257, 162.415 }, type = "any" },
                    { location = { 915.191, -480.732, 162.411 }, type = "any" },
                    { location = { 911.813, -479.254, 162.377 }, type = "any" },
                    { location = { 910.362, -485.034, 162.417 }, type = "any" },
                }
            },
            cardealership = {
                cardealership1 = {
                    location = { -393.344, 178.731, 100.092 }
                }
            }
        }

        DataManager.save_data("config", "posts.json", data)
    end
    if DataManager.load_data("config", "map_locations.json") == nil then
        local data = {
                    {   
                        name = "Центр",
                        pos = {0, 0, 0}
                    },
                    {   
                        name = "Причал",
                        pos = {10, 0, 0}
                    },
                    {   
                        name = "Пристань",
                        pos = {10, 10, 10}
                    }
        }

        DataManager.save_data("config", "map_locations.json", data)
    end
    
end

if dev_mode then
   
end


