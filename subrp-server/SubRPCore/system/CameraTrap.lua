log_debug("Запуск system/cameratrap.lua")

MP.RegisterEvent("packetredLight", "redLight")
MP.RegisterEvent("packetspeedTrap", "speedTrap")


local triggerPlaces = {
    [1] = "Перекресток Плаза",
    [2] = "Северная площадь Плаза",
    [3] = "Южная площадь Плаза",
    [4] = "Бич-роуд",
    [5] = "Маяк на острове",
    [6] = "Северный порт острова",
    [7] = "Южный порт острова"
}

function speedTrap(user_id, data)
    local speedTrapData = Util.JsonDecode(data)
    local triggerName = speedTrapData.triggerName
    local triggerNumber = tonumber(string.match(triggerName, "%d+"))
    local triggerPlace = triggerPlaces[triggerNumber] or "Unknown"
    local player_name = MP.GetPlayerName(user_id)
    local user_speed = string.format( "%.1f", speedTrapData.playerSpeed * 2.23694 * 1.609)
    local limit_speed = string.format( "%.0f", speedTrapData.speedLimit * 2.23694  * 1.609 )
    local car_name = speedTrapData.vehicleModel
    log_warning(player_name .. " Нарушил скоростной лимит на ".. triggerPlace .. " скорость " .. user_speed .."км/ч при лимите в ".. limit_speed.." машина ".. speedTrapData.vehicleModel)
    if speedTrapData.licensePlate ~= "Illegible" then
        log_success("Номера: " .. speedTrapData.licensePlate)

        local user = DataManager.load_data("players", player_name..".json") or {}
        user.orders_pdd = user.orders_pdd or {}
        table.insert(user.orders_pdd, {
            reason = "Привышение скорости - ".. triggerPlace, 
            amount = 2000
        })

        DataManager.update_data("players", player_name ..".json", user)

        send_notify(user_id, "Штрафы", "Вы получили штраф за привышение скорости", "error", 10000)
        local user = DataManager.load_data("players", player_name..".json") or {}
        M.DataPlayer[user_id].hud.PayPDD_info = user.orders_pdd
        send_data_hud(user_id)

    end
end

function redLight(user_id, data)
    local speedTrapData = json.decode(data)
    local triggerName = speedTrapData.triggerName
    local triggerNumber = tonumber(string.match(triggerName, "%d+"))
    local triggerPlace = triggerPlaces[triggerNumber] or "Unknown"
    local player_name = MP.GetPlayerName(user_id)
    log_warning(player_name .. " проехал на красный, на перекрёстке ".. triggerPlace.." машина ".. speedTrapData.vehicleModel)
    if speedTrapData.licensePlate ~= "Illegible" then
        log_success("Номера: " .. speedTrapData.licensePlate)

        local user = DataManager.load_data("players", player_name..".json") or {}
        user.orders_pdd = user.orders_pdd or {}
        table.insert(user.orders_pdd, {
            reason = "Проезд на красный - ".. triggerPlace, 
            amount = 2000
        })

        DataManager.update_data("players", player_name ..".json", user)

        send_notify(user_id, "Штрафы", "Вы получили штраф за проезд на красный", "error", 10000)
        local user = DataManager.load_data("players", player_name..".json") or {}
        M.DataPlayer[user_id].hud.PayPDD_info = user.orders_pdd
        send_data_hud(user_id)

    end
end