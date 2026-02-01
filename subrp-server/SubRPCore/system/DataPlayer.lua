log_debug("Запуск system/DataPlayer.lua")

M.DataPlayer = {}
anti_ddos = {}
MP.RegisterEvent("onPlayerAuth", "PlayerAuth")
MP.RegisterEvent("onPlayerConnecting", "PlayerConnecting")
MP.RegisterEvent("onPlayerJoining", "PlayerJoining")
MP.RegisterEvent("onPlayerJoin", "PlayerJoin")
MP.RegisterEvent("onPlayerDisconnect", "PlayerDisconnect")


local DEFAULT_COLOR = {
    r = 63, 
    g = 63, 
    b = 63,
    w = 95
}

function getRender_user_name(user_id)
    local user_list = {}
    local is_admin = false
    if M.DataPlayer[user_id] then
        is_admin = M.DataPlayer[user_id].is_admin
    end
    local players = MP.GetPlayers()
    
    for id, nick in pairs(players) do
        local user = DataManager.load_data("players", nick..".json") or {}
        
        user_list[nick] = {
            text = user.rp_name .. " | " .. user.game_id,
            color = DEFAULT_COLOR,
            dist = 20
        }

        if is_admin then
            user_list[nick].admin = "Ник: ".. user.nick .. " Рп: ".. user.rp_name .. " ID: ".. user.game_id .. " LVL: ".. user.lvl
        end
    end
    return user_list
end

function PlayerSyncData()
    local posts = DataManager.load_data("config", "posts.json") or {}
    local players = MP.GetPlayers()
    local User_data_core = {
        posts = posts
    }
    
    for user_id, nick in pairs(players) do
        MP.TriggerClientEvent(user_id, "ClientPacketReloadSignals", "0")
        
        User_data_core.nicks = getRender_user_name(user_id)
        User_data_core.perms = SetConfigPerm(nick)
        
        MP.TriggerClientEvent(user_id, "ClientPacketReloadData", json.encode(User_data_core))
    end
end


function SetConfigPerm(user_name)
    local user = DataManager.load_data("players", user_name..".json")
    local perms = {
        ["user"] = {
            'pause',
            'toggleCamera',
            'dropCameraAtPlayer',
            'editorToggle',
            'switch_previous_vehicle',
            'switch_next_vehicle',
            'slower_motion',
            'faster_motion',
            'toggle_slow_motion',
            'modify_vehicle',
            "vehicle_selector",
            "parts_selector",
            "vehicledebugMenu",
            'saveHome','loadHome',
            'reset_all_physics',
            'toggleTraffic',
            "recover_vehicle",
            "recover_vehicle_alt",
            "recover_to_last_road",
            "reload_vehicle",
            "reload_all_vehicles",
            "parts_selector",
            "dropPlayerAtCamera",
            "nodegrabberRender",
            'reset_physics',
            'dropPlayerAtCameraNoReset',
            'toggleRadialMenuSandbox',
            'toggleRadialMenuPlayerVehicle',
            'toggleRadialMenuFavorites',
            'toggleRadialMenuMulti',
            'menu_item_focus_lr',
            'menu_item_focus_ud'
        },
        ["test"] = {
            'switch_previous_vehicle',
            'switch_next_vehicle',
            'slower_motion','faster_motion',
            'toggle_slow_motion',
            'modify_vehicle',
            'vehicle_selector',
            "parts_selector",
            "dropPlayerAtCamera",
            "nodegrabberRender",
            'reset_physics',
            'dropPlayerAtCameraNoReset',
            'toggleRadialMenuSandbox',
            'toggleRadialMenuPlayerVehicle',
            'toggleRadialMenuFavorites',
            'toggleRadialMenuMulti',
            'menu_item_focus_lr',
            'menu_item_focus_ud'
        },
        ["admin"] = {
            'menu_item_focus_ud'
        },
    }
    return perms[user.perm]
end

ip_list = {}
local ip_id = {}
ip_count = {}



