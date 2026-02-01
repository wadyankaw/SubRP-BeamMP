-- Приватный мод для рп сервера SubRP. Версия v0.0.1
-- Автор Jastickon. Дискорд jastickon.
-- Вся логика вынесена на сторону сервера.
-- Все права защищены.
-- При попытки использовать эту модификацию у себя на сервере, без согласия создателя мода, то будет караться по закону!!!

local M = {}
local logTag = "SubRP-Core"
local data_core
local fuelMap = {}
local currentVehicles = {car = {}}
local fuel_cars = {}
local CheckPoint
local jbeamIO = require('jbeam/io')

local vehsPartsData = {}

local function getVehData(inVehID)
  local vehObj = inVehID and getObjectByID(inVehID) or getPlayerVehicle(0)
  if not vehObj then return end
  local vehID = vehObj:getID()

  local vehData = extensions.core_vehicle_manager.getVehicleData(vehID)
  if not vehData then return end

  if not vehsPartsData[vehID] then
    local partsHighlighted = {}
    local partsHighlightedIdxs = {}
    local partNameToIdx = {}

    local function recGetPart(node, outPartsHighlighted, outPartsHighlightedIdxs, outPartNameToIdx)
      if node.partPath then
        outPartsHighlighted[node.partPath] = true
      end
      if node.children then
        for _, childNode in pairs(node.children) do
          recGetPart(childNode, outPartsHighlighted, outPartsHighlightedIdxs, outPartNameToIdx)
        end
      end
    end

    recGetPart(vehData.config.partsTree or {}, partsHighlighted, partsHighlightedIdxs, partNameToIdx)
    local partsSorted = tableKeysSorted(partsHighlighted)

    for k, partName in ipairs(partsSorted) do
      partsHighlighted[partName] = true
      table.insert(partsHighlightedIdxs, k)
      partNameToIdx[partName] = k
    end

    vehsPartsData[vehID] = {
      vehName = vehObj:getJBeamFilename(),
      alpha = 1,
      partsSorted = partsSorted,
      partsHighlighted = partsHighlighted,
      partsHighlightedIdxs = partsHighlightedIdxs,
      partNameToIdx = partNameToIdx,
    }
  end

  return vehObj, vehData, vehID, vehsPartsData[vehID]
end

local function buildRichPartInfo(ioCtx)
  local availableParts = jbeamIO.getAvailableParts(ioCtx)
  local res = {}
  for partName, uiPartInfo in pairs(availableParts) do
    local richPartInfo = {}
    richPartInfo.information = deepcopy(uiPartInfo or {})
    if uiPartInfo.modName then
      local mod = core_modmanager.getModDB(uiPartInfo.modName)
      if mod and mod.modData then
        richPartInfo.modTagLine    = mod.modData.tag_line
        richPartInfo.modTitle      = mod.modData.title
        richPartInfo.modLastUpdate = mod.modData.last_update
      end
    end
    res[partName] = richPartInfo
  end
  return res
end

-- SubRPCore.sendDataParts()
local function sendDataParts()
	local playerVehID = be:getPlayerVehicleID(0)
	if playerVehID == -1 then
		log('E', 'partmgmt', 'no active vehicle')
		return
	end
	local vehObj, vehData, vehID, partsData = getVehData(playerVehID)

	local pcFilename = vehData.config.partConfigFilename
	local configDefaults = nil
	if pcFilename then
		local data = extensions.core_vehicle_partmgmt.buildConfigFromString(vehData.vehicleDirectory, pcFilename)
		if data ~= nil then
		configDefaults = data
		configDefaults.parts = configDefaults.parts or {}
		configDefaults.vars = configDefaults.vars or {}
		end
	end
	if configDefaults == nil then
		configDefaults = {parts = {}, vars = {}}
	end

	local data = {
		vehID                = vehID,
		mainPartName         = vehData.mainPartName,
		chosenPartsTree      = vehData.config.partsTree,
		variables            = vehData.vdata.variables,
		defaults             = configDefaults,
		partsHighlighted     = partsData.partsHighlighted,
	}

	data.richPartInfo = buildRichPartInfo(vehData.ioCtx)

	log('D', 'sendDataToUI', dump(data))
	guihooks.trigger("VehicleConfigSet", data)
