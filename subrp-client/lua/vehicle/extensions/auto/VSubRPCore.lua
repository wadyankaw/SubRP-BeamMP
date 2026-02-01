local M = {}

local function sendFuel()
    local storages = energyStorage.getStorages()
  
    local fuelCapacity, fuelRemaining = 0, 0
    local nitrousCapacity, nitrousRemaining = 0, 0
    local fuel_type = "none"
    
    for _, v in pairs(storages) do
        if (v.energyType == "n2o") then
            nitrousCapacity = nitrousCapacity + v.capacity
            nitrousRemaining = nitrousRemaining + v.remainingMass
        elseif (v.energyType == "gasoline" or v.energyType == "diesel" or v.energyType == "electricEnergy") then
            fuel_type = v.energyType
            fuelCapacity = fuelCapacity + v.capacity
            fuelRemaining = fuelRemaining + v.remainingVolume
        end
    end
  
    obj:queueGameEngineLua(
        "if SubRPCore and SubRPCore.setFuelInfo then SubRPCore.setFuelInfo(" ..
        obj:getID() ..
        ", " .. fuelCapacity .. ", " .. fuelRemaining .. ", " .. nitrousCapacity .. ", " .. nitrousRemaining .. ", \"" .. fuel_type .. "\") end"
    )
end

local function sendDamage()
    local beamstats = obj:calcBeamStats()

    obj:queueGameEngineLua(
        "if SubRPCore and SubRPCore.setDamageStats then SubRPCore.setDamageStats(" ..
        obj:getID() ..
            ", " .. beamstats.beams_broken .. ", " .. beamstats.beams_deformed .. ", " .. beamstats.beam_count .. ") end"
    )
end


local function updateGFX(dt)
    sendDamage()
end




M.sendFuel = sendFuel
M.sendDamage = sendDamage
M.updateGFX = updateGFX


log('I', "[VSubRPCore]", "Script loaded")
return M