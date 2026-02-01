MP.CancelEventTimer("SecTimerTeleport", 1000)
MP.RegisterEvent("SecTimerTeleport", "checkTeleport")
MP.CreateEventTimer("SecTimerTeleport", 1000)

local teleport = {
    name = "Anti-Teleport",
    last_positions = {}
}

local MAX_TELEPORT_DISTANCE = 100
local MIN_DISTANCE_TO_CHECK = 1

function checkTeleport()
    local current_time = os.time()
    local Players = MP.GetPlayers()

    for player_id, player_data in pairs(Players) do
        local player_vehicles = MP.GetPlayerVehicles(player_id)
        
        if not player_vehicles then goto skipPlayer end
        
        if not teleport.last_positions[player_id] then
            teleport.last_positions[player_id] = {}
        end
        for vehicle_id, vehicle_data_f in pairs(player_vehicles) do
            local veh_pos = MP.GetPositionRaw(player_id, vehicle_id).pos or {}


            if veh_pos == {} then goto skipVehicle end

            if not veh_pos[1] or not veh_pos[2] or not veh_pos[3] then goto skipVehicle end
            
            if teleport.last_positions[player_id][vehicle_id] then
                local last_pos = teleport.last_positions[player_id][vehicle_id].pos
                local last_time = teleport.last_positions[player_id][vehicle_id].time
                
                local dx = veh_pos[1] - last_pos[1]
                local dy = veh_pos[2] - last_pos[2]
                local dz = veh_pos[3] - last_pos[3]
                local distance = math.sqrt(dx*dx + dy*dy + dz*dz)
                
                local time_diff = current_time - last_time
                if distance > MIN_DISTANCE_TO_CHECK and 
                   distance > MAX_TELEPORT_DISTANCE and 
                   time_diff <= 1 then
                    
                    print(("Подозрение на телепорт у игрока %d. Транспорт: %d. "..
                           "Позиция: %.2f, %.2f, %.2f → %.2f, %.2f, %.2f. "..
                           "Расстояние: %.2fм за %dсек"):format(
                            player_id, 
                            vehicle_id,
                            last_pos[1], last_pos[2], last_pos[3],
                            veh_pos[1], veh_pos[2], veh_pos[3],
                            distance,
                            time_diff))

                    send_dc_message("1396162882357428436", {
                    embed = {
                        title = "Античит",
                        description = "Подозрение на использования Teleport Cheat",
                        color = 0xFF0000,
                        fields = {
                            {name = "Ник", value = M.DataPlayer[player_id].nick, inline = true},
                            {name = "Детали телепорта", value = ("Подозрение на телепорт у игрока %d. Транспорт: %d. "..
                                        "Позиция: %.2f, %.2f, %.2f → %.2f, %.2f, %.2f. "..
                                        "Расстояние: %.2fм за %dсек"):format(
                                            player_id, 
                                            vehicle_id,
                                            last_pos[1], last_pos[2], last_pos[3],
                                            veh_pos[1], veh_pos[2], veh_pos[3],
                                            distance,
                                            time_diff), inline = false}
                        },
                        footer = {text = os.date("%H:%M:%S")}
                    }
                })
                end
            end
            
            teleport.last_positions[player_id][vehicle_id] = {
                pos = {
                    [1] = veh_pos[1],
                    [2] = veh_pos[2],
                    [3] = veh_pos[3]
                },
                time = current_time
            }
            
            ::skipVehicle::
        end
        
        for stored_veh_id, _ in pairs(teleport.last_positions[player_id]) do
            if not player_vehicles[stored_veh_id] then
                teleport.last_positions[player_id][stored_veh_id] = nil
            end
        end
        
        ::skipPlayer::
    end
end

teleport.check = checkTeleport

return teleport