end




local function create_object(data_json)
	local data = jsonDecode(data_json)
	local object = createObject("TSStatic")
	object:setField("shapeName", 0, data.dir)
	object:setField("position", 0, data.pos)
	object:setField("rotation", 0, data.rot)
	object:registerObject(data.name)
	scenetree.MissionGroup:addObject(object)
	local object_id = object:getID()
	local data = {
		client_id = object_id,
		server_id = data.id
	}
	local data_json = jsonEncode(data)
	TriggerServerEvent("TriggerSubRPcreate_object_fid", data_json)
end

local function remove_object(data_json)
	local data = jsonDecode(data_json)
	local object = scenetree.findObjectById(data.id)
	object:delete()
end

local function move_object(data_json)
	local data = jsonDecode(data_json)
	local object = scenetree.findObjectById(data.id)
	object:delete()
end




local function lua_buisnes_rem_bal(businessId)
	local data = {
		businessId = businessId,
	}
	local data_json = jsonEncode(data)
	TriggerServerEvent("TriggerSubRPChangeBuisnesRemBal", data_json)
end

local function lua_buisnes_add_bal(businessId)
	local data = {
		businessId = businessId,
	}
	local data_json = jsonEncode(data)
	TriggerServerEvent("TriggerSubRPChangeBuisnesAddBal", data_json)
end

local function lua_buisnes_change_status(businessId, status)
	local data = {
		businessId = businessId,
		status = status
	}
	local data_json = jsonEncode(data)
	TriggerServerEvent("TriggerSubRPChangeBuisnesStatus", data_json)
end

local function lua_buisnes_change_ratio(businessId, newRatio)
	local data = {
		businessId = businessId,
		newRatio = newRatio
	}
	local data_json = jsonEncode(data)
	TriggerServerEvent("TriggerSubRPChangeBuisnesRation", data_json)
end

local function RunUISound(name, volue)
    local data = {
        name = name,
        volue = volue
    }
    guihooks.trigger('set-RolePlayHud-play-sound', data)
end

local function getPlayerVehicle()
    if currentVehicles.car and currentVehicles.car.gameVehicleID then
        local veh = be:getObjectByID(currentVehicles.car.gameVehicleID)
        if veh then
            return veh
        end
    end
  
    local veh = be:getPlayerVehicle(0)
  
    if veh and MPVehicleGE.isOwn(veh:getID()) then
        currentVehicles.car.gameVehicleID = veh:getID()
        return veh
    end
  
    return nil
end


local function create_trigger_pos(data_json)
	local data = jsonDecode(data_json)

	local trigger_name = data.name

	CheckPoint = createObject("BeamNGTrigger")
	CheckPoint.loadmode = 1;
	CheckPoint:setField("triggerType", 0, 'Sphere')
	CheckPoint.debug = true;
	CheckPoint:registerObject(trigger_name)
	CheckPoint:setPosition(vec3(data.pos))
	CheckPoint:setScale(vec3(12,12,12))

	core_groundMarkers.resetAll()
	core_groundMarkers.sendToApp()
	local color = {0, 0.4, 1}
	core_groundMarkers.setFocus(vec3(data.pos), nil, nil, nil, nil, nil, color)
end

local function remove_trigger_pos(data)
	if CheckPoint then
		core_groundMarkers.resetAll()
		core_groundMarkers.sendToApp()
		CheckPoint:delete()
	end	
end

local function onBeamNGTrigger(data)
	local veh_id = getPlayerVehicle():getID()
	if data.subjectID == veh_id then
		log('D', 'onBeamNGTrigger', dump(data))
		if data.event == "enter" then
			local data_json = jsonEncode(data)
			TriggerServerEvent("SubRPCoreonBeamNGTrigger", data_json)
		end
	end
end



