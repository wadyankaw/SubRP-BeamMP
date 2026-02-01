-- Приватный мод для рп сервера SubRP. Версия v0.0.1
-- Автор Jastickon. Дискорд jastickon.
-- Вся логика вынесена на сторону сервера.
-- Все права защищены.
-- При попытки использовать эту модификацию у себя на сервере, без согласия создателя мода, то будет караться по закону!!!

local M = {};

local logTag = "SubRP-Hud";

local data_ui


local previousClosestPoint = nil
local closestName = nil

local function start_job_bus(route)
    local data_json = jsonEncode(route)
    TriggerServerEvent("Triggerstart_job_bus", data_json)
end
-- SubRPHud.stop_job()
local function stop_job(data)
    TriggerServerEvent("Triggerstop_job", "")
end

local function buy_car_diler(jbeam, color)
    local data = {
        jbeam = jbeam,
        color = color
    }
    local data_json = jsonEncode(data)
    TriggerServerEvent("Triggerbuy_car_diler", data_json)
end

local function UpdateMapLocation()
    

    local currentVeh = be:getPlayerVehicle(0)
    if currentVeh then
        local currentVehPos = currentVeh:getPosition()

        local closestPoint = nil
        local closestDistance = nil

        for _, point in ipairs(data_ui.map_locations) do
            local pos = vec3(point.pos)
            local distance = currentVehPos:distance(pos)

            if closestDistance == nil or distance < closestDistance then
                closestDistance = distance
                closestPoint = point
            end
        end

        if closestPoint then
            if previousClosestPoint ~= closestPoint then
                data_ui.crossingRoad = closestPoint.name
                extensions.util_richPresence.locationload(closestPoint.name)
                extensions.util_richPresence.msgFormat()
                guihooks.trigger('set-RolePlayHud-data', data_ui)
                previousClosestPoint = closestPoint
            end
        end
    end
end

local function SubRPHudLoad()
	ui_apps.saveLayout(data_ui.ui_apps_set);
	core_gamestate.setGameState("SubRP Hud", "multiplayerroleplay");
	
end

local function onWorldReadyState(n)
	if n == 2 then
        SubRPHudLoad()
	end
end

local function UpdateHudData(data_json)
    data_ui = jsonDecode(data_json)
    log('D', 'UpdateHudData()', dump(data_ui))
    guihooks.trigger('set-RolePlayHud-data', data_ui)
end

local isReloading = false

local function SubRPHudReload()
    guihooks.trigger('set-RolePlayHud-data', data_ui)
end

local function HudOpenUI(data)
    guihooks.trigger('set-RolePlayHud-open-ui', data)
end

local function lua_button_send_trans(amount, sendId)
    data = {}
    data.amount = amount
    data.sendId = sendId
    local data_json = jsonEncode(data)
    TriggerServerEvent("Triggerbutton_send_trans", data_json)
end

local function lua_button_pay_pdd(id)
    TriggerServerEvent("Triggerbutton_pay_pdd", id)
end

local function RunUINotify(data_json)
    local data = jsonDecode(data_json)
    guihooks.trigger('run-RolePlayHud-notify', data)
end

local function RunUISound(name, volue)
    local data = {
        name = name,
        volue = volue
    }
    guihooks.trigger('set-RolePlayHud-play-sound', data)
end

local function Send_aller_user(type, name, message)
    if type == "info" then
        guihooks.trigger('toastrMsg', {type = "info", title = name, msg = message, config = {timeOut = 5000}}) 
    elseif type == "warning" then
        guihooks.trigger('toastrMsg', {type = "warning", title = name, msg = message, config = {timeOut = 5000}}) 
    elseif type == "error" then
        guihooks.trigger('toastrMsg', {type = "error", title = name, msg = message, config = {timeOut = 5000}})
    end

end

local function getUserRich()
    local text
    if data_ui then
        text = data_ui.name .. " | " .. data_ui.logoPlayerInfo
    else
        text = "Захожу на сервер"
    end
    return text
end



local function open_close_fast_use()
    local currentVeh = be:getPlayerVehicle(0);
	local currentVehId = "-1";
	local currentVehPos = vec3(0, 0, 0);
	if currentVeh then
		currentVehId = currentVeh:getID();
		currentVehPos = currentVeh:getPosition();
	end;

    local closestDistance = math.huge


    for _, ServerVeh in pairs(MPVehicleGE.getVehicles()) do
        local ServerVehId = ServerVeh.gameVehicleID;
        
        if ServerVehId == currentVehId then
            goto SkipVeh;
        end;

        local ServerVehObjekt = be:getObjectByID(ServerVehId);
        if ServerVehObjekt == nil then
            goto SkipVeh;
        end;
        
        local VehPos = ServerVehObjekt:getPosition();
        local distance = currentVehPos:distance(VehPos)
        
        if distance < closestDistance then
            closestDistance = distance
            closestName = ServerVeh.ownerName
        end

        ::SkipVeh::
    end

    if closestDistance > 15 then
        closestName =  nil
    end


    guihooks.trigger('set-RolePlayHud-open-ui', 'ui-fast_use')
end


local function fast_use_send_server(button_id)
    if closestName ~= nil then
        local data = {
            button_id = button_id,
            nick = closestName
        }
        local data_json = jsonEncode(data)
        TriggerServerEvent("Triggerfast_use_button", data_json)
    end
end

local function buybiz()
    TriggerServerEvent("TriggerSubRPbuy_buisnes", "0")
end

local function startTaxi()
    TriggerServerEvent("TriggerSubRPStartTaxi", "0")
end


local function onPreRender(dt)
	if be:getObjectCount() == 0 then
		return;
	end;
	UpdateMapLocation()
end;


local function onExtensionLoaded()
	log('D', 'onExtensionLoaded()', "Working Started")
    AddEventHandler("ClientEventUpdateHudData",              UpdateHudData)
    AddEventHandler("ClientRunUINotify",                 RunUINotify)
    AddEventHandler("ClientEventHudOpenUI",                  HudOpenUI)
	
end;

M.getUserRich = getUserRich
M.start_job_bus = start_job_bus
M.stop_job = stop_job
M.buy_car_diler = buy_car_diler
M.RunUISound = RunUISound
M.UpdateMapLocation = UpdateMapLocation
M.UpdateHudData = UpdateHudData
M.SubRPHudReload = SubRPHudReload
M.lua_button_send_trans = lua_button_send_trans
M.lua_button_pay_pdd = lua_button_pay_pdd
M.Send_aller_user = Send_aller_user
M.RunUINotify = RunUINotify
M.HudOpenUI = HudOpenUI
M.SubRPHudReload = SubRPHudReload
M.onWorldReadyState = onWorldReadyState
M.open_close_fast_use = open_close_fast_use
M.fast_use_send_server = fast_use_send_server
M.buybiz = buybiz
M.startTaxi = startTaxi


M.onPreRender = onPreRender
M.onExtensionLoaded = onExtensionLoaded


return M