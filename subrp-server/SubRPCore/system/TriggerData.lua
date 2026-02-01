log_debug("Запуск system/TriggerData.lua")


MP.RegisterEvent("SubRPCoreonBeamNGTrigger", "onBeamNGTrigger")

playerRoutes = {}

local function getTimeBasedSeed()
    local time = os.time()
    return time % 1000000
end

local function shuffleTable(t, seed)
    math.randomseed(seed)
    for i = #t, 2, -1 do
        local j = math.random(1, i)
        t[i], t[j] = t[j], t[i]
    end
    return t
end

function set_route_check(user_id, type, checkpoints, name)
    if type ~= "random" and type ~= "linear" then
        log_error("Invalid route type. Use 'random' or 'linear'")
    end
    
    if not checkpoints or #checkpoints == 0 then
        log_error("Checkpoints table is empty or nil")
    end

    playerRoutes[user_id] = {
        type = type,
        allCheckpoints = {},
        availableCheckpoints = {},
        currentCheckpoint = nil,
        originalCheckpoints = {},
        name = name
    }
    
    for i, checkpoint in ipairs(checkpoints) do
        playerRoutes[user_id].allCheckpoints[i] = checkpoint
        playerRoutes[user_id].originalCheckpoints[i] = checkpoint
    end
    
    if type == "linear" then
        playerRoutes[user_id].availableCheckpoints = table.copy(checkpoints)
    else
        local seed = getTimeBasedSeed()
        playerRoutes[user_id].availableCheckpoints = shuffleTable(table.copy(checkpoints), seed)
    end
    print(playerRoutes[user_id])
end

function table.copy(t)
    local result = {}
    for k, v in pairs(t) do
        result[k] = v
    end
    return result
end

function getNextCheckpoint(user_id)
    local route = playerRoutes[user_id]
    print(route)
    if not route then
        error("No route set for user " .. user_id)
    end
    
    local nextCheckpoint
    
    if route.type == "linear" then
        nextCheckpoint = table.remove(route.availableCheckpoints, 1)
        
        if #route.availableCheckpoints == 0 then
            route.availableCheckpoints = table.copy(route.originalCheckpoints)
        end
    else
        if #route.availableCheckpoints == 0 then
            local seed = getTimeBasedSeed()
            route.availableCheckpoints = shuffleTable(table.copy(route.allCheckpoints), seed)
        end

        math.randomseed(getTimeBasedSeed())
        local randomIndex = math.random(1, #route.availableCheckpoints)
        nextCheckpoint = table.remove(route.availableCheckpoints, randomIndex)
    end
    
    route.currentCheckpoint = nextCheckpoint


    local pay = nextCheckpoint[5]
    if pay > 0 then
        local user = DataManager.load_data("players",  M.DataPlayer[user_id].nick .. ".json") or {}
        local new_bal = tostring(tonumber(user.bal) + tonumber(pay))
        local update_data = {
            bal = new_bal
        }
        DataManager.update_data("players",  M.DataPlayer[user_id].nick .. ".json", update_data)
        M.DataPlayer[user_id].hud.InfoPlayerMoney = new_bal
        send_notify(user_id, "Работа", "Вы получили за работу ".. pay .."$", "success", 7000)
        send_data_hud(user_id)

    end
    return nextCheckpoint
end



function onBeamNGTrigger(user_id, data_json)
    local data = json.decode(data_json)

    if data.triggerName == "stop_work" then
        remove_current_pos(user_id)
        playerRoutes[user_id] = nil
        delete_veh_all(user_id)
    elseif data.triggerName == "taxi ".. user_id then
        taxi_trigger_use(user_id, data)
    elseif M.DataPlayer[user_id].triggerName == data.triggerName .. " " .. user_id then
        
        local p = getNextCheckpoint(user_id)
        local next_pos = {p[1], p[2], p[3]}
        remove_current_pos(user_id)
        create_triger(user_id, next_pos, playerRoutes[user_id].name)
    end
end

function create_triger(user_id, pos, name)
    -- playerRoutes[user_id] = pos
    M.DataPlayer[user_id].triggerName = name .. " " .. user_id
    local data = {
        name = name,
        pos = pos
    }
    M.DataPlayer[user_id].trigger = data
    local data_json = json.encode(data)
    MP.TriggerClientEvent(user_id, "ClientEventcreate_trigger_pos", data_json)
end

function remove_current_pos(user_id)
    -- playerRoutes[user_id] = nil
    MP.TriggerClientEvent(user_id, "ClientEventremove_trigger_pos", "0")
end