local function getFuelInfo()
    local currVeh = getPlayerVehicle()
    if currVeh then
        currVeh:queueLuaCommand("if VSubRPCore then VSubRPCore.sendFuel() end")
    end
end

local function setFuelInfo(vehID, fuelCapacity, fuelRemaining, nitrousCapacity, nitrousRemaining, fuelType)
    data = {
        capacity = fuelCapacity,
        current = fuelRemaining,
        nitrousCapacity = nitrousCapacity,
        nitrousRemaining = nitrousRemaining,
		fuelType = fuelType
    }
	fuel_cars[vehID] = fuel_cars
	local data_json = jsonEncode(data)
	TriggerServerEvent("TriggerSubRPFuelData", data_json)
    log('I', logTag, dump(fuelMap))
end



local function VehSpawnPos(data)
	local veh = getPlayerVehicle()
	if veh then
		veh:delete()
	end



	local decodedData = jsonDecode(data)

	local vehicleName    = decodedData.jbm
	local vehicleConfig  = decodedData.vcf
	local pos            = vec3(decodedData.pos)
	local rot            = decodedData.rot.w and quat(decodedData.rot) or quat(0,0,0,0)
	
	spawn.spawnVehicle(vehicleName, serialize(vehicleConfig), pos, rot)
end


-- SubRPCore.set_fuel(jsonEncode(10))
local function set_fuel(data_json)
    local data = jsonDecode(data_json) or {}
    local veh = getPlayerVehicle()
    if not veh or not veh:getID() then
        return
    end
    
    veh:queueLuaCommand([[
        local s = energyStorage.getStorages()
        local total_capacity = 0
        if (s) then
            for k, v in pairs(s) do
                if (v.energyType == 'gasoline' or v.energyType == 'diesel' or v.energyType == 'electricEnergy') then
                    total_capacity = total_capacity + v.capacity
                end
            end
        end
        local fuelRatio = ]].. data.fuel ..[[ / total_capacity
        for k, v in pairs(s) do
            if (v.energyType == 'gasoline' or v.energyType == 'diesel' or v.energyType == 'electricEnergy') then
                v:setRemainingRatio(fuelRatio)
            end
        end
    ]])
    
    getFuelInfo()
end

local function add_fuel_station(data_json)
	local data = jsonDecode(data_json) or {}
	local veh = getPlayerVehicle()
	veh:queueLuaCommand('if controller.mainController.setEngineIgnition then controller.mainController.setEngineIgnition(false) end')
	if not veh or not veh:getID() then
		return
	end
	veh:queueLuaCommand('controller.setFreeze(1)')
	RunUISound("gate", 1)
	local fuel_add = data.vehicle.current + data.fuel 
	for i = data.vehicle.current, fuel_add do
		veh:queueLuaCommand('if controller.mainController.setEngineIgnition then controller.mainController.setEngineIgnition(false) end')
		veh:queueLuaCommand([[
			local s = energyStorage.getStorages()
			local f = 0
			if (s) then
			for k, v in pairs(s) do
				if (v.energyType == 'gasoline' or v.energyType == 'diesel' or v.energyType == 'electricEnergy') then
				f = f + v.capacity
				end
			end
			end
			local fuelRatio = ]].. i ..[[ / f 
			for k, v in pairs(s) do
			if (v.energyType == 'gasoline' or v.energyType == 'diesel' or v.energyType == 'electricEnergy') then
				v:setRemainingRatio(fuelRatio)
			end
			end
		]])

		if i >= data.vehicle.capacity then
			break
		end
	end
	veh:queueLuaCommand('if controller.mainController.setEngineIgnition then controller.mainController.setEngineIgnition(true) end')
	veh:queueLuaCommand('controller.setFreeze(0)')
	getFuelInfo()
end

local function lua_payForFuel(fuel, value, type)
	local data = {
		fuel = fuel,
		value = value,
		type = type
	}
	local data_json = jsonEncode(data)
	TriggerServerEvent("TriggerSubRPpayForFuel", data_json)
end

