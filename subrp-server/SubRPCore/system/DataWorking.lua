log_debug("Запуск system/DataWorking.lua")

MP.RegisterEvent("Triggerstart_job_bus", "start_job_bus")
MP.RegisterEvent("TriggerSubRPStartTaxi", "start_job_taxi")
MP.RegisterEvent("Triggerstop_job", "stop_work")




function getRandCheck(checkpoints)
    local currentTime = os.time()
    local seconds = tonumber(os.date("%S", currentTime))
    local index = (seconds % #checkpoints) + 1
    local randomCheckpoint = checkpoints[index]

    return {randomCheckpoint[1], randomCheckpoint[2], randomCheckpoint[3]}
end



local data_work = {}

function start_job_bus(user_id, data_json)
    local data = json.decode(data_json)
    
    if M.DataPlayer[user_id].hud.work_status.activi == true then
        send_notify(user_id, "Работы", "Вы уже работаете", "error", 10000)
        return
    end
    local bus_work = DataManager.load_data("jobs", "bus.json") or {}


    for i, route in ipairs(bus_work) do
        if data == route.id then
            M.DataPlayer[user_id].hud.work_status = {
                activi = true,
                name = "Водитель автобуса",
                pay = route.payment,
            }
            send_data_hud(user_id)

            data_work[user_id] = {work_data = route}
            set_route_check(user_id, "linear", route.checkpoints, "bus")
            local p = getNextCheckpoint(user_id)
            local next_pos = {p[1], p[2], p[3]}
            create_triger(user_id, next_pos, "bus")
            delete_veh_all(user_id)
            spawn_worked_vehicle(user_id, "work_bus")
            break
        end
    end
end

local current_taxi = {}
function load_taxi(user_id)
    local user = DataManager.load_data("players",  M.DataPlayer[user_id].nick .. ".json") or {}
    local taxi_lvl
    local taxi_exp
    if user.taxi_lvl then 
        taxi_lvl = user.taxi_lvl
        taxi_exp = user.taxi_exp
    else
        taxi_lvl = 1
        taxi_exp = 0
        local update_data = {
            taxi_lvl = 1,
            taxi_exp = 0
        }
        DataManager.update_data("players",  M.DataPlayer[user_id].nick .. ".json", update_data)
    end


    local taxi_config = DataManager.load_data("jobs", "taxi.json") or {}

    local user_taxi_lvl
    for _, lvl_exp in ipairs(taxi_config.lvl_xp) do
        if lvl_exp.lvl == taxi_lvl then
            user_taxi_lvl = lvl_exp
        end
    end 

    

    local data = {
        lvl = taxi_lvl,
        next_lvl_xp = user_taxi_lvl.xp,
        xp = taxi_exp, 
        ratio = user_taxi_lvl.ratio, 
        lvl_name = user_taxi_lvl.lvl_name, 
        veh_id = user_taxi_lvl.veh_id,
        veh_name =  user_taxi_lvl.veh_name
    }
    M.DataPlayer[user_id].hud.jobs.taxi = data

    send_data_hud(user_id)

    open_user_ui(user_id, "ui-jobs-taxi")
end


local passenger = {}

function start_job_taxi(user_id, data_json)
    passenger[user_id] = 0
    local data = json.decode(data_json)
    
    if M.DataPlayer[user_id].hud.work_status.activi == true then
        send_notify(user_id, "Работы", "Вы уже работаете", "error", 10000)
        return
    end

    M.DataPlayer[user_id].hud.work_status = {
        activi = true,
        name = "Таксист",
        pay = "Посадка",
    }
    send_data_hud(user_id)


    local user = DataManager.load_data("players",  M.DataPlayer[user_id].nick .. ".json") or {}
    local taxi_config = DataManager.load_data("jobs", "taxi.json") or {}
    data_work[user_id] = {work_data = {stop_pos = taxi_config.stop_pos}}
    local user_taxi_lvl
    for _, lvl_exp in ipairs(taxi_config.lvl_xp) do
        if lvl_exp.lvl == user.taxi_lvl then
            user_taxi_lvl = lvl_exp
        end
    end


    
    open_user_ui(user_id, "close_hud")
    local pos = getRandCheck(taxi_config.checkpoints)
    current_taxi[user_id] = pos
    create_triger(user_id, pos, "taxi " .. user_id)

    delete_veh_all(user_id)
    spawn_worked_vehicle(user_id, user_taxi_lvl.veh_id)

end

function GetDistance3D(point1, point2)
    local dx = point2[1] - point1[1]
    local dy = point2[2] - point1[2]
    local dz = point2[3] - point1[3]
    return math.sqrt(dx*dx + dy*dy + dz*dz)
end
    


function taxi_trigger_use(user_id, data)
    remove_current_pos(user_id)
    local user = DataManager.load_data("players",  M.DataPlayer[user_id].nick .. ".json") or {}
    local taxi_config = DataManager.load_data("jobs", "taxi.json") or {}
    local pos = getRandCheck(taxi_config.checkpoints)
    create_triger(user_id, pos, "taxi " .. user_id)
    
    if passenger[user_id] == 0 then
        -- Когда забрал пассажира
        local distance = GetDistance3D(current_taxi[user_id], pos) or 0
        print(" Дистанция: " .. distance)

        local user_taxi_lvl
        for _, lvl_exp in ipairs(taxi_config.lvl_xp) do
            if lvl_exp.lvl == user.taxi_lvl then
                user_taxi_lvl = lvl_exp
            end
        end

        passenger[user_id] = ((taxi_config.pay_the_meters * distance) // 10) * user_taxi_lvl.ratio

        M.DataPlayer[user_id].hud.work_status = {
            activi = true,
            name = "Таксист",
            pay = passenger[user_id],
        }
    else
        -- Когда отвёз пассажира
        current_taxi[user_id] = pos
        local new_bal = tostring(tonumber(user.bal) + passenger[user_id])
        local update_data = {
            bal = new_bal
        }
        DataManager.update_data("players",  M.DataPlayer[user_id].nick .. ".json", update_data)
        M.DataPlayer[user_id].hud.InfoPlayerMoney = new_bal
        send_notify(user_id, "Работа", "Вы получили за работу ".. passenger[user_id] .."$", "success", 7000)
        send_data_hud(user_id)

        
        local lvl_user
        for _, lvl_exp in ipairs(taxi_config.lvl_xp) do
            if lvl_exp.lvl == user.taxi_lvl then
                lvl_user = lvl_exp
            end
        end

        if lvl_user.xp ~= 0 and lvl_user.xp <= user.taxi_exp then

            local update_data = {
                taxi_lvl = user.taxi_lvl +1,
                taxi_exp = 0
            }
            DataManager.update_data("players",  M.DataPlayer[user_id].nick .. ".json", update_data)

            send_notify(user_id, "Таксист", "Вы получили новый уровень!!!", "success", 7000)
        else
            local update_data = {
                taxi_exp = user.taxi_exp +1
            }
            DataManager.update_data("players",  M.DataPlayer[user_id].nick .. ".json", update_data)
        end
        
        passenger[user_id] = 0

        M.DataPlayer[user_id].hud.work_status = {
            activi = true,
            name = "Таксист",
            pay = "Посадка",
        }
    end
    send_data_hud(user_id)
end








function open_work_cargo(user_id)

    if M.DataPlayer[user_id].hud.work_status.activi == true then
        send_notify(user_id, "Работы", "Вы уже работаете", "error", 10000)
        return
    end

    local user = DataManager.load_data("players",  M.DataPlayer[user_id].nick .. ".json") or {}
    local cargo_lvl
    local cargo_exp
    if user.cargo_lvl then 
        cargo_lvl = user.cargo_lvl
        cargo_exp = user.cargo_exp
    else
        cargo_lvl = 1
        cargo_exp = 0
        local update_data = {
            cargo_lvl = 1,
            cargo_exp = 0
        }
        DataManager.update_data("players",  M.DataPlayer[user_id].nick .. ".json", update_data)
    end


    local cargo_config = DataManager.load_data("jobs", "cargo.json") or {}

    local user_cargo_lvl
    for _, lvl_exp in ipairs(cargo_config.lvl_xp) do
        if lvl_exp.lvl == cargo_lvl then
            user_cargo_lvl = lvl_exp
        end
    end 


    local data = {
        lvl = cargo_lvl,
        lvl_name = user_cargo_lvl.lvl_name,
        xp = cargo_exp,
        routes = cargo_config.routes,
        ratio = user_cargo_lvl.ratio,
        mass = user_cargo_lvl.mass,
        veh_name = user_cargo_lvl.veh_name,
        veh_id = user_cargo_lvl.veh_id
    }
    print(data)

    M.DataPlayer[user_id].hud.jobs.cargo = data

    send_data_hud(user_id)

    open_user_ui(user_id, "ui-jobs-cargo")
end

cargo_user = {}

function start_work_cargo(user_id, data)
    if M.DataPlayer[user_id].hud.work_status.activi == true then
        send_notify(user_id, "Работы", "Вы уже работаете", "error", 10000)
        return
    end   
    if cargo_user[user_id] ~= nil then
        
    end


    M.DataPlayer[user_id].hud.work_status = {
        activi = true,
        name = "Грузоперевозки",
        pay = "Погрузка",
    }



end


function cargo_trigger(user_id, data)

    M.DataPlayer[user_id].hud.work_status = {
        activi = true,
        name = "Грузоперевозки",
        pay = "Погрузка",
    }
    
end














function stop_work(user_id, data)
    M.DataPlayer[user_id].hud.work_status = {
        activi = false,
        name = "Loading",
        pay = "Loading",
    }
    send_data_hud(user_id)
    remove_current_pos(user_id)
    create_triger(user_id, data_work[user_id].work_data.stop_pos, "stop_work")
    data_work[user_id] = nil
end