log_debug("Запуск system/DataVehicle.lua")

MP.RegisterEvent("TriggerSubRPFuelData", "FuelData")
MP.RegisterEvent("timer_minute_place", "update_place_vehicle")
MP.RegisterEvent("Triggerbuy_car_diler", "buy_car_diler")

vehicle_place = {}
data_vehicles = {}


function gen_place_number()
    math.randomseed(os.time())
    local letters = {'A', 'B', 'E', 'K', 'M', 'H', 'O', 'P', 'C', 'T', 'Y', 'X'}
    
    local part1 = letters[math.random(1, #letters)]
    local part2 = letters[math.random(1, #letters)]
    local part3 = letters[math.random(1, #letters)]
    
    local digits = string.format("%03d", math.random(0, 999))
    
    local region = string.format("%02d", math.random(1, 99))
    if math.random(1, 10) == 1 then
        region = string.format("%03d", math.random(1, 199))
    end
    
    local number = part1 .. digits .. part2 .. part3 .. region
    
    return number
end

function buy_car_diler(user_id, data_json)
    local data = json.decode(data_json)
    local veh = DataManager.load_data("vehicles", data.jbeam ..".json")
    local user = DataManager.load_data("players", M.DataPlayer[user_id].nick .. ".json")
    local config_sell_cars = M.DataPlayer[user_id].hud.diler_cars

    local veh_data_diler = {}
    for _, car in ipairs(config_sell_cars) do

        if car.jbeam_id == data.jbeam then
            veh_data_diler = car
        end
    end

    if tonumber(user.bal) >= veh_data_diler.price then
        local new_bal = tostring(tonumber(user.bal) - tonumber(veh_data_diler.price))
        local data_user = {
            bal = new_bal
        }
        DataManager.update_data("players", M.DataPlayer[user_id].nick .. ".json", data_user)
        local rand = math.random(10000, 99999)
        veh.place = gen_place_number()
        local veh_data_name = data.jbeam.."_".. user.game_id.. "_" .. rand
        DataManager.save_data("vehicles", veh_data_name ..".json", veh)

        local buisnes = DataManager.load_data("buisnes", M.DataPlayer[user_id].buisnes_id .. ".json") or {}
        if buisnes.owner_id ~= -1 then
            local new_mat = buisnes.mat - 1
            if new_mat <= 0 then
                new_mat = 0
            end


            if buisnes.mat >= new_mat then
                local current_day = os.date("%A")
 
                local current_profit = buisnes.last_days_profit[current_day] and buisnes.last_days_profit[current_day].profit or 0
                local updated_profit = current_profit + (tonumber(veh_data_diler.price / 10))
                local new_balance = buisnes.balance + (tonumber(veh_data_diler.price) / 10)
                
                local updated_profits = {}
                for day, day_data in pairs(buisnes.last_days_profit or {}) do
                    updated_profits[day] = { profit = day_data.profit }
                end
                updated_profits[current_day] = { profit = updated_profit }
                
                local data_new = {
                    mat = new_mat,
                    last_days_profit = updated_profits, 
                    balance = new_balance
                }
                
                DataManager.update_data("buisnes", M.DataPlayer[user_id].buisnes_id .. ".json", data_new)
            end
        end
        vehicle_place[M.DataPlayer[user_id].nick] = nil
        update_place_vehicle()

        spawn_owned_vehicle(user_id, veh_data_name, buisnes.spawn_pos)

        M.DataPlayer[user_id].hud.InfoPlayerMoney = new_bal
		send_data_hud(user_id)
        send_notify(user_id, "Автосалон", "Вы купили ".. veh_data_diler.name , "success", 20000)
    else
        send_notify(user_id, "Автосалон", "Недостаточно наличных средств", "error", 10000)
        return
    end


end



function FuelData(user_id, data_json)
    local data = json.decode(data_json)
    M.DataPlayer[user_id].FuelData = data

    for user, veh_data in pairs(data_vehicles) do
        print(user_id)
        if user == user_id then
            if veh_data.owned then
                local new_data = {
                    fuel = data
                }
                DataManager.update_data("vehicles", veh_data.veh_id .. ".json", new_data)
            end
        end
        
    end


end

function add_fuel_station(user_id, fuel)
    local data = {
        fuel = fuel,
        vehicle = M.DataPlayer[user_id].FuelData
    }
    local data_json = json.encode(data)
    MP.TriggerClientEvent(user_id, "ClientEventadd_fuel_station", data_json);
end

function set_fuel_veh(user_id, fuel)
    local data = {
        fuel = fuel,
        vehicle = M.DataPlayer[user_id].FuelData
    }
    local data_json = json.encode(data)
    MP.TriggerClientEvent(user_id, "ClientEventset_fuel", data_json);
end



function set_place_vehicle(user_name, place)
    if user_name == nil or place == nil then
        print("Ошибка: user_name или place не могут быть nil")
        return
    end
    
    vehicle_place[user_name] = place
    update_place_vehicle()
end

function update_place_vehicle()
    local normalized_table = {}
    for user_name, place in pairs(vehicle_place) do
        normalized_table[tostring(user_name)] = place
    end
    
    local data_json = json.encode(normalized_table)
    for id, nick in pairs(MP.GetPlayers()) do
        MP.TriggerClientEvent(id, "ClientEventSyncPlace", data_json)
    end


    for user_id, veh_data in pairs(data_vehicles) do
        print(user_id)
        if veh_data.owned then
            print(veh_data)
            local raw_pos, error = MP.GetPositionRaw(user_id, 0)
            print(raw_pos)
            if raw_pos then
                local new_data = {
                    pos = raw_pos.pos
                }
                DataManager.update_data("vehicles", veh_data.veh_id .. ".json", new_data)
            else
                print("Error getting position:", error)
            end
        end
    end
end



function save_vehicle(user_id, json_name)
    local player_vehicles = MP.GetPlayerVehicles(user_id)

    for vehicle_id, vehicle_data in pairs(player_vehicles) do
        local start = string.find(vehicle_data, "{")
        local formattedVehicleData = string.sub(vehicle_data, start, -1)
        local data = json.decode(formattedVehicleData)
        DataManager.save_data("vehicles", json_name ..".json", data)
        break
    end
end

function spawn_owned_vehicle(user_id, veh_server_id, pos)
    local loaded_vehicle = DataManager.load_data("vehicles", veh_server_id .. ".json")

    data_vehicles[user_id] = {
        veh_id = veh_server_id,
        owned = true,
        spawned = true,
        pos = pos or loaded_vehicle.pos,
        fuel = M.DataPlayer[user_id].FuelData or 'not load',
        place = loaded_vehicle.place or "Illegible"
    }
    local user_name = M.DataPlayer[user_id].nick
    set_place_vehicle(user_name, loaded_vehicle.place or "Illegible")


    spawn_veh_pos(user_id, veh_server_id, pos or loaded_vehicle.pos)
    if loaded_vehicle.fuel then
        set_fuel_veh(user_id, loaded_vehicle.fuel)
        M.DataPlayer[user_id].FuelData = loaded_vehicle.fuel
    end
end


function spawn_worked_vehicle(user_id, veh_server_id)
    local loaded_vehicle = DataManager.load_data("vehicles", veh_server_id..".json")
    local gen_place = gen_place_number()
    data_vehicles[user_id] = {
        veh_id = veh_server_id,
        owned = false,
        spawned = true,
        pos = loaded_vehicle.pos,
        fuel = M.DataPlayer[user_id].FuelData or 'not load',
        place = gen_place
    }
    local user_name = M.DataPlayer[user_id].nick
    set_place_vehicle(user_name, gen_place)


    spawn_veh_pos(user_id, veh_server_id, loaded_vehicle.pos)
end




function spawn_veh_pos(user_id, json_name, pos)
    local loaded_vehicle = DataManager.load_data("vehicles", json_name..".json")
    if pos ~= nil then
        loaded_vehicle.pos = pos
    end
    local data_json = json.encode(loaded_vehicle)
    MP.TriggerClientEvent(user_id, "ClientPacketVehSpawnPos", data_json);
end


function delete_veh_all(user_id)
    local player_vehicles = MP.GetPlayerVehicles(user_id)
    if player_vehicles then
        update_place_vehicle()
        data_vehicles[user_id] = nil
        for vehicle_id, vehicle_data in pairs(player_vehicles) do
            MP.RemoveVehicle(user_id, vehicle_id)
        end
    end

end