local function setDamageStats(vehID, beams_broken, beams_deformed, beam_count)
	local data = {
		brokenBeams = beams_broken,
		deformedBeams = beams_deformed,
		totalBeams = beam_count
	}
	log('I', logTag, data)
	local data = jsonEncode(data)
	log('I', logTag, data)
end

local function IsEntityInsideArea(pos1, pos2, radius)
    return pos1:distance(pos2) < radius
end

local function isWithinViewDistance(playerPos, pointPos, maxDistance)
    local distance = (vec3(playerPos.x, playerPos.y, playerPos.z) - pointPos):length()
    return distance <= maxDistance
end

local function triggerPointUse(pointType, identifier, spotData, vehicle)
	local data = {
		identifier = identifier,
		spotData = spotData,
		vehicle = vehicle
	}
	local data_json = jsonEncode(data)
	TriggerServerEvent("TriggerSubRPPointUse", data_json)
end

local function use_button()
    local activeVeh = getPlayerVehicle()
    if not activeVeh then return end
    
    local vehPos = activeVeh:getPosition()
    local vehPosVec = vec3(vehPos.x, vehPos.y, vehPos.z)
    
    if not data_core or not data_core.posts then return end
    for pointType, pointGroups in pairs(data_core.posts) do
		if pointType == "buisnes_buy" then

			for buisnesName, buisnesSpots in pairs(pointGroups) do
                for spotIndex, spotData in ipairs(buisnesSpots) do
                    if spotData.location and IsEntityInsideArea(vehPosVec, vec3(spotData.location[1], spotData.location[2], spotData.location[3]), 1.5) then
                        local spotIdentifier = string.format("%s:%s_%d", pointType, buisnesName, spotIndex)
                        triggerPointUse(pointType, spotIdentifier, spotData, activeVeh)
                        return
                    end
                end
            end

        elseif pointType == "fuelstations" then
			getFuelInfo()
            for stationName, stationSpots in pairs(pointGroups) do
                for spotIndex, spotData in ipairs(stationSpots) do
                    if spotData.location and IsEntityInsideArea(vehPosVec, vec3(spotData.location[1], spotData.location[2], spotData.location[3]), 1.5) then
                        local spotIdentifier = string.format("%s:%s_%d", pointType, stationName, spotIndex)
                        triggerPointUse(pointType, spotIdentifier, spotData, activeVeh)
                        return
                    end
                end
            end
        
        elseif pointType == "cardealership" then
            for dealershipName, dealershipData in pairs(pointGroups) do
                if dealershipData.location and IsEntityInsideArea(vehPosVec, vec3(dealershipData.location[1], dealershipData.location[2], dealershipData.location[3]), 1.5) then
                    local spotIdentifier = string.format("%s:%s", pointType, dealershipName)
                    triggerPointUse(pointType, spotIdentifier, dealershipData, activeVeh)
                    return
                end
            end
        
        else
            if #pointGroups > 0 then
                for spotIndex, spotData in ipairs(pointGroups) do
                    if spotData.location and IsEntityInsideArea(vehPosVec, vec3(spotData.location[1], spotData.location[2], spotData.location[3]), 1.5) then
                        local spotIdentifier = string.format("%s:%d", pointType, spotIndex)
                        triggerPointUse(pointType, spotIdentifier.."_0", spotData, activeVeh)
                        return
                    end
                end
            else
                for groupName, groupSpots in pairs(pointGroups) do
                    for spotIndex, spotData in pairs(groupSpots) do
                        if spotData.location and IsEntityInsideArea(vehPosVec, vec3(spotData.location[1], spotData.location[2], spotData.location[3]), 1.5) then
                            local spotIdentifier = string.format("%s:%s_%d", pointType, groupName, spotIndex)
                            triggerPointUse(pointType, spotIdentifier.."_0", spotData, activeVeh)
                            return
                        end
                    end
                end
            end
        end
    end
    log('I', logTag, "Вы не находитесь на точке")
end