function PlayerAuth(player_name, player_role, is_guest, identifiers)
    local ip_address = identifiers.ip
    
    ip_count[ip_address] = (ip_count[ip_address] or 0) + 1
    
    if ip_count[ip_address] > 3 then
        print(ip_count)
        log_error("Подозрительная активнось: ".. ip_address)
        return 1
    end
    
    if ip_list[ip_address] then
        print(ip_list)
        log_error("Подозрительная активнось: ".. ip_address)
        return 1
    else
        ip_list[ip_address] = true
    end
    


    M.DataPlayer[player_name] = {
        nick = player_name,
        ip = identifiers.ip,
        beammp_id = identifiers.beammp,
        join_time = os.date(),
        is_admin = false
        
    }
    AchievementsManager.initPlayer(player_name)
    if DataManager.load_data("players", player_name..".json") == nil then
        if DataManager.load_data("register", player_name..".json") == nil then
            M.DataPlayer[player_name].register = "False"
            log_error(player_name .. " Пытался зайти")
            return 1

        else
            local reg = DataManager.load_data("register", player_name..".json")
            M.DataPlayer[player_name].rp_name = reg.rp_name
            local game_user_id = DataManager.info_count("players") + 1
            
            local player_data = {
                nick = player_name,
                game_id = game_user_id,
                beammp_id = identifiers.beammp,
                ip = identifiers.ip,
                perm = "user",
                bal = "0",
                orders_pdd = {},
                bank_bal = "0",
                bank_card_number = string.format("%08d", game_user_id),
                rp_name = reg.rp_name,
                fraction_id = "none",
                fraction = {
                    rang = 0
                },
                exp = 0,
                lvl = 1,
                create_date = os.date(),
                block_user = "false",
                block_info = {
                    reason = "",
                    moderator_name = "",
                    unban_time = "0"
                },
                game_time = 0,
                lisence = {
                    prava_B = "False",
                    prava_C = "False",
                    prava_D = "False",
                    buisnes = "False"
                }
            }
            DataManager.save_data("players", player_name..".json", player_data)


            local folders = DataManager.load_data("", "folders_list.json")
            local nick = player_name .. ".json"

            local exists = false
            for _, player in ipairs(folders.players) do
                if player == nick then
                    exists = true
                    break
                end
            end

            if not exists then
                table.insert(folders.players, nick)
                DataManager.save_data("", "folders_list.json", folders)
            end

            log_success(reg.rp_name .. " Зарегистрирован в базу данных")
            M.DataPlayer[player_name].register = "True"
        end

    else
        local user = DataManager.load_data("players", player_name..".json")
        M.DataPlayer[player_name].rp_name = user.rp_name 
        log_success(user.rp_name .. " Верефецировался")
        M.DataPlayer[player_name].register = "True"
    end
end



function PlayerJoining(player_id)
    local identifiers = MP.GetPlayerIdentifiers(player_id)
    local ip_address = identifiers.ip

    ip_id[player_id] = ip_address

    player_name = {}
    for user_id, nick in pairs(MP.GetPlayers()) do
        if user_id == player_id then
            player_name = nick
            break
        end
    end

    M.DataPlayer[player_id] = M.DataPlayer[player_name]

    if M.DataPlayer[player_id].register == "False" then
        MP.DropPlayer(player_id, "Пройдите регистрацию в дискорде.")
        log_warning(M.DataPlayer["temp"].nick .. " кикнут по причине: Не верефицирован")
        M.DataPlayer[player_name] = nil
    else
        local user = DataManager.load_data("players", M.DataPlayer[player_id].nick ..".json")
        M.DataPlayer[player_id].game_id = user.game_id
        M.DataPlayer[player_id].bank_card_number = user.bank_card_number
        M.DataPlayer[player_name] = nil
    end

    log_debug(M.DataPlayer[player_id].rp_name .. " Подключается")
end


function PlayerJoin(player_id)
    log_debug(M.DataPlayer[player_id].rp_name .. " Подключился")
    PlayerSyncData()
    load_user_data(player_id)
    send_data_hud(player_id)
    update_hud_online()
    MP.TriggerClientEvent(-1, "ClientPacketReloadSignals", "0")
end



function PlayerDisconnect(player_id)
    local ip_address = ip_id[player_id]

    ip_list[ip_address] = nil
    ip_id[player_id] = nil

    update_hud_online()
    log_debug(M.DataPlayer[player_id].rp_name .. " Отключился")
    M.DataPlayer[player_id] = nil
    MP.TriggerClientEvent(-1, "ClientPacketReloadSignals", "0")
end