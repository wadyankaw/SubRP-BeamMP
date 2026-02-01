log_debug("Запуск system/Commands.lua")

MP.RegisterEvent("onChatMessage", "CommandInChat");

function CommandInChat(sender_id, sender_name, command)
    if not command:find("^/") then return end
    local args = {}
    for arg in command:gmatch("%S+") do
        table.insert(args, arg)
    end

    -- Команда /set_place [user_name] [place]
    if args[1] == "/set_place" then
        if not args[2] or not args[3] then
            MP.SendChatMessage(sender_id, "❌ Используйте: /set_place [ID_машины] [место]")
            return
        end

        set_place_vehicle(args[2], args[3])
        MP.SendChatMessage(sender_id, "✅ Номера для ["..args[2].."] установленны: '"..args[3].."'")

    elseif args[1] == "/save_veh" then
        save_vehicle(sender_id, args[2])
        MP.SendChatMessage(sender_id, "✅ Вы сохранили машину под названием ["..args[2].."]")

    elseif args[1] == "/spawn_veh" then
        spawn_owned_vehicle(sender_id, args[2])
        MP.SendChatMessage(sender_id, "✅ Вы сохранили машину под названием ["..args[2].."]")

    elseif args[1] == "/new_loc" then
        local newlocal = table.concat(args, " ", 2)
        local pos = MP.GetPositionRaw(sender_id, 0).pos
        local locations = DataManager.load_data("config", "map_locations.json") or {}
        
        table.insert(locations, {
            name = newlocal,
            pos = {pos[1], pos[2], pos[3]}
        })
        
        DataManager.update_data("config", "map_locations.json", locations)
        MP.SendChatMessage(sender_id, "✅ Вы добавили локацию ["..newlocal.."]")
    
    elseif args[1] == "/test" then
        create_object("/levels/west_coast_usa/art/shapes/trees/spanishbayonet2.dae","test" , {-481.786, 114.768, 100.518}, {0,0,0,0})
        
    elseif args[1] == "/test2" then
        remove_object(args[2])
    
    elseif args[1] == "/cargo" then
        open_work_cargo(sender_id)


    elseif args[1] == "/taxi" then
        load_taxi(sender_id)
    elseif args[1] == "/bus" then
        open_user_ui(sender_id, "ui-jobs-bus")
    
    elseif args[1] == "/n" then
        if sender_name == "Jastickon" then
            local id = args[2]
            local reason = args[3]
            local price = args[4]

            
            local user = DataManager.load_data("players", M.DataPlayer[id].nick ..".json") or {}
            user.orders_pdd = user.orders_pdd or {}
            table.insert(user.orders_pdd, {
                reason = "Проезд на красный - ".. triggerPlace, 
                amount = 2000
            })

            DataManager.update_data("players", player_name ..".json", user)



            send_data_hud(args[2])
            send_notify(args[2], "Штрафы", "Вы получили штраф за привышение скорости", "error", 10000)
        end

    elseif args[1] == "/adm_mode" then
        if M.DataPlayer[sender_id].is_admin then
            M.DataPlayer[sender_id].is_admin = false
        else
            M.DataPlayer[sender_id].is_admin = true
        end
        PlayerSyncData()
    else
        MP.SendChatMessage(sender_id, "⚠️ Доступные команды: /bus, /taxi")
    end
end