local function load_points()
    if not data_core or not data_core.posts then return end

	local activeVeh = getPlayerVehicle()
	local MAX_VISIBLE_DISTANCE = 50

	local function checkPointGroup(group, pointType)
		for k, spot in pairs(group) do
			if not spot.location then goto continue end
			
			local bottomPos = vec3(spot.location[1], spot.location[2], spot.location[3])
			local topPos = bottomPos + vec3(0,0,2)
			local spotInRange = false
		
			if activeVeh then
				local vehPos = activeVeh:getPosition()
				if not isWithinViewDistance(vehPos, bottomPos, MAX_VISIBLE_DISTANCE) then
					goto continue
				end
				
				spotInRange = IsEntityInsideArea(vec3(vehPos.x, vehPos.y, vehPos.z), bottomPos, 1.5)
				local distanceToSpot = (vec3(vehPos.x, vehPos.y, vehPos.z) - bottomPos):length()
				local alphaFactor = 1 - (distanceToSpot / MAX_VISIBLE_DISTANCE)^2
				
				local baseColor
				if pointType == "fuelstations" then
					baseColor = spotInRange and ColorF(0,1,0,0.3) or ColorF(1,1,1,0.5)
				elseif pointType == "buisnes_buy" then
					baseColor = spotInRange and ColorF(0,1,0,0.3) or ColorF(1,1,1,0.5)
				elseif pointType == "repairs" then
					baseColor = spotInRange and ColorF(0,0.5,1,0.3) or ColorF(0.5,0.5,1,0.5)
				elseif pointType == "cardealership" then
					baseColor = spotInRange and ColorF(1,0,1,0.3) or ColorF(1,0.5,1,0.5)
				else
					baseColor = spotInRange and ColorF(1,0.5,0,0.3) or ColorF(1,1,0.5,0.5)
				end
				
				local spotColor = ColorF(baseColor.red, baseColor.green, baseColor.blue, baseColor.alpha * alphaFactor)
				debugDrawer:drawCylinder(bottomPos:toPoint3F(), topPos:toPoint3F(), 1, spotColor)
			end
			
			::continue::
		end
	end

	for pointType, pointGroups in pairs(data_core.posts) do
		if pointType == "fuelstations" then
			for stationName, stationData in pairs(pointGroups) do
				checkPointGroup(stationData, pointType)
			end
		elseif pointType == "cardealership" then
			for dealershipName, dealershipData in pairs(pointGroups) do
				local tempGroup = { { location = dealershipData.location } }
				checkPointGroup(tempGroup, pointType)
			end
		else
			if #pointGroups > 0 then
				checkPointGroup(pointGroups, pointType)
			else
				for groupName, groupData in pairs(pointGroups) do
					checkPointGroup(groupData, pointType)
				end
			end
		end
	end
end


local function ReloadData(data_json)
	data = jsonDecode(data_json)
	log('D', 'ReloadData()', dump(data))
	data_core = data
end

local function onSpeedTrapTriggered(speedTrapData, playerSpeed, overSpeed)
	local user_car_id = getPlayerVehicle():getID()

	if speedTrapData.subjectID == user_car_id then
		local obj = be:getObjectByID(speedTrapData.subjectID)
		speedTrapData.licensePlate = obj:getDynDataFieldbyName("licenseText", 0) or "Illegible"
		speedTrapData.vehicleModel = core_vehicles.getModel(obj.JBeam).model.Name
		speedTrapData.playerSpeed = playerSpeed
		speedTrapData.overSpeed = overSpeed
		TriggerServerEvent("packetspeedTrap", jsonEncode( speedTrapData ) )
	end
end

local function onRedLightCamTriggered(speedTrapData, playerSpeed)
	local user_car_id = getPlayerVehicle():getID()
	if speedTrapData.subjectID == user_car_id then
		local obj = be:getObjectByID(speedTrapData.subjectID)
		speedTrapData.licensePlate = obj:getDynDataFieldbyName("licenseText", 0) or "Illegible"
		speedTrapData.vehicleModel = core_vehicles.getModel(obj.JBeam).model.Name
		speedTrapData.playerSpeed = playerSpeed
		speedTrapData.overSpeed = overSpeed
		TriggerServerEvent("packetredLight", jsonEncode( speedTrapData ) )
	end
end


local baseColor, red = ColorF(1,0.7,0,0.7), ColorF(1,0,0,1)

local trailersizes = jsonReadFile("lua/trailerBoundingBoxes.json")

local function drawbox(corners, color)
	debugDrawer:drawQuadSolid(corners[2], corners[1], corners[4], corners[3], color)
	debugDrawer:drawQuadSolid(corners[5], corners[6], corners[7], corners[8], color)

	debugDrawer:drawQuadSolid(corners[1], corners[2], corners[2+4], corners[1+4], color)
	debugDrawer:drawQuadSolid(corners[2], corners[3], corners[3+4], corners[2+4], color)
	debugDrawer:drawQuadSolid(corners[3], corners[4], corners[4+4], corners[3+4], color)
	debugDrawer:drawQuadSolid(corners[4], corners[1], corners[1+4], corners[4+4], color)
end

local function renderTrailerBox(v, trailerData)
	local pos = v.position
	local rot = v.rotation

	local bb = OrientedBox3F()
	local mat = QuatF(rot.x, rot.y, rot.z, rot.w):getMatrix()

	pos = pos + ( rot * vec3(trailerData.refnodeOffset.x, trailerData.refnodeOffset.y, trailerData.refnodeOffset.z) )

	mat:setColumn(3, pos)
	bb:set2(mat, vec3(trailerData.extents.x, trailerData.extents.y, trailerData.extents.z ))

	local corners = {}
	for i=0, 7 do
		debugDrawer:drawSphere(bb:getPoint(i), 0.1, red)
		table.insert(corners, bb:getPoint(i))
	end

	drawbox(corners, baseColor)
end

local function onPreRender(dt)

	local vehicles = getVehicles()
	for pidvid, v in pairs(vehicles) do
		if v.isSpawned == false and v.rotation ~= nil and v.spawnQueue ~= nil then
			local spawn = jsonDecode(v.spawnQueue.data)
			local jbeam = spawn.jbm
			local pc_path = spawn.vcf.partConfigFilename
			local _jbeam, pc = string.match(pc_path, "^vehicles%/(%g+)%/(%g+)%.pc")

			if pc ~= nil and jbeam == _jbeam then
				if trailersizes and trailersizes[jbeam] then
					local trailerdata = trailersizes[jbeam][pc]

					if trailerdata then
						renderTrailerBox(v, trailerdata)
					end
				end
			end
		end
	end

	MPVehicleGE.hideNicknames(true)


	settings.setValue("hideNameTags", false)
	settings.setValue("richPresence", true)
	settings.setValue("richPresenceDiscord", true)
	-- core_input_actionFilter.setGroup("Rules", data_core.perms)
	-- core_input_actionFilter.addAction(0, "Rules", true)
end


local function reloadSignals(data)
	core_trafficSignals.resetTimer()
end


local function RenderUsersNick()
	local TextColor = ColorF(1, 1, 1, 0.75);
	local currentVeh = be:getPlayerVehicle(0);
	local currentVehId = "-1";
	local currentVehPos = vec3(0, 0, 0);
	if currentVeh then
		currentVehId = currentVeh:getID();
		currentVehPos = currentVeh:getPosition();
	end;
	
	for _, ServerVeh in pairs(MPVehicleGE.getVehicles()) do
		local ServerVehId = ServerVeh.gameVehicleID;
		
		if ServerVehId == currentVehId then
			if not commands.isFreeCamera() then
				goto SkipVeh;
			end;
		end;

		local ServerVehObjekt = be:getObjectByID(ServerVehId);
		if ServerVehObjekt == nil then
			goto SkipVeh;
		end;
		local VehPos = ServerVehObjekt:getPosition();

		local distanc_veh = currentVehPos:distance(VehPos)
		local speed_kmh = ServerVehObjekt:getVelocity():length() * 3.6 -- Конвертация м/с в км/ч

		local RenderText = tostring(data_core.nicks[ServerVeh.ownerName].text);
		local color = data_core.nicks[ServerVeh.ownerName].color
		local BoxColor = ColorI(color.r, color.g, color.b,color.w);
		
		if data_core.nicks[ServerVeh.ownerName].admin then
			VehPos.z = VehPos.z - 1.0;
			local BoxColor = ColorI(color.r, color.g, color.b,0);
			local veh_name = ServerVehObjekt:getJBeamFilename() or "Unknown"
			local adm_text = data_core.nicks[ServerVeh.ownerName].admin .. " Dist: ".. distanc_veh - (distanc_veh % 1) .. "m" .. " Speed: " .. string.format("%.1f", speed_kmh) .. " km/h JBeam: " .. veh_name
			debugDrawer:drawTextAdvanced(VehPos, tostring(adm_text), TextColor, true, false, BoxColor);
		end

		if distanc_veh > data_core.nicks[ServerVeh.ownerName].dist then
			goto SkipVeh;
		end
		
		if not ServerVeh.isSpawned then
			debugDrawer:drawSphere(VehPos, 3, ColorF(BoxColor.r/255, BoxColor.g/255, BoxColor.b/255, 0.5));
			RenderText = "NoCar-["..RenderText.."]"
		end;
		
		VehPos.z = VehPos.z + 1.0;
		debugDrawer:drawTextAdvanced(VehPos, RenderText, TextColor, true, false, BoxColor);

		:: SkipVeh ::
	end;
end;


local function onUpdate(dt, dtSim)
	load_points()
	RenderUsersNick()
end

local function SyncPlace(data_json)
	local data = jsonDecode(data_json)
	for _, ServerVeh in pairs(MPVehicleGE.getVehicles()) do

		core_vehicles.setPlateText(data[ServerVeh.ownerName], ServerVeh.gameVehicleID);
	end
end


local function onExtensionLoaded()
	log('D', 'onExtensionLoaded()', "Working Started")
	AddEventHandler("ClientPacketVehSpawnPos", 					VehSpawnPos)
	AddEventHandler("ClientPacketReloadSignals",                reloadSignals)
	AddEventHandler("ClientPacketReloadData",                   ReloadData)
	AddEventHandler("ClientEventadd_fuel_station", 				add_fuel_station)
	AddEventHandler("ClientEventset_fuel",						set_fuel)
	AddEventHandler("ClientEventSyncPlace", 					SyncPlace)
	AddEventHandler("ClientEventcreate_trigger_pos",			create_trigger_pos)
	AddEventHandler("ClientEventremove_trigger_pos",			remove_trigger_pos)
	AddEventHandler("Clientcreate_object",						create_object)
	AddEventHandler("Clientremove_object",						remove_object)

	
end;


M.sendDataParts = sendDataParts
M.create_object = create_object
M.remove_object = remove_object
M.lua_buisnes_rem_bal = lua_buisnes_rem_bal
M.lua_buisnes_add_bal = lua_buisnes_add_bal
M.lua_buisnes_change_status = lua_buisnes_change_status
M.lua_buisnes_change_ratio = lua_buisnes_change_ratio
M.RunUISound = RunUISound
M.set_fuel = set_fuel
M.add_fuel_station = add_fuel_station
M.lua_payForFuel = lua_payForFuel
M.getPlayerVehicle = getPlayerVehicle
M.onBeamNGTrigger = onBeamNGTrigger
M.create_trigger_pos = create_trigger_pos
M.remove_trigger_pos = remove_trigger_pos
M.VehSpawnPos = VehSpawnPos
M.getFuelInfo = getFuelInfo
M.setFuelInfo = setFuelInfo
M.use_button = use_button
M.onSpeedTrapTriggered = onSpeedTrapTriggered
M.onRedLightCamTriggered = onRedLightCamTriggered
M.ReloadData = ReloadData
M.SyncPlace = SyncPlace

M.onUpdate = onUpdate
M.onPreRender = onPreRender
M.onExtensionLoaded = onExtensionLoaded


return M